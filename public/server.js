require("dotenv").config();
const express = require("express");
const path = require("path");
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;
const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const personalities = {
  friendly: "Be friendly, encouraging, and natural.",
  professional: "Be clear, precise, respectful, and professional.",
  genius: "Explain difficult ideas simply, step by step, with helpful examples."
};

async function askOpenAI(messages, personality) {
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: `You are EMMANUEL AI. ${personality} Reply in the language the user uses when possible. Be honest about uncertainty.` },
      ...messages
    ]
  });
  return response.choices?.[0]?.message?.content || "I couldn't create an answer.";
}

async function askGemini(messages, personality) {
  const model = gemini.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    systemInstruction: `You are EMMANUEL AI. ${personality} Reply in the language the user uses when possible. Be honest about uncertainty.`
  });
  const prompt = messages.map(m => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`).join("\n\n");
  const result = await model.generateContent(prompt);
  return result.response.text();
}

app.get("/api/status", (_req, res) => {
  res.json({
    openaiConfigured: Boolean(openai),
    geminiConfigured: Boolean(gemini),
    mode: openai || gemini ? "live" : "demo"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, personality = "friendly", provider = "auto" } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return res.status(400).json({ error: "Send between 1 and 20 chat messages." });
    }
    const safeMessages = messages.map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 5000)
    }));
    const style = personalities[personality] || personalities.friendly;

    if (!openai && !gemini) {
      return res.json({
        reply: "I'm running in demo mode. Add an OpenAI or Gemini API key to the server's .env file to enable live AI answers.",
        provider: "demo"
      });
    }

    const order = provider === "openai" ? ["openai", "gemini"]
      : provider === "gemini" ? ["gemini", "openai"]
      : ["openai", "gemini"];

    let lastError;
    for (const engine of order) {
      try {
        if (engine === "openai" && openai) {
          return res.json({ reply: await askOpenAI(safeMessages, style), provider: "openai" });
        }
        if (engine === "gemini" && gemini) {
          return res.json({ reply: await askGemini(safeMessages, style), provider: "gemini" });
        }
      } catch (error) {
        lastError = error;
      }
    }
    console.error("AI providers unavailable:", lastError?.message || "No provider configured");
    return res.status(503).json({ error: "AI services are unavailable right now. Check the server keys and try again." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(PORT, () => console.log(`EMMANUEL AI running at http://localhost:${PORT}`));

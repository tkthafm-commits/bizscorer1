export const maxDuration = 60;

const ipMap = new Map();
const MAX_REQ_PER_HOUR = 15;

function rateLimit(ip) {
  const now = Date.now();
  const hour = 3600000;
  const reqs = (ipMap.get(ip) || []).filter(t => now - t < hour);
  if (reqs.length >= MAX_REQ_PER_HOUR) return false;
  reqs.push(now);
  ipMap.set(ip, reqs);
  return true;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) return res.status(429).json({ error: "Rate limit exceeded. Try again later." });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  try {
    const body = req.body;
    if (!body.messages || !body.model) return res.status(400).json({ error: "Missing required fields" });
    body.max_tokens = Math.min(body.max_tokens || 1500, 2500);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

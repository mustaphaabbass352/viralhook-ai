export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const GEMINI_KEY = "AIzaSyCZSql3L-WnWwERCIGpPYvRQrf8rZzr0Zc";

  if (!GEMINI_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);
    
    if (!text) {
      return res.status(400).json({ error: `Empty response. Raw: ${JSON.stringify(data)}` });
    }

    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
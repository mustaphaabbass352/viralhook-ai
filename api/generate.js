export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const GROQ_KEY = "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";
if (!GROQ_KEY) return res.status(500).json({ error: 'No GROQ key found' });

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 1.0
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const text = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
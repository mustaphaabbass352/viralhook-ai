export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const GROQ_KEY = "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";

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
          model: 'gemma2-9b-it',
          messages: [{ role: 'user', content: prompt.slice(0, 200) }],
          max_tokens: 300,
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

export default async function handler(req, res) {
  console.log('API request received:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  console.log('GROQ_API_KEY present:', !!GROQ_API_KEY);
  console.log('Prompt received:', prompt ? prompt.substring(0, 100) + '...' : 'NO PROMPT');
  
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY environment variable not set' });
  }

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.9,
          max_tokens: 2000
        })
      }
    );

    console.log('Groq API response status:', response.status);
    const responseText = await response.text();
    console.log('Groq API raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('Failed to parse Groq response as JSON:', parseErr);
      return res.status(500).json({ error: 'Invalid response from Groq API', raw: responseText });
    }

    console.log('Groq API parsed data:', data);

    if (data.error) {
      console.error('Groq API error:', data.error);
      return res.status(400).json({ error: data.error.message || 'Unknown Groq error', details: data.error });
    }

    const text = data.choices?.[0]?.message?.content || '';
    console.log('Extracted text:', text ? text.substring(0, 100) + '...' : 'NO TEXT');
    res.status(200).json({ text });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}

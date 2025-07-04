import { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export const getChatResponse = async (req: Request, res: Response) => {
  const { message } = req.body;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'mistralai/mistral-7b-instruct',
      messages: [{ role: 'user', content: message }],
      max_tokens: 50
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.CHAT_BOT_API_KEY}`,
        'HTTP-Referer': process.env.FRONTEND_URL,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } 
  catch (error: any) {
    console.error('AI error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch from AI' });
  }
}
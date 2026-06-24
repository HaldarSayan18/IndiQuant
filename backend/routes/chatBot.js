import 'dotenv/config';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const router = express.Router();

const client = new OpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: process.env.OPENROUTER_AI_API_KEY });

router.post('/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        if (!message)
            return res.status(400).json({ reply: 'Message is required' });
        let marketContext = '';
        const messages = [...history, { role: 'system', content: message }];

        // call claude model
        const resp = await client.chat.completions.create({
            model: 'openrouter/free',
            messages,
            max_tokens: 512,
            tempareture: 0.7,

        });
        const replyfromBot = resp.choices?.[0]?.message?.content;
        res.status(200).json({ success:true,  reply: replyfromBot });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: 'Internal server error!', error: error.message });
    }
});

export default router;
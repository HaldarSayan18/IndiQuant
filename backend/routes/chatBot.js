import 'dotenv/config';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

const client = Anthropic({ apiKey=process.env.CLAUDE_API_KEY });

router.post('/chat', async (req, res) => {
    const { message, history = [] } = req.body;
    let marketContext = '';
    try {
        const [btc, aapl, nvda] = await Promise.all([
            // getCr
        ])
    } catch (error) {
        marketContext = 'Live market data are temporarily unavialable.'
    }
    const messages = [...history, { role: 'user', content: message }];

    // call claude model
    const resp = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: ``
    })
})
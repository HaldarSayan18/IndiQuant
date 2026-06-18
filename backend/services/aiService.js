import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const models = await client.models.list();
// console.log('ai models', models);

export default async function getAgent_AISuggestions(candidates) {
    let picks;
    try {
        const prompt = `
        Here is the live market data for stocks and crypto and nfts: ${JSON.stringify(candidates, null, 2)}
        Pick the 15 most interesting buy/watch/avoid signals from this list.
        For each one, return a JSON object with: symbol, signal (one of "Strong buy", "Buy", "Watch", "Avoid"), and a 1-sentence plain-English reason based on the actual numbers given.
        Respond with ONLY a JSON array, no other text.
    `;
        const response = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            // contents: prompt,
            // config: {
            //     responseMimeType: 'application/json'
            // }
            messages: [
                { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' }
        });
        const text = response.choices[0].message.content;
        picks = JSON.parse(text);
    } catch (error) {
        // controll fallback
        return candidates
            .slice(0, 10)
            .map(c => ({
                ...c,
                signal:
                    (c.change24h || 0) > 5 ? "Strong buy"
                        : (c.change24h || 0) > 1 ? "Buy"
                            : (c.change24h || 0) > -2 ? "Watch"
                                : "Avoid",
                reason: "Fallback signal (AI unavailable)"
            }));

        console.error('OpenAI api failed', error);
        throw new Error('Failed to parse OpenAI API');
    }

    // merge Agent's response with the live data
    return picks.map(p => {
        const match = candidates.find(c => c.symbol === p.symbol);
        if (!match) return null;
        return { ...match, signal: p.signal, reason: p.reason };
    });
}
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

// Proxies POST requests to /api/games to https://shiba.hackclub.com/api/GetMyGames to avoid CORS issues

const app = express();

app.use(express.json());

app.post('/api/games', async (req, res) => {
    try {
        const response = await fetch('https://shiba.hackclub.com/api/GetMyGames', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).header('Access-Control-Allow-Origin', '*').json(data);
    } catch (err) {
        res.status(500).json({ error: 'Proxy error', details: err.message });
    }
});

app.use(cors({
    origin: '*'
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CORS proxy listening on port ${PORT}`);
});
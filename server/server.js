const express = require('express');
const path = require('path');

// Proxies POST requests to /api/games to https://shiba.hackclub.com/api/GetMyGames to avoid CORS issues

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.post('/api/games', async (req, res) => {
    const fetch = (await import('node-fetch')).default;

    try {
        const response = await fetch('https://shiba.hackclub.com/api/GetMyGames', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Proxy error', details: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
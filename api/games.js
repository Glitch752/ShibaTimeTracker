// Vercel serverless function to proxy requests to the Shiba API with CORS headers

export default async function handler(req, res) {
    if(req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return res.status(204).end()
    }
    
    if(req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed')
    }
    
    try {
        const upstream = await fetch('https://shiba.hackclub.com/api/GetMyGames', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        })
        const data = await upstream.text()
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(upstream.status).send(data)
    } catch(err) {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(502).json({ error: 'Proxy error', details: err.message })
    }
}
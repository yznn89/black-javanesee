export default async function handler(req, res) {
    const isTelegram = req.headers['user-agent']?.includes('Telegram') || 
                       req.headers['x-requested-with']?.includes('XMLHttpRequest') ||
                       req.headers['origin']?.includes('telegram') ||
                       req.headers['referer']?.includes('telegram');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (isTelegram) {
        res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
    }
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        const raw = req.method === "POST" ? req.body?.text : req.query?.text;
        const ask = raw || "?";

        const gate = "https://black-javanesee.vercel.app/api/v2/nano.js";

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 86400000);

        const hop = await fetch(gate, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: ask }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        const responseText = await hop.text();

        try {
            const json = JSON.parse(responseText);

            function extractText(obj) {
                if (typeof obj === 'string') return obj;
                if (!obj || typeof obj !== 'object') return null;
                const fields = ['text','response','result','message','answer','output','content','reply','generated_text'];
                for (const f of fields) {
                    if (typeof obj[f] === 'string' && obj[f]) return obj[f];
                }
                for (const f of fields) {
                    if (obj[f] && typeof obj[f] === 'object') {
                        const inner = extractText(obj[f]);
                        if (inner) return inner;
                    }
                }
                if (obj.candidates?.[0]?.content?.parts?.[0]?.text)
                    return obj.candidates[0].content.parts[0].text;
                if (Array.isArray(obj) && obj.length > 0) return extractText(obj[0]);
                return null;
            }

            const extracted = extractText(json) ?? JSON.stringify(json);
            res.status(200).json({ result: extracted });
        } catch (e) {
            res.status(200).json({ result: responseText });
        }

    } catch (err) {
        res.status(500).json({ 
            error: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
            detail: err.message 
        });
    }
}

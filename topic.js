const SYSTEM_INSTRUCTION = `Kamu adalah konverter pesan ke judul topik.
Tugasmu HANYA menghasilkan nama topik singkat dalam bahasa Indonesia.
ATURAN WAJIB:
- Keluarkan HANYA nama topik, tanpa kalimat tambahan, tanpa tanda kutip, tanpa penjelasan, tanpa titik di akhir
- Maksimal 5 kata
- Gunakan kata benda atau frasa ringkas yang mewakili isi percakapan
- Jika tidak bisa ditentukan, balas: Obrolan Baru
CONTOH:
Input: buatkan script python untuk scraping web -> Output: Script Python Web Scraping
Input: apa itu machine learning -> Output: Pengenalan Machine Learning
Input: tolong terjemahkan teks ini ke bahasa inggris -> Output: Terjemahan Teks
Input: hitung luas lingkaran jari-jari 7 -> Output: Hitung Luas Lingkaran
Input: bikin cerita pendek tentang kucing -> Output: Cerita Pendek Kucing`

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let userText = ''
  let aiReply = ''

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    userText = String(body.userText || body.text || '').replace(/<[^>]*>/g, '').trim().slice(0, 300)
    aiReply = String(body.aiReply || body.reply || '').replace(/<[^>]*>/g, '').trim().slice(0, 200)
  } catch {
    return res.status(400).json({ error: 'Body tidak valid' })
  }

  if (!userText) {
    return res.status(400).json({ error: 'userText wajib diisi' })
  }

  const userInput = aiReply
    ? `Pesan pengguna: ${userText}\nBalasan AI: ${aiReply}`
    : `Pesan pengguna: ${userText}`

  try {
    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyAkC_wCzDYhEWGmJ6rLS1NmMj65lXOPu6s'
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ parts: [{ text: userInput }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 20,
            stopSequences: ['\n']
          }
        }),
        signal: AbortSignal.timeout(8000)
      }
    )

    if (!geminiRes.ok) {
      return res.status(502).json({ error: 'Upstream error' })
    }

    const data = await geminiRes.json()
    let topic = ''
    try {
      topic = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    } catch {
      topic = ''
    }

    topic = topic
      .replace(/<[^>]*>/g, '')
      .replace(/^["'\s]+|["'\s]+$/g, '')
      .replace(/[\n\r].*/g, '')
      .replace(/[.،。]$/, '')
      .trim()
      .slice(0, 60)

    if (!topic || /[{\[<]|nekograf|html|css|javascript|script|window\.|document\./i.test(topic) || topic.length < 2) {
      return res.status(200).json({ topic: null })
    }

    return res.status(200).json({ topic })
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      return res.status(504).json({ error: 'Timeout' })
    }
    return res.status(500).json({ error: 'Gagal generate topik' })
  }
}

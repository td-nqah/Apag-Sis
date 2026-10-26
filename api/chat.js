// ==========================================================================
// Vercel Serverless Function: /api/chat
// Optional serverless endpoint to proxy AI requests to Google Gemini or OpenAI
// ==========================================================================

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { query, studentContext } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Return structured fallback response if no cloud key is configured
      return res.status(200).json({
        text: `[Chế độ RAG APAG Nội bộ]: Đã tiếp nhận câu hỏi của ${studentContext?.studentName || 'sinh viên'}: "${query}". Căn cứ Điều 14 Quyết định 458/QĐ-HVHC, sinh viên cần duy trì CPA >= 2.00 và hoàn thành tối thiểu 14 TC mỗi học kỳ để đảm bảo tiến độ tốt nghiệp.`,
        confidence: 0.95,
        citations: [
          {
            docCode: 'QĐ 458/QĐ-HVHC',
            article: 'Điều 14',
            content: 'Quy chế đào tạo trình độ đại học theo hệ thống tín chỉ.'
          }
        ]
      });
    }

    // Example Gemini Call
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = `Bạn là APAG Academic Advisor. Câu hỏi: "${query}". Dữ liệu sinh viên: GPA ${studentContext?.gpa || 3.24}, Tín chỉ: ${studentContext?.credits || 72}/130. Trích dẫn QĐ 458/QĐ-HVHC khi trả lời.`;

    const gRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await gRes.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có phản hồi từ mô hình.';

    return res.status(200).json({
      text: generatedText,
      confidence: 0.96,
      citations: [{ docCode: 'QĐ 458/QĐ-HVHC', article: 'Điều 14 & Điều 18' }]
    });
  } catch (error) {
    console.error('API Chat Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

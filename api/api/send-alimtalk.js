import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS 규격 준수: Origin 동적 헤더 설정 (Credentials와 Wildcard 충돌 해결)
  const clientOrigin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', clientOrigin);
  if (clientOrigin !== '*') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, programTitle, duration, date, time, note } = req.body || {};
    const cleanedPhone = (phone || '').replace(/[^0-9]/g, '');

    const apiKey = process.env.SOLAPI_API_KEY || "NCS24FJSIMGZIRAU";
    const apiSecret = process.env.SOLAPI_API_SECRET || "JA0NDRYGNN37UQYVOXOH90QFVIZUOMM6";
    const pfId = process.env.SOLAPI_PF_ID || "KA01PF260804020356564lHGfPOx0VFG";
    const templateId = process.env.SOLAPI_TEMPLATE_ID || "KA01TP260804022040688lMSG2sF9i8k";

    // Solapi HMAC SHA256 서명 생성
    const isoDate = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString('hex');
    const signature = crypto.createHmac('sha256', apiSecret).update(isoDate + salt).digest('hex');
    const authHeader = `HMAC-SHA256 apiKey=${apiKey}, date=${isoDate}, salt=${salt}, signature=${signature}`;

    const messages = [
      // 1. 고객 알림톡 메시지
      {
        to: cleanedPhone,
        from: "01065666369",
        kakaoOptions: {
          pfId: pfId,
          templateId: templateId,
          variables: {
            "#{고객명}": name || '고객',
            "#{코스명}": programTitle || '1:1 맞춤 예약',
            "#{소요시간}": String(duration || '50'),
            "#{예약일자}": date || '',
            "#{예약시간}": time || ''
          }
        }
      },
      // 2. 원장님 직통 LMS 안내 메시지
      {
        to: "01065666369",
        from: "01065666369",
        text: `[스트레칭온 실시간 예약 접수]\n• 고객명: ${name}\n• 연락처: ${phone}\n• 코스: ${programTitle} (${duration}분)\n• 일시: ${date} ${time}\n• 요청사항: ${note || '없음'}`
      }
    ];

    const solapiRes = await fetch("https://api.solapi.com/messages/v4/send-many", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify({ messages })
    });

    const solapiData = await solapiRes.json();

    if (!solapiRes.ok) {
      return res.status(solapiRes.status).json({
        success: false,
        error: solapiData.errorMessage || solapiData.message || JSON.stringify(solapiData)
      });
    }

    return res.status(200).json({ success: true, solapiData });
  } catch (error) {
    console.error('Solapi Alimtalk Send Error:', error);
    return res.status(500).json({ success: false, error: error.message || '알림톡 발송 중 서버 오류가 발생했습니다.' });
  }
}

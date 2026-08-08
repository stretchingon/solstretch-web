export default async function handler(req, res) {
  // CORS 허용 설정 (admin.html 등 외부 접근 허용)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, programTitle, duration, date, time } = req.body;

  // 원장님 솔라피 설정 정보
  const apiKey = "NCS24FJSIMGZIRAU";
  const apiSecret = "JA0NDRYGNN37UQYVOXOH90QFVIZUOMM6";
  const pfId = "스트레칭포인트";
  const templateId = "KA01TP260804022040688lMSG2sF9i8k";
  const senderPhone = "01065666369";

  // 솔라피 암호화 서명 생성
  const crypto = require('crypto');
  const dateStr = new Date().toISOString();
  const salt = Math.random().toString(36).substring(2, 10);
  const hmac = crypto.createHmac('sha256', apiSecret);
  hmac.update(dateStr + salt);
  const signature = hmac.digest('hex');
  const authHeader = `HMAC-SHA256 apiKey=${apiKey}, date=${dateStr}, salt=${salt}, signature=${signature}`;

  try {
    const payload = {
      messages: [{
        to: phone,
        from: senderPhone,
        kakaoOptions: {
          pfId: pfId,
          templateId: templateId,
          variables: {
            "#{고객명}": name,
            "#{코스명}": programTitle,
            "#{소요시간}": String(duration || 50),
            "#{예약일자}": date,
            "#{예약시간}": time
          }
        }
      }]
    };

    // 솔라피 서버로 최종 발송
    const response = await fetch("https://api.solapi.com/messages/v4/send-many", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error("Solapi Error:", error);
    return res.status(500).json({ error: 'Failed to send Alimtalk' });
  }
}

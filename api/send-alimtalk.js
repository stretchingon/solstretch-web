export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { return res.status(200).end(); }
  if (req.method !== 'POST') { return res.status(405).json({ error: 'Method not allowed' }); }

  const { name, phone, programTitle, duration, date, time } = req.body;

  const apiKey = "NCS24FJSIMGZIRAU"; 
  const apiSecret = "UUGFZ1N6ZDOPL8GVRT3SQBPQ35MNYBHU";
  const pfId = "KA01PF260804020356564lHGfPOx0VFG"; 
  const templateId = "KA01TP260804022040688lMSG2sF9i8k";
  const senderPhone = "01065666369";

  const crypto = require('crypto');
  const dateStr = new Date().toISOString();
  const salt = Math.random().toString(36).substring(2, 10);
  const hmac = crypto.createHmac('sha256', apiSecret);
  hmac.update(dateStr + salt);
  const signature = hmac.digest('hex');
  const authHeader = `HMAC-SHA256 apiKey=${apiKey}, date=${dateStr}, salt=${salt}, signature=${signature}`;

  // ⭐️ 핵심 수정: 카카오 승인 템플릿과 100% 동일한 텍스트로 치환 적용
  const messageText = `[스트레칭온] 1:1 맞춤 예약 완료 안내

안녕하세요, ${name}님!
스트레칭온 1:1 맞춤 수기 케어 예약이 정상 확정되었습니다.

• 예약 코스: ${programTitle} (${duration || 50}분)
• 예약 일시: ${date} ${time}
• 오시는 길: 인천 서구 가정로 451 벨라미센텀시티2차 8층 803호
• 문의 전화: 010-6566-6369

※ 자율적 이완 관리를 위해 움직임이 편안한 복장(운동복 등)을 착용 후 방문해 주세요.`;

  try {
    const payload = {
      messages: [{
        to: phone,
        from: senderPhone,
        text: messageText,
        kakaoOptions: {
          pfId: pfId,
          templateId: templateId,
          disableSms: true, // 카톡 실패시 문자로 빠지지 않게 강제 설정
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

    const response = await fetch("https://api.solapi.com/messages/v4/send-many", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": authHeader },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send' });
  }
}

import { SolapiMessageService } from "solapi";

// Solapi API 연결 서비스 초기화
const messageService = new SolapiMessageService(
  process.env.SOLAPI_API_KEY || "NCS24FJSIMGZIRAU",
  process.env.SOLAPI_API_SECRET || "JA0NDRYGNN37UQYVOXOH90QFVIZUOMM6"
);

export default async function handler(req, res) {
  // CORS 헤더 설정 (원장님 메인 PC ERP admin.html 접속 허용)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
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

  const { name, phone, programTitle, duration, date, time, note } = req.body;

  try {
    const cleanedPhone = (phone || '').replace(/[^0-9]/g, '');

    // 1. 발신프로필 ID (솔라피 > 카카오톡 > 발신프로필 관리의 KA01PF... 형태 고유코드)
    const pfId = process.env.SOLAPI_PF_ID || "KA01PF260804020356564lHGfPOx0VFG"; 
    const templateId = process.env.SOLAPI_TEMPLATE_ID || "KA01TP260804022040688lMSG2sF9i8k";

    // 2. 고객 휴대폰으로 카카오 알림톡 발송
    const alimtalkResult = await messageService.send({
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
    });

    // 3. 원장님 직통 휴대폰(010-6566-6369)으로 신규 예약 접수 SMS/LMS 발송
    await messageService.send({
      to: "01065666369",
      from: "01065666369",
      text: `[스트레칭온 실시간 예약 접수]\n• 고객명: ${name}\n• 연락처: ${phone}\n• 코스: ${programTitle} (${duration}분)\n• 일시: ${date} ${time}\n• 요청사항: ${note || '없음'}`
    });

    return res.status(200).json({ success: true, alimtalkResult });
  } catch (error) {
    console.error('Solapi Alimtalk Send Error:', error);
    let errMsg = error.message || '알림톡 발송 실패';
    if (error.data) {
      errMsg = typeof error.data === 'string' ? error.data : JSON.stringify(error.data);
    }
    return res.status(500).json({ success: false, error: errMsg });
  }
}

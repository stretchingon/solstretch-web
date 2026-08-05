import { SolapiMessageService } from "solapi";

const messageService = new SolapiMessageService(
  process.env.SOLAPI_API_KEY || "NCS24FJSIMGZIRAU",
  process.env.SOLAPI_API_SECRET || "JA0NDRYGNN37UQYVOXOH90QFVIZUOMM6"
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, programTitle, duration, date, time, note } = req.body;

  try {
    const cleanedPhone = phone.replace(/[^0-9]/g, '');

    const pfId = process.env.SOLAPI_PF_ID || "스트레칭포인트";
    const templateId = process.env.SOLAPI_TEMPLATE_ID || "KA01TP260804022040688lMSG2sF9i8k";

    // 1. 고객용 카카오 알림톡 발송
    await messageService.send({
      to: cleanedPhone,
      from: "01065666369",
      kakaoOptions: {
        pfId: pfId,
        templateId: templateId,
        variables: {
          "#{고객명}": name,
          "#{코스명}": programTitle,
          "#{소요시간}": String(duration),
          "#{예약일자}": date,
          "#{예약시간}": time
        }
      }
    });

    // 2. 원장님 직통 휴대폰 예약 접수 실시간 알림 SMS/LMS
    await messageService.send({
      to: "01065666369",
      from: "01065666369",
      text: `[스트레칭온 실시간 예약 접수]\n• 고객명: ${name}\n• 연락처: ${phone}\n• 코스: ${programTitle} (${duration}분)\n• 일시: ${date} ${time}\n• 요청: ${note || '없음'}`
    });

    return res.status(200).json({ success: true, message: '알림 발송 완료' });
  } catch (error) {
    console.error('Solapi Send Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

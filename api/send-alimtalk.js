```js
const { SolapiMessageService } = require('solapi');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Solapi Alimtalk API Server is running!'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : req.body || {};

    const {
      name,
      phone,
      programTitle,
      duration,
      date,
      time,
      note
    } = body;

    const cleanedPhone = String(phone || '').replace(/[^0-9]/g, '');

    if (!cleanedPhone) {
      return res.status(400).json({
        success: false,
        error: '휴대폰 번호가 올바르지 않습니다.'
      });
    }

    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;
    const pfId = process.env.SOLAPI_PF_ID;
    const templateId = process.env.SOLAPI_TEMPLATE_ID;

    const senderPhone = String(
      process.env.SOLAPI_SENDER_PHONE || ''
    ).replace(/[^0-9]/g, '');

    if (!apiKey || !apiSecret || !pfId || !templateId || !senderPhone) {
      return res.status(500).json({
        success: false,
        error: 'Solapi 환경변수가 모두 설정되지 않았습니다.'
      });
    }

    const messageService = new SolapiMessageService(
      apiKey,
      apiSecret
    );

    const alimtalkMessage = {
      to: cleanedPhone,
      from: senderPhone,
      kakaoOptions: {
        pfId: pfId,
        templateId: templateId,
        variables: {
          '#{고객명}': String(name || '고객'),
          '#{코스명}': String(programTitle || '1:1 맞춤 예약'),
          '#{소요시간}': String(duration || '50'),
          '#{예약일자}': String(date || ''),
          '#{예약시간}': String(time || '')
        }
      }
    };

    const lmsText =
      '[스트레칭온 실시간 예약 접수]\n' +
      '고객명: ' + String(name || '미입력') + '\n' +
      '연락처: ' + cleanedPhone + '\n' +
      '코스: ' + String(programTitle || '맞춤 케어') +
      ' (' + String(duration || '50') + '분)\n' +
      '일시: ' + String(date || '') +
      ' ' + String(time || '') + '\n' +
      '요청사항: ' + String(note || '없음');

    const lmsMessage = {
      to: senderPhone,
      from: senderPhone,
      text: lmsText
    };

    const alimtalkResult =
      await messageService.send(alimtalkMessage);

    const lmsResult =
      await messageService.send(lmsMessage);

    console.log('Alimtalk result:', alimtalkResult);
    console.log('LMS result:', lmsResult);

    return res.status(200).json({
      success: true,
      message: '예약 알림이 정상적으로 발송되었습니다.'
    });

  } catch (error) {
    console.error('Solapi send error:', error);

    return res.status(500).json({
      success: false,
      error: error && error.message
        ? error.message
        : '알림 발송 중 서버 오류가 발생했습니다.'
    });
  }
}
```

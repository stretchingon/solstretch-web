const crypto = require('crypto');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET = 연결 테스트
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'SOLAPI API 인증 서버 정상 작동!'
    });
  }

  // POST = 실제 예약 알림 발송
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: '허용되지 않은 요청 방식입니다.'
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
        error: 'SOLAPI 환경변수가 모두 설정되지 않았습니다.'
      });
    }

    // SOLAPI HMAC 인증
    const dateHeader = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString('hex');

    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(dateHeader + salt)
      .digest('hex');

    const authHeader =
      'HMAC-SHA256 ' +
      'apiKey=' + apiKey + ', ' +
      'date=' + dateHeader + ', ' +
      'salt=' + salt + ', ' +
      'signature=' + signature;

    // 고객 알림톡
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

    // 원장님 문자
    const lmsMessage = {
      to: senderPhone,
      from: senderPhone,
      text:
        '[스트레칭온 실시간 예약 접수]\n' +
        '고객명: ' + String(name || '미입력') + '\n' +
        '연락처: ' + cleanedPhone + '\n' +
        '코스: ' + String(programTitle || '맞춤 케어') +
        ' (' + String(duration || '50') + '분)\n' +
        '일시: ' + String(date || '') +
        ' ' + String(time || '') + '\n' +
        '요청사항: ' + String(note || '없음')
    };

    const messages = [
      alimtalkMessage,
      lmsMessage
    ];

    const solapiRes = await fetch(
      'https://api.solapi.com/messages/v4/send-many',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          messages: messages
        })
      }
    );

    const solapiData =
      await solapiRes.json().catch(() => ({}));

    if (!solapiRes.ok) {
      console.error('SOLAPI 발송 실패:', solapiData);

      return res.status(500).json({
        success: false,
        error:
          solapiData.errorMessage ||
          solapiData.message ||
          'SOLAPI 메시지 발송에 실패했습니다.',
        status: solapiRes.status
      });
    }

    console.log('SOLAPI 발송 성공:', solapiData);

    return res.status(200).json({
      success: true,
      message: '예약 알림이 정상적으로 발송되었습니다.',
      result: solapiData
    });

  } catch (error) {
    console.error('알림 발송 오류:', error);

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        '알림 발송 중 서버 오류가 발생했습니다.'
    });
  }
};

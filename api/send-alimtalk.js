import crypto from 'crypto';

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
      message: 'SOLAPI Alimtalk API 서버 정상 작동!'
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

    if (
      !apiKey ||
      !apiSecret ||
      !pfId ||
      !templateId ||
      !senderPhone
    ) {
      return res.status(500).json({
        success: false,
        error: 'SOLAPI 환경변수가 모두 설정되지 않았습니다.'
      });
    }

    const dateHeader = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString('hex');

    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(dateHeader + salt)
      .digest('hex');

    const authorization =
      `HMAC-SHA256 apiKey=${apiKey}, ` +
      `date=${dateHeader}, ` +
      `salt=${salt}, ` +
      `signature=${signature}`;

    // ============================================
    // 1. 고객 알림톡
    // ============================================

    const alimtalkPayload = {
      message: {
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
      }
    };

    console.log('알림톡 요청:', {
      to: cleanedPhone,
      pfId: pfId,
      templateId: templateId
    });

    const alimtalkResponse = await fetch(
      'https://api.solapi.com/messages/v4/send',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization
        },
        body: JSON.stringify(alimtalkPayload)
      }
    );

    const alimtalkData =
      await alimtalkResponse.json().catch(() => ({}));

    console.log('알림톡 응답:', alimtalkData);

    if (!alimtalkResponse.ok) {
      return res.status(500).json({
        success: false,
        stage: 'alimtalk',
        error:
          alimtalkData.errorMessage ||
          alimtalkData.message ||
          '알림톡 발송 실패',
        solapi: alimtalkData
      });
    }

    // ============================================
    // 2. 원장님 예약 접수 LMS
    // ============================================

    const adminPayload = {
      message: {
        to: senderPhone,
        from: senderPhone,
        text:
          `[스트레칭온 실시간 예약 접수]\n` +
          `고객명: ${name || '미입력'}\n` +
          `연락처: ${cleanedPhone}\n` +
          `코스: ${programTitle || '맞춤 케어'} (${duration || '50'}분)\n` +
          `일시: ${date || ''} ${time || ''}\n` +
          `요청사항: ${note || '없음'}`
      }
    };

    const adminResponse = await fetch(
      'https://api.solapi.com/messages/v4/send',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization
        },
        body: JSON.stringify(adminPayload)
      }
    );

    const adminData =
      await adminResponse.json().catch(() => ({}));

    console.log('원장님 문자 응답:', adminData);

    if (!adminResponse.ok) {
      console.error('원장님 문자 발송 실패:', adminData);

      return res.status(500).json({
        success: false,
        stage: 'admin_sms',
        error:
          adminData.errorMessage ||
          adminData.message ||
          '원장님 문자 발송 실패',
        solapi: adminData
      });
    }

    return res.status(200).json({
      success: true,
      message: '알림톡 및 예약 접수 문자가 정상 발송되었습니다.',
      alimtalk: alimtalkData,
      adminSms: adminData
    });

  } catch (error) {
    console.error('SOLAPI 발송 오류:', error);

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        '알림 발송 중 서버 오류가 발생했습니다.'
    });
  }
}

```js
import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  // 브라우저의 OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET 테스트
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Solapi Alimtalk API Server is running!'
    });
  }

  // POST만 허용
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

    // Vercel 환경변수에서 Solapi 정보 가져오기
    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;
    const pfId = process.env.SOLAPI_PF_ID;
    const templateId = process.env.SOLAPI_TEMPLATE_ID;
    const senderPhone = process.env.SOLAPI_SENDER_PHONE;

    // 환경변수 누락 확인
    if (!apiKey || !apiSecret || !pfId || !templateId || !senderPhone) {
      console.error('Solapi 환경변수가 설정되지 않았습니다.');

      return res.status(500).json({
        success: false,
        error: 'Solapi 서버 설정이 완료되지 않았습니다.'
      });
    }

    // Solapi HMAC SHA256 인증
    const isoDate = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString('hex');

    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(isoDate + salt)
      .digest('hex');

    const authHeader =
      `HMAC-SHA256 apiKey=${apiKey}, ` +
      `date=${isoDate}, ` +
      `salt=${salt}, ` +
      `signature=${signature}`;

    // 고객 알림톡 + 원장님 LMS
    const messages = [
      {
        to: cleanedPhone,
        from: senderPhone,
        kakaoOptions: {
          pfId: pfId,
          templateId: templateId,
          variables: {
            '#{고객명}': name || '고객',
            '#{코스명}': programTitle || '1:1 맞춤 예약',
            '#{소요시간}': String(duration || '50'),
            '#{예약일자}': date || '',
            '#{예약시간}': time || ''
          }
        }
      },
      {
        to: senderPhone,
        from: senderPhone,
        text:
          `[스트레칭온 실시간 예약 접수]\n` +
          `• 고객명: ${name || '미입력'}\n` +
          `• 연락처: ${cleanedPhone}\n` +
          `• 코스: ${programTitle || '맞춤 케어'} (${duration || 50}분)\n` +
          `• 일시: ${date || ''} ${time || ''}\n` +
          `• 요청사항: ${note || '없음'}`
      }
    ];

    const solapiRes = await fetch(
      'https://api.solapi.com/messages/v4/send-many',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader
        },
        body: JSON.stringify({ messages })
      }
    );

    const solapiData = await solapiRes.json().catch(() => ({}));

    if (!solapiRes.ok) {
      console.error('Solapi 오류:', solapiData);

      return res.status(500).json({
        success: false,
        error:
          solapiData.errorMessage ||
          solapiData.message ||
          `Solapi 오류 (상태: ${solapiRes.status})`
      });
    }

    return res.status(200).json({
      success: true,
      message: '예약 알림이 정상적으로 접수되었습니다.',
      solapiData
    });
  } catch (error) {
    console.error('Solapi Alimtalk Send Error:', error);

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        '알림톡 발송 중 서버 오류가 발생했습니다.'
    });
  }
}
```

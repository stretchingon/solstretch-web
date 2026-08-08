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

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'GET 방식으로 테스트해주세요.'
    });
  }

  try {
    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        success: false,
        error: 'SOLAPI_API_KEY 또는 SOLAPI_API_SECRET이 없습니다.'
      });
    }

    const date = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString('hex');

    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(date + salt)
      .digest('hex');

    const authHeader =
      `HMAC-SHA256 apiKey=${apiKey}, ` +
      `date=${date}, ` +
      `salt=${salt}, ` +
      `signature=${signature}`;

    const response = await fetch(
      'https://api.solapi.com/messages/v4/list',
      {
        method: 'GET',
        headers: {
          Authorization: authHeader
        }
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Solapi 인증 테스트 실패:', data);

      return res.status(500).json({
        success: false,
        error:
          data.errorMessage ||
          data.message ||
          `Solapi 오류 (${response.status})`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Solapi API 인증 성공!',
      solapiConnected: true
    });
  } catch (error) {
    console.error('Solapi 연결 테스트 오류:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Solapi 연결 테스트 실패'
    });
  }
}

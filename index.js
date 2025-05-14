require('dotenv').config();
const fetch = require('node-fetch');

async function gerarTokenHotmart() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('❌ CLIENT_ID ou CLIENT_SECRET não definidos.');
    return;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  try {
    const response = await fetch('https://api-sec-vlc.hotmart.com/security/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const texto = await response.text();
    console.log('📥 Resposta bruta:', texto);

    if (!response.ok) {
      throw new Error(`❌ Erro ${response.status}: ${texto}`);
    }

    const data = JSON.parse(texto);
    console.log('✅ Token de acesso:', data.access_token);
  } catch (error) {
    console.error('❌ Erro ao gerar token:', error.message);
  }
}

gerarTokenHotmart();

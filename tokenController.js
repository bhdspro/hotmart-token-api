const fetch = require('node-fetch');

let token = null;
let expiresAt = null;

async function gerarTokenHotmart() {
  const params = new URLSearchParams();
  params.append('client_id', process.env.CLIENT_ID);
  params.append('client_secret', process.env.CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');

  const response = await fetch('https://api.hotmart.com/security/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: params
});


  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Erro ao gerar token: ${JSON.stringify(data)}`);
  }

  token = data.access_token;
  expiresAt = Date.now() + (data.expires_in * 1000) - 30 * 1000; // Renova 30s antes de expirar
}

async function getTokenHotmart() {
  if (!token || Date.now() >= expiresAt) {
    await gerarTokenHotmart();
  }
  return token;
}

module.exports = { getTokenHotmart };

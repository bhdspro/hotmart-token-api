const fetch = require('node-fetch');

let token = null;
let expiresAt = null;

async function gerarTokenHotmart() {
  const params = new URLSearchParams();
  params.append('client_id', process.env.CLIENT_ID);
  params.append('client_secret', process.env.CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');

  console.log('Enviando requisição para obter o token Hotmart...');
  
  // Realiza a requisição POST para a Hotmart
  const response = await fetch('https://api.hotmart.com/security/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  console.log('Resposta da Hotmart:', response.status);  // Status da resposta HTTP

  const data = await response.json();  // Parse do JSON

  // Log de erro se a resposta não for ok
  if (!response.ok) {
    console.error('Erro ao gerar token:', data);
    throw new Error(`Erro ao gerar token: ${JSON.stringify(data)}`);
  }

  // Log da resposta bem-sucedida
  console.log('Token recebido:', data.access_token);
  
  token = data.access_token;
  expiresAt = Date.now() + (data.expires_in * 1000) - 30 * 1000; // Renova 30s antes de expirar
}

async function getTokenHotmart() {
  console.log('Verificando se o token precisa ser renovado...');
  
  // Se não houver token ou o token expirou, gera um novo
  if (!token || Date.now() >= expiresAt) {
    await gerarTokenHotmart();
  }

  console.log('Token atual:', token);  // Log do token atual
  return token;
}

module.exports = { getTokenHotmart };

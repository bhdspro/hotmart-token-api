const axios = require('axios');
const qs = require('qs');
require('dotenv').config();  // Carrega as variáveis de ambiente

async function obterToken() {
  const url = 'https://api-sec-vlc.hotmart.com/security/oauth/token';  // URL da Hotmart
  const client_id = process.env.CLIENT_ID;  // Obtém do .env
  const client_secret = process.env.CLIENT_SECRET;  // Obtém do .env

  // Codifica client_id:client_secret em Base64
  const auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  // Codifica os parâmetros do corpo da requisição
  const params = qs.stringify({
    grant_type: 'client_credentials',
  });

  try {
    // Envia a requisição
    const response = await axios.post(url, params, {
      headers: {
        'Authorization': `Basic ${auth}`,  // Cabeçalho de autenticação Basic
        'Content-Type': 'application/x-www-form-urlencoded',  // Tipo de conteúdo
      },
    });

    // Exibe o token obtido
    console.log('Token de acesso:', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter token:', error.response ? error.response.data : error.message);
  }
}

// Executa a função para obter o token
obterToken();

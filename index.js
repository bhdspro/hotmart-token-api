const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/gerar-token', async (req, res) => {
  const url = 'https://api.hotmart.com/security/oauth/token';

  const params = new URLSearchParams();
  params.append('client_id', process.env.CLIENT_ID);
  params.append('client_secret', process.env.CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const data = await response.json();

    if (response.ok) {
      res.json({ token: data.access_token });
    } else {
      res.status(400).json({ erro: data });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro no servidor', detalhe: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('API da Hotmart rodando com sucesso!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

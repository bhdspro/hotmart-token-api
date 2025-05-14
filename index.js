const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROTA 1: gerar token de acesso via client credentials
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

// ROTA 2: listar produtos usando o token
app.get('/produtos', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const response = await fetch('https://api.hotmart.com/payments/api/v1/products', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      res.json(data);
    } else {
      res.status(response.status).json({ erro: data });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro no servidor', detalhe: error.message });
  }
});

// Página inicial
app.get('/', (req, res) => {
  res.send('API da Hotmart rodando com sucesso!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

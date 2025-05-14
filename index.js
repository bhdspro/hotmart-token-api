const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getTokenHotmart } = require('./tokenController');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());  // Permitir qualquer origem (recomenda-se mais segurança se for em produção)
app.use(express.json());

app.get('/token-hotmart', async (req, res) => {
  try {
    const token = await getTokenHotmart();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter token', detalhe: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// URL do arquivo 'clientes.txt' no seu repositório GitHub
const clientesFileUrl = '';

// Rota GET para retornar os dados dos clientes
app.get('/clientes', async (req, res) => {
  try {
    // Fazendo uma requisição para obter o conteúdo do arquivo clientes.txt
    const response = await axios.get(clientesFileUrl);

    // Processar o conteúdo do arquivo
    const data = response.data;

    // Dividir os dados por cliente (clientes separados por duas quebras de linha)
    const clients = data.split('\n\n').map(client => {
      const lines = client.split('\n');

      // Criar um objeto para armazenar as informações do cliente
      let clientData = {};

      lines.forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          clientData[key.trim()] = value.trim();
        }
      });

      return clientData;
    });

    // Retornar os dados dos clientes no formato JSON
    res.json(clients);
  } catch (error) {
    console.error('Erro ao obter o arquivo:', error);
    res.status(500).send('Erro ao obter os dados dos clientes');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});

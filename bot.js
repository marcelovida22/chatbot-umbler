const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// URL do arquivo 'clientes.txt' no seu repositório GitHub
const clientesFileUrl = 'https://raw.githubusercontent.com/marcelovida22/chatbot-umbler/main/clientes.txt';  // Usando a URL raw

// Rota GET para retornar os dados dos clientes
app.get('/clientes', async (req, res) => {
  const numero = req.query.numero; // Obtendo o número de telefone enviado pelo UmblerTalk

  if (!numero) {
    return res.status(400).send('Número de telefone não fornecido');
  }

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

    // Buscar o cliente pelo número de telefone
    const cliente = clients.find(c => c.Numero === numero);

    if (cliente) {
      // Se o cliente for encontrado, retornar os dados (Nome e CPF, por exemplo)
      res.json({
        nome: cliente.Nome,
        cpf: cliente.CPF
      });
    } else {
      // Se o cliente não for encontrado
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao obter o arquivo:', error);
    res.status(500).send('Erro ao obter os dados dos clientes');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});

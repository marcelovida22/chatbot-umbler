const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json()); // 🔥 Middleware para interpretar JSON

// URL do arquivo 'clientes.txt' no seu repositório GitHub
const clientesFileUrl = 'https://raw.githubusercontent.com/marcelovida22/chatbot-umbler/main/clientes.txt';

// Função para normalizar o número de telefone (remover sinais de '+' e espaços)
function normalizePhoneNumber(phoneNumber) {
  return phoneNumber.replace(/\D/g, ''); // Remove qualquer coisa que não seja número (incluindo "+" e espaços)
}

// Rota POST para retornar os dados dos clientes
app.post('/clientes', async (req, res) => {
  const { Numero } = req.body; // Obtendo o número do corpo da requisição

  if (!Numero) {
    return res.status(400).json({ error: 'Número de telefone não fornecido' });
  }

  try {
    // Fazendo uma requisição para obter o conteúdo do arquivo clientes.txt
    const response = await axios.get(clientesFileUrl);
    const data = response.data;

    // Dividir os dados por cliente (clientes separados por duas quebras de linha)
    const clients = data.split('\n\n').map(client => {
      const lines = client.split('\n');
      let clientData = {};

      lines.forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          clientData[key.trim()] = value.trim();
        }
      });

      return clientData;
    });

    // Buscar o cliente pelo número de telefone (normalizando ambos os números)
    const cliente = clients.find(c => normalizePhoneNumber(c.Numero) === normalizePhoneNumber(Numero));

    if (cliente) {
      res.json({
        nome: cliente.Nome,
        cpf: cliente.CPF
      });
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao obter o arquivo:', error);
    res.status(500).json({ error: 'Erro ao obter os dados dos clientes' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});

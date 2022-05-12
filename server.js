// * Importações
const express = require('express')
const path = require('path')
const fs = require('fs')

// * Métodos

// * Busca os contatos
const getContacts = () => {
  const filePath = path.join(__dirname, 'contacts.json')          // cria um caminho absoluto contacts.json

  if (!fs.existsSync(filePath)) {                                 // verifica se o arquivo NÃO existe
    fs.writeFileSync(filePath, '[]')                              // cria o arquivo com um array vazio
  }

  const file = fs.readFileSync(filePath, 'utf-8')                 // lê o arquivo
  const result = JSON.parse(file)                                 // converte texto para objeto
  return result                                                   // retorna o objeto
}

// * Adiciona um contato
const addContact = (contact) => {                                 // cria constate adicionar contatos
  const contacts = getContacts()                                  // pegando os contatos
  contacts.push(contact)                                          // entregando os contatos
  const filePath = path.join(__dirname, 'contacts.json')          //  montando caminho absoluto do contacts.json
  fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2))   // cria o arquivo contacts e converte pra string
}

// * Script

const app = express()                                             // cria um servidor express
app.use(express.urlencoded({ extended: false }))                  // insere o plugin urlenconded

app.get('/', (request, response) => {                             // cria a rota GET /
  const contacts = getContacts()                                  // busca os contatos
  const contactsString = JSON.stringify(contacts, null, 2)        // converte os contatos para string
  const filePath = path.join(__dirname, 'views', 'index.html')    // monta o caminho absoluto do arquivo index.html
  const file = fs.readFileSync(filePath, 'utf-8')                 // lê o arquivo index.html
  const formattedFile = file.replace('[JSON]', contactsString)    // substitui a tag [JSON] para a string de contatos
  response.send(formattedFile)                                    // envia o arquivo formatado
})

app.get('/create', (request, response) => {                       // cria rota GET /create
  const filePath = path.join(__dirname, 'views', 'form.html')     // cria o caminho absoluto pra form.html
  response.sendFile(filePath)                                     // envia o arquivo
})

app.post('/create', (request, response) => {                      // cria uma rota POST /create
  addContact(request.body)                                        // adiciona um contato
  response.redirect('/')                                          // redireciona para /
})

app.listen(3000)                                                  // escutando a porta 3000

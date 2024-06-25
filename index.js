const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.static('dist'))

phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(cors())
app.use(requestLogger)

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const currDate = new Date().toString();
    const numPeople = phonebook.length;
    response.send(
        `
        <div>
            Phonebook has info for ${numPeople} people
            <br/>
            ${currDate}
        </div>
        `
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    const randomId = phonebook.length > 0
      ? Math.floor(Math.random() * (10000000 - 1 + 1)) + 1
      : 0
    return randomId;
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    const existing = phonebook.find(person => person.name === body.name)
    if (existing) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    phonebook = phonebook.concat(person)
  
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
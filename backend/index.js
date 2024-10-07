const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())
app.use(morgan("tiny"))
app.use(express.static("dist"))

const currentDate = new Date()


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {
  const personsAmount = persons.length
  response.send(`
    <p>There are ${personsAmount} persons in the phonebook.</p><br/>
    <hp>${currentDate}</hp>
    `)
})

app.get("/api/persons/:id", (request, response) => {
  const requestedId = request.params.id
  const person = persons.find(p => p.id === requestedId)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const requestedId = request.params.id
  persons = persons.filter(p => p.id !== requestedId)
  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => Number(p.id))) // returns list of all ids and transforming them into individual numbers
    : 0
  return String(maxId + 1)
}

const checkName = (name) => {
  const match = persons.find(p => p.name === name)
  return match === undefined ? false : true
}

app.post("/api/persons", (request, response) => { 
  const body = request.body
  console.log(body)
  
  if (!body) {
    return response.status(400).json({
      error: "content missing"
    })
  }

  if (!body.name) {
    return response.status(400).json({
      error: "name missing"
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing"
    })
  }

  if (checkName(body.name)) {
    return response.status(400).json({
      error: "Name already in phonebook"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})
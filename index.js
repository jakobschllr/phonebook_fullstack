require("dotenv").config()
const express = require("express")
const app = express()
const Entry = require("./models/persons")

app.use(express.json())
app.use(express.static("dist"))

const currentDate = new Date()


// get all phonebook entries from database
app.get("/api/persons", (request, response) => {
  Entry.find({}).then(entries => {
    response.json(entries)
  })
})


app.get("/api/persons/:id", (request, response, next) => {
  const requestedId = request.params.id
  Entry.findById(requestedId)
    .then(person => {
      (response.json(person))
    })
    .catch(error => next(error))
})


app.delete("/api/persons/:id", (request, response, next) => {
  const requestedId = request.params.id
  Entry.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body

  Entry.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators: true, context: "query" })
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => next(error))
})


app.post("/api/persons", (request, response, next) => { 
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


  const person = new Entry({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.name)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})
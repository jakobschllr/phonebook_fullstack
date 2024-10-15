import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import PersonsService from './service/persons'
import axios from 'axios'
import SuccessNotification from "./components/SuccessNotification"
import FailureNotification from "./components/FailureNotification"

const App = () => {
  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('') // control form input element
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successNotification, setSuccessNotification] = useState(0)
  const [failureNotification, setFailureNotification] = useState(0)
  
  const hook = () => {
    PersonsService
      .getAllPersons()
      .then(allPersons => setPersons(allPersons))
  }

  useEffect(hook, [])

  if(!persons) {
    return null
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = (filter.length === 0) ? persons : persons.filter(person => {
    if (person.name.slice(0, filter.length) === filter) {
      return person
    }
  })

  const addNewPerson = (event) => {
    event.preventDefault()
    const newPersonObject = {
      name: newName,
      number: newNumber
    }
    // check if name is already in phonebook
    const personDuplicate = (persons.map(person => person.name)).includes(newName)
    if (personDuplicate) {
      const confirmation = confirm(`${newName} is already in the phonebook. Do you want to update the number?`)
      if (confirmation) {
        const person = persons.find(p => p.name === newName)
        const changedPerson = {...person, number: newNumber}
        PersonsService
          .updateNumber(changedPerson)
          .then(updatedPerson => {
            setPersons(persons.map(p => p.id !== updatedPerson.id ? p : updatedPerson))
            setSuccessNotification(`Changed Number of ${newName}`)
          })
          .catch(error => {
            setFailureNotification(`${newName} was already deleted from the server`)
            hook()
          })
      }
    } else {
      PersonsService
        .addPerson(newPersonObject)
        .then(newPersonObj => {
          setPersons(persons.concat(newPersonObj))
          setSuccessNotification(`Added ${newName} to the Phonebook`)
        })
        .catch(error => {
          console.log(error.response.data.error)
          if (newName.length < 3) {
            setFailureNotification("Name has to have atleast three characters.")
          } else if (newNumber.length < 6) {
            setFailureNotification("Number has to have atleast six characters.")
          } else if (true) {
            let isNumber = false;
              for (let i = 0; i < newNumber.length; i++) {
                const currentCharHex = newNumber[i].toString(16)                
                if (currentCharHex >= 0x30 & currentCharHex <= 0x39) {
                  isNumber = True;
                }
              }
              if (!isNumber) {
                setFailureNotification("Number has to consist of Integer.")
              }
          } else {
            setFailureNotification(`${newName} was already deleted from the server`)
          }
          
          hook()
        })
    }
    setTimeout(() => {
      setFailureNotification(0)
      setSuccessNotification(0)
    }, 3000)
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    PersonsService
      .deletePerson(id)
      .then(deletedPerson => setPersons(persons.filter(person => person.id !== id))
      )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessNotification message={successNotification} />
      <FailureNotification message={failureNotification}/>
      <Filter onFilterChange={handleFilterChange}/>
      <h3>Add a new Person</h3>
      <PersonForm
        onFormSubmit={addNewPerson}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        currentName={newName}
        currentNumber={newNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePersonHandler={deletePerson}/>
    </div>
  )
}

export default App

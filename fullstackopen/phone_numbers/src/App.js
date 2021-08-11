
import React, { useState, useEffect } from 'react'

import personService from './services/persons'
import Notification from './components/Notification'
import Footer from './components/Footer'

import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personFilter, setPersonFilter] = useState('')
  const [footerMessage, setFooterMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  const addOrUpdatePerson = (event) => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName);
    if (person) {
      const changedPerson = { ...person, number: newNumber }
      updatePerson(changedPerson)
    } else {
      addPerson()
    }
  }

  const addPerson = () => {
    const newPerson = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setFooterMessage(`Added '${returnedPerson.name}'`)
        setTimeout(() => {
          setFooterMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error)
        console.log(error.response.data)
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const updatePerson = (person) => {
    console.log(person)
    if (window.confirm(`${person.name} already exists, update number?`)) {
      personService.update(person.id, person)
        .then(updatedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(error)
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handlePersonFilterChange = (event) => {
    setPersonFilter(event.target.value)
  }


  const personsToShow = (personFilter === "")
    ? persons
    : persons.filter(person => person.name.includes(personFilter))

  const deletePerson = (name, id) => {
    console.log("Delete: " + id)
    if (window.confirm(`Really delete ${name}?`)) {
      personService.deletePerson(id)
        .then(returnedData => setPersons(persons.filter(p => p.id !== id)))
        .catch(error => {
          setErrorMessage(`Person '${name}' was already removed from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Footer message={footerMessage} />
      <form>
        <div>
          filter: <input onChange={handlePersonFilterChange} />
        </div>
      </form>
      <h2>Add phone number</h2>
      <form onSubmit={addOrUpdatePerson}>
        <div>
          name: <input value={newName} onChange={handleNewNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNewNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => <li className='person' key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person.name, person.id)}>delete</button></li>)}
      </ul>
    </div>
  )
}

export default App

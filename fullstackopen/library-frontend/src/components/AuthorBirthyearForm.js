import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import Select from 'react-select'

const AuthorBirthbornForm = () => {
  const [selectedName, setSelectedName] = useState(null);
  const [born, setBorn] = useState('')
  const result = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      //setError
      console.log(error)
    }
  })

  if (result.loading || result.error) {
    return null
  }

  const options2 = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ]

  const options = result.data.allAuthors.map(a => ({ value: a.name, label: a.name }))

  const submit = async (event) => {
    event.preventDefault()

    console.log('edit author...')
    editAuthor({
      variables: { name: selectedName.value, born: parseInt(born) }
    })

    setSelectedName(null)
    setBorn('')
  }

  return (
    <div>
      <h3>Set birthborn</h3>
      <Select
        defaultValue={selectedName}
        onChange={setSelectedName}
        options={options}
      />
      <form onSubmit={submit}>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default AuthorBirthbornForm
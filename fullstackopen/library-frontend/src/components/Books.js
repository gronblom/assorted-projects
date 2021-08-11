import React, { useState } from 'react'
import { useQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState('all')
  const result = useQuery(ALL_BOOKS, {
    onError: (error) => {
      //setError(error.graphQLErrors[0].message)
      console.log(error)
    }
  })
  /*
  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBooks)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }   
  }
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      console.log("adding book to cache")
      console.log(addedBook)
      //notify(`${addedPerson.name} added`)
      updateCacheWith(addedBook)
    }
  })
  */
  if (!props.show || result.loading || result.error) {
    return null
  }



  const books = genre === 'all' ? result.data.allBooks : result.data.allBooks.filter(book => book.genres.includes(genre))

  const genres = [...new Set(result.data.allBooks.reduce((a, b) => a.concat(b.genres), []))]

  return (
    <div>
      <h2>books</h2>
      {genres.map(genre => <button onClick={() => setGenre(genre)}>{genre}</button>)}
      <button onClick={() => setGenre('all')}>all</button>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books
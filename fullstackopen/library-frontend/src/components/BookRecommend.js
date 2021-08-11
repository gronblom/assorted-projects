import React, { useEffect, useState } from 'react'
import { useQuery, useLazyQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED, ME } from '../queries'

const Books = (props) => {
  const [favoriteGenre, setFavoriteGenre] = useState(null)
  const [getBooks, { loading: booksLoading, data: booksData }] = useLazyQuery(ALL_BOOKS);
  const [getMe, { loading, data: meData }] = useLazyQuery(ME)
  const meDataSuccess = meData && meData.data && meData.data.me
  useEffect(() => {
    if (props.token) {
      console.log("token changed, getting me")
      console.log(props.token)
      getMe()
    }
  }, [props.token])

  useEffect(() => {
    if (meData && meData.me) {
      setFavoriteGenre(meData.me.favoriteGenre)
      getBooks({ variables: { genre: meData.me.favoriteGenre } })
    }
  }, [meData])

  const updateCacheWith = (addedBook) => {
    const dataInStore = props.client.readQuery({ query: ALL_BOOKS, variables: { genre: favoriteGenre } })
    props.client.writeQuery({
      query: ALL_BOOKS,
      variables: { genre: favoriteGenre },
      data: { allBooks: dataInStore.allBooks.concat(addedBook) }
    })
  }
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      console.log("adding book to cache")
      console.log(addedBook)
      //notify(`${addedPerson.name} added`)
      if (favoriteGenre && addedBook.genres.includes(favoriteGenre)) {
        updateCacheWith(addedBook)
      }
    }
  })

  if (!props.show) {
    return null
  }

  //const books = booksResult.data.allBooks.filter(book => book.genres.includes(result.data.me.favoriteGenre))

  //const genres = [...new Set(result.data.allBooks.reduce((a, b) => a.concat(b.genres), []))]
  return (
    <div>
      books in your favorite genre: {meData && <b>{meData.me.favoriteGenre}</b>}
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
          {booksData && booksData.allBooks && booksData.allBooks.map(a =>
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
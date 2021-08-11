import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const submitAnecdote = async (event) => {
    event.preventDefault()
    const anecdote = event.target.newAnecdote.value
    event.target.newAnecdote.value = ''
    dispatch(createAnecdote(anecdote))
    const notificationText = 'Created new anecdote: ' + anecdote
    dispatch(setNotificationWithTimeout(notificationText, 5))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submitAnecdote}>
        <div><input name='newAnecdote' /></div>
        <button>create</button>
      </form>
    </div >
  )
}

export default AnecdoteForm
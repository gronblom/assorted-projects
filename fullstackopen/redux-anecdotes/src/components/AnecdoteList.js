import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const filter = useSelector(state => state.filter)

  const sortAnecdotes = (anecdotes) => {
    const filteredAnecdotes = filter ? anecdotes.filter(a => a.content.includes(filter)) : anecdotes
    filteredAnecdotes.sort((a, b) => {
      return b.votes - a.votes
    })
    return filteredAnecdotes
  }
  const anecdotes = useSelector(state => sortAnecdotes(state.anecdotes))


  const addVote = (anecdote) => {

    dispatch(vote(anecdote))
    const notificationText = 'Voted for ' + anecdote.content
    dispatch(setNotificationWithTimeout(notificationText, 5))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
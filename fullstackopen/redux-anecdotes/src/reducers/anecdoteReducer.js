import anecdoteService from '../services/anecdoteService'


const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type) {
    case 'INIT_ANECDOTES':
      return action.data.anecdotes
    case 'CREATE_ANECDOTE':
      const newAnecdote = action.data.anecdote
      return state.concat(newAnecdote)
    case 'VOTE':
      const anecdote = action.data.anecdote
      const anecdoteToChange = state.find(n => n.id === anecdote.id)
      if (anecdoteToChange) {
        return state.map(a =>
          a.id !== anecdote.id ? a : anecdote
        )
      } else {
        return state
      }
    default:
      return state
  }

}

export const initAnecdotes = (anecdotes) => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: { anecdotes }
    })
  }
}

export const createAnecdote = (anecdote) => {
  return async dispatch => {
    const returnedAnecdote = await anecdoteService.createNew(anecdote)
    dispatch({
      type: 'CREATE_ANECDOTE',
      data: { anecdote: returnedAnecdote }
    })
  }
}

export const vote = (anecdote) => {
  return async dispatch => {
    const returnedAnecdote = await anecdoteService.update({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch({
      type: 'VOTE',
      data: { anecdote: returnedAnecdote }
    })
  }
}

export default reducer
import React from 'react';
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {

  const dispatchAction = (action) => {
    store.dispatch({
      type: action
    })
  }

  return (
    <div>
      <button onClick={() => dispatchAction('GOOD')}>good</button>
      <button onClick={() => dispatchAction('OK')}>neutral</button>
      <button onClick={() => dispatchAction('BAD')}>bad</button>
      <button onClick={() => dispatchAction('ZERO')}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>neutral {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
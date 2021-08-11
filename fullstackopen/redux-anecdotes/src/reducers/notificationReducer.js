
const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SET':
      return action.data.notification
    case 'REMOVE':
      // Only remove if the state is was not changed
      if (state === action.data.notification) {
        return null
      } else {
        return state
      }
    default:
      return state
  }
}


export const setNotificationWithTimeout = (notification, timeoutSec = 5) => {
  return async dispatch => {
    dispatch(setNotification(notification))
    setTimeout(() => {
      dispatch(removeNotification(notification))
    }, timeoutSec * 1000)
  }
}

export const setNotification = (notification) => {
  return {
    type: 'SET',
    data: { notification }
  }
}

export const removeNotification = (notification) => {
  return {
    type: 'REMOVE',
    data: { notification }
  }
}

export default reducer
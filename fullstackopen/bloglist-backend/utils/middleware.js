const logger = require('./logger')
const config = require('../utils/config')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

const userExtractor = async (request, response, next) => {
  // code that extracts the token
  const authorization = request.get('authorization')

  if (authorization) {
    if (authorization.toLowerCase().startsWith('bearer ')) {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(token, config.TOKEN_SECRET)
      if (token && decodedToken.id) {
        const user = await User.findById(decodedToken.id)
        if (user) {
          request.user = user
        } else {
          console.log('invalid user id')
        }
      } else {
        console.log('invalid authorization token')
      }
    } else {
      console.log('invalid authorization header')
    }
  } else {
    console.log('missing authorization')
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor
}
const { Client } = require('pg')
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')

const secrets = new AWS.SecretsManager({})

exports.handler = async (e) => {
  try {
    const { config } = e.params
    const { password, username, host } = await getSecretValue(config.credsSecretName)
    const databaseName = 'postgres'
    
    const client = new Client({
      user: username,
      host,
      database: databaseName,
      password,
      port: 1521,
    })

    client.connect()

    const sqlData = fs.readFileSync(path.join(__dirname, 'pagila-insert-data.sql')).toString()
    const res = await query(client, sqlData)
    
    return {
      status: 'OK',
    }
  } catch (err) {
    return {
      status: 'ERROR',
      err,
      message: err.message
    }
  }
}

function query(client, sql) {
  return new Promise((resolve, reject) => {
    client.query(sql, (error, res) => {
      if (error) return reject(error)

      return resolve(res)
    })
  })
}

function getSecretValue(secretId) {
  return new Promise((resolve, reject) => {
    secrets.getSecretValue({ SecretId: secretId }, (err, data) => {
      if (err) return reject(err)

      return resolve(JSON.parse(data.SecretString))
    })
  })
}
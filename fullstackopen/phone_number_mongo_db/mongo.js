const mongoose = require('mongoose')

if (process.argv.length != 3 && process.argv.length != 5) {
  console.log('Please provide the password as an argument: node mongo.js <password> [<name> <number>]')
  process.exit(1)
}

const password = process.argv[2]

const url =
    // `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`
    `mongodb+srv://fullstack:${password}@cluster0.urxzq.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
  console.log('phonebook:')
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log('%s %s', person.name, person.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length == 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then((result) => {
    console.log('added %s with number %s to phonebook', result.name, result.number)
    mongoose.connection.close()
  })
}

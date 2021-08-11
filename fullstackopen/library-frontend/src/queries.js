import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}
`

export const ALL_BOOKS = gql`
query allBooks_($author: String, $genre: String){
  allBooks(author: $author, genre: $genre) {
    title
    author {
      name
    }
    published 
    genres
  }
}
`

export const ADD_BOOK = gql`
mutation addBook_($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title,
    author {
      name
    }
  }
}
`

export const EDIT_AUTHOR = gql`
mutation editAuthor_($name: String!, $born: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $born) {
      name
      born
  }
}
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ME = gql`
query {
  me {
    username,
    favoriteGenre
  }
}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title,
      author {
        name
      },
      published,
      genres
    }
  }
`

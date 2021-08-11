/* eslint-disable linebreak-style */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let bearer

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const user =
  {
    "username": "pickelhaube",
    "name": "Pickel Haube",
    "password": "pas"
  }

  await api.post('/api/users').send(user)
  const loginResponse = await api.post('/api/login').send(user)
  bearer = 'bearer ' + loginResponse.body.token
  const promiseArray = helper.testBlogs
    .map(blog => api
      .post('/api/blogs')
      .set('Authorization', bearer)
      .send(blog))
  await Promise.all(promiseArray)

})

test('dummy test', () => {

})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .set('Authorization', bearer)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .set('Authorization', bearer)

  expect(response.body).toHaveLength(helper.testBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.
    get('/api/blogs')
    .set('Authorization', bearer)

  const titles = response.body.map(r => r.title)

  expect(titles).toContain(
    'Type wars'
  )
})

test('a valid blog, missing token', async () => {
  const newBlog = {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('a valid blog, invalid token', async () => {
  const newBlog = {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  }
  const invalidBearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvZnUiLCJpZCI6IjYwN2M3ZDU2YTBmMGRhM2UzMGJlNzY2OCIsImlhdCI6MTYxODg1ODc3NH0.RlpsLeJ75ljUJIq2Q60XoVAuEZ4g9vR-nbaiOyUHRCU"

  await api
    .post('/api/blogs')
    .set('Authorization', invalidBearer)
    .send(newBlog)
    .expect(401)
})


test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', bearer)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.testBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'TDD harms architecture'
  )
})

test('add blog without likes', async () => {
  const newBlog = {
    title: 'TDD harms architecture 2',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', bearer)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.testBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'TDD harms architecture 2'
  )
})

test('add blog with only title', async () => {
  const newBlog = {
    title: 'TDD does not harm architecture',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', bearer)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.testBlogs.length)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).not.toContain(
    'TDD does not harm architecture'
  )
})

test('add blog with only url', async () => {
  const newBlog = {
    url: 'www.kerrolisaa.com',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', bearer)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.testBlogs.length)

  const titles = blogsAtEnd.map(n => n.url)
  expect(titles).not.toContain(
    'www.kerrolisaa.com'
  )
})

test('blog with missing fields is not added', async () => {
  const newBlog = {
    title: 'error'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', bearer)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.testBlogs.length)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]
  console.log(blogToView)
  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .set('Authorization', bearer)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
  expect({ ...resultBlog.body, user: resultBlog.body.user.id }).toEqual(processedBlogToView)
})

test('blog has id field', async () => {
  const blogsAtStart = await helper.blogsInDb()
  expect(blogsAtStart[0].id).toBeDefined()

})

test('update blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blog = { ...blogsAtStart[0], title: "Angular patterns" }
  const updatedBlog = await api
    .put(`/api/blogs/${blog.id}`)
    .set('Authorization', bearer)
    .send(blog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.testBlogs.length)
  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).not.toContain(blogsAtStart[0].title)
  expect(titles).toContain(blog.title)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  console.log(blogToDelete)

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', bearer)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.testBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

afterAll(() => {
  mongoose.connection.close()
})
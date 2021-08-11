const blogsRouter = require('express').Router()
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})


blogsRouter.post('/', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'invalid authorization' })
  }
  const blog = new Blog({ ...request.body, user: user._id })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  blogJson = savedBlog.toJSON()
  blogJson.user = {
    id: user._id,
    username: user.username,
    name: user.name
  }
  response.status(201).json(blogJson)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'invalid authorization' })
  }
  const blog = await Blog.findById(request.params.id).populate('user', { _id: 1 })
  if (blog.user._id.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'blog does not belong to user' })
  }
  await blog.delete()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { body } = request

  const blog = {
    user: body.user,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
    .populate('user', { username: 1, name: 1 })
  response.json(updatedBlog.toJSON())
})

blogsRouter.get('/:id/comments', async (request, response) => {
  const comments = await Comment.find({ blogId: mongoose.Types.ObjectId(request.params.id) })
  response.json(comments.map(comment => comment.toJSON()))
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(401).json({ error: 'blog does not exist' })
  }
  const { body } = request
  const comment = new Comment({ text: body.text, timestamp: new Date(), blogId: request.params.id })
  const savedComment = await comment.save()
  response.json(savedComment.toJSON())
})


module.exports = blogsRouter
var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)

}

const favoriteBlog = (blogs) => {
  const maxLikes = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
  if (maxLikes) {
    // eslint-disable-next-line no-unused-vars
    const { title, author, likes, ...partialObject } = maxLikes
    return { title, author, likes }
  }
  return undefined
}

const mostBlogs = (blogs) => {
  const maxBlogCount = _.flow(
    _.partialRight(_.countBy, 'author'),
    _.toPairs,
    _.partialRight(_.map, (vals) => ({ author: vals[0], blogs: vals[1] })),
    _.partialRight(_.maxBy, 'blogs')
  )(blogs)
  //const maxBlogCount = blogCount.reduce((prev, current) => (prev.blogs > current.blogs) ? prev : current)
  return maxBlogCount
}

const mostLikes = (blogs) => {

  const sumLikes = (blogList) => {
    return blogList.reduce((sum, blog) => sum + (blog['likes'] || 0), 0)
  }

  const mostLikes_ = _.flow(
    _.partialRight(_.groupBy, 'author'),
    _.partialRight(_.map, (blogList, author) => ({ author: author, likes: sumLikes(blogList) })),
    //_.partialRight(_.map, (blogList, author) => ({ author: author, likes: blogList.reduce((sum, blog) => sum + (blog['likes'] || 0), 0) })),
    _.partialRight(_.maxBy, 'likes')
  )(blogs)
  return mostLikes_
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
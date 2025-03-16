import { useState } from 'react'
const Blog = ({ blog, blogUpdate, deleteB, user}) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const showWhenVisible = { display: visible ? '' : 'none' }
  const showRemove = { display: blog.user.name === user.name ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const updateBlog = (event) => {
    event.preventDefault()
    blogUpdate({ ...blog, likes: blog.likes + 1 })
  }

  const removeBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteB(blog.id)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div className='title'>
        {blog.title} <button onClick={toggleVisibility} className='btn-view'>view</button>
      </div>
      <div style={showWhenVisible} className='blog-details'>
        <div className='url'>{blog.url}</div>
        <div className='like'>
          likes {blog.likes} <button onClick={updateBlog} className='btn-like'>like</button>
        </div>
        <div className='author'>{blog.author}</div>
        <div>
          <button id='btn-remove' style={showRemove} onClick={removeBlog}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog

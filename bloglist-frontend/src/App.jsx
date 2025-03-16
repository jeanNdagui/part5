import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [type, setType] = useState(true)
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setType(false)
      setMessage(`${error.response.data.error}.`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addNewBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)

      setBlogs(blogs.concat(blog).sort((a, b) => b.likes - a.likes))
      setType(true)
      setMessage(`a new blog ${blog.title} by ${blog.author}.`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setType(false)
      setMessage(`${error.response.data.error}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }

    blogFormRef.current.toggleVisibility()
  }

  const updateBlog = async (blogObject) => {
    console.log(blogObject)
    const blog = await blogService.update(blogObject.id, blogObject)
    setBlogs(
      blogs
        .map((b) => (b.id !== blog.id ? b : blog))
        .sort((a, b) => b.likes - a.likes)
    )
  }

  const removeBlog = async (id) => {
    try {
      const blog = await blogService.deleteB(id)
      setBlogs(
        blogs.filter((b) => b.id !== id).sort((a, b) => b.likes - a.likes)
      )
      setType(true)
      setMessage('blog was removed ')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setType(false)
      setMessage(`${error.response.data.error}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  /* ====================== composants ====================== */
  const BlogView = ({ blogs }) => {
    return (
      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            blogUpdate={updateBlog}
            deleteB={removeBlog}
            user={user}
          />
        ))}
      </div>
    )
  }

  const UserConnection = ({ name, onLogOut }) => (
    <div>
      {`${name} logged in`} <button onClick={onLogOut}>logout</button>{' '}
    </div>
  )

  return (
    <div>
      {!user && (
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          onChangeUsername={({ target }) => setUsername(target.value)}
          onChangePassword={({ target }) => setPassword(target.value)}
          message={message}
          type={type}
        />
      )}
      {user && <h2>blogs</h2>}
      {user && <Notification message={message} type={type} />}
      {user && (
        <UserConnection
          name={user.name}
          onLogOut={() => {
            window.localStorage.removeItem('loggedBlogappUser')
            setUser(null)
          }}
        />
      )}
      {user && (
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addNewBlog} />
        </Togglable>
      )}

      {user && (
        <BlogView blogs={blogs} blogUpdate={updateBlog} deleteB={removeBlog} />
      )}
    </div>
  )
}

export default App

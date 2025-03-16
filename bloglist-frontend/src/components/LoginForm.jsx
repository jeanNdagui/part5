import Notification from '../components/Notification'
const LoginForm = (props) => {

  return (
    <div>
      <h2>log in to application</h2>
      <Notification message={props.message} type={props.type} />
      <form onSubmit={props.handleLogin}>
        <div>username <input type="text" name="username" value={props.username} onChange={props.onChangeUsername}/></div>
        <div>password <input type="password" name="password" value={props.password} onChange={props.onChangePassword}/></div>
        <div><input type="submit" value="login" /></div>
      </form>
    </div>
  )
}

export default LoginForm
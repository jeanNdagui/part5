import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
  const loginRequest = await axios.post(baseUrl, credentials)
  return loginRequest.data
}

export default { login }

const TOKEN_KEY = 'qibo_token'
const USER_KEY = 'qibo_user'

export const getToken = () => uni.getStorageSync(TOKEN_KEY)
export const setToken = (token) => uni.setStorageSync(TOKEN_KEY, token)
export const removeToken = () => uni.removeStorageSync(TOKEN_KEY)

export const getUser = () => {
  try {
    return JSON.parse(uni.getStorageSync(USER_KEY) || 'null')
  } catch {
    return null
  }
}
export const setUser = (user) => uni.setStorageSync(USER_KEY, JSON.stringify(user))
export const removeUser = () => uni.removeStorageSync(USER_KEY)

export const isLoggedIn = () => !!getToken()
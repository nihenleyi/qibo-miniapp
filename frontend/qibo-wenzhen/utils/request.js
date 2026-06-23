const USE_MOCK = false
const BASE_URL = 'http://localhost:3000'

let requestCount = 0

function showLoading() {
  if (requestCount === 0) {
    uni.showLoading({ title: '加载中...', mask: true })
  }
  requestCount++
}

function hideLoading() {
  requestCount--
  if (requestCount === 0) {
    uni.hideLoading()
  }
}

// ============================================
// Mock 数据
// ============================================
function mockRequest(options) {
  return new Promise((resolve) => {
    const delay = 500 + Math.random() * 300
    setTimeout(() => {
      const url = options.url || ''
      if (url.includes('/login')) {
        const { username, password } = options.data || {}
        if (username === 'test' && password === '123456') {
          resolve({
            code: 200,
            data: { token: 'mock-token-' + Date.now(), userInfo: { name: '测试用户' } },
            message: '登录成功'
          })
        } else {
          resolve({ code: 401, message: '用户名或密码错误' })
        }
        return
      }
      if (url.includes('/inquiry/submit')) {
        resolve({ code: 200, data: { id: Date.now(), createTime: new Date().toLocaleString() }, message: '问诊提交成功' })
        return
      }
      if (url.includes('/inquiry/list')) {
        resolve({
          code: 200,
          data: [
            { id: 1, symptoms: '头痛、发热', createTime: '2026-06-15 10:00', status: '已完成' },
            { id: 2, symptoms: '乏力、怕冷', createTime: '2026-06-14 14:30', status: '已完成' }
          ]
        })
        return
      }
      if (url.includes('/user/info')) {
        resolve({ code: 200, data: { name: '测试用户', username: 'test' } })
        return
      }
      resolve({ code: 200, data: {}, message: 'success' })
    }, delay)
  })
}

// ============================================
// 真实请求
// ============================================
function realRequest(options) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('qibo_token')
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data)
          } else {
            uni.showToast({ title: res.data.message || '请求失败', icon: 'none' })
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          uni.removeStorageSync('qibo_token')
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
          setTimeout(() => uni.reLaunch({ url: '/pages/login/login' }), 1500)
          reject(res)
        } else {
          uni.showToast({ title: res.data?.message || '请求失败', icon: 'none' })
          reject(res)
        }
      },
      fail: (err) => {
        uni.showToast({ title: err.errMsg || '网络异常，请稍后重试', icon: 'none' })
        reject(err)
      },
      complete: () => { hideLoading() }
    })
  })
}

const request = (options) => {
  showLoading()
  if (USE_MOCK) return mockRequest(options)
  return realRequest(options)
}

request.get = (url, data) => request({ url, method: 'GET', data })
request.post = (url, data) => request({ url, method: 'POST', data })
request.put = (url, data) => request({ url, method: 'PUT', data })
request.delete = (url, data) => request({ url, method: 'DELETE', data })

export default request
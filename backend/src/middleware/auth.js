const jwt = require('jsonwebtoken')
const config = require('../config')

/**
 * JWT 认证中间件
 * 验证请求头中的 Bearer token
 */
function authMiddleware(req, res, next) {
  // 公开接口无需认证
  const publicPaths = ['/', '/api/login', '/api/qa/questions', '/api/qa/search', '/api/qa/categories']
  if (publicPaths.includes(req.path)) {
    return next()
  }

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

  if (!token) {
    return res.status(401).json({ code: 401, message: '未登录，请先登录' })
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    req.userId = decoded.userId
    req.userPhone = decoded.phone
    next()
  } catch (err) {
    return res.status(401).json({ code: 401, message: '登录已过期，请重新登录' })
  }
}

module.exports = authMiddleware

const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('../models/db')
const config = require('../config')

const router = express.Router()

/**
 * POST /api/login
 * 手机号+验证码登录
 * Request: { username: "138xxxx", password: "123456" }
 * Response: { code: 200, data: { token, userInfo }, message: "登录成功" }
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.json({ code: 400, message: '请填写手机号和验证码' })
  }

  // 简化验证码逻辑：开发阶段任意6位数字都通过
  // 生产环境应接入短信验证码服务
  if (password.length < 4) {
    return res.json({ code: 401, message: '验证码错误' })
  }

  // 查找或创建用户
  let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(username)

  if (!user) {
    // 新用户自动注册
    const result = db.prepare(
      'INSERT INTO users (phone, name, avatar) VALUES (?, ?, ?)'
    ).run(username, '岐伯用户' + username.slice(-4), '/static/avatar-default.png')

    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
  }

  // 生成 JWT token
  const token = jwt.sign(
    { userId: user.id, phone: user.phone },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  )

  const userInfo = {
    id: user.id,
    name: user.name,
    phone: user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
    avatar: user.avatar,
    gender: user.gender,
    age: user.age
  }

  res.json({
    code: 200,
    data: { token, userInfo },
    message: '登录成功'
  })
})

module.exports = router

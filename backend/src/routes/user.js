const express = require('express')
const db = require('../models/db')

const router = express.Router()

/**
 * GET /api/user/info
 * 获取当前用户信息
 * Response: { code: 200, data: { id, name, phone, avatar, gender, age } }
 */
router.get('/info', (req, res) => {
  const user = db.prepare('SELECT id, phone, name, avatar, gender, age, created_at FROM users WHERE id = ?').get(req.userId)

  if (!user) {
    return res.json({ code: 404, message: '用户不存在' })
  }

  res.json({
    code: 200,
    data: {
      id: user.id,
      name: user.name,
      username: user.name,
      phone: user.phone ? user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '',
      avatar: user.avatar,
      gender: user.gender,
      age: user.age,
      createdAt: user.created_at
    }
  })
})

/**
 * PUT /api/user/info
 * 更新用户信息
 * Request: { name, gender, age, avatar }
 */
router.put('/info', (req, res) => {
  const { name, gender, age, avatar } = req.body

  const updates = []
  const params = []

  if (name !== undefined) { updates.push('name = ?'); params.push(name) }
  if (gender !== undefined) { updates.push('gender = ?'); params.push(gender) }
  if (age !== undefined) { updates.push('age = ?'); params.push(age) }
  if (avatar !== undefined) { updates.push('avatar = ?'); params.push(avatar) }

  if (updates.length === 0) {
    return res.json({ code: 400, message: '没有需要更新的字段' })
  }

  params.push(req.userId)
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params)

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId)

  res.json({
    code: 200,
    data: {
      id: user.id,
      name: user.name,
      phone: user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      avatar: user.avatar,
      gender: user.gender,
      age: user.age
    },
    message: '更新成功'
  })
})

/**
 * PUT /api/user/settings
 * 更新用户设置
 * Request: { notification, sound, vibration }
 */
router.put('/settings', (req, res) => {
  // 当前版本使用 uni 本地存储，后端仅做转发确认
  res.json({
    code: 200,
    data: req.body,
    message: '设置保存成功'
  })
})

module.exports = router

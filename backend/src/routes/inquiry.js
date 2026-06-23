const express = require('express')
const db = require('../models/db')

const router = express.Router()

/**
 * GET /api/inquiry/list
 * 获取当前用户的问诊记录列表
 * Response: { code: 200, data: [{ id, symptoms, createTime, status, name, gender, age }] }
 */
router.get('/list', (req, res) => {
  const userId = req.userId

  const inquiries = db.prepare(`
    SELECT id, name, gender, age, symptoms, status, created_at
    FROM inquiries
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(userId)

  // 格式化为前端期望的格式
  const list = inquiries.map(item => ({
    id: item.id,
    name: item.name,
    gender: item.gender,
    age: item.age,
    symptoms: item.symptoms,
    status: item.status === 'completed' ? '已完成' : '进行中',
    createTime: item.created_at
  }))

  res.json({
    code: 200,
    data: list, // 前端期望 data 直接是数组
    message: 'success'
  })
})

/**
 * GET /api/inquiry/detail/:id
 * 获取问诊详情
 */
router.get('/detail/:id', (req, res) => {
  const userId = req.userId
  const inquiryId = req.params.id

  const inquiry = db.prepare(`
    SELECT * FROM inquiries WHERE id = ? AND user_id = ?
  `).get(inquiryId, userId)

  if (!inquiry) {
    return res.json({ code: 404, message: '问诊记录不存在' })
  }

  let answers = {}
  try {
    answers = JSON.parse(inquiry.answers || '{}')
  } catch (e) {
    answers = {}
  }

  res.json({
    code: 200,
    data: {
      id: inquiry.id,
      name: inquiry.name,
      gender: inquiry.gender,
      age: inquiry.age,
      phone: inquiry.phone,
      diseaseHistory: inquiry.disease_history ? inquiry.disease_history.split(',') : [],
      symptoms: inquiry.symptoms,
      answers: answers,
      status: inquiry.status === 'completed' ? '已完成' : '进行中',
      result: inquiry.result,
      createTime: inquiry.created_at
    }
  })
})

/**
 * POST /api/inquiry/submit
 * 提交问诊
 * Request: { userId, symptoms, answers: {...} }
 * Response: { code: 200, data: { id, createTime }, message: "问诊提交成功" }
 */
router.post('/submit', (req, res) => {
  const userId = req.userId
  const { symptoms, answers } = req.body

  if (!symptoms) {
    return res.json({ code: 400, message: '请填写症状描述' })
  }

  // 从用户表获取基本信息
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId)

  const now = new Date()
  const createTime = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  const result = db.prepare(`
    INSERT INTO inquiries (user_id, name, gender, age, phone, symptoms, answers, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(
    userId,
    user.name,
    user.gender,
    user.age,
    user.phone,
    symptoms,
    JSON.stringify(answers || {}),
    createTime
  )

  res.json({
    code: 200,
    data: {
      id: result.lastInsertRowid,
      createTime: createTime
    },
    message: '问诊提交成功'
  })
})

module.exports = router

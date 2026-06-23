const express = require('express')
const db = require('../models/db')

const router = express.Router()

/**
 * GET /api/health
 * 获取健康档案列表
 * Response: { code: 200, data: [{ id, type, content, recordedAt }] }
 */
router.get('/', (req, res) => {
  const userId = req.userId

  const records = db.prepare(`
    SELECT id, type, content, recorded_at, created_at
    FROM health_records
    WHERE user_id = ?
    ORDER BY recorded_at DESC
  `).all(userId)

  const list = records.map(item => {
    let content = {}
    try {
      content = JSON.parse(item.content || '{}')
    } catch (e) {
      content = { value: item.content }
    }
    return {
      id: item.id,
      type: item.type,
      content: content,
      recordedAt: item.recorded_at,
      createTime: item.created_at
    }
  })

  res.json({
    code: 200,
    data: list,
    message: 'success'
  })
})

/**
 * POST /api/health
 * 添加健康记录
 * Request: { type, content, recordedAt }
 */
router.post('/', (req, res) => {
  const userId = req.userId
  const { type, content, recordedAt } = req.body

  if (!type) {
    return res.json({ code: 400, message: '请选择记录类型' })
  }

  const result = db.prepare(`
    INSERT INTO health_records (user_id, type, content, recorded_at)
    VALUES (?, ?, ?, ?)
  `).run(userId, type, JSON.stringify(content || {}), recordedAt || new Date().toLocaleDateString('zh-CN'))

  res.json({
    code: 200,
    data: { id: result.lastInsertRowid },
    message: '添加成功'
  })
})

module.exports = router

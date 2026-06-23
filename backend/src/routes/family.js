const express = require('express')
const db = require('../models/db')

const router = express.Router()

/**
 * GET /api/family
 * 获取家庭成员列表
 * Response: { code: 200, data: [{ id, name, relation, gender, age, phone }] }
 */
router.get('/', (req, res) => {
  const userId = req.userId

  const members = db.prepare(`
    SELECT id, name, relation, gender, age, phone, created_at
    FROM family_members
    WHERE user_id = ?
    ORDER BY created_at ASC
  `).all(userId)

  const list = members.map(item => ({
    id: item.id,
    name: item.name,
    relation: item.relation,
    gender: item.gender,
    age: item.age,
    phone: item.phone ? item.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '',
    createTime: item.created_at
  }))

  res.json({
    code: 200,
    data: list,
    message: 'success'
  })
})

/**
 * POST /api/family
 * 添加家庭成员
 * Request: { name, relation, gender, age, phone }
 */
router.post('/', (req, res) => {
  const userId = req.userId
  const { name, relation, gender, age, phone } = req.body

  if (!name || !relation) {
    return res.json({ code: 400, message: '请填写姓名和关系' })
  }

  const result = db.prepare(`
    INSERT INTO family_members (user_id, name, relation, gender, age, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, name, relation, gender || '', age || 0, phone || '')

  res.json({
    code: 200,
    data: { id: result.lastInsertRowid },
    message: '添加成功'
  })
})

/**
 * PUT /api/family/:id
 * 更新家庭成员信息
 */
router.put('/:id', (req, res) => {
  const userId = req.userId
  const memberId = req.params.id
  const { name, relation, gender, age, phone } = req.body

  // 验证成员属于当前用户
  const member = db.prepare('SELECT * FROM family_members WHERE id = ? AND user_id = ?').get(memberId, userId)
  if (!member) {
    return res.json({ code: 404, message: '家庭成员不存在' })
  }

  const updates = []
  const params = []
  if (name !== undefined) { updates.push('name = ?'); params.push(name) }
  if (relation !== undefined) { updates.push('relation = ?'); params.push(relation) }
  if (gender !== undefined) { updates.push('gender = ?'); params.push(gender) }
  if (age !== undefined) { updates.push('age = ?'); params.push(age) }
  if (phone !== undefined) { updates.push('phone = ?'); params.push(phone) }

  if (updates.length > 0) {
    params.push(memberId, userId)
    db.prepare(`UPDATE family_members SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...params)
  }

  res.json({
    code: 200,
    message: '更新成功'
  })
})

/**
 * DELETE /api/family/:id
 * 删除家庭成员
 */
router.delete('/:id', (req, res) => {
  const userId = req.userId
  const memberId = req.params.id

  const member = db.prepare('SELECT * FROM family_members WHERE id = ? AND user_id = ?').get(memberId, userId)
  if (!member) {
    return res.json({ code: 404, message: '家庭成员不存在' })
  }

  db.prepare('DELETE FROM family_members WHERE id = ? AND user_id = ?').run(memberId, userId)

  res.json({
    code: 200,
    message: '删除成功'
  })
})

module.exports = router

const express = require('express')
const db = require('../models/db')

const router = express.Router()

/**
 * GET /api/qa/questions
 * 获取热门问答列表
 * Query: ?category=体质调理 (可选)
 * Response: { code: 200, data: { list: [{ id, title, answer, category, isHot }] } }
 */
router.get('/questions', (req, res) => {
  const { category } = req.query

  let questions
  if (category) {
    questions = db.prepare(`
      SELECT id, title, answer, category, is_hot, created_at
      FROM qa_questions
      WHERE category = ?
      ORDER BY is_hot DESC, created_at DESC
    `).all(category)
  } else {
    questions = db.prepare(`
      SELECT id, title, answer, category, is_hot, created_at
      FROM qa_questions
      ORDER BY is_hot DESC, created_at DESC
    `).all()
  }

  const list = questions.map(item => ({
    id: item.id,
    title: item.title,
    answer: item.answer,
    category: item.category,
    isHot: !!item.is_hot,
    createTime: item.created_at
  }))

  res.json({
    code: 200,
    data: { list },
    message: 'success'
  })
})

/**
 * GET /api/qa/search
 * 搜索问答
 * Query: ?q=关键词
 * Response: { code: 200, data: { list: [...] } }
 */
router.get('/search', (req, res) => {
  const { q } = req.query

  if (!q) {
    return res.json({ code: 400, message: '请输入搜索关键词' })
  }

  const questions = db.prepare(`
    SELECT id, title, answer, category, is_hot, created_at
    FROM qa_questions
    WHERE title LIKE ? OR answer LIKE ?
    ORDER BY is_hot DESC
  `).all(`%${q}%`, `%${q}%`)

  const list = questions.map(item => ({
    id: item.id,
    title: item.title,
    answer: item.answer,
    category: item.category,
    isHot: !!item.is_hot,
    createTime: item.created_at
  }))

  res.json({
    code: 200,
    data: { list },
    message: 'success'
  })
})

/**
 * GET /api/qa/categories
 * 获取问答分类列表
 * Response: { code: 200, data: ['体质调理', '症状解释', '饮食养生', '中药知识', '节气养生'] }
 */
router.get('/categories', (req, res) => {
  const categories = db.prepare(`
    SELECT DISTINCT category FROM qa_questions ORDER BY category
  `).all()

  res.json({
    code: 200,
    data: categories.map(c => c.category),
    message: 'success'
  })
})

module.exports = router

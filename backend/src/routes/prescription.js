const express = require('express')
const db = require('../models/db')

const router = express.Router()

/**
 * GET /api/prescriptions
 * 获取当前用户的处方列表
 * Response: { code: 200, data: [{ id, prescriptionNo, drugName, spec, quantity, usage, notes, status, createTime }] }
 */
router.get('/', (req, res) => {
  const userId = req.userId

  const prescriptions = db.prepare(`
    SELECT id, prescription_no, drug_name, spec, quantity, usage, notes, status, created_at
    FROM prescriptions
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(userId)

  const list = prescriptions.map(item => ({
    id: item.id,
    prescriptionNo: item.prescription_no,
    drugName: item.drug_name,
    spec: item.spec,
    quantity: item.quantity,
    usage: item.usage,
    notes: item.notes,
    status: item.status === 'verified' ? '已验证' : item.status === 'dispensed' ? '已取药' : '待取药',
    createTime: item.created_at
  }))

  res.json({
    code: 200,
    data: list,
    message: 'success'
  })
})

/**
 * GET /api/prescriptions/:id
 * 获取处方详情
 */
router.get('/:id', (req, res) => {
  const userId = req.userId
  const prescriptionId = req.params.id

  const prescription = db.prepare(`
    SELECT * FROM prescriptions WHERE id = ? AND user_id = ?
  `).get(prescriptionId, userId)

  if (!prescription) {
    return res.json({ code: 404, message: '处方不存在' })
  }

  res.json({
    code: 200,
    data: {
      id: prescription.id,
      prescriptionNo: prescription.prescription_no,
      drugName: prescription.drug_name,
      spec: prescription.spec,
      quantity: prescription.quantity,
      usage: prescription.usage,
      notes: prescription.notes,
      status: prescription.status,
      createTime: prescription.created_at
    }
  })
})

module.exports = router

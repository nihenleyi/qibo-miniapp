const express = require('express')
const db = require('../models/db')

const router = express.Router()

/**
 * GET /api/drug/verify
 * 按处方编号或药品名称验证药品
 * Query: ?prescriptionNo=CF20240115001 或 ?drugName=板蓝根颗粒
 * Response: { code: 200, data: { drugName, spec, quantity, usage, notes, expiry, status } }
 */
router.get('/verify', (req, res) => {
  const userId = req.userId
  const { prescriptionNo, drugName } = req.query

  let prescription = null

  if (prescriptionNo) {
    prescription = db.prepare(`
      SELECT * FROM prescriptions
      WHERE prescription_no = ? AND user_id = ?
    `).get(prescriptionNo, userId)
  } else if (drugName) {
    prescription = db.prepare(`
      SELECT * FROM prescriptions
      WHERE drug_name LIKE ? AND user_id = ?
      ORDER BY created_at DESC LIMIT 1
    `).get(`%${drugName}%`, userId)
  }

  if (!prescription) {
    return res.json({
      code: 200,
      data: {
        name: drugName || '未知药品',
        spec: 'N/A',
        quantity: 0,
        usage: '请咨询药师',
        note: '未找到对应处方',
        expiry: 'N/A',
        status: 'mismatch'
      }
    })
  }

  res.json({
    code: 200,
    data: {
      name: prescription.drug_name,
      spec: prescription.spec,
      quantity: prescription.quantity + (prescription.spec.includes('袋') ? '袋' : prescription.spec.includes('盒') ? '盒' : ''),
      usage: prescription.usage,
      note: prescription.notes,
      expiry: '2026-12',
      status: 'match',
      prescriptionNo: prescription.prescription_no
    }
  })
})

module.exports = router

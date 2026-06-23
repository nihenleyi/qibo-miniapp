const express = require('express')
const cors = require('cors')
const config = require('./config')
const authMiddleware = require('./middleware/auth')
const db = require('./models/db')
const initDatabase = require('./database/init')
const seedDatabase = require('./database/seed')

async function start() {
  // 等待 sql.js 异步初始化完成
  await db.initPromise
  console.log('[DB] 数据库模块初始化完成')

  // 初始化表结构 + 种子数据
  initDatabase()
  seedDatabase()

  // 保存数据库到文件
  db.save()
  console.log('[DB] 数据库已保存到: ' + config.DB_PATH)

  const app = express()

  // ---- 中间件 ----
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  // JWT 认证中间件（公开路由自动跳过）
  app.use(authMiddleware)
  const express = require('express')
  const app = express()
// 托管 static 目录
  app.use('/static', express.static('static'))

  // ---- 路由注册 ----
  app.use('/api', require('./routes/auth'))
  app.use('/api/user', require('./routes/user'))
  app.use('/api/inquiry', require('./routes/inquiry'))
  app.use('/api/prescriptions', require('./routes/prescription'))
  app.use('/api/family', require('./routes/family'))
  app.use('/api/health', require('./routes/health'))
  app.use('/api/drug', require('./routes/drug'))
  app.use('/api/qa', require('./routes/qa'))

  // ---- 健康检查 ----
  app.get('/', (req, res) => {
    res.json({
      status: 'ok',
      app: '岐伯中医小程序后端',
      version: '1.0.0',
      time: new Date().toLocaleString('zh-CN')
    })
  })

  // ---- 404 ----
  app.use((req, res) => {
    res.status(404).json({ code: 404, message: '接口不存在' })
  })

  // ---- 全局错误处理 ----
  app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message || err)
    res.status(500).json({ code: 500, message: '服务器内部错误' })
  })

  // ---- 启动 ----
  app.listen(config.PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('  岐伯中医小程序后端服务已启动')
    console.log(`  地址: http://localhost:${config.PORT}`)
    console.log(`  环境: ${process.env.NODE_ENV || 'development'}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })
}

start().catch(err => {
  console.error('[FATAL] 启动失败:', err)
  process.exit(1)
})

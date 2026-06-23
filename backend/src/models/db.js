/**
 * 基于 sql.js (SQLite WASM) 的数据库封装
 * 提供与 better-sqlite3 兼容的同步 API
 */
const initSqlJs = require('sql.js')
const fs = require('fs')
const path = require('path')
const config = require('../config')

// 确保 data 目录存在
const dataDir = path.dirname(config.DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

let _db = null

/**
 * Statement 包装类 —— 模拟 better-sqlite3 的 Statement
 */
class Statement {
  constructor(db, sql) {
    this._db = db
    this._sql = sql
  }

  /**
   * 执行写操作 (INSERT/UPDATE/DELETE)
   * 返回 { changes, lastInsertRowid }
   */
  run(...params) {
    this._db.run(this._sql, params)
    const result = this._db.exec('SELECT last_insert_rowid() as id, changes() as changes')
    const row = result[0]?.values?.[0]
    const ret = {
      changes: row ? row[1] : 0,
      lastInsertRowid: row ? row[0] : 0
    }
    // 写操作后自动保存
    db.save()
    return ret
  }

  /**
   * 查询单行
   * 返回对象或 undefined
   */
  get(...params) {
    const stmt = this._db.prepare(this._sql)
    if (params.length > 0) {
      stmt.bind(params)
    }
    let row = null
    if (stmt.step()) {
      row = stmt.getAsObject()
    }
    stmt.free()
    return row
  }

  /**
   * 查询所有行
   * 返回对象数组
   */
  all(...params) {
    const stmt = this._db.prepare(this._sql)
    if (params.length > 0) {
      stmt.bind(params)
    }
    const rows = []
    while (stmt.step()) {
      rows.push(stmt.getAsObject())
    }
    stmt.free()
    return rows
  }
}

/**
 * 数据库包装对象
 */
const db = {
  /**
   * 执行原生 SQL（用于建表等 DDL）
   */
  exec(sql) {
    _db.run(sql)
  },

  /**
   * 创建预编译语句
   */
  prepare(sql) {
    return new Statement(_db, sql)
  },

  /**
   * 保存数据库到文件
   */
  save() {
    const data = _db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(config.DB_PATH, buffer)
  },

  /**
   * 关闭数据库
   */
  close() {
    if (_db) {
      _db.close()
      _db = null
    }
  }
}

// ---- 初始化 ----
function initDatabase() {
  return initSqlJs().then(SQL => {
    // 尝试从文件加载已有数据库
    if (fs.existsSync(config.DB_PATH)) {
      const fileBuffer = fs.readFileSync(config.DB_PATH)
      _db = new SQL.Database(fileBuffer)
      console.log('[DB] 从文件加载数据库: ' + config.DB_PATH)
    } else {
      _db = new SQL.Database()
      console.log('[DB] 创建新的内存数据库')
    }

    // 启用外键
    _db.run('PRAGMA foreign_keys = ON')

    return db
  })
}

// 同步方式的初始化状态
let _initialized = false
let _initPromise = null

/**
 * 确保数据库已初始化（同步检查）
 * 在首次 require 后，数据库已异步初始化完成
 */
function ensureInit() {
  if (!_initialized) {
    throw new Error('数据库尚未初始化，请等待 initDatabase() 完成')
  }
}

// 启动初始化
_initPromise = initDatabase().then(dbInstance => {
  _initialized = true
  return dbInstance
})

// 导出 —— 代码使用 db.prepare() 等在初始化完成后正常工作
// 因为 require('./models/db') 发生在 app.js 的顶层，
// 而 app.listen 在所有 require 之后，初始化在这之前已完成
module.exports = db
module.exports.initPromise = _initPromise

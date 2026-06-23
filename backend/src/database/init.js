const db = require('../models/db')

function initDatabase() {
  console.log('[DB] 正在初始化数据库...')

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE NOT NULL,
      name TEXT DEFAULT '',
      avatar TEXT DEFAULT '/static/avatar-default.png',
      gender TEXT DEFAULT '',
      age INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT DEFAULT '',
      gender TEXT DEFAULT '',
      age INTEGER DEFAULT 0,
      phone TEXT DEFAULT '',
      disease_history TEXT DEFAULT '',
      symptoms TEXT DEFAULT '',
      answers TEXT DEFAULT '{}',
      status TEXT DEFAULT 'completed',
      result TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      inquiry_id INTEGER,
      prescription_no TEXT UNIQUE NOT NULL,
      drug_name TEXT DEFAULT '',
      spec TEXT DEFAULT '',
      quantity INTEGER DEFAULT 0,
      usage TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      status TEXT DEFAULT 'dispensed',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (inquiry_id) REFERENCES inquiries(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS family_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT DEFAULT '',
      relation TEXT DEFAULT '',
      gender TEXT DEFAULT '',
      age INTEGER DEFAULT 0,
      phone TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS health_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT DEFAULT '',
      content TEXT DEFAULT '{}',
      recorded_at TEXT DEFAULT (date('now', 'localtime')),
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS qa_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      answer TEXT DEFAULT '',
      category TEXT DEFAULT '',
      is_hot INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `)

  console.log('[DB] 数据库初始化完成')
  return true
}

// 如果直接运行此脚本
if (require.main === module) {
  initDatabase()
  console.log('[DB] 所有表创建完毕')
}

module.exports = initDatabase

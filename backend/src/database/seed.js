const db = require('../models/db')
const initDatabase = require('./init')

function seedDatabase() {
  // 先初始化表结构
  initDatabase()

  console.log('[SEED] 正在填充种子数据...')

  // 检查是否已有数据
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()
  if (userCount.count > 0) {
    console.log('[SEED] 数据库已有数据，跳过种子数据填充')
    return
  }

  // ---- 用户 ----
  const insertUser = db.prepare(`
    INSERT INTO users (phone, name, avatar, gender, age) VALUES (?, ?, ?, ?, ?)
  `)
  insertUser.run('13800008888', '张三', '/static/avatar-default.png', '男', 35)
  insertUser.run('13900009999', '李四', '/static/avatar-default.png', '女', 28)

  // ---- 问诊记录 ----
  const insertInquiry = db.prepare(`
    INSERT INTO inquiries (user_id, name, gender, age, phone, disease_history, symptoms, answers, status, result, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  insertInquiry.run(
    1, '张三', '男', 35, '13800008888',
    '高血压',
    '头痛、乏力、食欲不振',
    JSON.stringify({ '一问寒热': '怕冷', '二问汗': '自汗', '三问头身': '头痛', '四问二便': '正常', '五问饮食': '食欲不振' }),
    'completed',
    '根据十问结果，初步判断为脾胃虚寒、气血不足。建议：1. 饮食清淡，少食多餐；2. 适当服用归脾丸；3. 注意保暖，避免受凉。',
    '2024-01-15 10:30:00'
  )

  insertInquiry.run(
    1, '张三', '男', 35, '13800008888',
    '糖尿病',
    '口干、多饮、多尿',
    JSON.stringify({ '一问寒热': '正常', '二问汗': '盗汗', '三问头身': '头晕', '四问二便': '小便频数', '五问饮食': '多饮' }),
    'completed',
    '根据症状，属阴虚燥热之消渴病。建议：1. 控制饮食，避免甜食；2. 适当运动；3. 可服用六味地黄丸调理。',
    '2024-01-10 14:20:00'
  )

  insertInquiry.run(
    2, '李四', '女', 28, '13900009999',
    '过敏史',
    '皮肤瘙痒、红疹',
    JSON.stringify({ '一问寒热': '正常', '二问汗': '正常', '三问头身': '皮肤痒', '四问二便': '正常', '五问饮食': '正常' }),
    'completed',
    '皮肤过敏，属风热犯表。建议：1. 避免接触过敏原；2. 服用消风散；3. 外用炉甘石洗剂。',
    '2024-01-08 09:15:00'
  )

  insertInquiry.run(
    1, '张三', '男', 35, '13800008888',
    '无',
    '失眠、多梦、心悸',
    JSON.stringify({ '一问寒热': '五心烦热', '二问汗': '盗汗', '三问头身': '头晕', '四问二便': '便秘', '五问饮食': '正常' }),
    'pending',
    '',
    '2026-06-20 16:00:00'
  )

  // ---- 处方 ----
  const insertPrescription = db.prepare(`
    INSERT INTO prescriptions (user_id, inquiry_id, prescription_no, drug_name, spec, quantity, usage, notes, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  insertPrescription.run(1, 1, 'CF20240115001', '归脾丸', '9g×10丸/盒', 2, '每日2次，每次1丸，温水送服', '忌生冷油腻，饭前服用', 'dispensed', '2024-01-15 11:00:00')
  insertPrescription.run(1, 2, 'CF20240110001', '六味地黄丸', '9g×10丸/盒', 3, '每日3次，每次1丸，淡盐水送服', '忌辛辣，感冒发热时停用', 'dispensed', '2024-01-10 15:00:00')
  insertPrescription.run(2, 3, 'CF20240108001', '消风散', '6g×10袋/盒', 1, '每日2次，每次6g，温水冲服', '忌海鲜、辛辣', 'verified', '2024-01-08 10:00:00')
  insertPrescription.run(1, null, 'CF20260620001', '板蓝根颗粒', '10g×20袋/包', 1, '每日3次，每次1袋，开水冲服', '忌辛辣、忌油腻', 'pending', '2026-06-20 16:30:00')

  // ---- 家庭成员 ----
  const insertFamily = db.prepare(`
    INSERT INTO family_members (user_id, name, relation, gender, age, phone) VALUES (?, ?, ?, ?, ?, ?)
  `)
  insertFamily.run(1, '王芳', '配偶', '女', 33, '13800008889')
  insertFamily.run(1, '张小明', '子女', '男', 8, '')
  insertFamily.run(1, '张大山', '父母', '男', 62, '13800007777')

  // ---- 健康档案 ----
  const insertHealth = db.prepare(`
    INSERT INTO health_records (user_id, type, content, recorded_at) VALUES (?, ?, ?, ?)
  `)
  insertHealth.run(1, '体质', JSON.stringify({ type: '气虚质', score: 75, desc: '元气不足，疲乏、气短、自汗等' }), '2024-01-01')
  insertHealth.run(1, '血压', JSON.stringify({ systolic: 135, diastolic: 85, heartRate: 72 }), '2024-01-15')
  insertHealth.run(1, '体重', JSON.stringify({ weight: 72.5, height: 172, bmi: 24.5 }), '2024-01-15')

  // ---- 健康问答 ----
  const insertQA = db.prepare(`
    INSERT INTO qa_questions (title, answer, category, is_hot) VALUES (?, ?, ?, ?)
  `)

  insertQA.run('舌苔发白代表什么？', `根据中医理论，舌苔发白通常提示体内有寒邪或湿邪。

常见原因：
1. 外感风寒：伴随怕冷、发热、头痛等症状
2. 脾胃虚寒：伴随腹痛、腹泻、食欲不振
3. 湿浊内停：伴随身体沉重、乏力、腹胀

建议：
• 注意保暖，避免受凉
• 饮食清淡，避免生冷油腻
• 如有持续不适，建议及时就医

就医建议：如症状持续3天以上，建议到正规中医馆就诊。`, '症状解释', 1)

  insertQA.run('总感觉乏力怕冷是怎么回事？', `中医认为，乏力怕冷多与阳气不足有关。

常见原因：
1. 肾阳虚：腰膝酸软、畏寒肢冷
2. 脾阳虚：腹胀、食欲不振、大便溏薄
3. 气血两虚：面色萎黄、心悸失眠

调理建议：
• 多食温热食物：羊肉、韭菜、生姜
• 艾灸关元、足三里等穴位
• 适当运动：太极拳、八段锦`, '症状解释', 1)

  insertQA.run('脾虚怎么调理？', `脾虚是中医常见证型，调理需综合进行。

饮食调理：
• 宜食：山药、莲子、薏米、大枣、小米
• 忌食：生冷、油腻、甜腻食物

中药调理：
• 四君子汤：补气健脾基础方
• 参苓白术散：健脾祛湿

生活调理：
• 规律饮食，不过饥过饱
• 适度运动，避免久坐
• 保持心情舒畅`, '体质调理', 1)

  insertQA.run('经常失眠多梦怎么办？', `中医认为失眠多与心、肝、肾相关。

常见原因：
1. 心脾两虚：入睡困难、多梦易醒
2. 肝郁化火：心烦失眠、急躁易怒
3. 阴虚火旺：五心烦热、盗汗

调理建议：
• 睡前1小时放下手机
• 酸枣仁茶、百合莲子汤助眠
• 涌泉穴按摩、温水泡脚
• 严重者可用酸枣仁汤、天王补心丹`, '体质调理', 1)

  insertQA.run('湿热体质有什么特征？', `湿热体质常见特征：

面部：
• 面部油腻、易长痘
• 口苦口臭

身体：
• 身体困重、乏力
• 大便黏滞不爽、小便黄

舌象脉象：
• 舌质红、苔黄腻
• 脉滑数

调理：
• 饮食：薏米、赤小豆、冬瓜、苦瓜
• 药物：龙胆泻肝丸、茵陈蒿汤
• 避免：辛辣、油腻、甜食、酒`, '体质调理', 1)

  insertQA.run('感冒了怎么区分风寒还是风热？', `风寒感冒与风热感冒的区别：

风寒感冒：
• 怕冷重、发热轻
• 流清涕、打喷嚏
• 咳白痰、头痛身痛
• 舌苔薄白、脉浮紧
• 用药：感冒清热颗粒、荆防败毒散

风热感冒：
• 发热重、怕冷轻
• 咽喉肿痛、口干
• 流黄涕、咳黄痰
• 舌苔薄黄、脉浮数
• 用药：银翘解毒片、桑菊饮`, '症状解释', 0)

  insertQA.run('中药应该饭前还是饭后吃？', `中药服用时间原则：

饭前服（空腹）：
• 补益药：补气养血类
• 泻下药：通便类
• 驱虫药

饭后服：
• 消食药：助消化类
• 对胃肠有刺激的药物
• 大部分解表药

特殊说明：
• 安神药：睡前半小时
• 急性病：不拘时间
• 具体请遵医嘱，每种方剂有具体要求`, '中药知识', 0)

  insertQA.run('春季养生应该注意什么？', `春季养生原则——"春养肝"：

顺应自然：
• 早起早睡，多到户外活动
• 衣"春捂"，不宜过早减衣

饮食调理：
• 少酸多甘：大枣、山药、蜂蜜
• 多吃时令蔬菜：荠菜、香椿、春笋
• 养肝茶饮：枸杞菊花茶

运动：
• 太极拳、散步、放风筝
• 不宜大汗淋漓

情志：
• 保持心情舒畅
• 避免大怒伤肝`, '节气养生', 0)

  insertQA.run('中医说的"上火"到底是什么？', `"上火"是民间对热证的形象说法。

实火：
• 症状：口疮、牙龈肿痛、咽喉痛、便秘
• 原因：外感热邪、饮食辛辣
• 用药：牛黄解毒片、黄连上清丸

虚火：
• 症状：口干、咽干、五心烦热、盗汗
• 原因：阴虚导致阳相对偏亢
• 用药：知柏地黄丸、玄麦甘桔颗粒

去火建议：
• 多喝水、清淡饮食
• 充足睡眠、避免熬夜
• 反复"上火"需就医辨证`, '中药知识', 0)

  insertQA.run('气血不足有什么表现？', `气血不足的主要表现：

气虚：
• 乏力、懒言、动则气喘
• 面色萎黄或苍白
• 食欲不振、大便溏薄

血虚：
• 头晕眼花、心悸失眠
• 面色苍白或萎黄
• 手足发麻、月经量少

补气血食物：
• 红枣、桂圆、当归
• 黄芪炖鸡、阿胶
• 黑芝麻、动物肝脏

经典方剂：
• 八珍汤（四君子+四物汤）
• 归脾汤`, '体质调理', 0)

  console.log('[SEED] 种子数据填充完毕')
}

if (require.main === module) {
  seedDatabase()
}

module.exports = seedDatabase

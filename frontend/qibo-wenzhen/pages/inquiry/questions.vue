<template>
  <view class="page-questions">
    <view class="nav-bar">
      <text class="back" @click="goBack">← 返回</text>
      <text class="title">中医十问</text>
      <text class="progress">{{ currentIndex + 1 }}/10</text>
    </view>
    <view class="progress-bar"><view class="progress-fill" :style="{width: ((currentIndex+1)/10*100)+'%'}"></view></view>
    <view class="question-area">
      <text class="question-number">{{ question.label }}</text>
      <text class="question-text">{{ question.text }}</text>
    </view>
    <view class="options-grid">
      <view class="option" v-for="opt in question.options" :key="opt" :class="{active: selected === opt}" @click="selected = opt">
        <text class="opt-icon">{{ getIcon(opt) }}</text>
        <text class="opt-label">{{ opt }}</text>
      </view>
    </view>
    <view class="btn-row">
      <button class="btn-prev" :disabled="currentIndex === 0" @click="prev">上一步</button>
      <button class="btn-next" @click="next">{{ currentIndex === 9 ? '完成' : '下一步 →' }}</button>
    </view>
    <view class="step-indicators">
      <view class="dot" v-for="i in 10" :key="i" :class="{active: i <= currentIndex + 1}"></view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentIndex = ref(0)
const selected = ref('')
const answers = ref({})

const questions = [
  { label: '一问寒热', text: '你平时怕冷还是怕热？', options: ['怕冷', '怕热', '寒热交替', '没有感觉'] },
  { label: '二问汗', text: '你出汗情况如何？', options: ['自汗（白天多汗）', '盗汗（夜间多汗）', '无汗', '汗多'] },
  { label: '三问头身', text: '头部或身体有不适吗？', options: ['头痛', '头晕', '身体酸痛', '无明显感觉'] },
  { label: '四问二便', text: '大小便情况如何？', options: ['大便干结', '大便溏稀', '小便频数', '正常'] },
  { label: '五问饮食', text: '食欲和口渴情况？', options: ['食欲好', '食欲差', '口渴喜饮', '口不渴'] },
  { label: '六问胸腹', text: '胸腹部有不适吗？', options: ['胸闷', '腹胀', '腹痛', '无不适'] },
  { label: '七问睡眠', text: '睡眠情况如何？', options: ['失眠', '多梦', '嗜睡', '正常'] },
  { label: '八问口渴', text: '口渴情况如何？', options: ['口渴喜饮', '口不渴', '口干不欲饮'] },
  { label: '九问舌象', text: '你的舌象如何？', options: ['舌淡红', '舌红', '舌紫暗', '舌苔厚腻'] },
  { label: '十问脉象', text: '脉搏情况如何？（可咨询医生）', options: ['浮脉', '沉脉', '细脉', '不了解'] }
]

const question = computed(() => questions[currentIndex.value])

const getIcon = (opt) => {
  const map = { '怕冷':'❄️','怕热':'🔥','寒热交替':'🌡️','没有感觉':'😌','自汗（白天多汗）':'💦','盗汗（夜间多汗）':'🌙','无汗':'☀️','汗多':'💧' }
  return map[opt] || '☯️'
}

const next = () => {
  if (!selected.value) return uni.showToast({ title: '请选择一个选项', icon: 'none' })
  answers.value[question.value.label] = selected.value
  if (currentIndex.value === 9) {
    uni.setStorageSync('inquiryAnswers', answers.value)
    uni.navigateTo({ url: '/pages/inquiry/summary' })
  } else {
    currentIndex.value++
    selected.value = ''
  }
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    const prevLabel = questions[currentIndex.value].label
    selected.value = answers.value[prevLabel] || ''
  }
}

const goBack = () => {
  uni.showModal({
    title: '确认退出', content: '问诊尚未完成，确定要退出吗？',
    success: (res) => { if (res.confirm) uni.navigateBack() }
  })
}
</script>

<style lang="scss" scoped>
.page-questions { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16pt 0 8pt; }
.nav-bar .back { font-size: 14pt; color: #8C8C8C; }
.nav-bar .title { font-size: 18pt; font-weight: 600; color: #3D3D3D; }
.nav-bar .progress { font-size: 14pt; color: #2B7FFF; }
.question-area { padding: 12pt 4pt 16pt; }
.question-number { font-size: 20pt; font-weight: 700; color: #2B7FFF; display: block; }
.question-text { font-size: 17pt; color: #3D3D3D; margin-top: 6pt; display: block; }
.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; }
.option { background: #FFFFFF; border-radius: 16pt; padding: 20pt 12pt; text-align: center; border: 2pt solid transparent; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); }
.option.active { border-color: #2B7FFF; background: rgba(43,127,255,0.05); }
.option .opt-icon { font-size: 28pt; display: block; }
.option .opt-label { font-size: 14pt; color: #3D3D3D; margin-top: 6pt; display: block; }
.btn-row { display: flex; gap: 12pt; margin-top: 20pt; }
.btn-row button { flex: 1; padding: 12pt; border-radius: 25pt; font-size: 15pt; border: none; }
.btn-prev { background: rgba(212,184,150,0.15); color: #8C8C8C; }
.btn-prev[disabled] { opacity: 0.4; }
.btn-next { background: linear-gradient(135deg,#2B7FFF,#1A5FD4); color: #FFFFFF; }
.step-indicators { display: flex; justify-content: center; gap: 6pt; margin-top: 16pt; }
.step-indicators .dot { width: 8pt; height: 8pt; border-radius: 50%; background: rgba(212,184,150,0.20); }
.step-indicators .dot.active { background: #2B7FFF; }
</style>
<template>
  <view class="page-qa-result">
    <view class="nav-bar"><text class="back" @click="goBack">← 返回</text><text class="title">问答结果</text></view>
    <view class="card question-card">
      <text class="q-label">你的问题</text>
      <text class="q-text">{{ question }}</text>
    </view>
    <view class="card answer-card">
      <text class="a-label">💡 回答</text>
      <view class="a-content"><text class="a-text">{{ answer }}</text></view>
      <view class="disclaimer">⚠️ 本回答仅供健康宣教参考，不替代医生诊断</view>
    </view>
    <button class="btn-consult" @click="consultDoctor">👨‍⚕️ 咨询医生</button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const question = ref('')
const answer = ref('')

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const q = currentPage?.options?.q || ''
  question.value = decodeURIComponent(q || '舌苔发白代表什么？')
  answer.value = `根据中医理论，舌苔发白通常提示体内有寒邪或湿邪。

常见原因：
1. 外感风寒：伴随怕冷、发热、头痛等症状
2. 脾胃虚寒：伴随腹痛、腹泻、食欲不振
3. 湿浊内停：伴随身体沉重、乏力、腹胀

建议：
• 注意保暖，避免受凉
• 饮食清淡，避免生冷油腻
• 如有持续不适，建议及时就医

就医建议：如症状持续3天以上，建议到正规中医馆就诊。`
})

const goBack = () => uni.navigateBack()
const consultDoctor = () => uni.showToast({ title: '正在为您推荐附近中医馆...', icon: 'none' })
</script>

<style lang="scss" scoped>
.page-qa-result { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16pt 0 8pt; }
.nav-bar .back { font-size: 14pt; color: #8C8C8C; }
.nav-bar .title { font-size: 18pt; font-weight: 600; color: #3D3D3D; }
.card { background: #FFFFFF; border-radius: 16pt; padding: 16pt; margin-bottom: 12pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); border: 1pt solid rgba(212,184,150,0.10); }
.question-card .q-label { font-size: 12pt; color: #8C8C8C; display: block; margin-bottom: 6pt; }
.question-card .q-text { font-size: 16pt; font-weight: 600; color: #3D3D3D; }
.answer-card .a-label { font-size: 14pt; font-weight: 600; color: #3D3D3D; display: block; margin-bottom: 10pt; }
.a-content { background: rgba(43,127,255,0.04); border-radius: 12pt; padding: 14pt; }
.a-text { font-size: 14pt; line-height: 1.8; color: #3D3D3D; white-space: pre-wrap; }
.disclaimer { margin-top: 12pt; font-size: 11pt; color: #FAAD14; text-align: center; }
.btn-consult { width: 100%; background: linear-gradient(135deg,#2B7FFF,#1A5FD4); color: #FFFFFF; border-radius: 25pt; padding: 14pt; font-size: 16pt; font-weight: 600; border: none; margin-top: 8pt; }
</style>
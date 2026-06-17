<template>
  <view class="page-summary">
    <view class="header"><text class="icon">✅</text><text class="title">问诊完成</text><text class="sub">您的问诊摘要已生成</text></view>
    <view class="card">
      <view class="summary-item"><text class="label">姓名</text><text class="value">{{ info.name }}</text></view>
      <view class="summary-item"><text class="label">性别</text><text class="value">{{ info.gender }}</text></view>
      <view class="summary-item"><text class="label">年龄</text><text class="value">{{ info.age }}岁</text></view>
      <view class="summary-item"><text class="label">既往病史</text><text class="value">{{ info.diseases.join('、') || '无' }}</text></view>
    </view>
    <view class="card">
      <text class="card-title">📋 中医十问结果</text>
      <view class="answer-item" v-for="(value, key) in answers" :key="key">
        <text class="q">{{ key }}</text><text class="a">{{ value }}</text>
      </view>
    </view>
    <button class="btn-submit" @click="submitInquiry">提交问诊</button>
    <button class="btn-home" @click="goHome">返回首页</button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request.js'

const info = ref({ name: '', gender: '', age: '', diseases: [], diseaseOther: '' })
const answers = ref({})

onMounted(() => {
  info.value = uni.getStorageSync('inquiryInfo') || { name: '测试用户', gender: '男', age: 25, diseases: [] }
  answers.value = uni.getStorageSync('inquiryAnswers') || { '一问寒热': '怕冷', '二问汗': '自汗' }
})

const submitInquiry = async () => {
  try {
    const res = await request.post('/api/inquiry/submit', { userId: 1, symptoms: info.value.name + ' 问诊记录', answers: answers.value })
    if (res.code === 200) { uni.showToast({ title: '提交成功', icon: 'success' }); setTimeout(() => goHome(), 1500) }
  } catch {
    uni.showToast({ title: '提交成功（模拟）', icon: 'success' })
    setTimeout(() => goHome(), 1500)
  }
}

const goHome = () => uni.switchTab({ url: '/pages/index/index' })
</script>

<style lang="scss" scoped>
.page-summary { min-height: 100vh; background: #FDF8F0; padding: 20pt 20pt 30pt; }
.header { text-align: center; padding: 12pt 0 20pt; }
.header .icon { font-size: 48pt; display: block; }
.header .title { font-size: 22pt; font-weight: 700; color: #3D3D3D; display: block; margin-top: 8pt; }
.header .sub { font-size: 14pt; color: #8C8C8C; display: block; margin-top: 4pt; }
.summary-item { display: flex; padding: 10pt 0; border-bottom: 1pt solid rgba(212,184,150,0.08); }
.summary-item:last-child { border-bottom: none; }
.summary-item .label { width: 80pt; font-size: 14pt; color: #8C8C8C; }
.summary-item .value { flex: 1; font-size: 14pt; color: #3D3D3D; }
.card-title { font-size: 15pt; font-weight: 600; color: #3D3D3D; display: block; margin-bottom: 10pt; }
.answer-item { display: flex; padding: 8pt 0; border-bottom: 1pt solid rgba(212,184,150,0.06); }
.answer-item .q { width: 80pt; font-size: 13pt; color: #8C8C8C; }
.answer-item .a { flex: 1; font-size: 13pt; color: #3D3D3D; }
.btn-submit { width: 100%; background: linear-gradient(135deg,#2B7FFF,#1A5FD4); color: #FFFFFF; border-radius: 25pt; padding: 14pt; font-size: 16pt; font-weight: 600; border: none; margin-top: 16pt; }
.btn-home { width: 100%; background: rgba(212,184,150,0.15); color: #8C8C8C; border-radius: 25pt; padding: 14pt; font-size: 15pt; border: none; margin-top: 10pt; }
</style>
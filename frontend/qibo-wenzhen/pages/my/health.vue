<template>
  <view class="page-health">
    <view class="nav-bar">
      <text class="back" @click="goBack">← 返回</text>
      <text class="title">健康档案</text>
    </view>
    <view class="card" v-for="item in records" :key="item.id">
      <view class="record-header">
        <text class="record-type">{{ getTypeIcon(item.type) }} {{ item.type }}</text>
        <text class="record-date">{{ item.recordedAt || item.createTime }}</text>
      </view>
      <view class="record-content">
        <text class="content-item" v-for="(value, key) in item.content" :key="key">
          {{ getFieldLabel(key) }}：{{ value }}
        </text>
      </view>
    </view>
    <view v-if="records.length === 0" class="empty">
      <text class="empty-icon">📊</text>
      <text class="empty-text">暂无健康档案</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request.js'

const records = ref([])

const typeIconMap = { '体质': '🫁', '血压': '🩸', '血糖': '🩸', '体重': '⚖️' }
const fieldLabelMap = {
  'type': '体质类型', 'score': '评分', 'desc': '描述',
  'systolic': '收缩压', 'diastolic': '舒张压', 'heartRate': '心率',
  'weight': '体重', 'height': '身高', 'bmi': 'BMI',
  'value': '数值'
}

const getTypeIcon = (type) => typeIconMap[type] || '📋'
const getFieldLabel = (key) => fieldLabelMap[key] || key

onMounted(async () => {
  try {
    const res = await request.get('/api/health')
    if (res.code === 200) records.value = res.data
  } catch {
    records.value = [
      { id: 1, type: '体质', content: { type: '气虚质', score: 75, desc: '元气不足' }, recordedAt: '2024-01-01' },
      { id: 2, type: '血压', content: { systolic: 135, diastolic: 85, heartRate: 72 }, recordedAt: '2024-01-15' },
      { id: 3, type: '体重', content: { weight: 72.5, height: 172, bmi: 24.5 }, recordedAt: '2024-01-15' }
    ]
  }
})

const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.page-health { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16pt 0 8pt; }
.nav-bar .back { font-size: 14pt; color: #8C8C8C; }
.nav-bar .title { font-size: 18pt; font-weight: 600; color: #3D3D3D; }
.card { background: #FFFFFF; border-radius: 16pt; padding: 16pt; margin-bottom: 12pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); border: 1pt solid rgba(212,184,150,0.10); }
.record-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10pt; }
.record-type { font-size: 15pt; font-weight: 600; color: #3D3D3D; }
.record-date { font-size: 12pt; color: #B0B0B0; }
.record-content { display: flex; flex-wrap: wrap; gap: 8pt; }
.content-item { font-size: 13pt; color: #3D3D3D; background: rgba(43,127,255,0.04); border-radius: 8pt; padding: 6pt 12pt; }
.empty { text-align: center; padding: 60pt 0; }
.empty .empty-icon { font-size: 48pt; display: block; }
.empty .empty-text { font-size: 14pt; color: #8C8C8C; display: block; margin-top: 12pt; }
</style>

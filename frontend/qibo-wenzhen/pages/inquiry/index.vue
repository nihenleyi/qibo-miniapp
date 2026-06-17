<template>
  <view class="page-inquiry">
    <view class="header"><text class="title">🩺 中医问诊</text><text class="sub">请根据提示填写您的症状信息</text></view>
    <view class="card start-card" @click="startInquiry">
      <text class="big-icon">📝</text>
      <view class="card-body"><text class="card-title">开始新的问诊</text><text class="card-desc">填写基础信息 + 中医十问</text></view>
      <text class="card-arrow">→</text>
    </view>
    <view class="card">
      <view class="card-header"><text class="card-title">📋 历史问诊</text></view>
      <view class="history-item" v-for="item in historyList" :key="item.id">
        <text class="h-date">{{ item.date }}</text>
        <text class="h-status" :class="item.status === '已完成' ? 'done' : 'pending'">{{ item.status }}</text>
      </view>
      <view v-if="historyList.length === 0" class="empty">暂无问诊记录</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request.js'

const historyList = ref([])

const loadHistory = async () => {
  try {
    const res = await request.get('/api/inquiry/list')
    if (res.code === 200) historyList.value = res.data
  } catch {
    historyList.value = [{ id: 1, date: '2026-06-15 10:00', status: '已完成' }, { id: 2, date: '2026-06-14 14:30', status: '已完成' }]
  }
}

const startInquiry = () => uni.navigateTo({ url: '/pages/inquiry/info' })
onMounted(() => loadHistory())
</script>

<style lang="scss" scoped>
.page-inquiry { min-height: 100vh; background: #FDF8F0; padding: 12pt 20pt 20pt; }
.header { padding: 8pt 0 16pt; }
.header .title { font-size: 20pt; font-weight: 700; color: #3D3D3D; display: block; }
.header .sub { font-size: 13pt; color: #8C8C8C; }
.start-card { display: flex; align-items: center; background: linear-gradient(135deg,#F0F7FF,#E8F0FE); border: 1pt solid rgba(43,127,255,0.15); }
.start-card .big-icon { font-size: 36pt; margin-right: 14pt; }
.history-item { display: flex; justify-content: space-between; padding: 10pt 0; border-bottom: 1pt solid rgba(212,184,150,0.08); }
.history-item:last-child { border-bottom: none; }
.h-date { font-size: 14pt; color: #3D3D3D; }
.h-status.done { color: #52C41A; }
.h-status.pending { color: #FAAD14; }
.empty { text-align: center; padding: 20pt 0; color: #8C8C8C; font-size: 13pt; }
</style>
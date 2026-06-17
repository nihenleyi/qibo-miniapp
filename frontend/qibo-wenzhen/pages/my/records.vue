<template>
  <view class="page-records">
    <view class="nav-bar"><text class="back" @click="goBack">← 返回</text><text class="title">问诊记录</text></view>
    <view class="card" v-for="item in records" :key="item.id">
      <view class="record-header">
        <text class="date">{{ item.createTime || item.date }}</text>
        <text class="status" :class="item.status === '已完成' ? 'done' : 'pending'">{{ item.status || '已完成' }}</text>
      </view>
      <text class="content">{{ item.symptoms || '问诊记录' }}</text>
    </view>
    <view v-if="records.length === 0" class="empty"><text class="empty-icon">📭</text><text class="empty-text">暂无问诊记录</text></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request.js'

const records = ref([])
onMounted(async () => {
  try {
    const res = await request.get('/api/inquiry/list')
    if (res.code === 200) records.value = res.data
  } catch {
    records.value = [{ id: 1, symptoms: '头痛、发热', createTime: '2026-06-15 10:00', status: '已完成' }, { id: 2, symptoms: '乏力、怕冷', createTime: '2026-06-14 14:30', status: '已完成' }]
  }
})
const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.page-records { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16pt 0 8pt; }
.nav-bar .back { font-size: 14pt; color: #8C8C8C; }
.nav-bar .title { font-size: 18pt; font-weight: 600; color: #3D3D3D; }
.card { background: #FFFFFF; border-radius: 16pt; padding: 16pt; margin-bottom: 12pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); }
.record-header { display: flex; justify-content: space-between; margin-bottom: 8pt; }
.record-header .date { font-size: 12pt; color: #8C8C8C; }
.record-header .status { font-size: 12pt; font-weight: 500; }
.record-header .status.done { color: #52C41A; }
.record-header .status.pending { color: #FAAD14; }
.content { font-size: 14pt; color: #3D3D3D; }
.empty { text-align: center; padding: 60pt 0; }
.empty .empty-icon { font-size: 48pt; display: block; }
.empty .empty-text { font-size: 14pt; color: #8C8C8C; display: block; margin-top: 12pt; }
</style>
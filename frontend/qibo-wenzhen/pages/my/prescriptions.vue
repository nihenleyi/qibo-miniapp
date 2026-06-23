<template>
  <view class="page-prescriptions">
    <view class="nav-bar">
      <text class="back" @click="goBack">← 返回</text>
      <text class="title">我的处方</text>
    </view>
    <view class="card" v-for="item in prescriptions" :key="item.id" @click="showDetail(item)">
      <view class="pres-header">
        <text class="pres-no">{{ item.prescriptionNo || 'N/A' }}</text>
        <text class="status" :class="item.status === '已取药' ? 'done' : 'pending'">{{ item.status || '待取药' }}</text>
      </view>
      <text class="drug-name">{{ item.drugName || '未知药品' }}</text>
      <view class="pres-info">
        <text class="info-item">规格：{{ item.spec || 'N/A' }}</text>
        <text class="info-item">数量：{{ item.quantity || 0 }}</text>
      </view>
      <text class="pres-date">{{ item.createTime || '' }}</text>
    </view>
    <view v-if="prescriptions.length === 0" class="empty">
      <text class="empty-icon">📄</text>
      <text class="empty-text">暂无处方记录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request.js'

const prescriptions = ref([])

onMounted(async () => {
  try {
    const res = await request.get('/api/prescriptions')
    if (res.code === 200) prescriptions.value = res.data
  } catch {
    prescriptions.value = [
      { id: 1, prescriptionNo: 'CF20240115001', drugName: '归脾丸', spec: '9g×10丸/盒', quantity: 2, usage: '每日2次，每次1丸', notes: '忌生冷油腻', status: '已取药', createTime: '2024-01-15 11:00:00' },
      { id: 2, prescriptionNo: 'CF20240110001', drugName: '六味地黄丸', spec: '9g×10丸/盒', quantity: 3, usage: '每日3次，每次1丸', notes: '忌辛辣', status: '已取药', createTime: '2024-01-10 15:00:00' }
    ]
  }
})

const showDetail = (item) => {
  uni.showModal({
    title: item.drugName || '处方详情',
    content: `处方编号：${item.prescriptionNo || 'N/A'}\n规格：${item.spec || 'N/A'}\n数量：${item.quantity || 0}\n用法用量：${item.usage || 'N/A'}\n注意事项：${item.notes || '无'}`,
    showCancel: false,
    confirmText: '知道了'
  })
}

const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.page-prescriptions { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16pt 0 8pt; }
.nav-bar .back { font-size: 14pt; color: #8C8C8C; }
.nav-bar .title { font-size: 18pt; font-weight: 600; color: #3D3D3D; }
.card { background: #FFFFFF; border-radius: 16pt; padding: 16pt; margin-bottom: 12pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); border: 1pt solid rgba(212,184,150,0.10); }
.pres-header { display: flex; justify-content: space-between; margin-bottom: 8pt; }
.pres-header .pres-no { font-size: 13pt; color: #2B7FFF; font-weight: 500; }
.pres-header .status { font-size: 12pt; font-weight: 500; }
.pres-header .status.done { color: #52C41A; }
.pres-header .status.pending { color: #FAAD14; }
.drug-name { font-size: 16pt; font-weight: 600; color: #3D3D3D; display: block; margin-bottom: 6pt; }
.pres-info { display: flex; gap: 20pt; margin-bottom: 6pt; }
.pres-info .info-item { font-size: 12pt; color: #8C8C8C; }
.pres-date { font-size: 11pt; color: #B0B0B0; }
.empty { text-align: center; padding: 60pt 0; }
.empty .empty-icon { font-size: 48pt; display: block; }
.empty .empty-text { font-size: 14pt; color: #8C8C8C; display: block; margin-top: 12pt; }
</style>

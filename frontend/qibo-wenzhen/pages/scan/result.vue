<template>
  <view class="page-result">
    <view class="nav-bar"><text class="back" @click="goBack">← 返回</text><text class="title">药品核对</text></view>
    <view class="status" :class="statusClass">
      <text class="icon">{{ status === 'match' ? '✅' : '⚠️' }}</text>
      <text class="label">{{ statusText }}</text>
    </view>
    <view class="card drug-card">
      <view class="drug-row"><text class="label">药品名称</text><text class="value">{{ drug.name }}</text></view>
      <view class="drug-row"><text class="label">规格</text><text class="value">{{ drug.spec }}</text></view>
      <view class="drug-row"><text class="label">数量</text><text class="value">{{ drug.quantity }}</text></view>
      <view class="drug-row"><text class="label">用法用量</text><text class="value">{{ drug.usage }}</text></view>
      <view class="drug-row"><text class="label">注意事项</text><text class="value warning">{{ drug.note }}</text></view>
      <view class="drug-row"><text class="label">有效期</text><text class="value">{{ drug.expiry }}</text></view>
    </view>
    <view class="btn-row">
      <button class="btn-report" @click="reportIssue">有问题</button>
      <button class="btn-confirm" @click="confirmPickup">✅ 确认取药</button>
    </view>
    <text class="footer-tip">⚠️ 需药师二次确认后取药</text>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const drug = ref({ name: '板蓝根颗粒', spec: '10g/袋', quantity: '3袋', usage: '每日3次，每次1袋', note: '忌辛辣、忌油腻', expiry: '2026-12' })
const status = ref('match')
const statusText = computed(() => status.value === 'match' ? '核对结果：一致' : '核对结果：需确认')
const statusClass = computed(() => status.value === 'match' ? 'status-match' : 'status-mismatch')

const confirmPickup = () => {
  uni.showModal({
    title: '确认取药', content: '请确认已收到以上药品',
    success: (res) => { if (res.confirm) { uni.showToast({ title: '取药确认成功', icon: 'success' }); setTimeout(() => uni.navigateBack(), 1500) } }
  })
}
const reportIssue = () => uni.showToast({ title: '已通知药师处理', icon: 'none' })
const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.page-result { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16pt 0 8pt; }
.nav-bar .back { font-size: 14pt; color: #8C8C8C; }
.nav-bar .title { font-size: 18pt; font-weight: 600; color: #3D3D3D; }
.status { display: flex; align-items: center; justify-content: center; gap: 10pt; padding: 16pt; border-radius: 16pt; margin: 12pt 0; }
.status .icon { font-size: 28pt; }
.status .label { font-size: 16pt; font-weight: 600; }
.status-match { background: rgba(82,196,26,0.10); }
.status-match .label { color: #52C41A; }
.status-mismatch { background: rgba(250,173,20,0.10); }
.status-mismatch .label { color: #FAAD14; }
.drug-row { display: flex; padding: 10pt 0; border-bottom: 1pt solid rgba(212,184,150,0.08); }
.drug-row:last-child { border-bottom: none; }
.drug-row .label { width: 80pt; font-size: 14pt; color: #8C8C8C; }
.drug-row .value { flex: 1; font-size: 14pt; color: #3D3D3D; }
.drug-row .value.warning { color: #FAAD14; }
.btn-row { display: flex; gap: 12pt; margin-top: 16pt; }
.btn-row .btn-report { flex: 0.4; background: rgba(250,173,20,0.15); color: #FAAD14; border-radius: 25pt; padding: 12pt; font-size: 15pt; border: none; }
.btn-row .btn-confirm { flex: 0.6; background: linear-gradient(135deg,#2B7FFF,#1A5FD4); color: #FFFFFF; border-radius: 25pt; padding: 12pt; font-size: 15pt; border: none; }
.footer-tip { display: block; text-align: center; font-size: 12pt; color: #8C8C8C; margin-top: 12pt; }
</style>
<template>
  <view class="page-scan">
    <view class="nav-bar"><text class="back" @click="goBack">← 返回</text><text class="title">扫码取药</text></view>
    <view class="scanner-area">
      <view class="scanner-frame">
        <view class="corner tl"></view><view class="corner tr"></view>
        <view class="corner bl"></view><view class="corner br"></view>
        <text class="scanner-icon">📷</text>
        <text class="scanner-hint">对准处方二维码或药品标签</text>
      </view>
      <button class="btn-scan" @click="startScan">开始扫码</button>
    </view>
    <view class="manual-input">
      <text class="input-label">或手动输入处方号：</text>
      <view class="input-row">
        <input placeholder="请输入处方号" v-model="prescriptionNo" />
        <button class="btn-lookup" @click="lookup">查询</button>
      </view>
    </view>
    <view class="card">
      <view class="card-header"><text class="card-title">📋 最近扫码记录</text></view>
      <view class="record-item" v-for="item in scanRecords" :key="item.id" @click="goToResult(item)">
        <text class="record-date">{{ item.date }}</text>
        <text class="record-name">{{ item.name }}</text>
        <text class="record-arrow">▸</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const prescriptionNo = ref('')
const scanRecords = ref([{ id: 1, date: '2026-06-15 10:00', name: '处方#001' }, { id: 2, date: '2026-06-14 14:30', name: '处方#002' }])

const startScan = () => {
  uni.scanCode({
    success: (res) => { uni.showToast({ title: '识别成功', icon: 'success' }); uni.navigateTo({ url: '/pages/scan/result?data=' + encodeURIComponent(res.result) }) },
    fail: () => uni.showToast({ title: '扫码取消或失败', icon: 'none' })
  })
}
const lookup = () => {
  if (!prescriptionNo.value) return uni.showToast({ title: '请输入处方号', icon: 'none' })
  uni.navigateTo({ url: '/pages/scan/result?no=' + prescriptionNo.value })
}
const goToResult = (item) => uni.navigateTo({ url: '/pages/scan/result?no=' + item.name })
const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.page-scan { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16pt 0 8pt; }
.nav-bar .back { font-size: 14pt; color: #8C8C8C; }
.nav-bar .title { font-size: 18pt; font-weight: 600; color: #3D3D3D; }
.scanner-area { background: #FFFFFF; border-radius: 16pt; padding: 24pt; margin: 12pt 0 16pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); text-align: center; }
.scanner-frame { width: 200pt; height: 200pt; margin: 0 auto; position: relative; border-radius: 16pt; background: rgba(43,127,255,0.03); display: flex; flex-direction: column; align-items: center; justify-content: center; }
.scanner-frame .corner { position: absolute; width: 20pt; height: 20pt; border-color: #2B7FFF; border-style: solid; border-width: 0; }
.scanner-frame .corner.tl { top: 0; left: 0; border-top-width: 3pt; border-left-width: 3pt; border-radius: 4pt 0 0 0; }
.scanner-frame .corner.tr { top: 0; right: 0; border-top-width: 3pt; border-right-width: 3pt; border-radius: 0 4pt 0 0; }
.scanner-frame .corner.bl { bottom: 0; left: 0; border-bottom-width: 3pt; border-left-width: 3pt; border-radius: 0 0 0 4pt; }
.scanner-frame .corner.br { bottom: 0; right: 0; border-bottom-width: 3pt; border-right-width: 3pt; border-radius: 0 0 4pt 0; }
.scanner-frame .scanner-icon { font-size: 40pt; }
.scanner-frame .scanner-hint { font-size: 12pt; color: #8C8C8C; margin-top: 8pt; }
.btn-scan { background: linear-gradient(135deg,#2B7FFF,#1A5FD4); color: #FFFFFF; border-radius: 25pt; padding: 12pt 40pt; font-size: 15pt; border: none; margin-top: 16pt; }
.manual-input { margin-bottom: 16pt; }
.manual-input .input-label { font-size: 13pt; color: #8C8C8C; display: block; margin-bottom: 8pt; }
.manual-input .input-row { display: flex; gap: 10pt; }
.manual-input .input-row input { flex: 1; background: #FFFFFF; border-radius: 12pt; padding: 12pt 14pt; border: 1pt solid rgba(212,184,150,0.15); }
.manual-input .input-row .btn-lookup { background: #D4B896; color: #FFFFFF; border-radius: 12pt; padding: 0 20pt; border: none; font-size: 14pt; }
.card { background: #FFFFFF; border-radius: 16pt; padding: 16pt; margin-bottom: 12pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); border: 1pt solid rgba(212,184,150,0.10); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10pt; }
.card-title { font-size: 15pt; font-weight: 600; color: #3D3D3D; }
.record-item { display: flex; align-items: center; padding: 10pt 0; border-bottom: 1pt solid rgba(212,184,150,0.08); }
.record-item:last-child { border-bottom: none; }
.record-date { font-size: 12pt; color: #8C8C8C; width: 100pt; }
.record-name { flex: 1; font-size: 14pt; color: #3D3D3D; }
.record-arrow { color: #D4B896; }
</style>
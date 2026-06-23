<template>
  <view class="page-qa">
    <view class="nav-bar"><text class="back" @click="goBack">← 返回</text><text class="title">健康问答</text></view>
    <view class="search-box">
      <text class="icon">🔍</text>
      <input placeholder="输入你的中医问题..." v-model="keyword" @confirm="search" />
      <text class="btn-search" @click="search">搜索</text>
    </view>
    <view class="hot-section">
      <text class="section-title">🔥 热门问题</text>
      <view class="question-list">
        <view class="q-item" v-for="q in hotQuestions" :key="q.id" @click="goToResult(q.text)">
          <text class="q-icon">{{ q.icon }}</text>
          <text class="q-text">{{ q.text }}</text>
          <text class="q-arrow">▸</text>
        </view>
      </view>
    </view>
    <view class="category-tags">
      <text class="tag" v-for="cat in categories" :key="cat">{{ cat }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const keyword = ref('')
const hotQuestions = ref([
  { id: 1, icon: '🌿', text: '舌苔发白代表什么？' },
  { id: 2, icon: '💪', text: '总是乏力怕冷是什么原因？' },
  { id: 3, icon: '🍚', text: '脾虚日常怎么调理？' },
  { id: 4, icon: '😴', text: '失眠多梦怎么办？' },
  { id: 5, icon: '🔥', text: '湿热体质有什么表现？' }
])
const categories = ['体质调理', '症状解释', '饮食养生', '中药知识', '节气养生']

const search = () => {
  if (!keyword.value.trim()) return uni.showToast({ title: '请输入问题', icon: 'none' })
  goToResult(keyword.value)
}
const goToResult = (q) => uni.navigateTo({ url: '/pages/qa/result?q=' + encodeURIComponent(q) })
const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    // 没有上一页时，回到首页
    uni.switchTab({ url: '/pages/index/index' })
  }
}
</script>

<style lang="scss" scoped>
.page-qa { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16pt 0 8pt; }
.nav-bar .back { font-size: 14pt; color: #8C8C8C; }
.nav-bar .title { font-size: 18pt; font-weight: 600; color: #3D3D3D; }
.search-box { display: flex; align-items: center; background: #FFFFFF; border-radius: 12pt; padding: 0 14pt; margin: 12pt 0 16pt; border: 1pt solid rgba(212,184,150,0.10); }
.search-box .icon { font-size: 18pt; color: #8C8C8C; margin-right: 10pt; }
.search-box input { flex: 1; height: 44pt; font-size: 14pt; }
.search-box .btn-search { color: #2B7FFF; font-size: 14pt; font-weight: 500; }
.hot-section .section-title { font-size: 16pt; font-weight: 600; color: #3D3D3D; display: block; margin-bottom: 10pt; }
.q-item { display: flex; align-items: center; background: #FFFFFF; border-radius: 12pt; padding: 14pt 16pt; margin-bottom: 8pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); }
.q-item .q-icon { font-size: 18pt; margin-right: 12pt; }
.q-item .q-text { flex: 1; font-size: 14pt; color: #3D3D3D; }
.q-item .q-arrow { color: #D4B896; }
.category-tags { display: flex; flex-wrap: wrap; gap: 8pt; margin-top: 16pt; }
.category-tags .tag { padding: 6pt 16pt; background: rgba(212,184,150,0.12); border-radius: 20pt; font-size: 12pt; color: #8C8C8C; }
</style>
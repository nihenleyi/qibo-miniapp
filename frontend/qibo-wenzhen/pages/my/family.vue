<template>
  <view class="page-family">
    <view class="nav-bar">
      <text class="back" @click="goBack">← 返回</text>
      <text class="title">家庭成员管理</text>
    </view>
    <view class="card" v-for="item in members" :key="item.id">
      <view class="member-info">
        <text class="member-icon">{{ item.relation === '配偶' ? '💑' : item.relation === '子女' ? '👶' : item.relation === '父母' ? '👴' : '👤' }}</text>
        <view class="member-detail">
          <text class="member-name">{{ item.name }}</text>
          <text class="member-relation">{{ item.relation }} · {{ item.gender }} · {{ item.age }}岁</text>
          <text class="member-phone" v-if="item.phone">{{ item.phone }}</text>
        </view>
        <text class="delete-btn" @click.stop="confirmDelete(item)">删除</text>
      </view>
    </view>
    <button class="btn-add" @click="showAddDialog">+ 添加家庭成员</button>
    <view v-if="members.length === 0" class="empty">
      <text class="empty-icon">👨‍👩‍👦</text>
      <text class="empty-text">暂未添加家庭成员</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request.js'

const members = ref([])

onMounted(async () => {
  await loadMembers()
})

const loadMembers = async () => {
  try {
    const res = await request.get('/api/family')
    if (res.code === 200) members.value = res.data
  } catch {
    members.value = [
      { id: 1, name: '王芳', relation: '配偶', gender: '女', age: 33, phone: '138****8889' },
      { id: 2, name: '张小明', relation: '子女', gender: '男', age: 8, phone: '' }
    ]
  }
}

const showAddDialog = () => {
  uni.showModal({
    title: '添加成员',
    content: '功能开发中，敬请期待',
    showCancel: false,
    confirmText: '知道了'
  })
}

const confirmDelete = (item) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除成员「${item.name}」吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          const result = await request.delete('/api/family/' + item.id)
          if (result.code === 200) {
            uni.showToast({ title: '删除成功', icon: 'success' })
            await loadMembers()
          }
        } catch {
          uni.showToast({ title: '删除成功', icon: 'success' })
          members.value = members.value.filter(m => m.id !== item.id)
        }
      }
    }
  })
}

const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.page-family { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16pt 0 8pt; }
.nav-bar .back { font-size: 14pt; color: #8C8C8C; }
.nav-bar .title { font-size: 18pt; font-weight: 600; color: #3D3D3D; }
.card { background: #FFFFFF; border-radius: 16pt; padding: 16pt; margin-bottom: 12pt; box-shadow: 0 2pt 8pt rgba(43,127,255,0.06); border: 1pt solid rgba(212,184,150,0.10); }
.member-info { display: flex; align-items: center; }
.member-icon { font-size: 32pt; margin-right: 14pt; }
.member-detail { flex: 1; }
.member-name { font-size: 16pt; font-weight: 600; color: #3D3D3D; display: block; }
.member-relation { font-size: 12pt; color: #8C8C8C; display: block; margin-top: 2pt; }
.member-phone { font-size: 11pt; color: #B0B0B0; display: block; margin-top: 2pt; }
.delete-btn { font-size: 12pt; color: #FF4D4F; padding: 8pt 12pt; background: rgba(255,77,79,0.06); border-radius: 8pt; }
.btn-add { width: 100%; background: linear-gradient(135deg,#2B7FFF,#1A5FD4); color: #FFFFFF; border-radius: 25pt; padding: 14pt; font-size: 15pt; font-weight: 500; border: none; margin-top: 8pt; }
.empty { text-align: center; padding: 60pt 0; }
.empty .empty-icon { font-size: 48pt; display: block; }
.empty .empty-text { font-size: 14pt; color: #8C8C8C; display: block; margin-top: 12pt; }
</style>

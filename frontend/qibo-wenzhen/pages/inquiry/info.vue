<template>
  <view class="page-info">
    <view class="nav-bar">
      <text class="back" @click="goBack">← 返回</text>
      <text class="title">基础信息</text>
      <text class="progress">1/11</text>
    </view>
    <view class="progress-bar"><view class="progress-fill" style="width:9%"></view></view>
    <view class="main">
      <view class="section-title"><text class="icon">👤</text><text>请填写你的基本信息</text></view>
      <view class="form-group">
        <text class="label">姓名</text>
        <input class="input" placeholder="请输入姓名" v-model="form.name" />
      </view>
      <view class="form-group">
        <text class="label">性别</text>
        <view class="radio-group">
          <text class="radio" :class="{active: form.gender === '男'}" @click="form.gender='男'">男</text>
          <text class="radio" :class="{active: form.gender === '女'}" @click="form.gender='女'">女</text>
        </view>
      </view>
      <view class="form-group">
        <text class="label">年龄</text>
        <input class="input" placeholder="请输入年龄" v-model="form.age" type="number" />
      </view>
      <view class="form-group">
        <text class="label">手机号</text>
        <input class="input" placeholder="请输入手机号" v-model="form.phone" type="number" />
      </view>
      <view class="form-group">
        <text class="label">既往病史</text>
        <view class="tag-group">
          <text class="tag" v-for="tag in diseaseTags" :key="tag" :class="{active: form.diseases.includes(tag)}" @click="toggleDisease(tag)">{{ tag }}</text>
        </view>
        <input class="input" placeholder="其他病史请填写" v-model="form.diseaseOther" style="margin-top:8pt" />
      </view>
      <button class="btn-next" @click="goNext">下一步 →</button>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({ name: '', gender: '男', age: '', phone: '', diseases: [], diseaseOther: '' })
const diseaseTags = ['高血压', '糖尿病', '心脏病', '肠胃病', '过敏史', '手术史']

const toggleDisease = (tag) => {
  const idx = form.diseases.indexOf(tag)
  if (idx > -1) form.diseases.splice(idx, 1)
  else form.diseases.push(tag)
}

const goNext = () => {
  if (!form.name.trim()) return uni.showToast({ title: '请输入姓名', icon: 'none' })
  if (!form.age) return uni.showToast({ title: '请输入年龄', icon: 'none' })
  uni.setStorageSync('inquiryInfo', form)
  uni.navigateTo({ url: '/pages/inquiry/questions' })
}
const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
.page-info { min-height: 100vh; background: #FDF8F0; padding: 0 20pt 20pt; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 16pt 0 8pt; }
.nav-bar .back { font-size: 14pt; color: #8C8C8C; }
.nav-bar .title { font-size: 18pt; font-weight: 600; color: #3D3D3D; }
.nav-bar .progress { font-size: 14pt; color: #2B7FFF; }
.progress-bar { height: 4pt; background: rgba(212,184,150,0.20); border-radius: 2pt; margin: 0 0 16pt; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg,#2B7FFF,#1A5FD4); border-radius: 2pt; }
.section-title { font-size: 17pt; font-weight: 600; color: #3D3D3D; margin: 12pt 0 16pt; }
.section-title .icon { margin-right: 8pt; }
.form-group { margin-bottom: 14pt; }
.form-group .label { display: block; font-size: 14pt; color: #3D3D3D; font-weight: 500; margin-bottom: 6pt; }
.input { width: 100%; background: #FFFFFF; border-radius: 12pt; padding: 12pt 14pt; font-size: 14pt; border: 1pt solid rgba(212,184,150,0.15); }
.radio-group { display: flex; gap: 12pt; }
.radio { padding: 8pt 24pt; background: #FFFFFF; border-radius: 20pt; font-size: 14pt; color: #8C8C8C; border: 1pt solid rgba(212,184,150,0.15); }
.radio.active { background: #2B7FFF; color: #FFFFFF; border-color: #2B7FFF; }
.tag-group { display: flex; flex-wrap: wrap; gap: 8pt; }
.tag { padding: 6pt 16pt; background: #FFFFFF; border-radius: 20pt; font-size: 13pt; color: #8C8C8C; border: 1pt solid rgba(212,184,150,0.15); }
.tag.active { background: #2B7FFF; color: #FFFFFF; border-color: #2B7FFF; }
.btn-next { width: 100%; background: linear-gradient(135deg,#2B7FFF,#1A5FD4); color: #FFFFFF; border-radius: 25pt; padding: 14pt; font-size: 16pt; font-weight: 600; border: none; margin-top: 20pt; }
</style>
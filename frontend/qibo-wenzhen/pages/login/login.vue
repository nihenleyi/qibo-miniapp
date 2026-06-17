<template>
  <view class="page-login">
    <view class="bg-deco"><text class="deco-herb">🌿</text><text class="deco-herb">☯️</text></view>
    <view class="login-content">
      <view class="logo-area">
        <text class="logo-icon">☯️</text>
        <text class="logo-name">岐伯中医传承机器人</text>
        <text class="logo-sub">传承 · 智慧 · 健康</text>
      </view>
      <view class="login-tabs">
        <view class="tab-item" :class="{active: tabIndex === 0}" @click="tabIndex = 0">微信登录</view>
        <view class="tab-item" :class="{active: tabIndex === 1}" @click="tabIndex = 1">手机号登录</view>
      </view>
      <view v-if="tabIndex === 0" class="login-panel">
        <button class="btn-wechat" open-type="getPhoneNumber" @getphonenumber="onGetPhone">📱 微信一键登录</button>
        <text class="login-hint">首次登录将自动注册账号</text>
      </view>
      <view v-else class="login-panel">
        <input class="input" placeholder="请输入手机号" v-model="phone" type="number" />
        <view class="code-row">
          <input class="input-code" placeholder="验证码" v-model="code" type="number" />
          <button class="btn-code" @click="sendCode">{{ codeText }}</button>
        </view>
        <button class="btn-login" @click="handleLogin">登录</button>
      </view>
      <view class="agreement">
        <text>登录即代表同意</text><text class="link" @click="goToAgreement">《用户协议》</text>
        <text>和</text><text class="link" @click="goToPrivacy">《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import request from '@/utils/request.js'
import { setToken, setUser } from '@/utils/auth.js'

const tabIndex = ref(0)
const phone = ref('')
const code = ref('')
const codeText = ref('获取验证码')
const countdown = ref(0)

const onGetPhone = (e) => {
  uni.showToast({ title: '微信登录成功', icon: 'success' })
  setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 1000)
}

const sendCode = () => {
  if (!phone.value || phone.value.length < 11) {
    return uni.showToast({ title: '请输入正确手机号', icon: 'none' })
  }
  if (countdown.value > 0) return
  countdown.value = 60
  codeText.value = countdown.value + 's'
  const timer = setInterval(() => {
    countdown.value--
    codeText.value = countdown.value + 's'
    if (countdown.value <= 0) { clearInterval(timer); codeText.value = '获取验证码' }
  }, 1000)
  uni.showToast({ title: '验证码已发送', icon: 'success' })
}

const handleLogin = async () => {
  if (!phone.value || !code.value) return uni.showToast({ title: '请填写完整信息', icon: 'none' })
  try {
    const res = await request.post('/api/login', { username: phone.value, password: code.value })
    if (res.code === 200) {
      setToken(res.data.token)
      setUser(res.data.userInfo)
      uni.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 1000)
    } else {
      uni.showToast({ title: res.message || '登录失败', icon: 'none' })
    }
  } catch (e) { console.error(e) }
}

const goToAgreement = () => uni.showToast({ title: '用户协议', icon: 'none' })
const goToPrivacy = () => uni.showToast({ title: '隐私政策', icon: 'none' })
</script>

<style lang="scss" scoped>
.page-login {
  min-height: 100vh;
  background-color: #FDF8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40pt 30pt;
  position: relative;
}
.bg-deco {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden;
}
.bg-deco .deco-herb {
  font-size: 80pt; opacity: 0.06; position: absolute;
}
.bg-deco .deco-herb:first-child { top: 10%; right: 5%; transform: rotate(20deg); }
.bg-deco .deco-herb:last-child { bottom: 15%; left: 5%; transform: rotate(-15deg); }
.login-content {
  width: 100%; max-width: 400pt;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(10px);
  border-radius: 24pt;
  padding: 40pt 28pt 30pt;
  box-shadow: 0 8pt 32pt rgba(43,127,255,0.08);
  border: 1pt solid rgba(212,184,150,0.10);
  position: relative;
}
.logo-area { text-align: center; margin-bottom: 32pt; }
.logo-area .logo-icon { font-size: 52pt; display: block; }
.logo-area .logo-name { font-size: 22pt; font-weight: 700; color: #3D3D3D; display: block; margin-top: 8pt; }
.logo-area .logo-sub { font-size: 12pt; color: #2B7FFF; display: block; margin-top: 4pt; }
.login-tabs {
  display: flex; border-radius: 12pt; overflow: hidden;
  border: 1pt solid rgba(212,184,150,0.20); margin-bottom: 20pt;
}
.login-tabs .tab-item {
  flex: 1; text-align: center; padding: 12pt 0; font-size: 14pt;
  color: #8C8C8C; background: #FFFFFF;
}
.login-tabs .tab-item.active { background: #2B7FFF; color: #FFFFFF; }
.btn-wechat {
  background: #07c160; color: #FFFFFF; border-radius: 25pt;
  padding: 14pt; font-size: 16pt; font-weight: 600; border: none; width: 100%;
}
.login-hint { display: block; text-align: center; font-size: 11pt; color: #8C8C8C; margin-top: 12pt; }
.input {
  width: 100%; background: #FFFFFF; border-radius: 12pt; padding: 14pt;
  font-size: 14pt; border: 1pt solid rgba(212,184,150,0.15); margin-bottom: 12pt;
}
.code-row { display: flex; gap: 10pt; }
.code-row .input-code {
  flex: 1; background: #FFFFFF; border-radius: 12pt; padding: 14pt;
  font-size: 14pt; border: 1pt solid rgba(212,184,150,0.15);
}
.code-row .btn-code {
  background: #D4B896; color: #FFFFFF; border-radius: 12pt;
  padding: 0 16pt; font-size: 13pt; border: none;
}
.btn-login {
  width: 100%; background: linear-gradient(135deg, #2B7FFF, #1A5FD4);
  color: #FFFFFF; border-radius: 25pt; padding: 14pt;
  font-size: 16pt; font-weight: 600; border: none; margin-top: 12pt;
}
.agreement { text-align: center; font-size: 11pt; color: #8C8C8C; margin-top: 20pt; }
.agreement .link { color: #2B7FFF; }
</style>
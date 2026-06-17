<script>
import { isLoggedIn } from '@/utils/auth.js'

export default {
  onLaunch() {
    console.log('岐伯中医小程序启动')
  },
  mixins: [{
    onShow() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const route = currentPage?.route || ''
      const whiteList = ['pages/login/login', 'pages/index/index']
      const needAuth = !whiteList.some(item => route === item)
      if (needAuth && !isLoggedIn()) {
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  }]
}
</script>

<style lang="scss">
page {
  background-color: #FDF8F0;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}
.card {
  background: #FFFFFF;
  border-radius: 16pt;
  padding: 16pt;
  margin: 0 20pt 12pt 20pt;
  box-shadow: 0 2pt 8pt rgba(43, 127, 255, 0.06);
  border: 1pt solid rgba(212, 184, 150, 0.10);
}
.btn-primary {
  background: linear-gradient(135deg, #2B7FFF, #1A5FD4);
  color: #FFFFFF;
  border-radius: 25pt;
  padding: 12pt 24pt;
  font-size: 15pt;
  font-weight: 600;
  border: none;
}
</style>
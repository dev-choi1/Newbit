import _ from 'lodash'
import axios from 'axios'

const CommonMethodsPlugin = {}

CommonMethodsPlugin.install = function (Vue) {
  // 1. 라우터 관련
  // 1) 소셜 피드로 이동
  Vue.prototype.$goToSocialFeed = function () {
    this.$router.push({ name: 'Social' })
  }
  // 2) 큐레이션 피드로 이동
  Vue.prototype.$goToCurationFeed = function () {
    this.$router.push({ name: 'Curation' })
  }
  // 3) 아카이빙 피드로 이동
  Vue.prototype.$goToArchivingFeed = function () {
    this.$router.push({ name: 'Archiving' })
  }
  // 4) 회원가입 페이지 이동
  Vue.prototype.$goToSignupPage = function () {
    this.$router.push({ name: 'Signup' })
  }
  // 5) 로그인 페이지 이동
  Vue.prototype.$goToLoginPage = function () {
    this.$router.push({ name: 'Login' })
  }

  // 2. 키워드 관련
  // 1) 키워드 string 을 array로 파싱.
  Vue.prototype.$parseKeyword = function (keywordString) {
    const keywordArray = _.split(keywordString, '_')
    return keywordArray
  }
  // 3. 컨텐츠로 이동
  Vue.prototype.$openContent = function (contentURL) {
    window.open(contentURL)
  }

  // 특정 시간이 현재로부터 얼마나 지났는지를 간단히 표기하는 전역 함수.
  Vue.prototype.$createdAt = function createdAt (createdAt) {
    const milliSeconds = new Date() - new Date(createdAt)
    const seconds = milliSeconds / 1000
    if (seconds < 60) return `방금 전`
    const minutes = seconds / 60
    if (minutes < 60) return `${Math.floor(minutes)}분 전`
    const hours = minutes / 60
    if (hours < 24) return `${Math.floor(hours)}시간 전`
    const days = hours / 24
    if (days < 7) return `${Math.floor(days)}일 전`
    const weeks = days / 7
    if (weeks < 5) return `${Math.floor(weeks)}주 전`
    const months = days / 30
    if (months < 12) return `${Math.floor(months)}개월 전`
    const years = days / 365
    return `${Math.floor(years)}년 전`
  }

  // 4. 로그인 관련 
  // 1) 로그인
  Vue.prototype.$login = function (credentials) {
    axios.post(`${this.$serverURL}/user/login`, credentials)
      .then((res) => {
        console.log(res)
        localStorage.setItem('jwt', res.data['access-token'])
        this.$store.dispatch('Login')
        this.$goToSocialFeed()
        this.$fetchUserInformation()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 2) 로그아웃
  Vue.prototype.$logout = function () {
    localStorage.removeItem('jwt')
    this.$store.dispatch('Logout')
    this.$goToLoginPage()
  }

  // 5. 유저 정보 관련
  // 1) 조회
  Vue.prototype.$fetchUserInformation = function (user_code) {
    axios.get(`${this.$serverURL}/user?uid=${user_code}`)
      .then((res) => {
        console.log(res)
        // this.$store.dispatch('Login', this.credentials.userEmail)
      })
      .catch((err) => {
        console.log(err)
      })
  }

}
export default CommonMethodsPlugin
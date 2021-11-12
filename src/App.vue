<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import apiConfig from './components/api/apiConfig'
export default {
  name: 'App',
  mixins: [apiConfig],
  created () {
    this.createInterceptors()
    if (window.localStorage.authToken && window.localStorage.userId) {
      this.$store.commit('setAuthToken', window.localStorage.authToken)
      this.$store.commit('setUserId', window.localStorage.userId)
      this.$store.commit('setUserNome', window.localStorage.userNome)
      this.$store.commit('setUserPerfil', window.localStorage.userPerfil)
    } else {
      this.$router.push('/')
    }
  }
}
</script>

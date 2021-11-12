
import apiInstance from './apiInstance'

export default {
  name: 'config',
  methods: {
    createInterceptors () {
      apiInstance.interceptors.request.use((config) => {
        const newConfig = config
        // let token = 'eyJraWQiOiIvcHJpdmF0ZUtleS5wZW0iLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dpdGh1Yi5jb20vdmluaWNpdXNmY2YiLCJqdGkiOiJhLTEyMyIsInN1YiI6Impkb2UtdXNpbmctand0LXJiYWMiLCJ1cG4iOiJqZG9lQHF1YXJrdXMuaW8iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqZG9lIiwiYXVkIjoidXNpbmctand0LXJiYWMiLCJiaXJ0aGRhdGUiOiIyMDAxLTA3LTEzIiwiZ3JvdXBzIjpbImZ1bmNpb25hcmlvIl0sImlhdCI6MTU5MzI5ODEyNiwiYXV0aF90aW1lIjoxNTkzMjk4MTI2LCJleHAiOjE1OTMyOTg0MjZ9.Tra15QQbr9ziunvFH_07i2KIj6cGuhjkzzulsUwIzCij0x4YTlVVeJ3BbqiRewxQ1Yl5SrnupaJn178IL2tSL-XzV6gk5jvT4gPpJGOTGyYnNavL7dv1kXM4AtlRSvbbyy62sYVZgPbDyJwYEOrNmC4v7Kk8Swq8MO_VwMunqZ5x5UoIUTnixBkRPZCgLSJY0jRCy6S1dHMUNXKf6e049iaBni_EQNT5-jhpkXYgtcY5v7ZvULZj7wVUCPTjLnJBF__jAF2B6wpVLn6m69jMNAlcnNI9Anc_gnL0yc5-Vy5ryZXpqS5cKiaGQw0TiMYcioOpgXiawzxg8It6XcWsPA';
        var token = this.$store.state.authToken
        if (token) {
          newConfig.headers.Authorization = 'Bearer ' + token // eslint-disable-line no-use-before-define
          // newConfig.headers['Authorization'] = 'Bearer ' + token // eslint-disable-line no-use-before-define
        }
        return newConfig
      }, () => {
        console.log('ops ouver um erro na requisicao')
        this.$store.commit('showErrorMessage', 'Ops, Houve um problema ao enviar a requisição')
      })
      const UNAUTHORIZED = 401
      apiInstance.interceptors.response.use(
        response => response,
        error => {
          const { status } = error.response
          if (status === UNAUTHORIZED) {
            this.$store.commit('showErrorMessage', error.response.data)
          } else {
            this.$store.commit('showErrorMessage', 'Ops, Houve um problema ao enviar a requisição')
          }
        }
      )
    }
  }
}

<template>
  <div></div>
</template>

<script>
import firebase from '../service/firebase'
import api from '../components/api/api'

export default {
  name: 'PushNotification',
  mixins: [api],
  props: {
    currentToken: { required: true },
    pacienteId: { required: true }
  },
  data: () => ({
    hasServiceWorker: false
  }),
  mounted () {
    this.inicialize()
  },
  methods: {
    inicialize () {
      if (!('serviceWorker' in navigator)) {
        console.warn('serviceWorker not working')
        return
      }

      if (!('PushManager' in window)) {
        console.warn('PushManager not working')
        return
      }

      this.hasServiceWorker = true
    },
    askForPermission () {
      if (!this.hasServiceWorker) {
        this.$q.notify({
          message: 'Ops ocorreu um erro :( por favor tente habilitar novamente mais tarde. (Erro: k7u3',
          color: 'negative'
        })
        return
      }

      firebase.messaging.usePublicVapidKey(
        // 'BM1dPW72urRsKf7oi83qb4Hgt_R8wo482cAtqk1DDak2nF3XrwoRqlNVKowkf319jT2wfXDCG5O3gS5DjujdaGQ'
        'BD0-rRK69Kokz09vGtq5aB8zsVycx1ePUNKH4M5LVcDikH76kkJnEi7ac7VDsUOufkg9nHODDzwzhIrxTDDjjBs'
      ) // 1. Generate a new key pair
      this.$q.notify({
        message: 'Estamos configurando, por favor aguarde alguns segundos...',
        color: 'info'
      })
      this.$q.loading.show()
      // Request Permission of Notifications
      firebase.messaging
        .requestPermission()
        .then(() => {
          // this.$q.notify({
          // message: 'Sucesso linha 57: ',
          // color: 'negative'
          // })
          console.log('Notification permission granted.')
          // Get Token
          firebase.messaging.getToken().then(token => {
            if (token) {
              // Send the token to your server and update the UI if necessary
              console.log('Token!!!! - ' + token)
              // this.$store.mutations.setUserToken(token)
              this.$store.dispatch('setUserToken', token)
              console.log('Token gravado: ')
              console.log(this.$store.getters.getUserToken)
              try {
                this.$q.localStorage.set('userToken', token)
                this.post('/api/v1/acesso/salvarTokenPush', { id: this.pacienteId, tokenPush: token })
                  .then(response => {
                    this.$emit('messageFromChild', true)
                    this.$q.notify({
                      message: 'Pronto! Notificações habilitadas com sucesso! :D',
                      color: 'info'
                    })
                  }).catch(erro =>
                    this.$q.notify({
                      message: 'Erro 3:', // Ocorreu um erro, por favor tente habilitar novamente mais tarde -
                      color: 'negative'
                    })
                  )
              } catch (e) {
                this.$q.loading.hide()
                this.$q.notify({
                  message: 'Erro 4: ',
                  color: 'negative'
                })
                // data wasn't successfully saved due to
                // a Web Storage API error
              }
              this.$q.loading.hide()
            } else {
              this.$q.loading.hide()
              // Show permission request UI
              this.$q.notify({
                message: 'Não possui token - linha 98: ',
                color: 'negative'
              })
              console.log('No registration token available. Request permission to generate one.')
              // ...
            }
          })
        })
        .catch(err => {
          this.$q.loading.hide()
          console.log('Unable to get permission to notify.', err)
        })
    }
  }
}
</script>

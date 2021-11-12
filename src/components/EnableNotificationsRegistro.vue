<template>
  <div v-if="userToken == null">
    <PushNotification ref="pushNotification" :currentToken="userToken" :pacienteId="pacienteId" @messageFromChild="permitirNotificacoes"/>

    <div>
      <q-btn size="md" color="secondary" class="text-center q-pa-sm" label="Permitir Notificações"
              rounded
              icon="notifications_active"
              @click="enableNotifications"
              />
    </div>
  </div>
</template>

<script>
import PushNotification from './PushNotification'

export default {
  name: 'EnableNotificationsRegistro',
  props: {
    userToken: { required: true },
    pacienteId: { required: true }
  },
  components: {
    PushNotification
  },
  methods: {
    enableNotifications () {
      this.$refs.pushNotification.askForPermission()
    },
    permitirNotificacoes (arg1) {
      this.$emit('messageFromChild', arg1)
    }
  }
}
</script>

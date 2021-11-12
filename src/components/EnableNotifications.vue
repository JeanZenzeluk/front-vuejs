<template>
  <div v-if="userToken == null">
    <PushNotification ref="pushNotification" :currentToken="userToken" />

    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded class="bg-orange text-white">
        Habilite as notificações!
        <template v-slot:action>
          <q-btn flat @click="enableNotifications" label="Habilitar" />
        </template>
      </q-banner>
    </div>
  </div>
</template>

<script>
import PushNotification from './PushNotification'

export default {
  name: 'EnableNotifications',
  props: {
    userToken: { required: true }
  },
  components: {
    PushNotification
  },
  methods: {
    enableNotifications () {
      this.$refs.pushNotification.askForPermission()
    }
  }
}
</script>

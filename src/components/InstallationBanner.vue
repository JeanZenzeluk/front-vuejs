<template>
  <div>
    <q-banner v-if="deferredPrompt" class="bg-primary text-white">
      Para uma melhor experiência instale nosso Aplicativo :)
      <template v-slot:action>
        <q-btn flat color="white" @click="dismiss" label="Não, obrigado" />
        <q-btn
          flat
          color="white"
          @click="install"
          label="Instalar"
        />
      </template>
    </q-banner>
  </div>
</template>

<script>
export default {
  name: 'InstallationBanner',
  data () {
    return {
      deferredPrompt: null
    }
  },
  created () {
    console.log('created...')
    window.addEventListener('beforeinstallprompt', e => {
      console.log('beforeinstallprompt...')
      e.preventDefault()
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e
    })
    window.addEventListener('appinstalled', () => {
      console.log('appinstalled...')
      this.deferredPrompt = null
    })
  },
  methods: {
    async dismiss () {
      console.log('dismiss...')
      this.deferredPrompt = null
    },
    async install () {
      console.log('install...')
      this.deferredPrompt.prompt()
    }
  }
}
</script>

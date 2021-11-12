<template>
  <div>
    <q-btn size="md" color="secondary" class="text-center q-pa-sm" label="Instalar!"
              rounded
              icon="get_app"
              @click="install"
              />
  </div>
</template>

<script>
export default {
  name: 'InstallationBannerRegistro',
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
      // this.$emit('messageFromChild', true)
    }
  }
}
</script>

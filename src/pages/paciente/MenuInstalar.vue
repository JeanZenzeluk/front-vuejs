<template>
  <q-page class="q-pa-lg">

    <h5 class="q-mt-none text-primary">Instalar</h5>
    <div class="q-pl-xl q-mt-xl row">
       <div class="col-12 text-primary text-h7 text-weight-bold q-mb-md">
          Clique abaixo para instalar o TerapiApp:
      </div>
      <div class="col-12 q-mt-md text-center">
          <!-- <InstallationBannerRegistro /> -->
          <div align="center" class="q-mt-lg">
              <q-btn size="md" color="secondary" class="text-center q-pa-sm" label="Instalar!"
              rounded
              icon="get_app"
              @click="install"
              />
          </div>
      </div>
    </div>

  </q-page>
</template>

<script>
// import InstallationBannerRegistro from '../../components/InstallationBannerRegistro'
import api from '../../components/api/api'
export default {
  data () {
    return {
      deferredPrompt: null
    }
  },
  async created () {
    window.addEventListener('beforeinstallprompt', e => {
      console.log('beforeinstallprompt...')
      e.preventDefault()
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e
      this.$q.notify('Chamou beforeinstallprompt')
    })
    window.addEventListener('appinstalled', () => {
      console.log('appinstalled...')
      this.deferredPrompt = null
      this.$q.notify('chamou appinstalled')
    })
  },
  mixins: [api],
  // components: {
  //   InstallationBannerRegistro
  // },
  methods: {
    async install () {
      console.log('install...')
      this.deferredPrompt.prompt()
      // this.$emit('messageFromChild', true)
    }
  }
}
</script>

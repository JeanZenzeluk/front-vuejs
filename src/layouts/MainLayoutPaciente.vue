<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-secondary">
      <InstallationBanner />
      <q-toolbar flat dense round>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title class="text-center q-mt-sm">
          <img width="40px" src="../statics/logo-redonda.png"/>
        </q-toolbar-title>

        <div>{{nome}}</div>
      </q-toolbar>
      <!--
      <div class="q-px-lg q-pt-xl q-mb-mb">
        <div class="text-h4">Em Desenvolvimento...</div>
        <div class="text-subtitle1"> {{ todaysDate }} </div>
      </div>
      <q-img
        src="../statics/mountains.png"
        class="header-image absolute-top" />
        -->

    </q-header>

    <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :width="250"
        :breakpoint="600"
      >
        <q-scroll-area style="height: calc(100% - 161px); margin-top: 161px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item to="/paciente" clickable v-ripple class="item-menu-borda">
              <q-item-section avatar>
                <q-icon name="insert_emoticon" />
              </q-item-section>

              <q-item-section>
                Registro de pensamentos
              </q-item-section>
            </q-item>

            <q-item to="/cartao" clickable v-ripple class="item-menu-borda">
              <q-item-section avatar>
                <q-icon name="library_books" />
              </q-item-section>
              <q-item-section>
                Cartões de Enfrent.
              </q-item-section>
            </q-item>

            <q-item to="/atividade" clickable v-ripple class="item-menu-borda">
              <q-item-section avatar>
                <q-icon name="directions_run" />
              </q-item-section>
              <q-item-section>
                Plano de Atividades
              </q-item-section>
            </q-item>

            <q-item to="/sono" clickable v-ripple class="item-menu-borda">
              <q-item-section avatar>
                <q-icon name="bedtime" />
              </q-item-section>
              <q-item-section>
                Registro de Sono
              </q-item-section>
            </q-item>

            <q-item clickable @click="install" v-ripple class="item-menu-borda">
              <q-item-section avatar>
                <q-icon name="get_app" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Instalar</q-item-label>
              </q-item-section>
            </q-item>

            <q-item to="/permitirNotificacoes" clickable v-ripple class="item-menu-borda">
              <q-item-section avatar>
                <q-icon name="notifications_active" />
              </q-item-section>
              <q-item-section>
                HabilitarNotificações
              </q-item-section>
            </q-item>

            <q-item @click="deslogar()" clickable v-ripple class="item-menu-borda">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>
                Sair
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="../statics/grama-mini.jpg" style="height: 168px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="../statics/logo-grande.png">
            </q-avatar>
            <div class="text-weight-bold">TerapiApp</div>
            <div>{{nome}}</div>
          </div>
        </q-img>
      </q-drawer>

    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'
import InstallationBanner from '../components/InstallationBanner'

const linksData = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      nome: null
    }
  },
  methods: {
    deslogar () {
      localStorage.removeItem('userP')
      localStorage.removeItem('authToken')
      localStorage.removeItem('userNome')
      localStorage.removeItem('userId')
      localStorage.removeItem('userPerfil')
      localStorage.removeItem('userFullNome')
      localStorage.removeItem('pacienteId')
      this.$router.push('/')
    },
    async install () {
      console.log('install...')
      this.deferredPrompt.prompt()
      // this.$emit('messageFromChild', true)
    }
  },
  components: {
    InstallationBanner
  },
  computed: {
    todaysDate () {
      const timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM')
    }
  },
  async created () {
    // this.userToken = await this.$store.getters.getUserToken
    // console.log('tokennn: ' + this.$store.getters.getUserToken)
    this.nome = this.$q.localStorage.getItem('userNome')
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
  }
}
</script>
<style lang="scss">
  .header-image {
    height: 100%;
    z-index: -1;
    opacity: 0.2;
    filter: grayscale(100%);
  }
  .item-menu-borda {
    // border-bottom: 1px solid #C2C2C2;
  }
</style>

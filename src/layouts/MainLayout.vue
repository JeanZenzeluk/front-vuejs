<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-secondary">
      <InstallationBanner />
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          TerapiApp
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
            <q-item to="/psicologo" clickable v-ripple class="item-menu-borda">
              <q-item-section avatar>
                <q-icon name="supervised_user_circle" />
              </q-item-section>

              <q-item-section>
                Pacientes
              </q-item-section>
            </q-item>

            <q-item to="/relatorio" clickable v-ripple class="item-menu-borda">
              <q-item-section avatar>
                <q-icon name="leaderboard" />
              </q-item-section>
              <q-item-section>
                Relatórios
              </q-item-section>
            </q-item>

            <q-item to="/ajuda" clickable v-ripple class="item-menu-borda">
              <q-item-section avatar>
                <q-icon name="help" />
              </q-item-section>
              <q-item-section>
                Ajuda
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
            <div class="text-weight-bold">{{nomeFull}}</div>
            <div>{{userClinica}}</div>
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
      nome: null,
      nomeFull: null,
      userClinica: null
    }
  },
  methods: {
    deslogar () {
      localStorage.removeItem('userP')
      localStorage.removeItem('authToken')
      localStorage.removeItem('userNome')
      localStorage.removeItem('userClinica')
      localStorage.removeItem('userId')
      localStorage.removeItem('userPerfil')
      localStorage.removeItem('userFullNome')
      localStorage.removeItem('pacienteId')
      this.$router.push('/')
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
    this.nomeFull = this.$q.localStorage.getItem('userFullNome')
    this.userClinica = this.$q.localStorage.getItem('userClinica')
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

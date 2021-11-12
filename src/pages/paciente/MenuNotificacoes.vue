<template>
  <q-page class="q-pa-lg">

    <h5 class="q-mt-none text-primary">Instalar</h5>
    <div class="q-pl-xl q-mt-xl row">
       <div class="col-12 text-primary text-h7 text-weight-bold q-mb-md">
          Clique abaixo para habilitar as notificações do TerapiApp:
      </div>
      <div class="col-12 q-mt-md text-center">
          <EnableNotificationsRegistro :pacienteId="pacienteId" @messageFromChild="habilitarNotificacoesSalvar"/>
      </div>
    </div>

  </q-page>
</template>

<script>
import EnableNotificationsRegistro from '../../components/EnableNotificationsRegistro'
import api from '../../components/api/api'
export default {
  data () {
    return {
      pacienteId: null
    }
  },
  mixins: [api],
  components: {
    EnableNotificationsRegistro
  },
  methods: {
    habilitarNotificacoesSalvar (arg1) {
      console.log('habilitou!')
    }
  },
  async created () {
    this.pacienteId = this.$q.localStorage.getItem('pacienteId')
  }
}
</script>

<template>
  <q-page class="bg-grey-3 column" id="labelHeaderRelatorio" ref="labelHeaderRelatorio">
    <q-icon name="keyboard_arrow_left" class="text-secondary q-ml-sm q-mt-sm" @click="voltar" style="font-size: 30px;"/>
    <div class="row q-pl-md q-pr-md q-pt-sm">
      <p class="text-primary text-h6">Relatório de Atividades:</p>
       <q-select
        filled
        v-model="atividadeSelecionada"
        label="Selecione a atividade"
        :options="atividadesList"
         option-label="label"
        option-value="id"
        class="col-12 q-mb-sm"
        behavior="dialog"
      />
      <q-input v-model="dataDe" @click="abrirDialogDataDe" filled class="col-12 q-mb-sm" label="De: " />
      <q-input v-model="dataAte" @click="abrirDialogDataAte" filled class="col-12 q-mb-lg" label="Até: " />

      <div v-if="!showRelatorio" class="col-12 text-h6 text-blue-grey-5 text-center q-mt-lg">
        Selecione os filtros acima
      </div>

      <div v-if="showRelatorio" class="col-12 text-weight-medium font-header-relatorio text-primary q-pl-sm q-pr-sm q-mb-md text-center q-mt-lg">
        Atividades realizadas X Não realizadas <br/>no período:
      </div>

      <pie-chart v-if="showRelatorio" :data="itemChart" :colors="['#0F9AD9', '#10D9E3', '#10E376', '#BF2DCC', '#CC9B04', '#CC4518', '#CC2D44']"
        :messages="{empty: 'Sem registros'}"
        legend="bottom"></pie-chart>

      <q-list v-if="showRelatorio" style="width: 100%" class="bg-white q-mt-md" bordered separator>
        <q-item clickable v-ripple  class="q-pa-md bg-grey-4">
          <q-item-section>
            <q-item-label caption class="font-historico text-info text-uppercase text-weight-medium">{{atividadeSelecionada.label}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple  class="q-pa-md" v-for="atividade in atividadesHistorico" :key="atividade.id">
          <q-item-section>
            <q-item-label caption class="font-historico text-primary">{{atividade.dataHora}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <!-- Data atual -->
    <q-dialog
      v-model="dialogDataDe"
      full-height
      full-width
    >
      <q-date v-model="dataDe" mask="DD/MM/YYYY">
        <div>
          <q-btn label="Selecionar" type="submit" color="primary" v-close-popup/>
        </div>
      </q-date>
    </q-dialog>
    <!-- Data atual -->
    <q-dialog
      v-model="dialogDataAte"
      full-height
      full-width
    >
      <q-date v-model="dataAte" mask="DD/MM/YYYY">
        <div>
          <q-btn label="Selecionar" type="submit" color="primary" v-close-popup/>
        </div>
      </q-date>
    </q-dialog>
  </q-page>
</template>

<script>
import Vue from 'vue'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'
import { scroll } from 'quasar'
import api from '../../components/api/api'
const { getScrollTarget, setScrollPosition } = scroll
Vue.use(Chartkick.use(Chart))

export default {
  mixins: [api],
  data () {
    return {
      dataDe: null,
      dataDeOld: null,
      dataAte: null,
      dataAteOld: null,
      dialogDataDe: null,
      dialogDataAte: null,
      atividadeSelecionada: null,
      showRelatorio: false,
      atividadesList: [],
      itemChart: [],
      atividadesHistorico: []
    }
  },
  methods: {
    abrirDialogDataDe () {
      this.dialogDataDe = true
    },
    abrirDialogDataAte () {
      this.dialogDataAte = true
    },
    voltar () {
      this.$router.push('/paciente')
    },
    buscaRelatorio () {
      this.showRelatorio = true
      // takes an element object
      const el = this.$refs.labelHeaderRelatorio.$el
      const target = getScrollTarget(el)
      const offset = el.offsetTop + 250
      const duration = 400
      setScrollPosition(target, offset, duration)

      const pacienteId = this.$q.localStorage.getItem('pacienteId')
      const datasFiltro = {}

      datasFiltro.pacienteId = pacienteId
      datasFiltro.dataDe = this.dataDe
      datasFiltro.dataAte = this.dataAte
      datasFiltro.id = this.atividadeSelecionada.id

      this.post('/api/v1/paciente/relatorio/atividades', datasFiltro).then(response => {
        this.itemChart = []
        this.atividadesHistorico = []
        this.itemChart.push(['Dias que realizou a atividade', response.data.diasRealizados])
        this.itemChart.push(['Dias que NÃO realizou', response.data.diasNãoRealizados])
        response.data.itemChart.forEach((value, index) => {
          this.atividadesHistorico.push({ id: value.id, dataHora: value.data })
        })
        this.$q.notify({
          message: 'Busca realizada com sucesso!',
          position: 'top',
          color: 'info'
        })
      }).catch(erro =>
        this.$q.notify({
          message: 'Ocorreu um erro, por favor tente novamente mais tarde.',
          position: 'top',
          color: 'negative'
        })
      )
    }
  },
  watch: {
    atividadeSelecionada: function () {
      if (this.atividadeSelecionada != null && this.dataDe != null && this.dataAte != null) {
        this.buscaRelatorio()
      }
    },
    dataDe: function () {
      if (this.atividadeSelecionada != null && this.dataDe != null && this.dataAte != null) {
        this.buscaRelatorio()
      }
    },
    dataAte: function () {
      if (this.atividadeSelecionada != null && this.dataDe != null && this.dataAte != null) {
        this.buscaRelatorio()
      }
    }
  },
  async created () {
    const pacienteId = this.$q.localStorage.getItem('pacienteId')
    this.get('/api/v1/paciente/atividade/' + pacienteId).then(response => {
      console.log('sucesso: ' + response.data)
      this.atividadesList = []
      response.data.forEach((value, index) => {
        this.atividadesList.push({ label: value.titulo, id: value.id })
      })
    }).catch(erro =>
      this.$q.notify({
        message: 'Ocorreu um erro na busca dos cartões de enfrentamento',
        color: 'negative'
      })
    )
  }
}
</script>

<style lang="scss">
.size-descricao-atividade {
  font-size: 16px;
}
.font-historico {
  font-size: 17px;
}
.font-header-relatorio {
  font-size: 15px;
}
</style>

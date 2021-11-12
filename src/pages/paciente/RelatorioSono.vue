<template>
  <q-page class="bg-grey-3 column" id="labelHeaderRelatorio" ref="labelHeaderRelatorio">
    <q-icon name="keyboard_arrow_left" class="text-secondary q-ml-sm q-mt-sm" @click="voltar" style="font-size: 30px;"/>
    <div class="row q-pl-md q-pr-md q-pt-sm">
      <p class="text-primary text-h6">Diário de Sono:</p>
      <q-input v-model="dataDe" @click="abrirDialogDataDe" filled class="col-12 q-mb-sm" label="De: " />
      <q-input v-model="dataAte" @click="abrirDialogDataAte" filled class="col-12 q-mb-lg" label="Até: " />

      <div v-if="!showRelatorio" :data="itemChart" class="col-12 text-h6 text-blue-grey-5 text-center q-mt-lg">
        Selecione os filtros acima
      </div>

      <div v-if="showRelatorio" class="col-12 text-weight-medium font-header-relatorio text-primary q-pl-sm q-pr-sm q-mb-md text-center q-mt-md">
        Dias X Horas<br/>de Sono no período:
      </div>

      <column-chart :data="itemChart" v-if="showRelatorio"
      :colors="['#0F9AD9']"></column-chart>

      <q-list v-if="showRelatorio" style="width: 100%" class="bg-white q-mt-md" bordered separator>
        <q-item clickable v-ripple  class="q-pa-md" v-for="item in itemChart" :key="item[0]">
          <q-item-section>
            <q-item-label caption class="font-historico text-info"> {{item[0]}}:</q-item-label>
            <q-item-label caption class="font-historico text-primary q-pb-sm">Dormiu por <b class="text-info">{{item[1]}}</b> horas.</q-item-label>
            <q-item-label caption class="font-historico-sub text-primary"><i>Foi dormir às <b>{{item[2]}}h</b> até <b>{{item[3]}}h</b>,
              ficando por <b>{{item[4]}}</b> horas sem dormir. </i></q-item-label>
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
      dataAte: null,
      dialogDataDe: null,
      dialogDataAte: null,
      showRelatorio: false,
      itemChart: [
        ['08/11', 6, '23:30', '07:00', '01:30'],
        ['09/11', 6.5, '23:15', '07:00', '01:15'],
        ['12/11', 3, '00:30', '06:30', '03:00'],
        ['13/11', 4, '23:30', '07:00', '03:30'],
        ['10/11', 7, '23:45', '07:00', '00:15'],
        ['11/11', 8, '23:00', '07:00', '00:00'],
        ['14/11', 7, '23:30', '07:00', '00:30']
      ]
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
      const offset = el.offsetTop + 180
      const duration = 400
      setScrollPosition(target, offset, duration)

      const pacienteId = this.$q.localStorage.getItem('pacienteId')
      const datasFiltro = {}

      datasFiltro.pacienteId = pacienteId
      datasFiltro.dataDe = this.dataDe
      datasFiltro.dataAte = this.dataAte

      this.post('/api/v1/paciente/relatorio/diarioSono', datasFiltro).then(response => {
        this.itemChart = []
        response.data.itemChart.forEach((value, index) => {
          this.itemChart.push([value.dtHora, value.dormiuXHoras, value.horaFoiDormir, value.horaAcordou, value.tempoSemDormir])
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
    dataDe: function () {
      if (this.dataDe != null && this.dataAte != null) {
        this.buscaRelatorio()
      }
    },
    dataAte: function () {
      if (this.dataDe != null && this.dataAte != null) {
        this.buscaRelatorio()
      }
    }
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
.font-historico-sub {
  font-size: 14px;
}
</style>

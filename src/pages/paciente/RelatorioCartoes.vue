<template>
  <q-page class="bg-grey-3 column" id="labelHeaderRelatorio" ref="labelHeaderRelatorio">
    <q-icon name="keyboard_arrow_left" class="text-secondary q-ml-sm q-mt-sm" @click="voltar" style="font-size: 30px;"/>
    <div class="row q-pl-md q-pr-md q-pt-sm">
      <p class="text-primary text-h6">Leitura Cartões de Enfrentamento:</p>
       <q-select
        filled
        v-model="cartaoSelecionado"
        label="Selecione o cartão"
        :options="cartoesList"
        option-label="label"
        option-value="id"
        class="col-12 q-mb-sm"
        behavior="dialog"
      />
      <q-input v-model="dataDe" @click="abrirDialogDataDe" filled class="col-12 q-mb-sm" label="De: " />
      <q-input v-model="dataAte" @click="abrirDialogDataAte" filled class="col-12 q-mb-lg" label="Até: " />

      <div v-if="!showRelatorio" :data="itemChart" class="col-12 text-h6 text-blue-grey-5 text-center q-mt-lg">
        Selecione os filtros acima
      </div>

      <column-chart :data="itemChart" v-if="showRelatorio"
      :colors="['#0F9AD9']"></column-chart>

      <q-list v-if="showRelatorio" style="width: 100%" class="bg-white q-mt-md" bordered separator>
        <q-item clickable v-ripple  class="q-pa-md" v-for="item in itemChart" :key="item[0]">
          <q-item-section>
            <q-item-label caption class="font-historico text-primary"> {{item[0]}}:</q-item-label>
            <q-item-label caption class="font-historico text-primary">Leu <b>{{item[1]}}</b> vezes.</q-item-label>
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
      cartaoSelecionado: null,
      showRelatorio: false,
      cartoesList: [],
      itemChart: [
        ['08/11', 2],
        ['09/11', 3],
        ['10/11', 7],
        ['11/11', 5],
        ['12/11', 6],
        ['13/11', 2],
        ['14/11', 6]
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
      const offset = el.offsetTop + 230
      const duration = 400
      setScrollPosition(target, offset, duration)

      const pacienteId = this.$q.localStorage.getItem('pacienteId')
      const datasFiltro = {}

      datasFiltro.pacienteId = pacienteId
      datasFiltro.dataDe = this.dataDe
      datasFiltro.dataAte = this.dataAte
      datasFiltro.id = this.cartaoSelecionado.id

      this.post('/api/v1/paciente/relatorio/cartoes', datasFiltro).then(response => {
        this.itemChart = []
        response.data.itemChart.forEach((value, index) => {
          this.itemChart.push([value.data, value.leuXVezes])
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
    cartaoSelecionado: function () {
      if (this.cartaoSelecionado != null && this.dataDe != null && this.dataAte != null) {
        this.buscaRelatorio()
        console.log(this.cartaoSelecionado.id)
      }
    },
    dataDe: function () {
      if (this.cartaoSelecionado != null && this.dataDe != null && this.dataAte != null) {
        this.buscaRelatorio()
      }
    },
    dataAte: function () {
      if (this.cartaoSelecionado != null && this.dataDe != null && this.dataAte != null) {
        this.buscaRelatorio()
      }
    }
  },
  async created () {
    const pacienteId = this.$q.localStorage.getItem('pacienteId')
    this.get('/api/v1/paciente/cartaoEnfrentamento/' + pacienteId).then(response => {
      console.log('sucesso: ' + response.data)
      this.cartoesList = []
      response.data.forEach((value, index) => {
        this.cartoesList.push({ label: value.titulo, id: value.id })
        console.log(this.cartoesList)
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
</style>

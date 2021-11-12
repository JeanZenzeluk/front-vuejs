<template>
  <q-page class="bg-grey-3 column" id="labelHeaderRelatorio" ref="labelHeaderRelatorio">
    <q-icon name="keyboard_arrow_left" class="text-secondary q-ml-sm q-mt-sm absolute-top fixed-bottom-right" flat @click="voltar" style="font-size: 30px;"/>
    <div class="row q-pl-md q-pr-md q-pt-xl">
      <p class="text-primary text-h6">Relatório Registro de pensamentos:</p>
      <q-input v-model="dataDe" @click="abrirDialogDataDe" filled class="col-12 q-mb-sm" label="De: " />
      <q-input v-model="dataAte" @click="abrirDialogDataAte" filled class="col-12 q-mb-lg" label="Até: " />

      <div v-if="dataDe == null || dataAte == null" :data="itemChart" class="col-12 text-h6 text-blue-grey-5 text-center q-mt-lg">
        Selecione o período
      </div>

      <pie-chart v-if="dataDe != null && dataAte != null" :data="itemChart" :colors="['#0F9AD9', '#10D9E3', '#10E376', '#BF2DCC', '#CC9B04', '#CC4518', '#CC2D44']"
        :messages="{empty: 'Sem registros'}"
        legend="bottom"></pie-chart>

      <q-list v-if="dataDe != null && dataAte != null" style="width: 100%" class="bg-white q-mt-md" bordered separator>
        <q-item clickable v-ripple  class="q-pa-md" v-for="item in pensamentosHistorico" :key="item.id">
          <q-item-section>
            <q-item-label class="text-h6 text-weight-medium bg-blue-grey-2
              text-center q-pt-sm q-pb-sm text-primary">
                {{item.dia}}
            </q-item-label>
            <div v-for="emo in item.emocoes" :key="emo.emocao" class="q-pt-md q-pb-md">
              <q-item-label caption class="font-historico text-uppercase text-info"> <b>Emoção: </b> {{emo.emocao}}</q-item-label>
              <q-item-label caption class="font-historico text-uppercase"> <b>HORA: </b> {{emo.hora}}</q-item-label>
              <q-item-label caption class="font-historico"> <b>SITUAÇÃO: </b> {{emo.situacao}}</q-item-label>
              <q-item-label caption class="font-historico"> <b>PENS. AUTOMÁTICOS: </b> {{emo.pensamentosAutomaticos}} </q-item-label>
              <q-item-label caption class="font-historico"> <b>ACREDITA: </b> {{emo.acredita}} </q-item-label>
              <q-item-label caption class="font-historico"> <b>AÇÃO: </b> {{emo.acao}} </q-item-label>
            </div>
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
        ['Feliz (10)', 10],
        ['Raiva (7)', 7],
        ['Muito Feliz (4)', 4],
        ['Triste (5)', 5],
        ['Medo (2)', 2]
      ],
      pensamentosHistorico: [
        {
          id: 1,
          dia: '10/11/2020',
          emocoes: [
            {
              hora: '07:30',
              emocao: 'Feliz',
              situacao: 'Lendo um livro',
              pensamentosAutomaticos: 'Paz, tranquilidade e gratidão por poder ler um livro tão bom',
              acredita: 'Muito',
              acao: 'Continue lendo'
            },
            {
              hora: '11:00',
              emocao: 'Triste',
              situacao: 'Lembrei dos meu amigo falecido',
              pensamentosAutomaticos: 'Medo e frustração',
              acredita: 'Parcialmente',
              acao: 'Fiquei relembrando os momentos por quase uma hora'
            },
            {
              hora: '18:47',
              emocao: 'Medo',
              situacao: 'Lembrei da dificuldade de passar no vestibular',
              pensamentosAutomaticos: 'Não vou conseguir, se não conseguir o que vou fazer?',
              acredita: 'Parcialmente',
              acao: 'Comecei a estudar desesperadamente'
            }
          ]
        },
        {
          id: 2,
          dia: '11/11/2020',
          emocoes: [
            {
              hora: '07:45',
              emocao: 'Feliz',
              situacao: 'Lendo um livro',
              pensamentosAutomaticos: 'Paz, tranquilidade e gratidão por poder ler um livro tão bom',
              acredita: 'Muito',
              acao: 'Continue lendo'
            },
            {
              hora: '14:10',
              emocao: 'Triste',
              situacao: 'Lembrei dos meu amigo falecido',
              pensamentosAutomaticos: 'Medo e frustração',
              acredita: 'Parcialmente',
              acao: 'Fiquei relembrando os momentos por quase uma hora'
            },
            {
              hora: '20:30',
              emocao: 'Medo',
              situacao: 'Lembrei da dificuldade de passar no vestibular',
              pensamentosAutomaticos: 'Não vou conseguir, se não conseguir o que vou fazer?',
              acredita: 'Parcialmente',
              acao: 'Comecei a estudar desesperadamente'
            }
          ]
        }
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
      console.log(this.dataDe)
      console.log(this.dataAte)
      this.showRelatorio = true
      // takes an element object
      const el = this.$refs.labelHeaderRelatorio.$el
      const target = getScrollTarget(el)
      const offset = el.offsetTop + 165
      const duration = 400
      setScrollPosition(target, offset, duration)

      const pacienteId = this.$q.localStorage.getItem('pacienteId')
      const datasFiltro = {}

      datasFiltro.pacienteId = pacienteId
      datasFiltro.dataDe = this.dataDe
      datasFiltro.dataAte = this.dataAte

      this.post('/api/v1/paciente/relatorio/rpa', datasFiltro).then(response => {
        this.pensamentosHistorico = response.data.pensamentosHistorico
        this.itemChart = []
        response.data.itemChart.forEach((value, index) => {
          this.itemChart.push([value.emocao, value.quantidade])
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
  font-size: 15px;
}
</style>

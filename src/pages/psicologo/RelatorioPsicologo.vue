<template>
  <q-page class="q-pa-lg" id="labelHeaderRelatorio" ref="labelHeaderRelatorio">
    <h5 class="q-mt-none">Relatórios | Análise do Paciente</h5>
    <div class="row q-mt-md">
       <q-select outlined @input="changePaciente()"
       class="col-12 q-mb-sm"
       v-model="pacienteSelecionado"
       :options="pacientesOptions"
       label="Selecione o Paciente"
       :max-height="5"/>
    </div>

    <div class="row q-mt-md">
       <q-select outlined
       class="col-12 q-mb-sm"
       v-model="relatorioSelecionado"
       :options="relatorioOptions"
       label="Selecione o Relatório"
       @input="changeRelatorio()"
       :disable="pacienteSelecionado == null"/>
    </div>

    <div class="row q-mt-md" v-show="relatorioSelecionado == 'Atividades'">
       <div class="col-2"/>
       <q-select outlined
       class="col-8 q-mb-sm"
       v-model="atividadeSelecionada"
       :options="atividadeOptions"
       label="Selecione a atividade" />
    </div>

    <div class="row q-mt-md" v-show="relatorioSelecionado == 'Cartões de Enfrentamento'">
       <div class="col-2"/>
       <q-select outlined
       class="col-8 q-mb-sm"
       v-model="cartaoSelecionado"
       :options="cartaoOptions"
       label="Selecione o Cartão de Enfrentamento" />
    </div>

    <div class="text-center row q-mt-md">
      <q-input v-model="dataDe" @click="abrirDialogDataDe" outlined class="col-3" label="De: " />
      <q-input v-model="dataAte" @click="abrirDialogDataAte" outlined class="col-3 q-ml-md" label="Até: " />
      <q-btn
          label="Gerar Relatórios"
          :disable="!camposObrigatoriosPreenchidos()"
          class="text-center q-ml-xl"
          icon="analytics"
          color="secondary"
          @click="gerarRelatorios()"
        />
    </div>

    <!-- RELATÓRIO REGISTRO DE PENSAMENTOS / EMOÇÕES -->

    <div class="row q-ma-md" v-show="showRelatorio && relatorioCarregado == 'Registro de Pensamentos/Emoções'">
      <q-separator class="q-mt-xl"/>
      <div class="col-12 text-center">
        <p class="text-h5 text-primary q-mt-xl">Relatório Registro de Pensamentos e Emoções</p>
      </div>
      <pie-chart :data="itemChartPensamentos" :colors="['#0F9AD9', '#10D9E3', '#10E376', '#BF2DCC', '#CC9B04', '#CC4518', '#CC2D44']"
        :messages="{empty: 'Sem registros'}"
        legend="bottom"></pie-chart>
      <div class="row">
        <q-toggle v-model="showDetalhes" color="secondary" label="Mostrar Detalhes" />
      </div>
      <q-list style="width: 100%" v-show="showDetalhes" class="bg-white q-mt-md" bordered separator>
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

    <!-- RELATÓRIO CARTÕES DE ENFRENTAMENTO -->
    <div class="row" v-show="showRelatorio && relatorioCarregado == 'Cartões de Enfrentamento'">
      <q-separator class="q-mt-xl"/>
      <div class="col-12 text-center">
        <p class="text-h5 text-primary q-mt-xl">Relatório Cartões de Enfrentamento</p>
      </div>

      <column-chart :data="itemChartCartoes"
      :colors="['#0F9AD9']"></column-chart>
      <div class="row">
        <q-toggle v-model="showDetalhes" color="secondary" label="Mostrar Detalhes" />
      </div>
      <q-list style="width: 100%" v-show="showDetalhes" class="bg-white q-mt-md" bordered separator>
        <q-item clickable v-ripple  class="q-pa-md" v-for="item in itemChartCartoes" :key="item[0]">
          <q-item-section>
            <q-item-label caption class="font-historico text-primary"> {{item[0]}}:</q-item-label>
            <q-item-label caption class="font-historico text-primary">Leu <b>{{item[1]}}</b> vezes.</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- RELATÓRIO ATIVIDADES -->
    <div class="row" v-show="showRelatorio && relatorioCarregado == 'Atividades'">
       <q-separator class="q-mt-xl"/>
      <div class="col-12 text-center">
        <p class="text-h5 text-primary q-mt-xl">Relatório de Atividades</p>
      </div>
     <pie-chart :data="itemChartAtividades" :colors="['#0F9AD9', '#10D9E3', '#10E376', '#BF2DCC', '#CC9B04', '#CC4518', '#CC2D44']"
        :messages="{empty: 'Sem registros'}"
        legend="bottom"></pie-chart>
      <div class="row">
        <q-toggle v-model="showDetalhes" color="secondary" label="Mostrar Detalhes" />
      </div>
      <q-list style="width: 100%" v-show="showDetalhes" class="bg-white q-mt-md" bordered separator>
        <q-item clickable v-ripple  class="q-pa-md" v-for="atividade in atividadesHistorico" :key="atividade.id">
          <q-item-section>
            <q-item-label caption class="font-historico text-primary">{{atividade.dataHora}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- RELATÓRIO DIÁRIO DE SONO -->
    <div class="row" v-show="showRelatorio && relatorioCarregado == 'Diário de Sono'">
       <q-separator class="q-mt-xl"/>
      <div class="col-12 text-center">
        <p class="text-h5 text-primary q-mt-xl">Relatório do Diário de Sono</p>
      </div>

       <column-chart :data="itemChartDiarioSono"
      :colors="['#0F9AD9']"></column-chart>
      <div class="row">
        <q-toggle v-model="showDetalhes" color="secondary" label="Mostrar Detalhes" />
      </div>
      <q-list style="width: 100%" v-show="showDetalhes" class="bg-white q-mt-md" bordered separator>
        <q-item clickable v-ripple  class="q-pa-md" v-for="item in itemChartDiarioSono" :key="item[0]">
          <q-item-section>
            <q-item-label caption class="font-historico text-info"> {{item[0]}}:</q-item-label>
            <q-item-label caption class="font-historico text-primary q-pb-sm">Dormiu por <b class="text-info">{{item[1]}}</b> horas.</q-item-label>
            <q-item-label caption class="font-historico-sub text-primary"><i>Foi dormir às <b>{{item[2]}}h</b> até <b>{{item[3]}}h</b>,
              ficando por <b>{{item[4]}}</b> horas sem dormir. </i></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="q-pa-md q-gutter-sm" v-show="userToken != null">
      <div class="text-center">

      </div>
      <q-dialog v-model="alert">
        <q-card>
          <q-card-section>
            <div class="text-h6">Seu Token</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ userToken }}
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <q-dialog
      v-model="dialogDataDe"
    >
      <q-date v-model="dataDe" mask="DD/MM/YYYY">
        <div>
          <q-btn label="Selecionar" type="submit" color="primary" v-close-popup/>
        </div>
      </q-date>
    </q-dialog>

    <q-dialog
      v-model="dialogDataAte"
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
import api from '../../components/api/api'
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
// import { date } from 'quasar'
Vue.use(Chartkick.use(Chart))

export default {
  mixins: [api],
  data () {
    return {
      userId: null,
      userToken: null,
      alert: null,
      dialog: false,
      showTodos: true,
      showDetalhes: true,
      showAnimo: false,
      showEngajamento: false,
      showRPA: false,
      showCartoes: false,
      showAtividades: false,
      showSono: false,
      dataDe: null,
      dataAte: null,
      dialogDataDe: null,
      dialogDataAte: null,
      model: null,
      pacienteSelecionado: null,
      pacientesOptions: [
        { id: 1, label: 'Googleee' },
        { id: 2, label: 'facebook' },
        { id: 3, label: 'Twiter' }
      ],
      relatorioSelecionado: null,
      relatorioOptions: [
        'Registro de Pensamentos/Emoções',
        'Cartões de Enfrentamento',
        'Atividades',
        'Diário de Sono'
        // 'Ânimo Geral',
        // 'Engajamento com o tratamento'
      ],
      atividadeSelecionada: null,
      atividadeOptions: [],
      cartaoSelecionado: null,
      cartaoOptions: [],
      showRelatorio: null,
      relatorioCarregado: null,
      itemChartPensamentos: [],
      pensamentosHistorico: [],
      itemChartCartoes: [],
      itemChartAtividades: [],
      atividadesHistorico: [],
      itemChartDiarioSono: []
    }
  },
  methods: {
    camposObrigatoriosPreenchidos () {
      if (this.pacienteSelecionado == null ||
        this.relatorioSelecionado == null ||
        this.dataDe == null ||
        this.dataAte == null ||
        (this.relatorioSelecionado === 'Cartões de Enfrentamento' & this.cartaoSelecionado == null) ||
        (this.relatorioSelecionado === 'Atividades' & this.atividadeSelecionada == null)) {
        return false
      } else {
        return true
      }
    },
    changePaciente (val) {
      console.log('aaa: ' + this.pacienteSelecionado.id)
      this.relatorioSelecionado = null
      this.cartaoOptions = []
      this.cartaoSelecionado = null
      this.atividadeOptions = []
      this.atividadeSelecionada = null
    },
    chamarServicoRelatorioRPA () {
      const datasFiltro = {}

      datasFiltro.pacienteId = this.pacienteSelecionado.id
      datasFiltro.dataDe = this.dataDe
      datasFiltro.dataAte = this.dataAte

      this.post('/api/v1/paciente/relatorio/rpa', datasFiltro).then(response => {
        this.pensamentosHistorico = response.data.pensamentosHistorico
        this.itemChartPensamentos = []
        response.data.itemChart.forEach((value, index) => {
          this.itemChartPensamentos.push([value.emocao, value.quantidade])
        })
      }).catch(erro =>
        this.$q.notify({
          message: 'Ocorreu um erro, por favor tente novamente mais tarde.',
          position: 'top',
          color: 'negative'
        })
      )
    },
    chamarServicoCartoesDeEnfrentamento () {
      const datasFiltro = {}
      datasFiltro.pacienteId = this.pacienteSelecionado.id
      datasFiltro.dataDe = this.dataDe
      datasFiltro.dataAte = this.dataAte
      datasFiltro.id = this.cartaoSelecionado.id

      this.post('/api/v1/paciente/relatorio/cartoes', datasFiltro).then(response => {
        this.itemChartCartoes = []
        response.data.itemChart.forEach((value, index) => {
          this.itemChartCartoes.push([value.data, value.leuXVezes])
        })
      }).catch(erro =>
        this.$q.notify({
          message: 'Ocorreu um erro, por favor tente novamente mais tarde.',
          position: 'top',
          color: 'negative'
        })
      )
    },
    chamarServicoAtividades () {
      const datasFiltro = {}

      datasFiltro.pacienteId = this.pacienteSelecionado.id
      datasFiltro.dataDe = this.dataDe
      datasFiltro.dataAte = this.dataAte
      datasFiltro.id = this.atividadeSelecionada.id

      this.post('/api/v1/paciente/relatorio/atividades', datasFiltro).then(response => {
        this.itemChartAtividades = []
        this.atividadesHistorico = []
        this.itemChartAtividades.push(['Dias que fez a atividade', response.data.diasRealizados])
        this.itemChartAtividades.push(['Dias que NÃO fez a atividade', response.data.diasNãoRealizados])
        response.data.itemChart.forEach((value, index) => {
          this.atividadesHistorico.push({ id: value.id, dataHora: value.data })
        })
      }).catch(erro =>
        this.$q.notify({
          message: 'Ocorreu um erro, por favor tente novamente mais tarde.',
          position: 'top',
          color: 'negative'
        })
      )
    },
    chamarServicoDiarioSono () {
      const datasFiltro = {}

      datasFiltro.pacienteId = this.pacienteSelecionado.id
      datasFiltro.dataDe = this.dataDe
      datasFiltro.dataAte = this.dataAte

      this.post('/api/v1/paciente/relatorio/diarioSono', datasFiltro).then(response => {
        this.itemChartDiarioSono = []
        response.data.itemChart.forEach((value, index) => {
          this.itemChartDiarioSono.push([value.dtHora, value.dormiuXHoras, value.horaFoiDormir, value.horaAcordou, value.tempoSemDormir])
        })
      }).catch(erro =>
        this.$q.notify({
          message: 'Ocorreu um erro, por favor tente novamente mais tarde.',
          position: 'top',
          color: 'negative'
        })
      )
    },
    changeRelatorio (val) {
      if (this.relatorioSelecionado === 'Cartões de Enfrentamento') {
        this.atividadeSelecionada = null
        if (this.cartaoOptions === null || this.cartaoOptions.length === 0) {
          console.log('yeee')
          this.get('/api/v1/paciente/cartaoEnfrentamento/' + this.pacienteSelecionado.id).then(response => {
            response.data.forEach((value, index) => {
              this.cartaoOptions.push({ label: value.titulo, id: value.id })
            })
          }).catch(erro =>
            this.$q.notify({
              message: 'Ocorreu um erro na busca dos cartões de enfrentamento',
              color: 'negative'
            })
          )
        }
      } else if (this.relatorioSelecionado === 'Atividades') {
        this.cartaoSelecionado = null
        if (this.atividadeOptions === null || this.atividadeOptions.length === 0) {
          console.log('yeee ativ')
          this.get('/api/v1/paciente/atividade/' + this.pacienteSelecionado.id).then(response => {
            response.data.forEach((value, index) => {
              this.atividadeOptions.push({ label: value.titulo, id: value.id })
            })
          }).catch(erro =>
            this.$q.notify({
              message: 'Ocorreu um erro na busca das Atividades',
              color: 'negative'
            })
          )
        }
      }
    },
    abrirDialogDataDe () {
      this.dialogDataDe = true
    },
    abrirDialogDataAte () {
      this.dialogDataAte = true
    },
    gerarRelatorios () {
      this.$q.loading.show()
      this.showDetalhes = true
      // hiding in 2s
      this.chamarServicoRelatorio()
    },
    chamarServicoRelatorio () {
      switch (this.relatorioSelecionado) {
        case 'Registro de Pensamentos/Emoções':
          this.chamarServicoRelatorioRPA()
          break
        case 'Cartões de Enfrentamento':
          this.chamarServicoCartoesDeEnfrentamento()
          break
        case 'Atividades':
          this.chamarServicoAtividades()
          break
        case 'Diário de Sono':
          this.chamarServicoDiarioSono()
          break
      }

      console.log('aaabb')
      this.timer = setTimeout(() => {
        this.showRelatorio = true
        this.relatorioCarregado = this.relatorioSelecionado
        this.$q.loading.hide()
        this.timer = 0

        const el = this.$refs.labelHeaderRelatorio.$el
        const target = getScrollTarget(el)
        const offset = el.offsetTop + 330
        const duration = 800
        setScrollPosition(target, offset, duration)

        this.$q.notify({
          message: 'Relatório gerado com sucesso',
          position: 'top',
          color: 'info'
        })
      }, 2000)
    },
    buscarPacientes () {
      this.get('/api/v1/psicologo/paciente/listaNomes/' + this.userId).then(response => {
        this.pacientesOptions = []
        response.data.forEach((value, index) => {
          this.pacientesOptions.push({
            id: value.id,
            label: value.nome
          })
        })
      }).catch(erro =>
        this.$q.notify({
          message: 'Ocorreu um erro na busca dos pacientes',
          color: 'negative'
        })
      )
    }
  },
  async created () {
    // this.userToken = await this.$store.getters.getUserToken
    // console.log('tokennn: ' + this.$store.getters.getUserToken)
    this.userToken = this.$q.localStorage.getItem('userToken')
    this.userId = this.$q.localStorage.getItem('userId')
    console.log('token quasarrr: ' + this.userToken)
    this.buscarPacientes()
    // let timeStampDe = Date.now()
    // timeStampDe = date.subtractFromDate(timeStampDe, { hours: 168, milliseconds: 10000 }) // menos 7 dias
    // const formattedStringDe = date.formatDate(timeStampDe, 'DD/MM/YYYY')
    // this.dataDe = formattedStringDe

    // const timeStampAte = Date.now()
    // const formattedStringAte = date.formatDate(timeStampAte, 'DD/MM/YYYY')
    // this.dataAte = formattedStringAte
  }
}
</script>

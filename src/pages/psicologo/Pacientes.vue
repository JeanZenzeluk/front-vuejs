<template>
  <q-page class="bg-grey-3 column">

    <div class="q-pa-md" v-show="!visualizandoPaciente">

      <q-table
        title="Pacientes"
        :data="pacientesList"
        :columns="columns"
        row-key="nome"
        :rows-per-page-options="[50]"
      >
        <template v-slot:top>
          <div class="row">
            <div class="col-12">
              <p class="text-h6 text-primary">Pacientes </p>
            </div>
            <div class="col-12">
               <novo-paciente @messageFromChild="childMessageReceived" />
            </div>
          </div>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-if="props.row.ativo" key="nome" :props="props"
            @click="verPaciente(props.row)"
            class="cursor-pointer linha-selecionavel">
              {{ props.row.nome }}
            </q-td>
            <q-td v-if="!props.row.ativo" key="nome" :props="props"
            @click="verPaciente(props.row)"
            class="no-tasks cursor-pointer linha-selecionavel">
              {{ props.row.nome }}
            </q-td>
             <q-td key="ativo" :props="props">
               <q-btn v-show="props.row.ativo" flat round size="md" icon="delete" color="negative" @click="excluir(props.row.id)"/>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div v-if="!pacientesList.length" v-show="!visualizandoPaciente" class="no-tasks absolute-center">
      <q-icon name="check" size="100px" color="primary" />
      <div class="text-h5 text-primary text-center">
        Sem Pacientes
      </div>
    </div>

  <!-- TABS -->
    <div class="q-pa-md" transition-show="slide-left" v-show="visualizandoPaciente">
        <div class="row q-ml-xl q-pl-md absolute-top text-subtitle2 text-info">
          <div class="q-pt-sm" style="border-radius: 10px">
            Paciente: {{nomePaciente}}
          </div>
        </div>
       <q-btn rounded flat @click="voltar()" class="absolute-top" icon="arrow_back" color="secondary"/>
       <q-tabs
        v-model="tab"
        dense
        class="text-grey q-mt-md"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="dados-paciente" label="Dados do Paciente" icon="face" />
        <q-tab name="cartao-enfrentamento" label="Cartões de Enfrentamento" icon="library_books"/>
        <q-tab name="atividades" label="Avividades" icon="directions_bike" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>

        <q-tab-panel name="dados-paciente">
          <div class="text-h6 text-primary">Dados do Paciente</div>
          <dados-paciente :paciente="paciente" :visualizando-paciente="visualizandoPaciente" />
        </q-tab-panel>

        <q-tab-panel name="cartao-enfrentamento">
          <div class="row text-h6 text-primary float-left">
            <q-icon name="assignment" size="md" class="text-primary q-ml-sm q-mr-sm"/>
            Cartões de Enfrentamento
          </div>
          <br/>
          <br/>
          <div class="row">
           <q-btn color="info"
                icon="add"
                size="md"
                @click="abrirModalAddCartao()"
                class="q-mb-md q-mt-md q-ml-md"
                label="Adicionar Cartão de Enfrentamento"/>
          </div>
          <lista-com-sublista class="q-pa-md" :itens="cartoesListPaciente" :showEditButton="true" :showSubitem="true"
            iconName="assignment"/>
        </q-tab-panel>

        <q-tab-panel name="atividades">
          <div class="row text-h6 text-primary float-left">
            <q-icon name="directions_bike" size="md" class="text-primary q-ml-sm q-mr-sm"/>
            Atividades
          </div>
          <br/>
          <br/>
           <div class="row">
           <q-btn color="info"
                icon="add"
                size="md"
                @click="abrirModalAddAtividade()"
                class="q-mb-md q-mt-md q-ml-md"
                label="Adicionar Atividade"/>
          </div>
          <lista-atividades class="q-pa-md" :itens="atividadesListPaciente"
            iconName="directions_bike"/>
        </q-tab-panel>
      </q-tab-panels>
    </div>

      <!-- Dialog Novo Cartão de Enfrentamento -->
     <q-dialog
      v-model="showNovoCartaoDialog"
      full-width
      >
        <q-card class="q-pa-md">
          <q-card-section class="row items-center q-pb-none">
               <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
              <div class="col-12 text-h6 text-seco q-mt-md q-mb-md text-center text-primary">
                <q-icon name="list" size="xl"/> <div class="text-h6 text-primary">Novo Cartão de Enfrentamento</div>
              </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="row q-pa-md q-gutter-sm">
              <q-input class="col-12" v-model="novoCartaoTitulo" label="* Título do Cartão:" ref="novoCartaoTituloRef" maxlength="85"
              :rules="[ val => val && val.length > 3 || 'Por favor descreva o título do cartão']" outlined />
            </div>
          </q-card-section>

           <q-card-actions align="right" class="bg-white text-teal">
             <q-btn color="secondary" class="q-pr-sm" label="Adicionar"
            rounded
            icon="save"
            @click="salvarNovoCartao()"/>
          </q-card-actions>

        </q-card>
     </q-dialog>

      <!-- Dialog Nova Atividade -->
     <q-dialog
      v-model="showNovaAtividadeDialog"
      full-width
      >
        <q-card class="q-pa-md">
          <q-card-section class="row items-center q-pb-none">
               <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
              <div class="col-12 text-h6 text-seco q-mt-md q-mb-md text-center text-primary">
                <q-icon name="directions_bike" size="xl"/> <div class="text-h6 text-primary">Nova Atividade</div>
              </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="row q-pa-md q-gutter-sm">
              <q-input class="col-6" v-model="novaAtividadeTitulo" label="* Título:" outlined ref="novaAtividadeTituloRef" maxlength="55"
              :rules="[ val => val && val.length > 3 || 'Por favor descreva o Título da Atividade']" />
              <q-input class="col-12" v-model="novaAtividadeDescricao" label="* Descrição da Atividade:" ref="novaAtividadeDescricaoRef"
              maxlength="200" :rules="[ val => val && val.length > 3 || 'Por favor descreva a Descrição da Atividade']" outlined  />
            </div>
          </q-card-section>

           <q-card-actions align="right" class="bg-white text-teal">
             <q-btn color="secondary" class="q-pr-sm" label="Adicionar"
            rounded
            icon="save"
            @click="salvarNovaAtividade()"/>
          </q-card-actions>

        </q-card>
     </q-dialog>
  </q-page>
</template>

<script>

import DadosPaciente from '../../pages/psicologo/DadosPaciente'
import NovoPaciente from '../../pages/psicologo/NovoPaciente'
import ListaComSublista from '../../pages/psicologo/ListaComSublista'
import ListaAtividades from '../../pages/psicologo/ListaAtividades'
import api from '../../components/api/api'

export default {
  mixins: [api],
  data () {
    return {
      userId: null,
      nomePaciente: null,
      tab: 'dados-paciente',
      visualizandoPaciente: false,
      atualizarGrid: false,
      showNovoCartaoDialog: false,
      showNovaAtividadeDialog: false,
      novoCartaoTitulo: '',
      novaAtividadeTitulo: '',
      novaAtividadeDescricao: '',
      atividadesListPaciente: [
        {
          id: 1,
          titulo: 'Ir para academia',
          ativo: true
        }
      ],
      cartoesListPaciente: [
        {
          id: 1,
          titulo: 'Por que desejo emagrecer?',
          ativo: true,
          subItens: [
            { id: 1, descricao: 'Minha autoestima vai melhorar' },
            { id: 2, descricao: 'Irei mais vezes a praia' }
          ]
        },
        {
          id: 2,
          titulo: 'Por que quero passar no vestibular?',
          ativo: true,
          subItens: [
            { id: 3, descricao: 'Para realizar a faculdade dos meus sonhos' },
            { id: 4, descricao: 'Para mudar de cidade e ser independente' }
          ]
        }
      ],
      paciente: {
        id: 1,
        nome: 'Roger Teste',
        email: 'rogerteste@email.com',
        dt_exclusao: '10/01/2020',
        telefone: '(42) 98888-7777',
        ativo: true,
        habilita_rpa: true,
        habilita_cartao_enfrentamento: true,
        habilita_plano_atividade: false,
        habilita_diario_sono: true
      },
      columns: [
        {
          name: 'nome',
          required: true,
          label: 'Nome',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true,
          style: 'width: 100%'
        },
        {
          name: 'ativo',
          align: 'center',
          label: 'Excluir',
          field: 'ativo',
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        }
      ],
      pacientesList: [
        {
          id: 1,
          nome: 'Maria Silva',
          email: 'rogerteste@email.com',
          dt_exclusao: null,
          telefone: '(42) 98888-7777',
          ativo: true,
          habilita_rpa: true,
          habilita_cartao_enfrentamento: true,
          habilita_plano_atividade: false,
          habilita_diario_sono: true
        },
        {
          id: 2,
          nome: 'João teste',
          email: 'rogerteste@email.com',
          dt_exclusao: null,
          telefone: '(42) 98888-7777',
          ativo: true,
          habilita_rpa: true,
          habilita_cartao_enfrentamento: false,
          habilita_plano_atividade: false,
          habilita_diario_sono: false
        },
        {
          id: 3,
          nome: 'Ana Silva',
          email: 'rogerteste@email.com',
          dt_exclusao: null,
          telefone: '(42) 98888-7777',
          ativo: true,
          habilita_rpa: true,
          habilita_cartao_enfrentamento: true,
          habilita_plano_atividade: false,
          habilita_diario_sono: true
        },
        {
          id: 4,
          nome: 'Marcio Teste',
          email: 'rogerteste@email.com',
          dt_exclusao: '10/01/2020',
          telefone: '(42) 98888-7777',
          ativo: false,
          habilita_rpa: true,
          habilita_cartao_enfrentamento: true,
          habilita_plano_atividade: false,
          habilita_diario_sono: true
        },
        {
          id: 5,
          nome: 'Giovane Testeee',
          email: 'rogerteste@email.com',
          dt_exclusao: null,
          telefone: '(42) 98888-7777',
          ativo: true,
          habilita_rpa: true,
          habilita_cartao_enfrentamento: true,
          habilita_plano_atividade: false,
          habilita_diario_sono: true
        }
      ]
    }
  },
  methods: {
    excluir (pacienteId) {
      this.$q.dialog({
        title: 'Confirmação',
        message: 'Deseja realmente remover este paciente?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.delete('/api/v1/psicologo/paciente/' + pacienteId).then(response => {
          console.log('Excluido com sucesso: ' + response.data)
          this.buscarPacientes()
          this.$q.notify({
            message: 'Paciente excluído',
            position: 'top',
            color: 'info'
          })
        }).catch(erro =>
          this.$q.notify({
            message: 'Ocorreu um erro na exclusão do paciente',
            color: 'negative'
          })
        )
      })
    },
    verPaciente (param) {
      this.paciente = param
      this.nomePaciente = this.paciente.nome

      this.visualizandoPaciente = true
      this.buscarCartoes(param.id)
      this.buscarAtividades(param.id)
      console.log(this.visualizandoPaciente)
    },
    buscarCartoes (idPaciente) {
      this.cartoesListPaciente = []
      this.get('/api/v1/paciente/cartaoEnfrentamento/' + idPaciente).then(response => {
        console.log('sucesso: ' + response.data)
        this.cartoesListPaciente = []
        response.data.forEach((value, index) => {
          this.cartoesListPaciente.push({ titulo: value.titulo, id: value.id, ativo: value.ativo, subItens: value.cartaoItemList })
          console.log(this.cartoes)
        })
      }).catch(erro =>
        this.$q.notify({
          message: 'Ocorreu um erro na busca dos cartões de enfrentamento',
          color: 'negative'
        })
      )
    },
    buscarAtividades (idPaciente) {
      this.atividadesListPaciente = []
      this.get('/api/v1/paciente/atividade/' + idPaciente).then(response => {
        console.log('sucesso: ' + response.data)
        this.atividadesListPaciente = []
        response.data.forEach((value, index) => {
          this.atividadesListPaciente.push({ titulo: value.titulo, id: value.id, ativo: value.ativo })
          console.log(this.atividadesListPaciente)
        })
      }).catch(erro =>
        this.$q.notify({
          message: 'Ocorreu um erro na busca das atividades',
          color: 'negative'
        })
      )
    },
    voltar () {
      this.visualizandoPaciente = false
    },
    childMessageReceived (arg1, arg2, arg3) {
      console.log('implementar o buscarPacientes...')
      this.buscarPacientes()
    },
    buscarPacientes () {
      this.get('/api/v1/psicologo/paciente/' + this.userId).then(response => {
        console.log('sucesso: ' + response.data)
        this.pacientesList = []
        response.data.forEach((value, index) => {
          this.pacientesList.push({
            id: value.id,
            nome: value.nome,
            email: value.email,
            dt_exclusao: value.dt_exclusao,
            telefone: value.telefone,
            ativo: value.ativo,
            habilita_rpa: value.habilita_rpa,
            habilita_cartao_enfrentamento: value.habilita_cartao_enfrentamento,
            habilita_plano_atividade: value.habilita_plano_atividade,
            habilita_diario_sono: value.habilita_diario_sono
          })
          console.log(this.pacientesList)
        })
      }).catch(erro =>
        this.$q.notify({
          message: 'Ocorreu um erro na busca dos pacientes',
          color: 'negative'
        })
      )
    },
    abrirModalAddCartao () {
      this.novoCartaoTitulo = null
      this.showNovoCartaoDialog = true
    },
    abrirModalAddAtividade () {
      this.showNovaAtividadeDialog = true
      this.novaAtividadeTitulo = null
      this.novaAtividadeDescricao = null
    },
    salvarNovoCartao () {
      this.$refs.novoCartaoTituloRef.validate()
      if (this.$refs.novoCartaoTituloRef.hasError) {
        this.$q.notify({
          message: 'Preencha os campos obrigatórios',
          position: 'top',
          color: 'negative'
        })
      } else {
        const atividadeSalvar = {}
        atividadeSalvar.titulo = this.novoCartaoTitulo
        atividadeSalvar.pacienteId = this.paciente.id
        this.post('/api/v1/psicologo/paciente/novoCartao', atividadeSalvar).then(response => {
          console.log(response.data)
          this.$q.notify({
            message: 'Cartão adicionado com Sucesso',
            position: 'top',
            color: 'info'
          })
          this.showNovoCartaoDialog = false
          this.buscarCartoes(this.paciente.id)
        }).catch(erro =>
          this.$q.notify({
            message: 'Ocorreu um erro, por favor tente novamente mais tarde.',
            position: 'top',
            color: 'negative'
          })
        )
      }
    },
    salvarNovaAtividade () {
      this.$refs.novaAtividadeTituloRef.validate()
      this.$refs.novaAtividadeDescricaoRef.validate()
      if (this.$refs.novaAtividadeTituloRef.hasError || this.$refs.novaAtividadeDescricaoRef.hasError) {
        this.$q.notify({
          message: 'Preencha os campos obrigatórios',
          position: 'top',
          color: 'negative'
        })
      } else {
        const atividadeSalvar = {}
        atividadeSalvar.titulo = this.novaAtividadeTitulo
        atividadeSalvar.descricao = this.novaAtividadeDescricao
        atividadeSalvar.pacienteId = this.paciente.id
        this.post('/api/v1/psicologo/paciente/novaAtividade', atividadeSalvar).then(response => {
          console.log(response.data)
          this.$q.notify({
            message: 'Atividade adicionada com Sucesso',
            position: 'top',
            color: 'info'
          })
          this.buscarAtividades(this.paciente.id)
          this.showNovaAtividadeDialog = false
        }).catch(erro =>
          this.$q.notify({
            message: 'Ocorreu um erro, por favor tente novamente mais tarde.',
            position: 'top',
            color: 'negative'
          })
        )
      }
    }

  },
  components: {
    DadosPaciente,
    NovoPaciente,
    ListaComSublista,
    ListaAtividades
  },
  watch: {
    atualizarGrid: function () {
      console.log('atualizou gridd - implementar')
    }
  },
  async created () {
    this.userId = this.$q.localStorage.getItem('userId')
    this.buscarPacientes()
  }
}
</script>

<style lang="scss">
  .done {
    .q-item__label {
      text-decoration: line-through;
      color: #bbb;
    }
  }
  .no-tasks {
    opacity: 0.5;
  }
</style>

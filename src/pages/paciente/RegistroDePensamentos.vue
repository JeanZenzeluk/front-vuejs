<template>
  <q-page class="column">

    <!-- TELA 1 -->
    <div v-if="tela == 1">
      <div class="row q-pl-md q-pr-md">
        <div class="col text-center q-ml-sm q-mr-sm" @click="registrarEmocao('Muito Triste')">
          <h5 class="text-primary">{{nome}}, como você está se sentindo?</h5>
        </div>
      </div>

      <div class="row q-pl-md q-pr-md q-mt-md">
        <div class="col text-center q-ml-sm q-mr-sm" @click="registrarEmocao('Muito Triste')">
          <q-img src="../../statics/emocao-muito-triste.png" width="50px"/>
          <p class="text-primary text-weight-medium q-mt-sm">Muito Triste</p>
        </div>
        <div class="col text-center q-ml-sm q-mr-sm" @click="registrarEmocao('Triste')">
          <q-img src="../../statics/emocao-triste.png" width="50px"/>
          <p class="text-primary text-weight-medium q-mt-sm">Triste</p>
        </div>
        <div class="col text-center q-ml-sm q-mr-sm" @click="registrarEmocao('Neutro')">
          <q-img src="../../statics/emocao-neutro.png" width="50px"/>
          <p class="text-primary text-weight-medium q-mt-sm">Neutro</p>
        </div>
        <div class="col text-center q-ml-sm q-mr-sm" @click="registrarEmocao('Feliz')">
          <q-img src="../../statics/emocao-feliz.png" width="50px"/>
          <p class="text-primary text-weight-medium q-mt-sm">Feliz</p>
        </div>
        <div class="col text-center q-ml-sm q-mr-sm" @click="registrarEmocao('Muito Feliz')">
          <q-img src="../../statics/emocao-muito-feliz.png" width="50px"/>
          <p class="text-primary text-weight-medium q-mt-sm">Muito Feliz</p>
        </div>
        <div class="col-12 text-center" @click="irParaOutrasEmocoes()">
            <q-btn outline rounded color="secondary" label="Outra Emoção" />
        </div>
      </div>

      <div class="absolute-top">
        <EnableNotifications :userToken='userToken'/>
      </div>

      <div class="row q-pa-sm bg-primary bg-secondary absolute-bottom">
        <div class="col text-center q-ml-sm q-mr-sm" v-show="permiteCartoes">
          <q-card class="my-card">
            <q-card-section class="text-center" @click="irPara('cartao')">
              <q-icon name="library_books" class="text-primary" style="font-size: 35px;"/>
              <p class="text-weight-regular text-primary" style="font-size: 12px">Cartões</p>
            </q-card-section>
          </q-card>
        </div>
        <div class="col text-center q-mr-sm" v-show="permiteAtividades">
          <q-card class="my-card">
            <q-card-section @click="irPara('atividade')">
              <q-icon name="directions_run" class="text-primary" style="font-size: 35px;"/>
              <p class="text-weight-regular text-primary" style="font-size: 12px; margin-left: -7px">Atividades</p>
            </q-card-section>
          </q-card>
        </div>
        <div class="col text-center q-mr-sm" v-show="permiteDiarioSono">
          <q-card class="my-card">
            <q-card-section @click="irPara('sono')">
              <q-icon name="bedtime" class="text-primary" style="font-size: 35px;"/>
              <p class="text-weight-regular text-primary" style="font-size: 12px">Sono</p>
            </q-card-section>
          </q-card>
        </div>
        <div class="col text-center q-mr-sm" v-show="!permiteCartoes">

        </div>
        <div class="col text-center q-mr-sm" v-show="!permiteAtividades">

        </div>
        <div class="col text-center q-mr-sm" v-show="!permiteDiarioSono">

        </div>
        <div class="col text-center q-mr-sm">
          <q-card class="my-card">
            <q-card-section>
              <div>
                <q-fab
                  external-label
                  label-position="top"
                  padding="xs"
                  color="primary"
                  icon="leaderboard"
                  direction="up"
                  hide-label="true"
                >
                    <q-fab-action padding="15px" external-label label-position="left" label-style="font-size: 15px" style="font-size: 20px"
                      color="primary" @click="irPara('RelatorioPensamentos')" icon="emoji_emotions" label="Registro de Pensamentos" />
                    <q-fab-action v-show="permiteCartoes" padding="15px" external-label label-position="left" label-style="font-size: 15px" style="font-size: 20px"
                      color="primary" @click="irPara('RelatorioCartoes')" icon="library_books" label="Cartões de Enfrentamento" />
                    <q-fab-action v-show="permiteAtividades" padding="15px" external-label label-position="left" label-style="font-size: 15px" style="font-size: 20px"
                      color="primary" @click="irPara('RelatorioAtividades')" icon="directions_run" label="Atividades" />
                    <q-fab-action v-show="permiteDiarioSono" padding="15px" external-label label-position="left" label-style="font-size: 15px" style="font-size: 20px"
                      color="primary" @click="irPara('RelatorioSono')" icon="bedtime" label="Diário de Sono" />
                  </q-fab>
              </div>
              <p class="text-weight-regular text-primary" style="font-size: 12px; margin-top: 2px; margin-left: -7px">Relatórios</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- TELA 2 -->
    <div v-if="tela == 2">
      <q-icon name="keyboard_arrow_left" class="text-secondary q-ml-sm q-mt-sm" @click="voltar" style="font-size: 30px;"/>
      <div class="row q-pl-md q-pr-md">
        <div class="col-12 text-center q-ml-sm q-mr-sm">
          <h5 class="text-primary">Que emoção você sentiu?</h5>
        </div>
        <div class="col-12 q-ml-sm q-mr-sm q-mb-xl q-pb-md">
          <div class="q-pa-md">
            <q-option-group
              :options="emocoes"
              label="Notifications"
              type="radio"
              color="secondary"
              size="xl"
              class="text-weight-medium"
              v-model="emocao"
            />
          </div>
        </div>
        <div class="col-12 text-center absolute-bottom q-ml-sm q-mr-sm q-mb-lg">
          <q-btn color="secondary" label="Próximo 1/4"
            rounded
            icon="arrow_right_alt"
            @click="registrarEmocaoOutra()"/>
        </div>
      </div>
    </div>

    <!-- TELA 3 -->
    <div v-if="tela == 3">
      <q-icon name="keyboard_arrow_left" class="text-secondary q-ml-sm q-mt-sm" @click="voltar" style="font-size: 30px;"/>
      <div class="row q-pl-md q-pr-md">
        <div class="col-12 text-center q-ml-sm q-mr-sm">
          <h5 class="text-primary">* Que situação levou a essas emoções?</h5>
          <div class="q-pa-md">
            <q-input
              label="Descreva aqui"
              v-model="situacao"
              ref="situacaoRef"
              :rules="[ val => val && val.length > 3 || 'Por favor descreva a situação']"
              filled
              type="textarea"
            />
          </div>
        </div>

      </div>
      <div class="row q-mt-xl">
        <div class="col-12 text-center absolute-bottom q-ml-sm q-mr-sm q-mb-lg">
          <q-btn color="secondary" label="Próximo 2/4"
            rounded
            icon="arrow_right_alt"
            @click="registrarSituacao()"/>
        </div>
      </div>
    </div>

    <!-- TELA 4 -->
    <div v-if="tela == 4">
      <q-icon name="keyboard_arrow_left" class="text-secondary q-ml-sm q-mt-sm" @click="voltar" style="font-size: 30px;"/>
      <div class="row q-pl-md q-pr-md">
        <div class="col-12 text-center q-ml-sm q-mr-sm q-mt-md">
          <p class="text-primary text-h5">* Quais pensamentos automátivos você teve?</p>
          <div class="q-pa-md q-pr-lg">
            <q-input filled ref="pensamentosAutomaticosRef" v-model="pensamentosAutomaticos"
              label="Descreva aqui" :rules="[ val => val && val.length > 2 || 'Por favor descreva os pensamentos']"/>
          </div>
          <p class="text-primary text-h5 q-mt-md">Acredita nestes pensamentos:</p>
          <div class="q-pa-md q-pr-lg">
            <q-slider
              v-model="quantoAcredita"
              :min="1"
              :max="3"
              :step="1"
              color="secondary"
            />
            <p class="text-secondary text-weight-medium text-h6"
              v-if="quantoAcredita == 1">Pouco
            </p>
            <p class="text-secondary text-weight-medium text-h6"
              v-if="quantoAcredita == 2">Parcialmente
            </p>
            <p class="text-secondary text-weight-medium text-h6"
              v-if="quantoAcredita == 3">Muito
            </p>
          </div>
        </div>

        <div class="col-12 text-center absolute-bottom q-ml-sm q-mr-sm q-mb-lg">
          <q-btn color="secondary" label="Próximo 3/4"
            rounded
            icon="arrow_right_alt"
            @click="registrarAutomaticos()"/>
        </div>
      </div>
    </div>

    <!-- TELA 5 -->
    <div v-if="tela == 5">
      <q-icon name="keyboard_arrow_left" class="text-secondary q-ml-sm q-mt-sm" @click="voltar" style="font-size: 30px;"/>
      <div class="row q-pl-md q-pr-md">
        <div class="col-12 text-center q-ml-sm q-mr-sm">
          <h5 class="text-primary">* Que ação você tomou?</h5>
          <div class="q-pa-md">
            <q-input
              label="Descreva aqui"
              ref="acaoRef"
              :rules="[ val => val && val.length > 4 || 'Por favor descreva a ação']"
              v-model="acao"
              filled
              type="textarea"
            />
          </div>
        </div>
      </div>
      <div class="row q-mt-xl">
        <div class="col-12 text-center absolute-bottom q-ml-sm q-mr-sm q-mb-lg">
          <q-btn color="secondary" label="Salvar"
            rounded
            icon="save"
            @click="registrarAcao()"/>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>

import EnableNotifications from '../../components/EnableNotifications'
import api from '../../components/api/api'

export default {
  mixins: [api],
  data () {
    return {
      novoPaciente: '',
      permitePensamentos: false,
      permiteCartoes: false,
      permiteAtividades: false,
      permiteDiarioSono: false,
      alert: false,
      tela: 1,
      emocao: null,
      situacao: null,
      pensamentosAutomaticos: null,
      quantoAcredita: 2,
      acao: null,
      emocoes: [
        { label: 'Ansioso', value: 'Ansioso' },
        { label: 'Desejo sexual', value: 'Desejo sexual' },
        { label: 'Exitação', value: 'Exitação' },
        { label: 'Inveja', value: 'Inveja' },
        { label: 'Medo', value: 'Medo' },
        { label: 'Nojo', value: 'Nojo' },
        { label: 'Nostalgia', value: 'Nostalgia' },
        { label: 'Raiva', value: 'Raiva' },
        { label: 'Romance', value: 'Romance' },
        { label: 'Surpresa', value: 'Surpresa' }
      ],
      userToken: null
    }
  },
  computed: {
    credential () {
      return this.$store.getters.getCredentials[0]
    }
  },
  components: {
    EnableNotifications
  },
  methods: {
    voltar () {
      this.tela = 1
    },
    deleteTask (index) {
      this.$q.dialog({
        title: 'Confirmação',
        message: 'Deseja realmente remover este paciente?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.tasks.splice(index, 1)
        this.$q.notify('Paciente deletado')
      })
    },
    irPara (onde) {
      this.$router.push('/' + onde)
    },
    registrarEmocao (emocaoRegistrada) {
      this.emocao = emocaoRegistrada
      this.tela = 3
    },
    irParaOutrasEmocoes () {
      this.tela = 2
    },
    registrarEmocaoOutra () {
      this.tela = 3
    },
    registrarSituacao () {
      this.$refs.situacaoRef.validate()
      if (this.$refs.situacaoRef.hasError) {
        this.camposObrigatoriosNotify()
      } else {
        this.tela = 4
      }
    },
    camposObrigatoriosNotify () {
      this.$q.notify({
        message: 'Preencha os campos obrigatórios',
        position: 'top',
        color: 'negative'
      })
    },
    registrarAutomaticos () {
      this.$refs.pensamentosAutomaticosRef.validate()
      if (this.$refs.pensamentosAutomaticosRef.hasError) {
        this.camposObrigatoriosNotify()
      } else {
        this.tela = 5
      }
    },
    limpaCampos () {
      this.acao = null
      this.situacao = null
      this.emocao = null
      this.quantoAcredita = null
      this.pensamentosAutomaticos = null
    },
    registrarAcao () {
      this.$refs.acaoRef.validate()
      if (this.$refs.acaoRef.hasError) {
        this.camposObrigatoriosNotify()
      } else {
        console.log('chamou acessar')
        const rpaSalvar = {}
        rpaSalvar.emocao = this.emocao
        rpaSalvar.situacao = this.situacao
        rpaSalvar.pensamentosAutomaticos = this.pensamentosAutomaticos
        rpaSalvar.acao = this.acao
        rpaSalvar.quantoAcredita = this.quantoAcredita
        rpaSalvar.paciente = {}
        const pacienteId = this.$q.localStorage.getItem('pacienteId')
        rpaSalvar.paciente.id = pacienteId
        this.post('/api/v1/paciente/rpa', rpaSalvar).then(response => {
          this.tela = 1
          this.limpaCampos()
          this.$q.notify({
            message: 'Salvo com sucesso!',
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
    testar () {
      this.$q.notify('testou!')
    },
    addPaciente () {
      if (this.novoPaciente) {
        this.tasks.push({
          title: this.novoPaciente,
          done: false
        })
        this.novoPaciente = ''
      }
    }
  },
  async created () {
    // this.userToken = await this.$store.getters.getUserToken
    // console.log('tokennn: ' + this.$store.getters.getUserToken)
    this.userToken = this.$q.localStorage.getItem('userToken')
    this.nome = this.$q.localStorage.getItem('userNome')

    this.permitePensamentos = this.$q.localStorage.getItem('permitePensamentos')
    this.permiteCartoes = this.$q.localStorage.getItem('permiteCartoes')
    this.permiteAtividades = this.$q.localStorage.getItem('permiteAtividades')
    this.permiteDiarioSono = this.$q.localStorage.getItem('permiteDiarioSono')

    console.log('testee jáaa! ' + this.permitePensamentos)
    console.log('token quasarrr: ' + this.userToken)
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
  .my-card {
    height: 70px;
  }
</style>

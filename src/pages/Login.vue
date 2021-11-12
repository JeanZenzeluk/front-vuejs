<template>
  <div class="bg-image">
    <q-layout view="lHh Lpr lFf" class="window-height window-width row justify-center items-center">
      <div class="column q-pa-lg">
        <div class="row">
          <q-card square class="shadow-24" style="width:300px;height:475px;">
            <q-card-section class="bg-secondary text-center">
              <q-img
                  src="../statics/logo-login.png"
                  spinner-color="white"
                  style="height: 125px; max-width: 220px"
                />
            </q-card-section>
            <q-card-section>
              <q-form class="q-px-sm q-pt-md q-pb-sm">
                <q-input square clearable v-model="email" type="email" label="E-mail" maxlength="100">
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
                <q-input square clearable v-model="password" type="password" label="Senha" maxlength="20">
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>
              </q-form>
            </q-card-section>
            <q-card-actions class="q-px-lg">
              <q-btn unelevated size="md" rounded color="secondary" class="full-width text-white"
              @click="acessar" label="Acessar" />
              <q-btn unelevated size="md" outline rounded color="secondary" class="full-width q-mt-sm"
              @click="registrar" label="Registrar-se" />
            </q-card-actions>
            <q-card-section class="text-center q-pa-sm">
              <p class="text-grey-7 label-senha" style="text-decoration: underline" @click="visualizarEsqueceuSenha = true">Esqueceu sua senha?</p>
            </q-card-section>
          </q-card>
          <q-inner-loading :showing="carregando">
            <q-spinner-gears size="50px" color="secondary" />
          </q-inner-loading>
        </div>
      </div>

      <q-dialog
            v-model="visualizarEsqueceuSenha"
            full-height
            full-width
          >
            <q-card class="column full-height q-pa-md">
              <q-card-section class="row">
                <div class="text-h6 text-primary">Recuperar Senha</div>
                <q-btn icon="close" class="absolute-right q-mr-sm" flat round dense v-close-popup />
              </q-card-section>
              <q-separator />
              <q-card-section class="row">
                <div class="q-pt-md">
                  <p class="q-mb-xl">
                    Para recuperação de senha digite seu e-mail de acesso:
                  </p>
                  <q-input square clearable v-model="emailSenha" type="email" label="Email" maxlength="100">
                        <template v-slot:prepend>
                          <q-icon name="email" />
                        </template>
                  </q-input>
                </div>
              </q-card-section>
                <q-card-actions align="center" class="q-pb-xl q-pl-lg q-pr-lg q-pt-xl">
                <div>
                  <q-btn size="md" color="secondary" class="text-center q-pa-sm" label="Recuperar"
                    rounded
                    icon="send"
                    @click="enviarSenha()"
                    />
                </div>
              </q-card-actions>
            </q-card>
      </q-dialog>

       <q-dialog
      v-model="visualizarRegistrar"
      full-height
      full-width
    >
      <q-card class="column full-height">
        <q-card-section class="row" v-show="etapa != 6">
          <div class="text-h6 text-primary">Registrar-se</div>
          <q-btn icon="close" class="absolute-right q-mr-sm" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-linear-progress
          v-for="size in ['md']"
          :key="size"
          :size="size"
          :value="progress"
          color="secondary"
          label="Etapas Concluídas"
        />
        <q-card-section class="col text-primary text-weight-medium">
          <div v-show="etapa == 1" class="q-pt-md">
            <p class="q-mb-md">
              Por favor digite abaixo o E-mail cadastrado pelo seu psicólogo:
            </p>
            <q-input square clearable v-model="emailRegistro" type="email" label="Email" maxlength="100">
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
            </q-input>
          </div>

          <div v-show="etapa == 2" class="q-pt-md">
            <p class="q-mb-md">
              Defina sua senha de acesso:
            </p>
            <q-input square clearable v-model="senha1Registro" type="password" label="Senha" maxlength="20">
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
            </q-input>
            <q-input square clearable v-model="senha2Registro" type="password" label="Repita a senha" maxlength="20">
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
            </q-input>
            <div class="row q-mt-md text-red" v-show="senha1Registro != senha2Registro">
              As 2 senhas devem ser iguais*
            </div>
          </div>

          <div v-show="etapa == 3" class="q-pt-md">
            <p class="q-mb-md">
              Para ter uma melhor experiência recomendamos que instale o aplicativo TerapiApp na sua área de trabalho:
            </p>
            <div align="center" class="q-mt-lg">
              <q-btn size="md" color="secondary" class="text-center q-pa-sm" label="Instalar!"
              rounded
              icon="get_app"
              @click="install"
              />
              <!--<InstallationBannerRegistro @messageFromChild="instalar"/>-->
            <!--
            <q-btn size="md" color="secondary" class="text-center q-pa-sm" label="Instalar"
              rounded
              icon="get_app"
              @click="instalar()"
              /> -->
            </div>
              <p class="q-mb-md q-pa-md text-center text-grey-6 text-caption">
              *Esta ação pode ser realizada a qualquer momento no menu "Instalar" do aplicativo
            </p>
          </div>

          <div v-show="etapa == 4" class="q-pt-md">
            <p class="q-mb-md">
              O TerapiApp envia notificações diariamente para lembrá-lo de realizar suas atividades, clique abaixo
              para habilitá-las:
            </p>
            <div align="center" class="q-mt-lg">
              <EnableNotificationsRegistro :pacienteId="pacienteId" @messageFromChild="permitirNotificacoes"/>
            <!--
            <q-btn size="md" color="secondary" class="text-center q-pa-sm" label="Permitir Notificações"
              rounded
              icon="notifications_active"
              @click="permitirNotificacoes()"
              />-->
            </div>
              <p class="q-mb-md q-pa-md text-center text-grey-6 text-caption">
              *Esta ação pode ser realizada a qualquer momento no menu "Notificações" do aplicativo
            </p>
          </div>

          <div v-show="etapa == 5" class="q-pt-md">
            <p class="q-mb-md">
              Termos e condições de uso:
            </p>
            <div class="row">
               <q-scroll-area style="height: 150px;" class="full-width">
              <div v-for="n in 100" :key="n" class="q-py-xs bg-grey-3 q-pa-sm text-caption">
                Ao aceitar os termos você declara estar ciente da possibilidade de possíveis problemas de registro de
                informações, instabilidade, dentre quaisquer outras falhas técnicas que possam vir a ocorrer durante a utilização do
                aplicativo, e em nenhuma destas situações não poderão ser reclamadas judicialmente. O TerapiApp ainda
                está em processo desenvolvimento e você está utilizando a versão beta.
              </div>
                </q-scroll-area>
                <q-toggle color="blue" label="Concordo com os termos e condiçõesde uso" class="q-mt-sm" v-model="aceitouTermos" />
            </div>
          </div>

            <div v-show="etapa == 6" class="justify-center row">
            <p class="q-mb-md text-h5 col-12 text-center">
              Cadastro finalizado!
            </p>
            <p class="q-mb-md col-12 text-center text-body2">
              Agora já pode utilizar o TerapiApp, e se optou por instalar irá encontrá-lo na sua tela inicial :D
            </p>
            <div class="col text-center q-ml-sm q-mr-sm">
              <q-img src="../statics/abrir-app-gif.gif" width="100%"/>
            </div>
            <div v-if="false" class="col-12 text-center q-mt-xl">
              <q-icon name="check" size="xl" color="secondary"/>
            </div>
          </div>

        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-pl-lg q-pr-lg">
          <div v-show="etapa == 1 || etapa == 2 || etapa == 5 || etapa == 6">
            <q-btn size="md" color="secondary" class="text-center q-pa-sm" :disable="etapa == 5 && !aceitouTermos"
            :label="etapa == 6 ? 'Acessar TerapiApp' : 'Próximo'"
              rounded
              @click="proximo()"
              />
          </div>
          <div v-show="etapa == 3 || etapa == 4">
            <q-btn size="md" color="secondary" outline class="text-center q-pa-sm" label="Próximo"
              rounded
              @click="proximo()"
              />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
    </q-layout>
  </div>
</template>

<script>
import api from '../components/api/api'
// import InstallationBannerRegistro from '../components/InstallationBannerRegistro'
import EnableNotificationsRegistro from '../components/EnableNotificationsRegistro'

export default {
  name: 'Login',
  mixins: [api],
  data () {
    return {
      deferredPrompt: null,
      email: 'joaoteste@email.com',
      username: '',
      password: '1234',
      carregando: false,
      visualizarRegistrar: false,
      visualizarEsqueceuSenha: false,
      emailSenha: null,
      progress: 0.00,
      etapa: 1,
      emailRegistro: null,
      senha1Registro: null,
      senha2Registro: null,
      aceitouTermos: false,
      appInstalado: false,
      habilitaNotificacoes: false,
      pacienteId: null
    }
  },
  components: {
    // InstallationBannerRegistro,
    EnableNotificationsRegistro
  },
  methods: {
    async install () {
      console.log('install...')
      this.deferredPrompt.prompt()
      // this.$emit('messageFromChild', true)
    },
    enviarSenha () {
      if (this.emailValido(this.emailSenha)) {
        // enviar email
        this.visualizarEsqueceuSenha = false
        this.emailSenha = null
        this.$q.notify('Pronto! A senha foi enviada para seu E-mail')
      }
    },
    proximo () {
      switch (this.etapa) {
        case 1:
          if (this.emailValido(this.emailRegistro)) {
            this.post('/api/v1/acesso/validaEmailPrimeiroAcesso', { email: this.emailRegistro }).then(response => {
              this.pacienteId = response.data.id
              console.log('id do paciente: ' + 1)
              this.progress = 0.20
              this.etapa = 2
            }).catch(erro =>
              this.$q.notify({
                message: 'Este e-mail não está disponível, verifique com seu psicólogo',
                color: 'negative'
              })
            )
          }
          break
        case 2:
          if (this.senha1Registro == null || this.senha1Registro === '') {
            this.$q.notify({ message: 'Por favor defina sua senha', color: 'negative' })
          } else if (this.senha1Registro.length < 4) {
            this.$q.notify({ message: 'A senha deve conter no mínimo 4 caracteres', color: 'negative' })
          } else if (this.senha1Registro !== this.senha2Registro) {
            this.$q.notify({ message: 'As senhas não conferem', color: 'negative' })
          } else {
            this.progress = 0.40
            this.etapa = 3
          }
          break
        case 3:
          this.progress = 0.60
          this.etapa = 4
          break
        case 4:
          this.progress = 0.80
          this.etapa = 5
          break
        case 5:
          this.post('/api/v1/acesso/finalizarCadastroPaciente', { id: this.pacienteId, appInstalado: this.appInstalado, habilitaNotificacoes: this.habilitaNotificacoes, senha: this.senha1Registro })
            .then(response => {
              this.progress = 1.00
              this.etapa = 6
            }).catch(erro =>
              this.$q.notify({
                message: 'Ocorreu um erro, por favor tente novamente mais tarde',
                color: 'negative'
              })
            )
          break
        case 6:
          this.email = this.emailRegistro
          this.password = this.senha1Registro
          this.acessar()
          break
      }
    },
    emailValido (emailParam) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      if (emailPattern.test(emailParam)) {
        // chamar serviço de validação
        return true
      } else {
        this.$q.notify({
          message: 'E-mail inválido',
          color: 'negative'
        })
        return false
      }
    },
    registrar () {
      this.visualizarRegistrar = true
      this.etapa = 1
      this.emailRegistro = null
      this.senha1Registro = null
      this.senha2Registro = null
      this.progress = 0.20
    },
    usuarioNaoEncontradoMessage () {
      this.$q.loading.hide()
      this.timer = 0
      this.$q.notify({
        message: 'Usuário não encontrado',
        color: 'negative'
      })
    },
    instalar (arg1) {
      this.appInstalado = arg1
    },
    permitirNotificacoes (arg1) {
      this.permitirNotificacoes = arg1
    },
    acessar () {
      this.$q.loading.show()
      console.log('chamou acessar')
      this.post('/api/v1/acesso/logar', { email: this.email, senha: this.password }).then(response => {
        console.log(response.data)
        this.$q.localStorage.set('userPerfil', response.data.perfil)
        this.$q.localStorage.set('authToken', response.data.token)
        var nomeFull = response.data.nome
        this.$q.localStorage.set('userFullNome', nomeFull)
        this.$q.localStorage.set('userE', this.email)
        this.$q.localStorage.set('userP', this.password)
        this.$q.localStorage.set('userFullNome', nomeFull)
        this.$q.localStorage.set('userClinica', response.data.clinica)

        this.$q.localStorage.set('permitePensamentos', response.data.permitePensamentos)
        this.$q.localStorage.set('permiteCartoes', response.data.permiteCartoes)
        this.$q.localStorage.set('permiteAtividades', response.data.permiteAtividades)
        this.$q.localStorage.set('permiteDiarioSono', response.data.permiteDiarioSono)
        if (nomeFull != null && nomeFull !== '') {
          var tmp = nomeFull.split(' ')
          var nome = tmp[0]
          this.$q.localStorage.set('userNome', nome)
        }
        this.$q.localStorage.set('userId', response.data.id)
        if (response.data.pacienteId) {
          this.$q.localStorage.set('pacienteId', response.data.pacienteId)
        }
        if (response.data.perfil === 'psicologo') {
          this.$router.push('/psicologo')
        } else {
          this.$router.push('/paciente')
        }
        this.$q.loading.hide()
        this.timer = 0
      }).catch(erro =>
        this.usuarioNaoEncontradoMessage()
      )
    }
  },
  async created () {
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

    // this.userToken = await this.$store.getters.getUserToken
    // console.log('tokennn: ' + this.$store.getters.getUserToken)
    var userE = this.$q.localStorage.getItem('userE')
    var userP = this.$q.localStorage.getItem('userP')
    var userPerfil = this.$q.localStorage.getItem('userPerfil')

    if (userE != null) {
      this.email = userE
    }
    if (userP != null) {
      this.password = userP
    }
    if (userE != null && userP != null && userPerfil != null) {
      if (userPerfil === 'psicologo') {
        this.$router.push('/psicologo')
      } else {
        this.$router.push('/paciente')
      }
    }
  }
}
// style="background: linear-gradient(#1976D2, #223A52);"
</script>

<style>
.bg-image {
    background-image: url('../statics/grama.jpg');
    background-repeat: no-repeat;
    background-size: cover;
}
.label-senha:hover{
  color: #0F9AD9 !important;
}
</style>

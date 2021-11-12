<template>
  <div>
      <q-btn color="info"
                icon="person_add"
                @click="abrirModal()"
                label="Adicionar paciente"/>
     <q-dialog
      v-model="showNovoPacienteDialog"
      full-width
      >
        <q-card class="q-pa-md">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-primary">Novo Paciente</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="row q-pa-md q-gutter-sm">
              <q-input v-model="paciente.nome" class="col-11" label="* Nome:" ref="nomeRef" maxlength="100"
                :rules="[ val => val && val.length > 3 || 'Por favor preencha o Nome do paciente']"/>
              <q-input v-model="paciente.email" class="col-9" label="* E-mail:" ref="emailRef" maxlength="100"
              :rules="[ val => val && val.length > 3 || 'Por favor preencha o E-mail do paciente']"/>
              <q-input v-model="paciente.telefone" class="col-2" label="* Telefone:" ref="telefoneRef" mask="(##) ####-#####"
              :rules="[ val => val && val.length > 3 || 'Por favor preencha o Telefone do paciente']"/>
            </div>

            <div class="row q-pl-md q-pt-md q-gutter-sm">
              <p class="text-h6 text-weight-medium col-12 text-primary">Técnicas que serão utilizadas:</p>
            </div>

            <div class="row q-pl-md q-pr-md q-gutter-sm">
               <q-checkbox v-model="paciente.habilita_rpa"
                  label="Registro de Pensamentos/Emoções"
                  color="secondary"
                  disable
                  class="col-12" />
              <q-checkbox v-model="paciente.habilita_cartao_enfrentamento"
                  label="Cartões de Enfrentamento"
                  color="secondary"
                  class="col-12" />
              <q-checkbox v-model="paciente.habilita_plano_atividade"
                  label="Plano de Atividades"
                  color="secondary"
                  class="col-12" />
              <q-checkbox v-model="paciente.habilita_diario_sono"
                  label="Registro de Sono"
                  color="secondary"
                  class="col-12" />
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
             <q-btn color="secondary" class="q-pr-sm" label="Adicionar"
            rounded
            icon="save"
            @click="salvar()"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
  </div>
</template>

<script>

import api from '../../components/api/api'

export default {
  name: 'NovoPaciente',
  mixins: [api],
  data () {
    return {
      showNovoPacienteDialog: false,
      paciente: {
        nome: null,
        email: null,
        telefone: null,
        habilita_rpa: true,
        habilita_cartao_enfrentamento: false,
        habilita_plano_atividade: false,
        habilita_diario_sono: false
      }
    }
  },
  methods: {
    salvar () {
      this.$refs.nomeRef.validate()
      this.$refs.emailRef.validate()
      this.$refs.telefoneRef.validate()
      if (this.$refs.nomeRef.hasError || this.$refs.emailRef.hasError || this.$refs.telefoneRef.hasError) {
        this.$q.notify({
          message: 'Preencha os campos obrigatórios',
          position: 'top',
          color: 'negative'
        })
      } else if (this.paciente.habilita_rpa !== true &&
        this.paciente.habilita_cartao_enfrentamento !== true &&
        this.paciente.habilita_plano_atividade !== true &&
        this.paciente.habilita_diario_sonos !== true) {
        this.$q.notify({
          message: 'Selecione ao menos 1 Técnica',
          position: 'top',
          color: 'negative'
        })
      } else if (this.emailValido(this.paciente.email)) {
        // salvar novo contato e adicionar
        console.log('chamou acessar')
        const pacienteSalvar = {}
        pacienteSalvar.nome = this.paciente.nome
        pacienteSalvar.email = this.paciente.email
        pacienteSalvar.telefone = this.paciente.telefone
        pacienteSalvar.habilita_rpa = this.paciente.habilita_rpa
        pacienteSalvar.habilita_cartao_enfrentamento = this.paciente.habilita_cartao_enfrentamento
        pacienteSalvar.habilita_plano_atividade = this.paciente.habilita_plano_atividade
        pacienteSalvar.habilita_diario_sono = this.paciente.habilita_diario_sono

        const psicologoId = this.$q.localStorage.getItem('userId')
        pacienteSalvar.psicologoId = psicologoId
        this.post('/api/v1/psicologo/paciente', pacienteSalvar).then(response => {
          console.log(response.data)
          this.$q.notify({
            message: 'Paciente adicionado com Sucesso',
            position: 'top',
            color: 'info'
          })
          this.$emit('messageFromChild', 'abc', 22, 33)
          this.showNovoPacienteDialog = false
        }).catch(erro =>
          this.$q.notify({
            message: 'Ocorreu um erro, por favor tente novamente mais tarde.',
            position: 'top',
            color: 'negative'
          })
        )
      }
    },
    emailValido (emailParam) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      if (emailPattern.test(emailParam)) {
        // chamar serviço de validação
        return true
      } else {
        this.$q.notify({
          message: 'E-mail inválido (Exemplo: aaaa@aaaa.com',
          color: 'negative',
          position: 'top'
        })
        return false
      }
    },
    abrirModal () {
      this.showNovoPacienteDialog = true
    }

  }
}
</script>

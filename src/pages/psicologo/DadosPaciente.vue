<template>
  <div>
    <div v-show="paciente != null">
      <div class="row q-pa-md q-gutter-sm">
        <q-input v-model="paciente.nome" class="col-12" label="* Nome:"  ref="nomeRef" maxlength="100"
                :rules="[ val => val && val.length > 3 || 'Por favor preencha o Nome do paciente']"/>
        <q-input v-model="paciente.email" class="col-8" label="* E-mail:" ref="emailRef" maxlength="100"
              :rules="[ val => val && val.length > 3 || 'Por favor preencha o E-mail do paciente']"/>
        <q-input v-model="paciente.telefone" class="col-3" label="* Telefone" ref="telefoneRef" mask="(##) ####-#####"
              :rules="[ val => val && val.length > 3 || 'Por favor preencha o Telefone do paciente']"/>
        <q-banner v-show="paciente.ativo != true" inline-actions rounded class="q-mt-md bg-negative text-white col-12 text-center">
          ATENÇÃO: Paciente {{paciente.nome}} está INATIVO desde {{paciente.dt_exclusao}}
          <template v-slot:action>
            <q-btn flat @click="reativar" label="Reativar" />
          </template>
        </q-banner>
      </div>

      <div class="row q-pa-md q-gutter-sm" v-show="paciente.ativo">
        <p class="text-h6 text-weight-medium text-center col-12 text-primary">Técnicas Habilitadas:</p>
      </div>
      <div class="row q-gutter-sm q-ml-xl" v-show="paciente.ativo">
        <q-checkbox v-model="paciente.habilita_rpa"
            label="Registro de Pensamentos/Emoções"
            disable
            color="secondary"
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

        <div class="col-12 text-center q-ml-sm q-mr-sm">
          <q-btn color="secondary" label="Salvar Alterações"
            rounded
            icon="save"
            @click="salvarAlteracoes()"/>
        </div>

    </div>
  </div>
</template>

<script>

import api from '../../components/api/api'
export default {
  name: 'DadosPaciente',
  mixins: [api],
  data () {
    return {

    }
  },
  props: {
    paciente: { required: true },
    visualizandoPaciente: { required: true }
  },
  methods: {
    reativar () {
      this.$q.dialog({
        title: 'Confirmação',
        message: 'Confirma a reativação deste paciente?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.post('/api/v1/psicologo/reativarPaciente/' + this.paciente.id).then(response => {
          console.log('Reativado com sucesso: ' + response.data)
          this.paciente.ativo = true
          this.$q.notify({
            message: 'Paciente reativado!',
            position: 'top',
            color: 'info'
          })
        }).catch(erro =>
          this.$q.notify({
            message: 'Ocorreu um erro ao tentar reativar o paciente',
            color: 'negative'
          })
        )
      })
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
    salvarAlteracoes () {
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
        this.put('/api/v1/psicologo/paciente/alteraDados', this.paciente).then(response => {
          console.log(response.data)
          this.$q.notify({
            message: 'Paciente alterado com Sucesso',
            position: 'top',
            color: 'info'
          })
          this.$emit('messageFromChild', 'abc', 22, 33)
        }).catch(erro =>
          this.$q.notify({
            message: 'Ocorreu um erro, por favor tente novamente mais tarde.',
            position: 'top',
            color: 'negative'
          })
        )
      }
    }
  }
}
</script>

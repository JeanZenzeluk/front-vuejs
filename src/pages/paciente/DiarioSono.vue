<template>
  <q-page class="bg-grey-3 column">
     <q-icon name="keyboard_arrow_left" class="text-secondary q-ml-sm q-mt-sm" @click="voltar" style="font-size: 30px;"/>
     <div class="row q-pl-md q-pr-md q-pt-md q-mb-sm">
          <q-icon name="bedtime" class="text-primary q-mr-sm" style="font-size: 30px;"/>
          <p class="text-primary text-h6">Registro de Sono:</p>
    </div>
    <div class="row q-pl-md q-pr-md">

      <!-- DIA -->
       <q-input v-model="horaAtual" @click="abrirDialogDataAtual" ref="horaAtualRef"
        :rules="[ val => val && val.length > 9 || 'Por favor preencha o dia']" mask="##/##/####"
        filled class="col-12 q-mb-sm" label="* Dia: " />

      <!-- FOI DORMIR AS -->
        <template>
          <div class="col-12 q-mb-sm">
            <q-input filled v-model="horaDormiu" label="* Foi dormir às: " ref="horaDormiuRef" mask="##:##"
              :rules="[ val => val && val.length > 4 || 'Por favor descreva a hora que dormiu']">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="horaDormiu" mask="HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Ok" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
              <template v-slot:prepend>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="horaDormiu" mask="HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Ok" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </template>

        <!-- ACORDOU AS -->
        <template>
        <div class="col-12 q-mb-sm">
          <q-input filled v-model="horaAcordou" label="* Acordou às: " ref="acordouAsRef" mask="##:##"
              :rules="[ val => val && val.length > 4 || 'Por favor descreva a hora que acordou']">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="horaAcordou" mask="HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
            <template v-slot:prepend>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="horaAcordou" mask="HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
       </template>

       <!-- HORAS SEM DORMIR -->
       <template>
        <div class="col-12 q-mb-sm">
          <q-input
                    filled
                    v-model="tempoSemDormir"
                    label="Horas e Minutos sem dormir"
                    mask="##:##"
                    hint="Coloque um tempo aproximado"
                     ref="tempoSemDormirRef"
                    :rules="[ val => val && val.length > 4 || 'Por favor descreva quanto tempo ficou sem dormir']"
                  />
                  <!--
          <q-input filled v-model="tempoSemDormir" label="* Horas sem dormir (Aproximado): "
              ref="tempoSemDormirRef" mask="##:##"
              :rules="[ val => val && val.length > 4 || 'Por favor descreva quanto tempo ficou sem dormir']">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="tempoSemDormir" mask="HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
            <template v-slot:prepend>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="tempoSemDormir" mask="HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          -->
        </div>
      </template>

    </div>
    <div class="row q-mt-xl">
      <div class="col-12 text-center absolute-bottom q-ml-sm q-mr-sm q-mb-lg">
          <q-btn color="secondary" label="Registrar diário de Sono"
            rounded
            icon="save"
            @click="registrarDiarioSono()"/>
        </div>
    </div>

    <!-- Data atual -->
    <q-dialog
      v-model="dialogHoraAtual"
      full-height
      full-width
    >
      <q-date v-model="horaAtual" mask="DD/MM/YYYY">
      <div>
        <q-btn label="Selecionar" type="submit" color="primary" v-close-popup/>
      </div>
      </q-date>
    </q-dialog>
  </q-page>
</template>

<script>

import api from '../../components/api/api'
import { date } from 'quasar'
export default {
  mixins: [api],
  data () {
    return {
      dialogHoraAtual: false,
      tituloCartaoVisualizado: '',
      idAtividadeVisualizada: null,
      horaAtual: '20/11/2020',
      horaDormiu: null,
      horaAcordou: null,
      tempoSemDormir: null,
      atividades: [
        { label: 'Ir para a academia', valor: 3, id: 1, descricao: 'Tentar ir para a academia ao menos 4 vezes na semana.' },
        { label: 'Ler livro', valor: 2, id: 2, descricao: 'Ler ao menos 15 páginas cada vez.' },
        { label: 'Praticar meditação', valor: 6, id: 3, descricao: 'Praticar todos os dias por pelo menos 15 minutos.' },
        { label: 'Visitar um amigo pessoalmente', valor: 0, id: 4, descricao: 'Tente ir em algum lugar descontraído se possível, ou na própria casa do amigo.' }
      ],
      controlType: 'flat',
      descricaoAtividade: null
    }
  },
  methods: {
    registrarDiarioSono () {
      this.$refs.horaAtualRef.validate()
      this.$refs.horaDormiuRef.validate()
      this.$refs.acordouAsRef.validate()
      this.$refs.tempoSemDormirRef.validate()

      if (this.$refs.horaAtualRef.hasError || this.$refs.horaDormiuRef.hasError ||
        this.$refs.acordouAsRef.hasError || this.$refs.tempoSemDormirRef.hasError) {
        this.$q.notify({
          message: 'Preencha os campos obrigatórios',
          position: 'top',
          color: 'negative'
        })
      } else {
        console.log('chamou acessar')
        const diarioSalvar = {}
        diarioSalvar.dtHora = this.horaAtual
        diarioSalvar.horaFoiDormir = this.horaDormiu
        diarioSalvar.horaQueAcordou = this.horaAcordou
        diarioSalvar.tempoSemDormir = this.tempoSemDormir
        const pacienteId = this.$q.localStorage.getItem('pacienteId')
        diarioSalvar.pacienteId = pacienteId
        this.post('/api/v1/paciente/diarioSono', diarioSalvar).then(response => {
          this.$router.push('/paciente')
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
    voltar () {
      this.$router.push('/paciente')
    },
    limpaCampos () {
      this.horaAtual = null
      this.horaDormiu = null
      this.horaAcordou = null
      this.horaFoiDormir = null
      this.tempoSemDormir = null
      this.dtHora = null
    },
    selecionarAtividade (id) {
      this.descricaoAtividade = this.atividades[id - 1].descricao
      this.tituloCartaoVisualizado = this.atividades[id - 1].label
      this.idAtividadeVisualizada = id
      this.dialogDormiu = true
    },
    abrirDialogDataAtual () {
      this.dialogHoraAtual = true
    },
    marcarComoVisualizado () {
      this.atividades[this.idAtividadeVisualizada - 1].valor = this.atividades[this.idAtividadeVisualizada - 1].valor + 1
      this.$q.notify({
        message: 'Marcado com sucesso!',
        position: 'top',
        color: 'info'
      })
    }

  },
  async created () {
    const timeStamp = Date.now()
    const formattedString = date.formatDate(timeStamp, 'DD/MM/YYYY')
    this.horaAtual = formattedString
  }
}
</script>

<style lang="scss">
.size-descricao-atividade {
  font-size: 16px;
}
</style>

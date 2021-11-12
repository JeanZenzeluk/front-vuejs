<template>
  <q-page class="bg-grey-3 column">
    <q-icon name="keyboard_arrow_left" class="text-secondary q-ml-sm q-mt-sm" @click="voltar" style="font-size: 30px;"/>
    <div class="row q-pl-md q-pr-md q-pt-md">
          <q-icon name="directions_run" class="text-primary q-mr-sm" style="font-size: 30px;"/>
          <p class="text-primary text-h6">Suas Atividades:</p>
    </div>
    <div class="row q-pl-md q-pr-md">
       <q-list style="width: 100%;" class="bg-white q-mb-xl" bordered separator>
        <q-item clickable v-ripple v-for="item in atividades" :key="item.index" class="q-pa-md"
          @click="selecionarAtividade(item.index + 1)" v-show="item.ativo">
          <q-icon name="star_rate" class="text-grey-5 q-mr-sm" style="font-size: 25px;"/>
          <q-item-section>
            <q-item-label>{{item.label}}</q-item-label>
            <q-item-label caption>{{item.valor}} vezes realizadas (últimos 7 dias)</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="col-12 q-pl-md q-pr-md text-center" v-show="atividades.length === 0">
        <p class="text-grey text-h5">Sem Atividades Registradas </p>
      </div>
      <div class="col-12 text-center absolute-bottom q-ml-sm q-mb-sm">
        <q-btn color="secondary"  label="Voltar" class="q-mt-lg"
          rounded
          icon="reply"
          @click="voltar()"/>
      </div>
    </div>
    <q-dialog
      v-model="visualizarAtividade"
      full-height
      full-width
    >
      <q-card class="column full-height">
        <q-card-section class="row">
          <div class="text-h6 text-secondary">Atividade</div>
          <q-btn icon="close" class="absolute-right q-mr-sm" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="col text-primary">
          <p class="q-pt-none text-primary text-center text-h5 q-mt-md"> {{tituloCartaoVisualizado}}</p>
          <div class="q-mt-lg text-primary size-descricao-atividade">
            {{ descricaoAtividade }}
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-md q-pl-lg q-pr-lg">
          <q-btn color="secondary" class="text-center full-width q-ma-md" rounded label="Marcar como Realizado"
              v-close-popup
              @click="marcarComoVisualizado()"
              />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import api from '../../components/api/api'
export default {
  mixins: [api],
  data () {
    return {
      visualizarAtividade: false,
      tituloCartaoVisualizado: '',
      idAtividadeVisualizada: null,
      indexAtividadeVisualizada: null,
      dateee: '2019/02/01',
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
    voltar () {
      this.$router.push('/paciente')
    },
    selecionarAtividade (index) {
      this.descricaoAtividade = this.atividades[index - 1].descricao
      this.tituloCartaoVisualizado = this.atividades[index - 1].label
      this.idAtividadeVisualizada = this.atividades[index - 1].id
      this.indexAtividadeVisualizada = index
      this.visualizarAtividade = true
    },
    marcarComoVisualizado () {
      this.atividades[this.indexAtividadeVisualizada - 1].valor = this.atividades[this.indexAtividadeVisualizada - 1].valor + 1
      this.$q.notify({
        message: 'Marcado com sucesso!',
        position: 'top',
        color: 'info'
      })

      this.post('/api/v1/paciente/realizacaoAtividade/' + this.idAtividadeVisualizada).then(response => {
        this.slide = null
        this.ultimoSlide = null
        this.$q.notify({
          message: 'Marcado com sucesso!',
          position: 'top',
          color: 'info'
        })
      }).catch(erro =>
        this.$q.notify({
          message: 'Ocorreu um erro na busca das atividades',
          color: 'negative'
        })
      )
    }

  },
  async created () {
    const pacienteId = this.$q.localStorage.getItem('pacienteId')
    this.get('/api/v1/paciente/atividade/' + pacienteId).then(response => {
      console.log('sucesso: ' + response.data)
      this.atividades = []
      response.data.forEach((value, index) => {
        this.atividades.push({ label: value.titulo, valor: value.totalVisualizacaoesSeteDias, id: value.id, index: index, descricao: value.descricao, ativo: value.ativo })
        console.log(this.atividades)
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
</style>

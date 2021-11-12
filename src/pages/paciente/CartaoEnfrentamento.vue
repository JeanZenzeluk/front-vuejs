<template>
  <q-page class="bg-grey-3 column">
    <q-icon name="keyboard_arrow_left" class="text-secondary q-ml-sm q-mt-sm" @click="voltar" style="font-size: 30px;"/>
    <div class="row q-pl-md q-pr-md q-pt-md">
          <q-icon name="library_books" class="text-primary q-mr-sm" style="font-size: 30px;"/>
          <p class="text-primary text-h6">Cartões de Enfrentamento:</p>
    </div>
    <div class="row q-pl-md q-pr-md">
       <q-list style="width: 100%" class="bg-white q-mb-xl" bordered separator>
        <q-item clickable v-ripple v-for="item in cartoes" :key="item.id" class="q-pa-md"
          @click="selecionarCartao(item.id)" v-show="item.ativo">
          <q-icon name="remove_red_eye" class="text-grey-5 q-mr-sm" style="font-size: 25px;"/>
          <q-item-section>
            <q-item-label>{{item.label}}</q-item-label>
            <q-item-label caption>{{item.valor}} visualizações hoje</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="col-12 q-pl-md q-pr-md text-center" v-show="cartoes.length === 0">
        <p class="text-grey text-h5">Sem Cartões Registrados </p>
      </div>
      <div class="col-12 text-center absolute-bottom q-ml-sm q-mr-sm q-mb-sm">
        <q-btn color="secondary" label="Voltar"
          rounded
          icon="reply"
          @click="voltar()"/>
      </div>
    </div>
    <q-dialog
      v-model="visualizarCartao"
      full-height
      full-width
    >
      <q-card class="column full-height">
        <q-card-section class="row">
          <div class="text-h6 text-secondary">Cartão de Enfrentamento</div>
          <q-btn icon="close" class="absolute-right q-mr-sm" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="col text-primary text-weight-medium">
          <p class="q-pt-none text-primary text-center text-h5 q-mt-md"> {{tituloCartaoVisualizado}}</p>
          <div>
            <q-carousel
              v-model="slide"
              swipeable
              animated
              :control-type="controlType"
              control-color="primary"
              navigation
              padding
              arrows
              height="200px"
              class="text-secondary rounded-borders"
            >
              <q-carousel-slide v-for="item in cartaoItens" :key="item.value" :name="item.value" class="column no-wrap flex-center">
                <q-icon name="sticky_note_2" size="56px" />
                <div class="q-mt-md text-center text-primary">
                  {{ item.label }}
                </div>
              </q-carousel-slide>
            </q-carousel>
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-md q-pl-lg q-pr-lg">
          <q-btn v-show="ultimoSlide == slide" color="secondary" class="text-center full-width q-ma-md" label="Marcar como visualizado"
              v-close-popup rounded
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
      visualizarCartao: false,
      tituloCartaoVisualizado: '',
      idCartaoVisualizado: null,
      cartaoItens: [
        { label: 'Quero ter mais confiança', value: 1 },
        { label: 'Poderei usar roupas menores', value: 2 },
        { label: 'Minha autoestima vai melhorar', value: 3 },
        { label: 'Terei mais aceitação social', value: 4 },
        { label: 'Irei mais vezes a praia', value: 5 }
      ],
      cartoes: [
        { label: 'Por que quero emagrecer?', valor: 4, id: 1, cartaoItens: null },
        { label: 'Por que não comer besteira?', valor: 2, id: 2, cartaoItens: null },
        { label: 'Por que continuar naquele curso?', valor: 0, id: 3, cartaoItens: null },
        { label: 'Por que quero passar neste vestibular?', valor: 4, id: 4, cartaoItens: null }
      ],
      controlType: 'flat',
      slide: null,
      ultimoSlide: null,
      lorem: 'Lorem ipsum dolor, sit amet libero ab nemo.'
    }
  },
  methods: {
    voltar () {
      this.$router.push('/paciente')
    },
    selecionarCartao (id) {
      this.cartoes.forEach((cartao, index) => {
        if (cartao.id === id) {
          this.tituloCartaoVisualizado = cartao.label
          this.idCartaoVisualizado = id
          this.visualizarCartao = true
          this.slide = 1
          this.ultimoSlide = cartao.cartaoItens.length === 0 ? 1 : cartao.cartaoItens.length
          this.cartaoItens = []
          cartao.cartaoItens.forEach((value, index) => {
            this.cartaoItens.push({ label: value.descricao, value: index + 1 })
          })
        }
      })
    },
    marcarComoVisualizado () {
      this.post('/api/v1/paciente/visualisacaoCartao/' + this.idCartaoVisualizado).then(response => {
        this.slide = null
        this.ultimoSlide = null
        this.$q.notify({
          message: 'Marcado com sucesso!',
          position: 'top',
          color: 'info'
        })
        this.cartoes.forEach((value, index) => {
          if (value.id === this.idCartaoVisualizado) {
            value.valor++
          }
        })
      }).catch(erro =>
        this.$q.notify({
          message: 'Ocorreu um erro na busca dos cartões de enfrentamento',
          color: 'negative'
        })
      )
    }

  },
  async created () {
    const pacienteId = this.$q.localStorage.getItem('pacienteId')
    this.get('/api/v1/paciente/cartaoEnfrentamento/' + pacienteId).then(response => {
      console.log('sucesso: ' + response.data)
      this.cartoes = []
      response.data.forEach((value, index) => {
        this.cartoes.push({ label: value.titulo, ativo: value.ativo, valor: value.totalVisualizacaoesHoje, id: value.id, cartaoItens: value.cartaoItemList })
        console.log(this.cartoes)
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
</style>

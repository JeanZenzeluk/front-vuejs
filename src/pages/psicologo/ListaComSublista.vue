<template>
  <div>
        <q-list class="bg-white" separator bordered>
          <q-item v-for="(task, index) in itens" v-show="task.ativo"
            :key="task.title" v-ripple  class="cursor-pointer linha-selecionavel">
            <q-item-section @click=" openDialog(task.id, task.titulo, task.subItens)">
              <q-item-label class="text-primary">{{task.titulo}}
                <p class="text-blue-grey-4 q-mt-sm" v-if="showSubitem">
                {{task.subItens.length}} subitens</p>
              </q-item-label>
            </q-item-section>
            <q-item-section side dense v-if="showEditButton">
                <q-btn @click.stop="openDialog(task.id, task.titulo, task.subItens)" flat round color="info"
                icon="list"/>
            </q-item-section>
            <q-item-section side dense>
                <q-btn @click.stop="deleteTask(index, task.id)" flat round color="negative" icon="delete" />
            </q-item-section>
          </q-item>
        </q-list>
        <div v-if="!itens.length" class="no-itens">
          <div class="text-h5 text-primary text-center">
            Sem itens
          </div>
        </div>

    <q-dialog
      v-model="showDialog"
      full-width
      full-height
      persistent
      id="modalListaRemoveAddItem"
      >
       <q-card class="q-pa-md">
          <q-card-section class="q-pt-none">
            <div class="row q-pa-sm">
              <lista-remove-add-item :cartaoId="cartaoId" :itens="subItens" :titulo="tituloCartao" :iconName="iconName"/>
            </div>
          </q-card-section>
       </q-card>
    </q-dialog>

  </div>
</template>

<script>
import ListaRemoveAddItem from '../../pages/psicologo/ListaRemoveAddItem'
import api from '../../components/api/api'

export default {
  name: 'ListaComSublista',
  mixins: [api],
  data () {
    return {
      novoItem: '',
      showDialog: false,
      subItens: [],
      tituloCartao: '',
      cartaoId: null
    }
  },
  props: {
    itens: { required: true },
    iconName: { type: String, required: true },
    showEditButton: { type: Boolean },
    showSubitem: { type: Boolean }
  },
  components: {
    ListaRemoveAddItem
  },
  methods: {
    deleteTask (index, cartaoId) {
      this.$q.dialog({
        title: 'Confirmação',
        message: 'Deseja realmente remover este item?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.delete('/api/v1/psicologo/paciente/inativarCartao/' + cartaoId).then(response => {
          console.log('Excluido com sucesso: ' + response.data)
          this.$q.notify('Item deletado')
        }).catch(erro =>
          this.$q.notify({
            message: 'Ocorreu um erro na exclusão do item',
            color: 'negative'
          })
        )
        this.itens.splice(index, 1)
        this.$q.notify('Item deletado')
      })
    },
    additem () {
      if (this.novoItem) {
        this.itens.push({
          title: this.novoItem
        })
        this.novoItem = ''
      }
    },
    openDialog (id, titulo, subItens) {
      if (this.showEditButton) {
        this.showDialog = true
        this.subItens = subItens
        this.tituloCartao = titulo
        this.cartaoId = id
      }
    }
  }
}
</script>

<style lang="scss">
  .no-itens {
    opacity: 0.5;
  }
</style>

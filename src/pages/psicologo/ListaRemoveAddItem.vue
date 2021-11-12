<template>
  <div class="col">
      <q-space />
      <q-btn icon="close" class="float-right" flat round dense @click="modalSendoFechada()" v-close-popup/>
       <div class="text-h6 text-seco q-mt-md q-mb-md text-center text-primary">
         <q-icon :name="iconName" size="xl"/>
       </div>
      <div class="text-h6 text-seco q-mt-md q-mb-md text-center text-primary">{{titulo}}</div>
       <div class="q-pa-sm bg-secondary">
          <q-input
            square
            filled
            bg-color="white"
            v-model="novoItem"
            label="Adicionar item"
            @keyup.enter="additem"
            maxlength="65"
            dense>
            <template v-slot:append>
              <q-btn round dense flat icon="add" @click="additem"/>
            </template>
          </q-input>
        </div>
        <q-list class="bg-white" separator bordered>
          <q-item v-for="(task, index) in itens"
            :key="task.descricao" v-ripple class="text-primary">
            <q-item-section>
              <q-item-label>{{task.descricao}}</q-item-label>
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
  </div>
</template>

<script>
import api from '../../components/api/api'

export default {
  name: 'ListaRemoveAddItem',
  mixins: [api],
  data () {
    return {
      novoItem: ''
    }
  },
  props: {
    itens: { required: true },
    titulo: { required: true },
    iconName: { type: String, required: true },
    cartaoId: { required: true }
  },
  methods: {
    deleteTask (index, itemId) {
      this.$q.dialog({
        title: 'Confirmação',
        message: 'Deseja realmente remover este item?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.delete('/api/v1/psicologo/paciente/cartaoItem/' + itemId).then(response => {
          console.log('Excluido com sucesso: ' + response.data)
          this.$q.notify('Item deletado')
        }).catch(erro =>
          this.$q.notify({
            message: 'Ocorreu um erro na exclusão do paciente',
            color: 'negative'
          })
        )
        this.itens.splice(index, 1)
      })
    },
    additem () {
      if (this.novoItem) {
        const cartaoitemSalvar = {}
        cartaoitemSalvar.descricao = this.novoItem
        cartaoitemSalvar.cartaoId = this.cartaoId
        this.post('/api/v1/psicologo/paciente/novoCartaoItem', cartaoitemSalvar).then(response => {
          console.log(response.data)
          this.itens.push({
            id: response.data.id,
            descricao: response.data.descricao
          })
          this.$q.notify({
            message: 'Item de Cartão adicionado com Sucesso',
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
        // this.itens.push({
        //   descricao: this.novoItem
        // })
        this.novoItem = ''
      }
    },
    modalSendoFechada () {
      // Implementar salvamento dos itens
    }
  }
}
</script>

<style lang="scss">
  .no-itens {
    opacity: 0.5;
  }
</style>

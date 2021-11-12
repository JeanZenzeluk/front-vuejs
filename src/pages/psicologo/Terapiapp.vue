<template>
  <q-page class="bg-grey-3 column">
    <div class="row q-pa-sm bg-primary bg-secondary">
      <q-input
        class="col"
        square
        filled
        bg-color="white"
        v-model="novoPaciente"
        label="Adicionar paciente"
        @keyup.enter="addPaciente"
        dense>
        <template v-slot:append>
          <q-btn round dense flat icon="add" @click="addPaciente"/>
        </template>
      </q-input>
    </div>
    <q-list class="bg-white" separator bordered>
      <q-item v-for="(task, index) in tasks"
        @click="task.done = !task.done"
        clickable
        :key="task.title" v-ripple
        :class="{ 'done bg-blue-1' : task.done}">
        <q-item-section avatar>
          <q-checkbox v-model="task.done" val="teal" color="primary" class="no-pointer-events"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{task.title}}</q-item-label>
        </q-item-section>
          <q-item-section v-if="task.done" side dense>
            <q-btn @click.stop="deleteTask(index)" flat round color="primary" icon="delete" />
        </q-item-section>
      </q-item>
    </q-list>
    <div v-if="!tasks.length" class="no-tasks absolute-center">
      <q-icon name="check" size="100px" color="primary" />
      <div class="text-h5 text-primary text-center">
        Sem Pacientes
      </div>
    </div>
    <div class="absolute-bottom">
      <EnableNotifications :userToken='userToken'/>
    </div>
  </q-page>
</template>

<script>

import EnableNotifications from '../../components/EnableNotifications'

export default {
  data () {
    return {
      novoPaciente: '',
      alert: false,
      tasks: [
        // {
        //   title: 'Opção 1',
        //   done: false
        // },
        // {
        //   title: 'Opção 2',
        //   done: false
        // },
        // {
        //   title: 'Opção 3',
        //   done: false
        // }
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
</style>

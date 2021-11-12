<template>
  <q-page class="q-pa-lg">
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="dialog" position="top">
        <q-card style="width: 350px">

          <q-card-section class="row items-center no-wrap">
            <div>
              <div class="text-weight-bold center">Você já possui um Token!</div>
            </div>

            <q-space />

          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <h5 class="q-mt-none">Módulo de relatórios em desenvolvimento...</h5>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum similique
      illo tenetur voluptatibus at, asperiores facere temporibus, vel nesciunt
      ipsum doloremque dolorum! Animi debitis corrupti impedit eum, ratione
      magnam quam.
    </p>
    <div class="q-pa-md q-gutter-sm" v-show="userToken != null">
      <div class="text-center">
        <q-btn
          label="Visualizar seu token"
          class="text-center"
          icon="mail"
          color="secondary"
          @click="alert = true"
        />
      </div>
      <q-dialog v-model="alert">
        <q-card>
          <q-card-section>
            <div class="text-h6">Seu Token</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ userToken }}
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      userToken: null,
      alert: null,
      dialog: true
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

<template>
  <q-page class="q-pa-lg">

    <h5 class="q-mt-none text-primary">Ajuda / Suporte</h5>
    <div class="q-pl-xl q-mt-xl row">
       <div class="col-12 text-primary text-h5 text-weight-bold q-mb-md">
          Canais de atendimento:
      </div>
      <div class="col-4 q-mt-md">
        <q-icon name="mail" size="sm" class="text-secondary q-mb-sm"/>
        <div class="text-primary text-body1 text-weight-bold">
          E-mail
        </div>
        <div class="text-primary text-body1">
          suporte@terapiapp.com.br
        </div>
      </div>

      <div class="col-4 q-mt-md">
          <q-icon name="message" size="sm" class="text-secondary q-mb-sm"/>
          <div class="text-primary text-body1 text-weight-bold">
            WhatsApp
          </div>
          <div class="text-primary text-body1">
            <a href="https://wa.me/5542999516757" target="blank">
              (42) 99951-6757
            </a>
          </div>
      </div>

       <div class="col-3 q-mt-md">
        <q-icon name="local_phone" size="sm" class="text-secondary q-mb-sm"/>
        <div class="text-primary text-body1 text-weight-bold">
          Telefone
        </div>
        <div class="text-primary text-body1">
          (42) 99951-6757
        </div>
       </div>
    </div>

    <div class="row q-pa-xl q-mt-xl">
      <div class="text-primary text-h5 text-weight-bold q-mb-md">
          Dúvidas Frequentes:
      </div>
     <q-list bordered class="rounded-borders col-12">

       <q-expansion-item
        expand-separator
        icon="more_horiz"
        class="text-h6 text-primary"
        label="Como faço para cadastrar um novo Paciente?"
      >
        <q-card>
          <q-card-section class="text-body1">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
            commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
            eveniet doloribus ullam aliquid.
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        expand-separator
        icon="more_horiz"
        class="text-h6 text-primary"
        label="Uso a versão gratuita mas quero migrar para a conta Premium, como devo proceder?"
      >
        <q-card>
          <q-card-section class="text-body1">
            Para possuir a versão completa do TerapiApp basta mandar um e-mail para comercial@terapiapp.com.br, ou ligar para
            o telefone (42) 99951-6757 ou entrar
             em contato via WhatsApp clicando aqui:  <a class="q-mr-sm" href="https://wa.me/5542999516757" target="blank">
              Quero conversar via WhatsApp
            </a> :)
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item
        expand-separator
        icon="more_horiz"
        class="text-h6 text-primary"
        label="Onde acesso o histórico do Paciente?"
      >
        <q-card>
          <q-card-section class="text-body1">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
            commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
            eveniet doloribus ullam aliquid.
          </q-card-section>
        </q-card>
      </q-expansion-item>

    </q-list>
    </div>

  </q-page>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  async created () {

  }
}
</script>

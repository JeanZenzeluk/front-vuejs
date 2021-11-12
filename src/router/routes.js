
const routes = [
  {
    path: '/psicologo',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/psicologo/Pacientes.vue') },
      { path: '/ajuda', component: () => import('pages/psicologo/Ajuda.vue') },
      { path: '/relatorio', component: () => import('pages/psicologo/RelatorioPsicologo.vue') }
    ]
  },
  {
    path: '/paciente',
    component: () => import('layouts/MainLayoutPaciente.vue'),
    children: [
      { path: '/', component: () => import('pages/paciente/RegistroDePensamentos.vue') },
      { path: '/relatorioPaciente', component: () => import('pages/psicologo/Relatorio.vue') },
      { path: '/cartao', component: () => import('pages/paciente/CartaoEnfrentamento.vue') },
      { path: '/atividade', component: () => import('pages/paciente/Atividade.vue') },
      { path: '/sono', component: () => import('pages/paciente/DiarioSono.vue') },
      { path: '/relatorioPensamentos', component: () => import('pages/paciente/RelatorioPensamentos.vue') },
      { path: '/relatorioCartoes', component: () => import('pages/paciente/RelatorioCartoes.vue') },
      { path: '/relatorioAtividades', component: () => import('pages/paciente/RelatorioAtividades.vue') },
      { path: '/relatorioSono', component: () => import('pages/paciente/RelatorioSono.vue') },
      { path: '/instalar', component: () => import('pages/paciente/MenuInstalar.vue') },
      { path: '/permitirNotificacoes', component: () => import('pages/paciente/MenuNotificacoes.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('pages/Login.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

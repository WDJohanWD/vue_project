import { createRouter, createWebHistory } from 'vue-router'
import TablaUsuarios from '@/components/TablaUsuarios.vue'
import TablaContacto from '@/components/TablaContacto.vue'
import TablaEmpleo    from '@/components/TablaEmpleo.vue'
import NotFound from '@/components/NotFound.vue'
import AvisoLegal from '@/components/AvisoLegal.vue'
import PoliticaPrivacidad from '@/components/PoliticaPrivacidad.vue'
import TablaComentarios from '@/components/TablaComentarios.vue'
import TablaArticulos from '@/components/TablaArticulos.vue'
import TablaRegistro from '@/components/TablaRegistro.vue'
import TablaLogin from '@/components/TablaLogin.vue'
import TablaGestion from '@/components/TablaGestion.vue'
import PaginaInicio from '@/components/PaginaInicio.vue'
import TablaTienda from '@/components/TablaTienda.vue'
import TablaCarro from '@/components/TablaCarro.vue'

const routes = [
  {
    path: '/inicio',
    name: 'inicio',
    component: PaginaInicio,
  },
  {
    path: '/',
    name: 'gestion',
    component: TablaGestion,
    meta: {requiresAdmin: true}
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: TablaUsuarios,
    meta: {requiresAdmin: true}

  }, 
  {
    path: '/contacto',
    name: 'contacto',
    component: TablaContacto
  },
  {
    path: '/:pathMatch(.*)*',
    name:'NotFound',
    component: NotFound
  },
  {
    path: '/empleo',
    name: 'empleo',
    component: TablaEmpleo
  },
  {
    path: '/avisolegal',
    name: 'avisolegal',
    component: AvisoLegal
  },
  {
    path: '/privacidad',
    name: 'privacidad',
    component: PoliticaPrivacidad
  },

  {
    path:'/comentarios',
    name:'comentarios',
    component: TablaComentarios
  },
  {
    path: '/articulos',
    name: 'articulos',
    component: TablaArticulos
  },
  {
    path:'/registro',
    name:'registro',
    component: TablaRegistro
  },
  {
    path: '/login',
    name: 'login',
    component: TablaLogin
    
  },
  {
    path: '/tienda',
    name: 'tienda',
    component: TablaTienda
  },
  {
    path: '/cart',
    name: 'carro',
    component: TablaCarro
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isLogueado = localStorage.getItem('isLogueado') === 'true' || false;
  const isAdmin = localStorage.getItem('isAdmin') === 'true' || false;

  if (to.meta.requiresAdmin) {
      if (!isLogueado) {
          next({ name: 'login' });
      } else if (!isAdmin) {
          next({ name: 'contacto' }); // Ruta alternativa
      } else {
          next();
      }
  } else {
      next();
  }
});


export default router;


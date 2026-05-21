import Vue from 'vue';
import Router from 'vue-router';
import BaseConfig from './views/BaseConfig.vue';
import LabelRequest from './views/LabelRequest.vue';
import LabelManagement from './views/LabelManagement.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/base-config'
    },
    {
      path: '/base-config',
      name: 'BaseConfig',
      component: BaseConfig
    },
    {
      path: '/label-request',
      name: 'LabelRequest',
      component: LabelRequest
    },
    {
      path: '/label-management',
      name: 'LabelManagement',
      component: LabelManagement
    }
  ]
});

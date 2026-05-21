import Vue from 'vue';
import Router from 'vue-router';
import EnterpriseInfo from './views/EnterpriseInfo.vue';
import ProductTemplate from './views/ProductTemplate.vue';
import NameplateTemplate from './views/NameplateTemplate.vue';
import LabelRequest from './views/LabelRequest.vue';
import LabelManagement from './views/LabelManagement.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/base-config/enterprise-info'
    },
    {
      path: '/base-config',
      redirect: '/base-config/enterprise-info'
    },
    {
      path: '/base-config/enterprise-info',
      name: 'EnterpriseInfo',
      component: EnterpriseInfo
    },
    {
      path: '/base-config/product-template',
      name: 'ProductTemplate',
      component: ProductTemplate
    },
    {
      path: '/base-config/nameplate-template',
      name: 'NameplateTemplate',
      component: NameplateTemplate
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

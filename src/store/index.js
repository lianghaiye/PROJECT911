import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

function createLabelList(count) {
  const list = [];
  for (let i = 1; i <= count; i++) {
    list.push({
      id: i,
      productName: `工业产品 ${i}`,
      batchNumber: `BATCH-${1000 + i}`,
      labelCode: `IOT-${20260000 + i}`,
      qrCodeStatus: i % 3 === 0 ? '未生成' : '已生成',
      nameplateStatus: i % 4 === 0 ? '未打印' : '已打印',
      requestOrder: `REQ-${2000 + i}`,
      templateName: i % 2 === 0 ? '标准模板 A' : '定制模板 B',
      nameplateTemplate: i % 3 === 0 ? '铭牌模板 1' : '铭牌模板 2',
      labelStatus: i % 5 === 0 ? '待审核' : '已完成',
      registrationTime: `2026-05-${(i % 28) + 1}`
    });
  }
  return list;
}

export default new Vuex.Store({
  state: {
    baseConfigTabs: ['企业节点申请', '产品信息更新模板', '铭牌模板'],
    selectedBaseConfigTab: '企业节点申请',
    enterpriseInfo: {
      name: '',
      unifiedSocialCreditCode: '',
      address: '',
      contactPerson: '',
      contactPhone: ''
    },
    productTemplate: {
      name: '产品信息更新模板 A',
      fields: ['生产日期', '出厂检验人', '安装位置']
    },
    labelTemplate: {
      name: '铭牌模板 A',
      fields: ['产品名称', '生产批次号', '工业互联标识码']
    },
    labelRequests: [
      {
        id: 1,
        orderNumber: 'REQ-20260518-001',
        productName: '工业产品 A',
        productQuantity: 300,
        applyQuantity: 300,
        successQuantity: 300,
        applicant: '张工',
        applicationTime: '2026-05-18 09:30'
      },
      {
        id: 2,
        orderNumber: 'REQ-20260518-002',
        productName: '工业产品 B',
        productQuantity: 120,
        applyQuantity: 120,
        successQuantity: 115,
        applicant: '李工',
        applicationTime: '2026-05-18 11:10'
      }
    ],
    labelList: createLabelList(100)
  },
  mutations: {
    setSelectedBaseConfigTab(state, tab) {
      state.selectedBaseConfigTab = tab;
    },
    updateEnterpriseInfo(state, payload) {
      Object.assign(state.enterpriseInfo, payload);
    },
    saveProductTemplate(state, payload) {
      state.productTemplate = payload;
    },
    saveLabelTemplate(state, payload) {
      state.labelTemplate = payload;
    },
    addLabelRequest(state, payload) {
      state.labelRequests.unshift(payload);
    }
  },
  actions: {
    submitEnterpriseInfo({ commit }, payload) {
      commit('updateEnterpriseInfo', payload);
    },
    saveProductTemplate({ commit }, payload) {
      commit('saveProductTemplate', payload);
    },
    saveLabelTemplate({ commit }, payload) {
      commit('saveLabelTemplate', payload);
    },
    createLabelRequest({ commit, state }, payload) {
      const newRequest = {
        id: state.labelRequests.length + 1,
        orderNumber: `REQ-20260518-00${state.labelRequests.length + 1}`,
        productName: payload.productName,
        productQuantity: payload.productQuantity,
        applyQuantity: payload.applyQuantity,
        successQuantity: 0,
        applicant: payload.applicant,
        applicationTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };
      commit('addLabelRequest', newRequest);
    }
  }
});

<template>
  <div class="page-card">
    <div class="page-header">
      <h2>基础配置</h2>
      <small>管理企业节点申请、产品信息更新模板与铭牌模板</small>
    </div>

    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-button', { active: tab === activeTab }]"
        @click="setTab(tab)
      ">
        {{ tab }}
      </button>
    </div>

    <div class="panel">
      <div v-if="activeTab === '企业节点申请'">
        <h3>企业节点申请</h3>
        <form class="form-grid" @submit.prevent="submitEnterpriseInfo">
          <label>
            企业名称
            <input v-model="enterpriseInfo.name" placeholder="请输入企业名称" />
          </label>
          <label>
            统一社会信用代码
            <input v-model="enterpriseInfo.unifiedSocialCreditCode" placeholder="请输入信用代码" />
          </label>
          <label>
            企业地址
            <input v-model="enterpriseInfo.address" placeholder="请输入企业地址" />
          </label>
          <label>
            联系人
            <input v-model="enterpriseInfo.contactPerson" placeholder="请输入联系人" />
          </label>
          <label>
            联系电话
            <input v-model="enterpriseInfo.contactPhone" placeholder="请输入联系电话" />
          </label>
          <div class="form-actions">
            <button type="submit">提交申请</button>
          </div>
        </form>
      </div>

      <div v-if="activeTab === '产品信息更新模板'">
        <h3>产品信息更新模板</h3>
        <p>当前模板：{{ productTemplate.name }}</p>
        <div class="template-panel">
          <ul>
            <li v-for="(field, index) in productTemplate.fields" :key="index">{{ field }}</li>
          </ul>
          <div class="field-editor">
            <input v-model="newProductField" placeholder="新增字段名称" />
            <button @click="addProductField">添加字段</button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === '铭牌模板'">
        <h3>铭牌模板</h3>
        <p>当前模板：{{ labelTemplate.name }}</p>
        <div class="template-panel">
          <ul>
            <li v-for="(field, index) in labelTemplate.fields" :key="index">{{ field }}</li>
          </ul>
          <div class="field-editor">
            <input v-model="newLabelField" placeholder="新增字段名称" />
            <button @click="addLabelField">添加字段</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState(['baseConfigTabs', 'selectedBaseConfigTab', 'enterpriseInfo', 'productTemplate', 'labelTemplate']),
    tabs() {
      return this.baseConfigTabs;
    },
    activeTab() {
      return this.selectedBaseConfigTab;
    }
  },
  data() {
    return {
      newProductField: '',
      newLabelField: ''
    };
  },
  methods: {
    ...mapMutations(['setSelectedBaseConfigTab', 'updateEnterpriseInfo', 'saveProductTemplate', 'saveLabelTemplate']),
    setTab(tab) {
      this.setSelectedBaseConfigTab(tab);
    },
    submitEnterpriseInfo() {
      this.updateEnterpriseInfo({ ...this.enterpriseInfo });
      alert('企业节点申请信息已保存（示例）');
    },
    addProductField() {
      if (!this.newProductField.trim()) return;
      const newFields = [...this.productTemplate.fields, this.newProductField.trim()];
      this.saveProductTemplate({ ...this.productTemplate, fields: newFields });
      this.newProductField = '';
    },
    addLabelField() {
      if (!this.newLabelField.trim()) return;
      const newFields = [...this.labelTemplate.fields, this.newLabelField.trim()];
      this.saveLabelTemplate({ ...this.labelTemplate, fields: newFields });
      this.newLabelField = '';
    }
  }
};
</script>

<style scoped>
.page-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  padding: 24px;
}
.page-header h2 {
  margin: 0;
}
.page-header small {
  color: #666;
}
.tab-bar {
  display: flex;
  margin: 20px 0;
  flex-wrap: wrap;
}
.tab-button {
  border: 1px solid #d8e0eb;
  background: #f8fafc;
  color: #334155;
  padding: 10px 18px;
  margin-right: 12px;
  border-radius: 4px;
  cursor: pointer;
}
.tab-button.active {
  background: #1f5cb0;
  color: white;
  border-color: #1f5cb0;
}
.panel {
  margin-top: 16px;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(250px, 1fr));
  gap: 16px;
}
label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #334155;
}
input {
  margin-top: 8px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}
.form-actions {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
}
button {
  background: #1f5cb0;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  opacity: 0.95;
}
.template-panel {
  padding: 18px;
  border: 1px solid #edf2f7;
  border-radius: 6px;
  background: #f9fafb;
}
.template-panel ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}
.template-panel li {
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}
.template-panel li:last-child {
  border-bottom: none;
}
.field-editor {
  display: flex;
  gap: 12px;
}
.field-editor input {
  flex: 1;
}
</style>

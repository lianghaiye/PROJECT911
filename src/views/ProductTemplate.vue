<template>
  <div class="page-card">
    <div class="page-header">
      <h2>配置产品信息更新模板</h2>
      <small>管理产品信息更新模板的字段配置</small>
    </div>
    <p class="template-name">当前模板：{{ productTemplate.name }}</p>
    <div class="template-panel">
      <ul>
        <li v-for="(field, index) in productTemplate.fields" :key="index">
          <span class="field-name">{{ field }}</span>
          <button class="btn-remove" @click="removeField(index)">删除</button>
        </li>
      </ul>
      <div class="field-editor">
        <input v-model="newField" placeholder="新增字段名称" @keyup.enter="addField" />
        <button @click="addField">添加字段</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState(['productTemplate'])
  },
  data() {
    return {
      newField: ''
    };
  },
  methods: {
    ...mapMutations(['saveProductTemplate']),
    addField() {
      if (!this.newField.trim()) return;
      const newFields = [...this.productTemplate.fields, this.newField.trim()];
      this.saveProductTemplate({ ...this.productTemplate, fields: newFields });
      this.newField = '';
    },
    removeField(index) {
      const newFields = this.productTemplate.fields.filter((_, i) => i !== index);
      this.saveProductTemplate({ ...this.productTemplate, fields: newFields });
    }
  }
};
</script>

<style scoped>
.page-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}
.page-header h2 {
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 4px;
}
.page-header small {
  color: #6b7280;
  font-size: 13px;
}
.template-name {
  margin: 16px 0;
  font-weight: 500;
  color: #374151;
}
.template-panel {
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
}
.template-panel ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}
.template-panel li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}
.template-panel li:last-child {
  border-bottom: none;
}
.field-name {
  font-size: 14px;
  color: #374151;
}
.btn-remove {
  background: none;
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.btn-remove:hover {
  background: #fef2f2;
}
.field-editor {
  display: flex;
  gap: 12px;
}
.field-editor input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}
.field-editor button {
  background: #1890ff;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
</style>

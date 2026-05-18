<template>
  <div class="page-card">
    <div class="page-header">
      <div>
        <h2>标识管理</h2>
        <small>展示申请成功的标识，支持批量维护铭牌、导出和模板变更。</small>
      </div>
      <div class="page-actions">
        <button @click="openChangeTemplate">变更产品信息更新模板</button>
        <button @click="batchMaintainNameplates">批量维护铭牌</button>
        <button @click="exportLabels">批量导出标识</button>
      </div>
    </div>

    <table class="list-table">
      <thead>
        <tr>
          <th>产品名称</th>
          <th>批次号</th>
          <th>标识码</th>
          <th>二维码状态</th>
          <th>铭牌状态</th>
          <th>关联申请单号</th>
          <th>产品信息更新模板</th>
          <th>铭牌模板</th>
          <th>标识状态</th>
          <th>注册时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in labelList" :key="item.id">
          <td>{{ item.productName }}</td>
          <td>{{ item.batchNumber }}</td>
          <td>{{ item.labelCode }}</td>
          <td>{{ item.qrCodeStatus }}</td>
          <td>{{ item.nameplateStatus }}</td>
          <td>{{ item.requestOrder }}</td>
          <td>{{ item.templateName }}</td>
          <td>{{ item.nameplateTemplate }}</td>
          <td>{{ item.labelStatus }}</td>
          <td>{{ item.registrationTime }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="showTemplateModal" class="modal-mask">
      <div class="modal-dialog">
        <h3>变更产品信息更新模板（预留）</h3>
        <p>后续可拓展为选择模板并同步到当前批次号。</p>
        <button @click="closeTemplateModal">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['labelList'])
  },
  data() {
    return {
      showTemplateModal: false
    };
  },
  methods: {
    openChangeTemplate() {
      this.showTemplateModal = true;
    },
    closeTemplateModal() {
      this.showTemplateModal = false;
    },
    batchMaintainNameplates() {
      alert('批量维护铭牌功能已触发（示例）');
    },
    exportLabels() {
      alert('批量导出标识功能已触发（示例）');
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
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.page-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.page-actions button {
  min-width: 160px;
}
.list-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.list-table th,
.list-table td {
  border: 1px solid #e2e8f0;
  padding: 12px 10px;
  font-size: 13px;
}
.list-table th {
  background: #f8fafc;
  color: #1f2937;
}
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-dialog {
  width: 420px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}
.modal-dialog h3 {
  margin-top: 0;
}
.modal-dialog button {
  margin-top: 18px;
}
</style>

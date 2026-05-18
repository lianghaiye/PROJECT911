<template>
  <div class="page-card">
    <div class="page-header">
      <div>
        <h2>标识申请</h2>
        <small>管理标识申请单的主数据，支持新增申请、批量导出与下载二维码</small>
      </div>
      <button @click="openNewRequest">新增申请</button>
    </div>

    <table class="list-table">
      <thead>
        <tr>
          <th>申请单号</th>
          <th>产品名称</th>
          <th>产品数量</th>
          <th>申请数量</th>
          <th>成功数量</th>
          <th>申请人</th>
          <th>申请时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in labelRequests" :key="item.id">
          <td>{{ item.orderNumber }}</td>
          <td>{{ item.productName }}</td>
          <td>{{ item.productQuantity }}</td>
          <td>{{ item.applyQuantity }}</td>
          <td>{{ item.successQuantity }}</td>
          <td>{{ item.applicant }}</td>
          <td>{{ item.applicationTime }}</td>
        </tr>
      </tbody>
    </table>

    <div class="footer-actions">
      <button @click="exportRequests">批量导出标识</button>
      <button @click="downloadQRCodes">下载二维码</button>
    </div>

    <div v-if="showModal" class="modal-mask">
      <div class="modal-dialog">
        <h3>新增申请（预留功能）</h3>
        <p>该功能为预留弹窗，后续可扩展批量申请与表单输入。</p>
        <button @click="closeModal">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['labelRequests'])
  },
  data() {
    return {
      showModal: false
    };
  },
  methods: {
    openNewRequest() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    exportRequests() {
      alert('导出标识功能已触发（示例）');
    },
    downloadQRCodes() {
      alert('下载二维码功能已触发（示例）');
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
  align-items: center;
}
.page-header button {
  min-width: 140px;
}
.list-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.list-table th,
.list-table td {
  border: 1px solid #e2e8f0;
  padding: 14px 12px;
  text-align: left;
  font-size: 14px;
}
.list-table th {
  background: #f8fafc;
  color: #1f2937;
}
.footer-actions {
  margin-top: 18px;
  display: flex;
  gap: 12px;
}
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.32);
  display: flex;
  align-items: center;
  justify-content: center;
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

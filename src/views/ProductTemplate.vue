<template>
  <div class="app-root">
  <div class="page-wrapper">
    <!-- 列表视图 -->
    <template v-if="currentView === 'list'">
      <div class="page-card">
        <div class="page-header">
          <h2>基础配置</h2>
          <small>管理企业注册、产品模板与铭牌模板</small>
        </div>
        <div class="sub-tabs">
          <router-link to="/base-config/enterprise-info" class="sub-tab">企业信息</router-link>
          <router-link to="/base-config/product-template" class="sub-tab active">配置产品信息更新模板</router-link>
          <router-link to="/base-config/nameplate-template" class="sub-tab">配置铭牌模板</router-link>
        </div>

        <div class="toolbar">
          <div class="toolbar-left">
            <button class="btn btn-primary" @click="openCreateModal">+ 新增模板</button>
            <button class="btn btn-default" :disabled="selectedRows.length === 0" @click="batchEnable">启用</button>
            <button class="btn btn-default" :disabled="selectedRows.length === 0" @click="batchDisable">停用</button>
          </div>
          <div class="toolbar-right">
            <input v-model="searchKeyword" placeholder="请输入模板编码/名称搜索" class="search-input" @keyup.enter="search" />
            <button class="btn btn-default" @click="search">搜索</button>
          </div>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th width="50"><input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" /></th>
                <th width="80">模板状态</th>
                <th width="110">模板编码</th>
                <th width="180">模板名称</th>
                <th width="90">适用范围</th>
                <th width="130">适用对象</th>
                <th width="90">模板类型</th>
                <th width="80">字段数量</th>
                <th width="100">创建人</th>
                <th width="140">创建时间</th>
                <th width="100">更新人</th>
                <th width="140">更新时间</th>
                <th width="140" class="sticky-col">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tpl in filteredTemplates" :key="tpl.id">
                <td><input type="checkbox" :checked="selectedRows.includes(tpl.id)" @change="toggleRow(tpl.id)" /></td>
                <td>
                  <span class="status-tag" :class="tpl.status === '启用' ? 'status-on' : 'status-off'">
                    {{ tpl.status }}
                  </span>
                </td>
                <td><a class="code-link" @click="viewDetail(tpl)">{{ tpl.code }}</a></td>
                <td>{{ tpl.name }}</td>
                <td>
                  <span class="scope-tag">{{ tpl.scope }}</span>
                </td>
                <td>
                  <span class="object-tags" v-if="tpl.scopeType === 'single'">
                    <span class="obj-tag" v-for="(obj, i) in tpl.objects.slice(0, 2)" :key="i">{{ obj }}</span>
                    <span class="obj-more" v-if="tpl.objects.length > 2">+{{ tpl.objects.length - 2 }}</span>
                  </span>
                  <span class="object-tags" v-else>
                    <span class="obj-tag" v-for="(obj, i) in tpl.objects.slice(0, 2)" :key="i">{{ obj }}</span>
                    <span class="obj-more" v-if="tpl.objects.length > 2">+{{ tpl.objects.length - 2 }}</span>
                  </span>
                </td>
                <td><span class="type-tag">{{ tpl.type }}</span></td>
                <td>{{ tpl.fieldCount }}</td>
                <td>{{ tpl.creator }}</td>
                <td>{{ tpl.createTime }}</td>
                <td>{{ tpl.updater }}</td>
                <td>{{ tpl.updateTime }}</td>
                <td class="action-cell sticky-col">
                  <a class="action-link" @click="previewTemplate(tpl)">预览</a>
                  <a class="action-link" @click="editTemplate(tpl)">编辑</a>
                  <a class="action-link danger" @click="confirmDelete(tpl)">删除</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <span class="page-info">共 {{ filteredTemplates.length }} 条</span>
        </div>
      </div>
    </template>

    <!-- 详情视图 -->
    <template v-if="currentView === 'detail'">
      <div class="page-card">
        <div class="page-header">
          <h2>基础配置</h2>
          <small>管理企业注册、产品模板与铭牌模板</small>
        </div>
        <div class="sub-tabs">
          <router-link to="/base-config/enterprise-info" class="sub-tab">企业信息</router-link>
          <router-link to="/base-config/product-template" class="sub-tab active">配置产品信息更新模板</router-link>
          <router-link to="/base-config/nameplate-template" class="sub-tab">配置铭牌模板</router-link>
        </div>

        <div class="detail-header">
          <button class="btn btn-default" @click="currentView = 'list'">← 返回列表</button>
          <h3 class="detail-title">模板详情 - {{ detailTemplate.name }}</h3>
        </div>

        <div class="detail-content">
          <div class="detail-row">
            <span class="d-label">模板编码：</span><span class="d-value">{{ detailTemplate.code }}</span>
            <span class="d-label">模板状态：</span>
            <span class="status-tag" :class="detailTemplate.status === '启用' ? 'status-on' : 'status-off'">{{ detailTemplate.status }}</span>
          </div>
          <div class="detail-row">
            <span class="d-label">适用范围：</span><span class="d-value">{{ detailTemplate.scope }}</span>
            <span class="d-label">模板类型：</span><span class="d-value"><span class="type-tag">{{ detailTemplate.type }}</span></span>
          </div>
          <div class="detail-row">
            <span class="d-label">适用对象：</span>
            <span class="d-value">
              <span class="obj-tag" v-for="(obj, i) in detailTemplate.objects" :key="i" style="margin-right:6px">{{ obj }}</span>
            </span>
          </div>
          <div class="detail-row">
            <span class="d-label">创建人：</span><span class="d-value">{{ detailTemplate.creator }}</span>
            <span class="d-label">创建时间：</span><span class="d-value">{{ detailTemplate.createTime }}</span>
          </div>

          <div class="detail-section">
            <h4 class="detail-section-title">模板字段</h4>
            <table class="data-table">
              <thead>
                <tr>
                  <th width="60">序号</th>
                  <th width="120">字段编码</th>
                  <th width="130">字段名称</th>
                  <th width="100">字段类型</th>
                  <th width="100">字段格式</th>
                  <th width="60">必填</th>
                  <th>输入提示</th>
                  <th width="80">字符限制</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(f, idx) in detailTemplate.fields" :key="idx">
                  <td>{{ idx + 1 }}</td>
                  <td>{{ f.code }}</td>
                  <td>{{ f.name }}</td>
                  <td>{{ fieldTypeMap[f.type] || f.type }}</td>
                  <td>{{ f.format || '-' }}</td>
                  <td>{{ f.required ? '是' : '否' }}</td>
                  <td>{{ f.placeholder || '-' }}</td>
                  <td>{{ f.charLimit || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <!-- 模板预览侧边栏 -->
    <div v-if="previewVisible" class="preview-overlay" @click.self="closePreview">
      <div class="preview-panel">
        <div class="preview-panel-header">
          <h4>模板预览 - {{ previewTemplateData.name }}</h4>
          <button class="btn-close" @click="closePreview">✕</button>
        </div>
        <div class="preview-body">
          <div class="phone-frame">
            <div class="phone-notch"></div>
            <div class="phone-screen">
              <div class="phone-status-bar">
                <span class="phone-time">9:41</span>
                <span class="phone-icons">📶 🔋</span>
              </div>
              <div class="phone-title">{{ previewTemplateData.name }}</div>
              <div class="preview-form">
            <div v-for="(f, idx) in previewTemplateData.fields" :key="idx" class="preview-field">
              <label>
                {{ f.name }}
                <span v-if="f.required" class="required-star">*</span>
              </label>
              <template v-if="f.type === 'text'">
                <input type="text" disabled :placeholder="f.placeholder" class="preview-input" />
              </template>
              <template v-else-if="f.type === 'textarea'">
                <textarea disabled :placeholder="f.placeholder" class="preview-textarea" rows="3"></textarea>
              </template>
              <template v-else-if="f.type === 'number'">
                <input type="number" disabled :placeholder="f.placeholder" class="preview-input" />
              </template>
              <template v-else-if="f.type === 'date'">
                <input type="date" disabled class="preview-input" />
              </template>
              <template v-else-if="f.type === 'radio'">
                <div class="preview-options">
                  <label v-for="(opt, oi) in (f.options || [])" :key="oi" class="preview-radio">
                    <input type="radio" disabled :name="'preview_' + idx" /> {{ opt }}
                  </label>
                </div>
              </template>
              <template v-else-if="f.type === 'checkbox'">
                <div class="preview-options">
                  <label v-for="(opt, oi) in (f.options || [])" :key="oi" class="preview-check">
                    <input type="checkbox" disabled /> {{ opt }}
                  </label>
                </div>
              </template>
            </div>
            </div>
            </div>
            <div class="phone-home-bar"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ============ 新增/编辑模板弹窗 ============ -->
  <div v-if="createModalVisible" class="modal-overlay" @click.self="closeCreateModal">
    <div class="modal-card modal-lg">
      <div class="modal-header">
        <h3>{{ editingTemplate ? '编辑模板' : '新增模板' }}</h3>
        <button class="btn-close" @click="closeCreateModal">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <label class="form-label required">模板名称</label>
          <input v-model="createForm.name" class="form-input" placeholder="请输入模板名称" />
        </div>
        <div class="form-row">
          <label class="form-label required">适用范围</label>
          <div class="radio-group">
            <label class="radio-item" v-for="s in scopeOptions" :key="s.value">
              <input type="radio" v-model="createForm.scopeType" :value="s.value" />
              {{ s.label }}
            </label>
          </div>
        </div>

        <!-- 适用范围：单产品 → 搜索选择器 -->
        <div class="form-row" v-if="createForm.scopeType === 'single'">
          <label class="form-label required">适用对象</label>
          <div class="object-selector">
            <div class="selected-tags">
              <span class="selected-tag" v-for="(p, i) in createForm.objects" :key="i">
                {{ p }}
                <i class="tag-remove" @click="removeObject(i)">✕</i>
              </span>
            </div>
            <button class="btn btn-link" @click="openProductSelector">+ 选择适用对象</button>
          </div>
        </div>

        <!-- 适用范围：产品类别 → 下拉多选 -->
        <div class="form-row" v-if="createForm.scopeType === 'category'">
          <label class="form-label required">适用对象</label>
          <div class="category-selector">
            <div class="selected-tags">
              <span class="selected-tag" v-for="(c, i) in createForm.objects" :key="i">
                {{ c }}
                <i class="tag-remove" @click="removeObject(i)">✕</i>
              </span>
            </div>
            <div class="category-dropdown">
              <div class="dropdown-trigger" @click="showCategoryDropdown = !showCategoryDropdown">
                <span v-if="createForm.objects.length === 0" class="placeholder">请选择产品类别</span>
                <span v-else>已选 {{ createForm.objects.length }} 个类别</span>
                <span class="arrow">▾</span>
              </div>
              <div class="dropdown-menu" v-if="showCategoryDropdown">
                <label class="dropdown-item" v-for="cat in productCategories" :key="cat">
                  <input type="checkbox" :value="cat" v-model="createForm.objects" />
                  {{ cat }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 适用范围：全局 → 不显示适用对象 -->
        <div v-if="createForm.scopeType === 'global'" class="form-row">
          <label class="form-label">适用对象</label>
          <span class="form-hint">全局模板适用于所有产品</span>
        </div>

        <!-- 字段列表 -->
        <div class="fields-section">
          <div class="fields-header">
            <h4>模板字段</h4>
            <button class="btn btn-primary btn-sm" @click="openFieldModal(null)">+ 添加字段</button>
          </div>
          <table class="data-table mini" v-if="createForm.fields.length > 0">
            <thead>
              <tr>
                <th width="50">序号</th>
                <th width="100">字段编码</th>
                <th width="120">字段名称</th>
                <th width="90">字段类型</th>
                <th width="60">必填</th>
                <th>输入提示</th>
                <th width="140">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(f, idx) in createForm.fields" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ f.code }}</td>
                <td>{{ f.name }}</td>
                <td>{{ fieldTypeMap[f.type] || f.type }}</td>
                <td>{{ f.required ? '是' : '否' }}</td>
                <td>{{ f.placeholder || '-' }}</td>
                <td class="action-cell">
                  <a class="action-link" @click="openFieldModal(idx)">编辑</a>
                  <a class="action-link danger" @click="removeField(idx)">删除</a>
                  <a class="action-link" @click="moveField(idx, -1)">↑</a>
                  <a class="action-link" @click="moveField(idx, 1)">↓</a>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="empty-hint">暂无字段，请点击"添加字段"</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" @click="closeCreateModal">取消</button>
        <button class="btn btn-primary" @click="saveTemplate">保存</button>
      </div>
    </div>
  </div>

  <!-- ============ 添加/编辑字段弹窗 ============ -->
  <div v-if="fieldModalVisible" class="modal-overlay" @click.self="closeFieldModal">
    <div class="modal-card modal-md">
      <div class="modal-header">
        <h3>{{ editingFieldIndex !== null ? '编辑模板字段' : '新增模板字段' }}</h3>
        <button class="btn-close" @click="closeFieldModal">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <label class="form-label">字段编码</label>
          <input v-model="fieldForm.code" class="form-input" placeholder="请输入字段编码" />
        </div>
        <div class="form-row">
          <label class="form-label">字段名称</label>
          <input v-model="fieldForm.name" class="form-input" placeholder="请输入字段名称" />
        </div>
        <div class="form-row">
          <label class="form-label">字段类型</label>
          <select v-model="fieldForm.type" class="form-input" @change="onFieldTypeChange">
            <option value="">请选择</option>
            <option v-for="(label, val) in fieldTypeMap" :key="val" :value="val">{{ label }}</option>
          </select>
        </div>
        <div class="form-row">
          <label class="form-label">字段格式</label>
          <input v-model="fieldForm.format" class="form-input" placeholder="如：yyyy-MM-dd" />
        </div>
        <div class="form-row">
          <label class="form-label">是否必填</label>
          <div class="radio-group">
            <label class="radio-item"><input type="radio" v-model="fieldForm.required" :value="true" /> 是</label>
            <label class="radio-item"><input type="radio" v-model="fieldForm.required" :value="false" /> 否</label>
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">输入提示</label>
          <input v-model="fieldForm.placeholder" class="form-input" placeholder="请输入输入提示" />
        </div>

        <!-- 单选/多选 → 选项列表 -->
        <div class="form-row" v-if="fieldForm.type === 'radio' || fieldForm.type === 'checkbox'">
          <label class="form-label">选项列表</label>
          <div class="options-editor">
            <div class="option-row" v-for="(opt, i) in fieldForm.options" :key="i">
              <input v-model="fieldForm.options[i]" class="form-input" placeholder="选项值" />
              <button class="btn-icon" @click="fieldForm.options.splice(i, 1)">✕</button>
            </div>
            <button class="btn btn-link" @click="fieldForm.options.push('')">+ 添加选项</button>
          </div>
        </div>

        <!-- 默认值 -->
        <div class="form-row" v-if="fieldForm.type && fieldForm.type !== 'date'">
          <label class="form-label">默认值</label>
          <input v-if="fieldForm.type === 'text' || fieldForm.type === 'textarea' || fieldForm.type === 'number'" v-model="fieldForm.defaultValue" class="form-input" placeholder="请输入默认值" />
          <select v-else-if="fieldForm.type === 'radio' || fieldForm.type === 'checkbox'" v-model="fieldForm.defaultValue" class="form-input">
            <option value="">请选择</option>
            <option v-for="opt in fieldForm.options" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>

        <!-- 字符限制 -->
        <div class="form-row" v-if="fieldForm.type === 'text' || fieldForm.type === 'textarea'">
          <label class="form-label">字符限制</label>
          <input v-model.number="fieldForm.charLimit" class="form-input" type="number" placeholder="请输入最大字符数" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" @click="closeFieldModal">取消</button>
        <button class="btn btn-primary" @click="saveField">确定</button>
      </div>
    </div>
  </div>

  <!-- ============ 产品搜索选择弹窗 ============ -->
  <div v-if="productModalVisible" class="modal-overlay" @click.self="closeProductModal">
    <div class="modal-card modal-xl">
      <div class="modal-header">
        <h3>选择适用对象</h3>
        <button class="btn-close" @click="closeProductModal">✕</button>
      </div>
      <div class="modal-body">
        <div class="filter-bar">
          <div class="filter-item">
            <label>产品类别</label>
            <select v-model="productFilter.category" class="form-input">
              <option value="">全部</option>
              <option v-for="cat in productCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label>产品属性</label>
            <select v-model="productFilter.attr" class="form-input">
              <option value="">全部</option>
              <option value="成品">成品</option>
              <option value="半成品">半成品</option>
              <option value="原材料">原材料</option>
            </select>
          </div>
          <div class="filter-item">
            <label>产品名称</label>
            <input v-model="productFilter.name" class="form-input" placeholder="请输入" />
          </div>
          <div class="filter-item">
            <label>规格型号</label>
            <input v-model="productFilter.model" class="form-input" placeholder="请输入" />
          </div>
          <button class="btn btn-primary" @click="searchProducts">搜索</button>
        </div>

        <div class="selected-count">
          已选择 <strong>{{ tempSelectedProducts.length }}</strong> 个产品
        </div>

        <div class="product-grid">
          <div
            v-for="p in displayedProducts"
            :key="p.id"
            class="product-card"
            :class="{ selected: tempSelectedProducts.includes(p.id) }"
            @click="toggleProductSelection(p.id)"
          >
            <div class="product-check">
              <input type="checkbox" :checked="tempSelectedProducts.includes(p.id)" />
            </div>
            <div class="product-img">
              <span class="img-placeholder">📦</span>
            </div>
            <div class="product-info">
              <div class="product-name">{{ p.name }}</div>
              <div class="product-meta">{{ p.model }} | {{ p.category }}</div>
            </div>
          </div>
        </div>
        <p v-if="displayedProducts.length === 0" class="empty-hint">暂无匹配产品</p>
      </div>
      <div class="modal-footer">
        <span class="footer-tip">已选择 {{ tempSelectedProducts.length }} 个产品</span>
        <button class="btn btn-default" @click="closeProductModal">取消</button>
        <button class="btn btn-primary" @click="confirmProductSelection">确定</button>
      </div>
    </div>
  </div>

  <!-- ============ 删除确认弹窗 ============ -->
  <div v-if="deleteModalVisible" class="modal-overlay" @click.self="closeDeleteModal">
    <div class="modal-card modal-sm">
      <div class="modal-header">
        <h3>提示</h3>
        <button class="btn-close" @click="closeDeleteModal">✕</button>
      </div>
      <div class="modal-body" style="text-align:center">
        <div v-if="deleteTemplate && deleteTemplate.status === '启用'">
          <p class="delete-warn-icon">⚠️</p>
          <p class="delete-warn-text">该模板处于<strong>启用</strong>状态，无法删除！请先停用后再进行删除操作。</p>
        </div>
        <div v-else>
          <p class="delete-confirm-icon">⚠️</p>
          <p>确定要删除模板 <strong>"{{ deleteTemplate ? deleteTemplate.name : '' }}"</strong> 吗？删除后不可恢复。</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" @click="closeDeleteModal">取消</button>
        <button v-if="deleteTemplate && deleteTemplate.status !== '启用'" class="btn btn-danger" @click="doDelete">确认删除</button>
        <button v-else class="btn btn-primary" @click="closeDeleteModal">知道了</button>
      </div>
    </div>
  </div>

  <!-- ============ 批量启用/停用确认弹窗 ============ -->
  <div v-if="batchConfirmVisible" class="modal-overlay" @click.self="cancelBatchAction">
    <div class="modal-card modal-sm">
      <div class="modal-header">
        <h3>操作确认</h3>
        <button class="btn-close" @click="cancelBatchAction">✕</button>
      </div>
      <div class="modal-body" style="text-align:center">
        <p class="delete-confirm-icon">{{ batchActionType === 'enable' ? '✅' : '⏸️' }}</p>
        <p>确定要{{ batchActionType === 'enable' ? '启用' : '停用' }}已选择的 <strong>{{ selectedRows.length }}</strong> 个模板吗？</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" @click="cancelBatchAction">取消</button>
        <button class="btn btn-primary" @click="confirmBatchAction">确定</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentView: 'list',
      searchKeyword: '',
      selectedRows: [],
      // 预设模板列表
      templates: [
        {
          id: 'a1',
          code: 'TPL-SYS-001',
          name: '产品信息更新模板-基础版',
          status: '启用',
          scope: '单产品',
          scopeType: 'single',
          objects: ['智能水泵A1', '智能水泵B2', '智能水泵C3'],
          type: '系统预设',
          fieldCount: 5,
          creator: '系统管理员',
          createTime: '2025-01-15 10:30:00',
          updater: '系统管理员',
          updateTime: '2025-03-20 14:22:00',
          fields: [
            { code: 'product_name', name: '产品名称', type: 'text', format: '', required: true, placeholder: '请输入产品名称', charLimit: 50, options: [], defaultValue: '' },
            { code: 'model_no', name: '规格型号', type: 'text', format: '', required: true, placeholder: '请输入规格型号', charLimit: 30, options: [], defaultValue: '' },
            { code: 'category', name: '产品类别', type: 'radio', format: '', required: true, placeholder: '请选择产品类别', charLimit: null, options: ['水泵', '阀门', '电机', '控制器'], defaultValue: '' },
            { code: 'mfg_date', name: '生产日期', type: 'date', format: 'yyyy-MM-dd', required: true, placeholder: '请选择日期', charLimit: null, options: [], defaultValue: '' },
            { code: 'description', name: '产品描述', type: 'textarea', format: '', required: false, placeholder: '请输入产品描述', charLimit: 200, options: [], defaultValue: '' }
          ]
        },
        {
          id: 'a2',
          code: 'TPL-SYS-002',
          name: '产品信息更新模板-详细版',
          status: '启用',
          scope: '产品类别',
          scopeType: 'category',
          objects: ['水泵', '阀门'],
          type: '系统预设',
          fieldCount: 8,
          creator: '系统管理员',
          createTime: '2025-01-15 10:35:00',
          updater: '系统管理员',
          updateTime: '2025-04-10 09:15:00',
          fields: [
            { code: 'product_name', name: '产品名称', type: 'text', format: '', required: true, placeholder: '请输入产品名称', charLimit: 50, options: [], defaultValue: '' },
            { code: 'model_no', name: '规格型号', type: 'text', format: '', required: true, placeholder: '请输入规格型号', charLimit: 30, options: [], defaultValue: '' },
            { code: 'category', name: '产品类别', type: 'radio', format: '', required: true, placeholder: '请选择', charLimit: null, options: ['水泵', '阀门', '电机', '控制器'], defaultValue: '' },
            { code: 'material', name: '材质', type: 'checkbox', format: '', required: false, placeholder: '请选择材质', charLimit: null, options: ['不锈钢', '铸铁', '铜', '塑料'], defaultValue: '' },
            { code: 'weight', name: '重量(kg)', type: 'number', format: '0.00', required: false, placeholder: '请输入重量', charLimit: null, options: [], defaultValue: '' },
            { code: 'power', name: '功率(kW)', type: 'number', format: '0.00', required: false, placeholder: '请输入功率', charLimit: null, options: [], defaultValue: '' },
            { code: 'mfg_date', name: '生产日期', type: 'date', format: 'yyyy-MM-dd', required: true, placeholder: '请选择日期', charLimit: null, options: [], defaultValue: '' },
            { code: 'description', name: '产品描述', type: 'textarea', format: '', required: false, placeholder: '请输入', charLimit: 200, options: [], defaultValue: '' }
          ]
        },
        {
          id: 'a3',
          code: 'TPL-USR-001',
          name: '电机类产品模板',
          status: '停用',
          scope: '单产品',
          scopeType: 'single',
          objects: ['智能电机X1', '智能电机X2'],
          type: '用户自定义',
          fieldCount: 3,
          creator: '张三',
          createTime: '2025-05-08 16:20:00',
          updater: '张三',
          updateTime: '2025-05-10 11:30:00',
          fields: [
            { code: 'motor_type', name: '电机类型', type: 'radio', format: '', required: true, placeholder: '请选择', charLimit: null, options: ['直流电机', '交流电机', '步进电机', '伺服电机'], defaultValue: '' },
            { code: 'rpm', name: '转速(rpm)', type: 'number', format: '0', required: true, placeholder: '请输入转速', charLimit: null, options: [], defaultValue: '' },
            { code: 'voltage', name: '额定电压(V)', type: 'number', format: '0', required: true, placeholder: '请输入', charLimit: null, options: [], defaultValue: '' }
          ]
        }
      ],
      // 新增/编辑模板
      createModalVisible: false,
      editingTemplate: null,
      createForm: this.getEmptyCreateForm(),
      // 字段编辑
      fieldModalVisible: false,
      editingFieldIndex: null,
      fieldForm: this.getEmptyFieldForm(),
      // 产品选择器
      productModalVisible: false,
      productFilter: { category: '', attr: '', name: '', model: '' },
      tempSelectedProducts: [],
      showCategoryDropdown: false,
      // 预览
      previewVisible: false,
      previewTemplateData: {},
      // 详情
      detailTemplate: {},
      // 删除
      deleteModalVisible: false,
      deleteTemplate: null,
      // 批量启用/停用确认
      batchConfirmVisible: false,
      batchActionType: ''
    };
  },
  computed: {
    filteredTemplates() {
      if (!this.searchKeyword) return this.templates;
      const kw = this.searchKeyword.toLowerCase();
      return this.templates.filter(t =>
        t.code.toLowerCase().includes(kw) || t.name.toLowerCase().includes(kw)
      );
    },
    isAllSelected() {
      return this.filteredTemplates.length > 0 &&
        this.filteredTemplates.every(t => this.selectedRows.includes(t.id));
    },
    displayedProducts() {
      const all = this.allProducts;
      return all.filter(p => {
        if (this.productFilter.category && p.category !== this.productFilter.category) return false;
        if (this.productFilter.attr && p.attr !== this.productFilter.attr) return false;
        if (this.productFilter.name && !p.name.includes(this.productFilter.name)) return false;
        if (this.productFilter.model && !p.model.includes(this.productFilter.model)) return false;
        return true;
      });
    },
    allProducts() {
      return [
        { id: 'p1', name: '智能水泵A1', model: 'SP-A1-100', category: '水泵', attr: '成品' },
        { id: 'p2', name: '智能水泵B2', model: 'SP-B2-200', category: '水泵', attr: '成品' },
        { id: 'p3', name: '智能水泵C3', model: 'SP-C3-150', category: '水泵', attr: '半成品' },
        { id: 'p4', name: '电动阀门D1', model: 'EV-D1-050', category: '阀门', attr: '成品' },
        { id: 'p5', name: '电动阀门D2', model: 'EV-D2-080', category: '阀门', attr: '成品' },
        { id: 'p6', name: '智能电机X1', model: 'SM-X1-030', category: '电机', attr: '成品' },
        { id: 'p7', name: '智能电机X2', model: 'SM-X2-045', category: '电机', attr: '半成品' },
        { id: 'p8', name: '控制器Y1', model: 'CT-Y1-010', category: '控制器', attr: '成品' },
        { id: 'p9', name: '控制器Y2', model: 'CT-Y2-012', category: '控制器', attr: '原材料' },
        { id: 'p10', name: '水泵阀体Z1', model: 'VB-Z1-300', category: '水泵', attr: '原材料' }
      ];
    },
    productCategories() {
      return ['水泵', '阀门', '电机', '控制器', '管道', '仪表'];
    },
    scopeOptions() {
      return [
        { label: '全局', value: 'global' },
        { label: '单产品', value: 'single' },
        { label: '产品类别', value: 'category' }
      ];
    },
    fieldTypeMap() {
      return {
        text: '文本框',
        textarea: '文本域',
        number: '数字',
        date: '日期',
        radio: '单选',
        checkbox: '多选'
      };
    }
  },
  watch: {
    'createForm.scopeType'() {
      this.createForm.objects = [];
    }
  },
  methods: {
    // --- 列表操作 ---
    toggleSelectAll(e) {
      if (e.target.checked) {
        this.selectedRows = this.filteredTemplates.map(t => t.id);
      } else {
        this.selectedRows = [];
      }
    },
    toggleRow(id) {
      const idx = this.selectedRows.indexOf(id);
      if (idx >= 0) this.selectedRows.splice(idx, 1);
      else this.selectedRows.push(id);
    },
    search() {},
    batchEnable() {
      if (this.selectedRows.length === 0) return;
      this.batchActionType = 'enable';
      this.batchConfirmVisible = true;
    },
    batchDisable() {
      if (this.selectedRows.length === 0) return;
      this.batchActionType = 'disable';
      this.batchConfirmVisible = true;
    },
    confirmBatchAction() {
      this.selectedRows.forEach(id => {
        const t = this.templates.find(x => x.id === id);
        if (t) t.status = this.batchActionType === 'enable' ? '启用' : '停用';
      });
      this.selectedRows = [];
      this.batchConfirmVisible = false;
      this.batchActionType = '';
    },
    cancelBatchAction() {
      this.batchConfirmVisible = false;
      this.batchActionType = '';
    },

    // --- 新增/编辑模板 ---
    getEmptyCreateForm() {
      return {
        name: '',
        scopeType: 'single',
        objects: [],
        fields: []
      };
    },
    openCreateModal() {
      this.createForm = this.getEmptyCreateForm();
      this.editingTemplate = null;
      this.createModalVisible = true;
    },
    closeCreateModal() {
      this.createModalVisible = false;
      this.showCategoryDropdown = false;
    },
    editTemplate(tpl) {
      this.createForm = {
        name: tpl.name,
        scopeType: tpl.scopeType,
        objects: [...tpl.objects],
        fields: tpl.fields.map(f => ({ ...f, options: f.options ? [...f.options] : [] }))
      };
      this.editingTemplate = tpl;
      this.createModalVisible = true;
    },
    removeObject(index) {
      this.createForm.objects.splice(index, 1);
    },
    saveTemplate() {
      if (!this.createForm.name.trim()) {
        alert('请输入模板名称');
        return;
      }
      const now = this.getNow();
      if (this.editingTemplate) {
        const t = this.templates.find(x => x.id === this.editingTemplate.id);
        if (t) {
          t.name = this.createForm.name;
          t.scopeType = this.createForm.scopeType;
          t.scope = this.scopeOptions.find(s => s.value === this.createForm.scopeType).label;
          t.objects = [...this.createForm.objects];
          t.fields = this.createForm.fields.map(f => ({ ...f, options: f.options ? [...f.options] : [] }));
          t.fieldCount = t.fields.length;
          t.updater = '当前用户';
          t.updateTime = now;
        }
      } else {
        const id = 'tpl_' + Date.now();
        this.templates.push({
          id,
          code: 'TPL-USR-' + String(this.templates.length + 1).padStart(3, '0'),
          name: this.createForm.name,
          status: '停用',
          scope: this.scopeOptions.find(s => s.value === this.createForm.scopeType).label,
          scopeType: this.createForm.scopeType,
          objects: [...this.createForm.objects],
          type: '用户自定义',
          fieldCount: this.createForm.fields.length,
          creator: '当前用户',
          createTime: now,
          updater: '当前用户',
          updateTime: now,
          fields: this.createForm.fields.map(f => ({ ...f, options: f.options ? [...f.options] : [] }))
        });
      }
      this.closeCreateModal();
    },

    // --- 字段编辑 ---
    getEmptyFieldForm() {
      return {
        code: '',
        name: '',
        type: '',
        format: '',
        required: false,
        placeholder: '',
        options: [],
        defaultValue: '',
        charLimit: null
      };
    },
    openFieldModal(index) {
      this.editingFieldIndex = index;
      if (index !== null && this.createForm.fields[index]) {
        const f = this.createForm.fields[index];
        this.fieldForm = {
          code: f.code,
          name: f.name,
          type: f.type,
          format: f.format || '',
          required: f.required || false,
          placeholder: f.placeholder || '',
          options: f.options ? [...f.options] : [],
          defaultValue: f.defaultValue || '',
          charLimit: f.charLimit || null
        };
      } else {
        this.fieldForm = this.getEmptyFieldForm();
      }
      this.fieldModalVisible = true;
    },
    closeFieldModal() {
      this.fieldModalVisible = false;
      this.editingFieldIndex = null;
    },
    onFieldTypeChange() {
      this.fieldForm.options = [];
      this.fieldForm.defaultValue = '';
      this.fieldForm.charLimit = null;
    },
    saveField() {
      if (!this.fieldForm.name.trim()) {
        alert('请输入字段名称');
        return;
      }
      const field = {
        code: this.fieldForm.code || ('field_' + Date.now()),
        name: this.fieldForm.name,
        type: this.fieldForm.type || 'text',
        format: this.fieldForm.format,
        required: !!this.fieldForm.required,
        placeholder: this.fieldForm.placeholder,
        options: this.fieldForm.options ? [...this.fieldForm.options].filter(o => o.trim()) : [],
        defaultValue: this.fieldForm.defaultValue,
        charLimit: this.fieldForm.charLimit
      };
      if (this.editingFieldIndex !== null) {
        this.$set(this.createForm.fields, this.editingFieldIndex, field);
      } else {
        this.createForm.fields.push(field);
      }
      this.closeFieldModal();
    },
    removeField(index) {
      this.createForm.fields.splice(index, 1);
    },
    moveField(index, direction) {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= this.createForm.fields.length) return;
      const temp = this.createForm.fields[index];
      this.$set(this.createForm.fields, index, this.createForm.fields[newIndex]);
      this.$set(this.createForm.fields, newIndex, temp);
    },

    // --- 产品选择器 ---
    openProductSelector() {
      this.productFilter = { category: '', attr: '', name: '', model: '' };
      this.tempSelectedProducts = this.allProducts
        .filter(p => this.createForm.objects.includes(p.name))
        .map(p => p.id);
      this.productModalVisible = true;
    },
    closeProductModal() {
      this.productModalVisible = false;
    },
    searchProducts() {},
    toggleProductSelection(productId) {
      const idx = this.tempSelectedProducts.indexOf(productId);
      if (idx >= 0) this.tempSelectedProducts.splice(idx, 1);
      else this.tempSelectedProducts.push(productId);
    },
    confirmProductSelection() {
      const selectedNames = this.allProducts
        .filter(p => this.tempSelectedProducts.includes(p.id))
        .map(p => p.name);
      // 合并去重
      const current = new Set(this.createForm.objects);
      selectedNames.forEach(n => current.add(n));
      this.createForm.objects = [...current];
      this.closeProductModal();
    },

    // --- 预览 ---
    previewTemplate(tpl) {
      this.previewTemplateData = tpl;
      this.previewVisible = true;
    },
    closePreview() {
      this.previewVisible = false;
    },

    // --- 详情 ---
    viewDetail(tpl) {
      this.detailTemplate = tpl;
      this.currentView = 'detail';
    },

    // --- 删除 ---
    confirmDelete(tpl) {
      this.deleteTemplate = tpl;
      this.deleteModalVisible = true;
    },
    closeDeleteModal() {
      this.deleteModalVisible = false;
      this.deleteTemplate = null;
    },
    doDelete() {
      const idx = this.templates.indexOf(this.deleteTemplate);
      if (idx >= 0) this.templates.splice(idx, 1);
      this.closeDeleteModal();
    },

    getNow() {
      const d = new Date();
      const pad = n => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
  }
};
</script>

<style scoped>
/* ---- 通用 ---- */
.page-wrapper {
  height: 100%;
}

.page-card {
  background: #fff;
  border-radius: 8px;
}
.page-header {
  padding: 24px 24px 0;
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

.sub-tabs {
  display: flex;
  padding: 16px 24px 0;
  border-bottom: 1px solid #e5e7eb;
}
.sub-tab {
  padding: 10px 20px;
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.2s;
}
.sub-tab:hover {
  color: #1890ff;
}
.sub-tab.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
  font-weight: 500;
}

/* ---- 工具栏 ---- */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  gap: 16px;
}
.toolbar-left {
  display: flex;
  gap: 8px;
}
.search-input {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  width: 200px;
}

/* ---- 按钮 ---- */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.btn-primary {
  background: #1890ff;
  color: #fff;
  border-color: #1890ff;
}
.btn-primary:hover {
  background: #096dd9;
}
.btn-default {
  background: #fff;
  color: #374151;
  border-color: #d1d5db;
}
.btn-default:hover {
  border-color: #1890ff;
  color: #1890ff;
}
.btn-default:disabled {
  color: #d1d5db;
  cursor: not-allowed;
}
.btn-danger {
  background: #dc2626;
  color: #fff;
  border-color: #dc2626;
}
.btn-danger:hover {
  background: #b91c1c;
}
.btn-sm {
  padding: 4px 12px;
  font-size: 12px;
}
.btn-link {
  background: none;
  border: none;
  color: #1890ff;
  padding: 0;
  font-size: 13px;
  cursor: pointer;
}
.btn-link:hover {
  color: #096dd9;
}
.btn-icon {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  color: #dc2626;
}
.btn-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
}
.btn-close:hover {
  color: #374151;
}

/* ---- 表格 ---- */
.table-wrap {
  overflow-x: auto;
  padding: 0 24px 16px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.data-table th, .data-table td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}
.data-table th {
  background: #fafafa;
  color: #6b7280;
  font-weight: 500;
  position: sticky;
  top: 0;
}
.data-table.mini {
  font-size: 12px;
}
.data-table.mini th, .data-table.mini td {
  padding: 6px 8px;
}

/* ---- 标签 ---- */
.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
}
.status-on {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}
.status-off {
  background: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}
.scope-tag {
  display: inline-block;
  padding: 2px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 3px;
  font-size: 12px;
}
.type-tag {
  color: #722ed1;
  background: #f9f0ff;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
}
.object-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.obj-tag {
  background: #f0f5ff;
  color: #2f54eb;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
}
.obj-more {
  background: #fafafa;
  color: #8c8c8c;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
}

/* ---- 操作列 ---- */
.action-cell {
  white-space: nowrap;
}
.action-link {
  color: #1890ff;
  cursor: pointer;
  margin-right: 8px;
  font-size: 13px;
  text-decoration: none;
}
.action-link:hover {
  color: #096dd9;
}
.action-link.danger {
  color: #dc2626;
}
.code-link {
  color: #1890ff;
  cursor: pointer;
  text-decoration: underline;
}
.code-link:hover {
  color: #096dd9;
}

/* ---- 分页 ---- */
.pagination {
  padding: 12px 24px;
  text-align: right;
}
.page-info {
  font-size: 13px;
  color: #6b7280;
}

/* ---- 空状态 ---- */
.empty-hint {
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
  padding: 24px;
}

/* ---- 弹窗通用 ---- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}
.modal-card {
  background: #fff;
  border-radius: 8px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}
.modal-lg { width: 800px; }
.modal-md { width: 520px; }
.modal-sm { width: 420px; }
.modal-xl { width: 860px; }
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}
.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}
.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border-top: 1px solid #e5e7eb;
}
.footer-tip {
  flex: 1;
  font-size: 13px;
  color: #6b7280;
}

/* ---- 表单通用 ---- */
.form-row {
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
}
.form-label {
  width: 90px;
  flex-shrink: 0;
  padding-top: 7px;
  font-size: 13px;
  color: #374151;
}
.form-label.required::before {
  content: '*';
  color: #dc2626;
  margin-right: 4px;
}
.form-input {
  flex: 1;
  padding: 7px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  color: #1f2937;
}
.form-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24,144,255,0.1);
}
.form-hint {
  padding-top: 7px;
  font-size: 13px;
  color: #9ca3af;
}
.radio-group {
  display: flex;
  gap: 16px;
  padding-top: 2px;
}
.radio-item {
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}
.radio-item input {
  margin-right: 4px;
  accent-color: #1890ff;
}

/* ---- 适用对象选择器 ---- */
.object-selector {
  flex: 1;
}
.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
  min-height: 28px;
}
.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #f0f5ff;
  color: #2f54eb;
  border-radius: 3px;
  font-size: 12px;
}
.tag-remove {
  cursor: pointer;
  font-style: normal;
  font-size: 11px;
  color: #8c8c8c;
}
.tag-remove:hover {
  color: #dc2626;
}

.category-selector {
  flex: 1;
}
.category-dropdown {
  position: relative;
}
.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  background: #fff;
}
.dropdown-trigger .placeholder {
  color: #9ca3af;
}
.dropdown-trigger .arrow {
  font-size: 12px;
  color: #6b7280;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-height: 180px;
  overflow-y: auto;
  z-index: 10;
  margin-top: 4px;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f0f7ff;
}
.dropdown-item input {
  accent-color: #1890ff;
}

/* ---- 字段区域 ---- */
.fields-section {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  background: #fafbfc;
}
.fields-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.fields-header h4 {
  font-size: 14px;
  color: #1f2937;
  margin: 0;
}

/* ---- 选项编辑 ---- */
.options-editor {
  flex: 1;
}
.option-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

/* ---- 产品选择弹窗 ---- */
.filter-bar {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.filter-item label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}
.filter-item .form-input {
  width: 140px;
}
.selected-count {
  font-size: 13px;
  color: #374151;
  margin-bottom: 12px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  max-height: 360px;
  overflow-y: auto;
}
.product-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}
.product-card:hover {
  border-color: #1890ff;
}
.product-card.selected {
  border-color: #1890ff;
  background: #f0f7ff;
}
.product-check {
  margin-bottom: 6px;
}
.product-check input {
  accent-color: #1890ff;
}
.product-img {
  text-align: center;
  margin-bottom: 6px;
}
.img-placeholder {
  font-size: 32px;
}
.product-info {
  text-align: center;
}
.product-name {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}
.product-meta {
  font-size: 11px;
  color: #9ca3af;
}

/* ---- 预览侧边栏 ---- */
.preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 999;
  display: flex;
  justify-content: flex-end;
}
.preview-panel {
  width: 520px;
  background: #f0f2f5;
  height: 100vh;
  display: flex;
  flex-direction: column;
  animation: slideRight 0.3s ease;
  box-shadow: -4px 0 16px rgba(0,0,0,0.1);
}
.preview-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}
.preview-panel-header h4 {
  font-size: 15px;
  margin: 0;
  color: #1f2937;
}
.preview-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
.preview-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.preview-field label {
  display: block;
  font-size: 13px;
  color: #374151;
  margin-bottom: 6px;
  font-weight: 500;
}
.preview-field .required-star {
  color: #dc2626;
  margin-left: 2px;
}
.preview-input {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 13px;
  background: #fafafa;
  color: #9ca3af;
}
.preview-textarea {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 13px;
  background: #fafafa;
  color: #9ca3af;
  resize: vertical;
  font-family: inherit;
}
.preview-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.preview-radio, .preview-check {
  font-size: 13px;
  color: #9ca3af;
}

/* ---- 手机外框 ---- */
.phone-frame {
  width: 280px;
  margin: 0 auto;
  background: #fff;
  border-radius: 28px;
  border: 3px solid #1f2937;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
.phone-notch {
  width: 80px;
  height: 20px;
  background: #1f2937;
  border-radius: 0 0 14px 14px;
  margin: 0 auto;
}
.phone-screen {
  padding: 8px 16px 16px;
  min-height: 320px;
  max-height: 480px;
  overflow-y: auto;
}
.phone-status-bar {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #1f2937;
  padding: 4px 0 8px;
}
.phone-time {
  font-weight: 600;
}
.phone-title {
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}
.phone-home-bar {
  width: 100px;
  height: 4px;
  background: #1f2937;
  border-radius: 2px;
  margin: 8px auto;
}

/* ---- sticky 操作列 ---- */
.data-table th.sticky-col,
.data-table td.sticky-col {
  position: sticky;
  right: 0;
  background: #fff;
  z-index: 1;
  box-shadow: -2px 0 4px rgba(0,0,0,0.06);
}
.data-table th.sticky-col {
  z-index: 2;
  background: #fafafa;
}

/* ---- 详情页 ---- */
.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}
.detail-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}
.detail-content {
  padding: 24px;
}
.detail-row {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.d-label {
  font-size: 13px;
  color: #6b7280;
}
.d-value {
  font-size: 13px;
  color: #1f2937;
}
.detail-section {
  margin-top: 24px;
}
.detail-section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px;
  padding-left: 10px;
  border-left: 3px solid #1890ff;
}

/* ---- 删除弹窗 ---- */
.delete-warn-icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.delete-warn-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}
.delete-confirm-icon {
  font-size: 36px;
  color: #faad14;
  margin-bottom: 8px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes slideRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style>

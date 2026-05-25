<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-icon">🏭</div>
        <div class="logo-text">工业互联标识管理</div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-group">
          <div
            class="nav-item parent"
            :class="{ active: isBaseConfigActive, expanded: baseConfigExpanded }"
            @click="toggleBaseConfig"
          >
            <span class="nav-icon">⚙️</span>
            <span class="nav-label">基础配置</span>
            <span class="nav-arrow">{{ baseConfigExpanded ? '▾' : '▸' }}</span>
          </div>
          <div v-show="baseConfigExpanded" class="nav-children">
            <router-link
              to="/base-config/enterprise-info"
              class="nav-item child"
              :class="{ active: $route.path === '/base-config/enterprise-info' }"
            >
              企业信息
            </router-link>
            <router-link
              to="/base-config/product-template"
              class="nav-item child"
              :class="{ active: $route.path === '/base-config/product-template' }"
            >
              配置产品信息更新模板
            </router-link>
            <router-link
              to="/base-config/nameplate-template"
              class="nav-item child"
              :class="{ active: $route.path === '/base-config/nameplate-template' }"
            >
              配置铭牌模板
            </router-link>
          </div>
        </div>
        <router-link to="/label-request" class="nav-item" active-class="active">
          <span class="nav-icon">📋</span>
          <span class="nav-label">标识申请</span>
        </router-link>
        <router-link to="/label-management" class="nav-item" active-class="active">
          <span class="nav-icon">📊</span>
          <span class="nav-label">标识管理</span>
        </router-link>
      </nav>
    </aside>
    <main class="content-area">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseConfigExpanded: true
    };
  },
  computed: {
    isBaseConfigActive() {
      return this.$route.path.startsWith('/base-config');
    }
  },
  methods: {
    toggleBaseConfig() {
      this.baseConfigExpanded = !this.baseConfigExpanded;
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  background: #f0f2f5;
}
.app-shell {
  display: flex;
  align-items: flex-start;
  min-height: 100vh;
}
.sidebar {
  width: 220px;
  background: #001529;
  color: #fff;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.sidebar-header {
  padding: 20px 16px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.logo-icon {
  font-size: 24px;
  margin-bottom: 4px;
}
.logo-text {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}
.sidebar-nav {
  padding: 8px 0;
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.nav-item:hover {
  color: #fff;
  background: rgba(255,255,255,0.08);
}
.nav-item.active {
  color: #fff;
  background: #1890ff;
}
.nav-item.parent.active:not(.expanded) {
  background: rgba(24,144,255,0.3);
}
.nav-icon {
  margin-right: 10px;
  font-size: 16px;
}
.nav-label {
  flex: 1;
}
.nav-arrow {
  font-size: 12px;
  margin-left: auto;
}
.nav-children {
  background: rgba(0,0,0,0.15);
}
.nav-item.child {
  padding-left: 48px;
  font-size: 13px;
}
.nav-item.child.active {
  background: #1890ff;
}
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  min-width: 0;
}
</style>

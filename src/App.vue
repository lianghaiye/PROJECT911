<template>
  <div class="app-shell">
    <header class="top-bar">
      <div class="brand">工业互联标识管理</div>
      <nav class="top-nav">
        <router-link to="/base-config" exact-active-class="active">基础配置</router-link>
        <router-link to="/label-request" exact-active-class="active">标识申请</router-link>
        <router-link to="/label-management" exact-active-class="active">标识管理</router-link>
      </nav>
    </header>
    <main class="content-area">
      <router-view />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  background: #f2f4f7;
}
.app-shell {
  min-height: 100vh;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #1f5cb0;
  color: white;
}
.brand {
  font-size: 18px;
  font-weight: 600;
}
.top-nav a {
  color: rgba(255, 255, 255, 0.85);
  margin-left: 24px;
  text-decoration: none;
}
.top-nav a.active,
.top-nav a:hover {
  color: #ffffff;
}
.content-area {
  padding: 24px;
}
</style>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Vue } from 'vue-property-decorator';

export default class app extends Vue {
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: PingFangSC-Semibold, PingFang SC;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

body .el-input__inner {
  border: none!important;
}

.el-checkbox__input.is-checked+.el-checkbox__label {
  color: #666 !important;
}
</style>

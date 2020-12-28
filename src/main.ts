
import Vue from 'vue'
import App from './App.vue'
import router from './router'

import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'//css
// import md5 from 'js-md5/src/md5.js';
import x2js from 'x2js'

import axios from 'axios'
import qs from 'qs'


// const service = require('./utils/request.js')
// // import service from './utils/request.js';

import service from './utils/request';

import constant from './utils/public-res'

Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$path = constant;
Vue.prototype.$request = service;
// Vue.prototype.$md5 = md5;
// Vue.prototype.$X2js = new x2js();

Vue.prototype.$refreshToken = function () {
  console.log('执行')
  service.get('/api/h5/sign/refreshToken')
      .then((res: any) => {
        if (res.code == "00000000") {
          console.log('------ 刷新tokenok ------');
          const token = res.data;
          localStorage.setItem('token', token);
          store.commit('setToken', token);
        }
        else {
          console.log('------ 刷新token操作失败 ------');
        }
      })
}

Vue.config.productionTip = false
Vue.use(Element)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

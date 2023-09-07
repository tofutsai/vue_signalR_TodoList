import Vue from 'vue'
import App from './App.vue'

//引入store
import store from './store/index.js'
import PG from "./store/plugin.js";
import VueRouter from 'vue-router'
//引入路由器
import router from './router/index'
//引入Vuetify
//import Vuetify from "vuetify";
import vuetify from "./plugins/vuetify";
//引入signalR
import signalr from "./store/signalR.js";
//引入elementUI組件庫
import ElementUI from 'element-ui';
//引入elementUI全部樣式
import 'element-ui/lib/theme-chalk/index.css';

//使用signalR
Vue.use(signalr);
//Vue.use(Vuetify);
//阻止vue在啟動時生成生產提示
Vue.config.productionTip = false
//應用elementUI
Vue.use(ElementUI);

//使用插件
Vue.use(VueRouter)
Vue.mixin(PG.mixin); //Vue.mixin 表示用於全域

 new Vue({ 
  render: h => h(App),
  store,
  router,
  vuetify,
  PG
}).$mount('#app')



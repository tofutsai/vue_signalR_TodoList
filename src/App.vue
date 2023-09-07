<template>
  <div>
    <Count/>
    <hr>
    <Person/>
    <hr>
    <div class="row">
        <Banner/>
    </div>
    <div class="row">
      <div class="col-xs-2 col-xs-offset-2">
        <div class="list-group"> 
          
          <!-- 原始html中使用a標籤實現頁面的跳轉 -->
          <!-- <a class="list-group-item active" href="./About.html">About</a>
          <a class="list-group-item" href="./Home.html">Home</a> -->

          <!-- Vue中借助router-link標籤實現路由的切換 -->
          <router-link class="list-group-item" active-class="active" to="/about">About</router-link>
          <router-link class="list-group-item" active-class="active" to="/home">Home</router-link>
          <!-- <router-link class="list-group-item" active-class="active" to="/signalr">SingalR</router-link>
          <router-link class="list-group-item" active-class="active" to="/signalrCenter">客服中心</router-link> -->
        </div>
      </div>
      <div class="col-xs-6">
        <!-- <div class="panel">
          <div class="panel-body">
            
          </div>
        </div> -->
        <!-- 指定組件呈現位置 -->
            <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Count from './components/Count.vue'
import Person from './components/Person.vue'
import Banner from './components/Banner.vue'

export default {
  name: 'App',
  components: {
    Count,
    Person,
    Banner
  },
  mounted(){
    //console.log(this);
  }
}
</script>

<style>

</style>

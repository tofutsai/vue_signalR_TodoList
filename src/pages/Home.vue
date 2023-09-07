<template>
  <div>
    <h2>我是Home內容</h2>
    <div>
      <ul class="nav nav-tabs">
        <li>
          <router-link class="list-group-item"  active-class="active" to="/home/news">News</router-link>
        </li>
        <li>
          <router-link class="list-group-item"  active-class="active" to="/home/message">Message</router-link>
        </li>
      </ul>
      <!--  緩存多個路由組件寫法
      <keep-alive :include="['News', 'Message']"></keep-alive> -->
      <!-- 組件緩存加上<keep-alive>標籤 緩存1個路由組件寫法 include內要寫組件名 -->
      <keep-alive include="News">
        <router-view></router-view>
      </keep-alive>
      
    </div>
  </div>
  
</template>

<script>
    export default {
        name:'Home'
    }
</script>

<template>
  <ul>
    <!-- <li>消息編號:{{$route.query.id}}</li>
    <li>消息標題:{{$route.query.title}}</li> -->
    <!-- <li>消息編號:{{$route.params.id}}</li>
    <li>消息標題:{{$route.params.title}}</li> -->
    <li>消息編號:{{id}}</li>
    <li>消息標題:{{title}}</li>
  </ul>
</template>

<script>
    export default {
        name:'Detail',
        props:['id', 'title'],
        mounted(){
            console.log(this.$route);
        }
    }
</script>

<style>

</style>
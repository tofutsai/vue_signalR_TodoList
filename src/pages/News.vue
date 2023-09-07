<template>
  <ul>
    <li :style={opacity}>歡迎學習Vue</li>
    <li>news001 <input type="text"></li>
    <li>news002 <input type="text"></li>
    <li>news003 <input type="text"></li>
  </ul>
  
</template>

<script>
  export default {
    name:'News',
    data(){
      return {
        opacity:1,
      }
    },
    /* beforeDestory(){
       clearInterval(this.timer);
     },
     mounted(){
       this.timer = setInterval(() =>{
         this.opacity -= 0.01
         if(this.opacity <= 0){
           this.opacity = 1
         }
       }, 16)
     }*/
     //路由組件所獨有的兩個生命週期鉤子，用於捕獲路由組件激活狀態
     activated(){
      console.log('News組件被激活了')
        this.timer = setInterval(() =>{
          console.log('@')
           this.opacity -= 0.01
           if(this.opacity <= 0){
             this.opacity = 1
           }
         }, 16)
     },
     deactivated(){
      console.log('News組件失活了')
        clearInterval(this.timer);
     }

  }
</script>

<style>

</style>
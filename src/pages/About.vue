<template>
<div>
    <h2>我是About內容</h2>
    <button>原生的按鈕</button>
    <input type="text">
    <el-row>
        <el-button>默认按钮</el-button>
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
    </el-row>
    <el-date-picker
      type="date"
      placeholder="选择日期">
    </el-date-picker>
    <el-row>
        <el-button icon="el-icon-search" circle></el-button>
        <el-button type="primary" icon="el-icon-edit" circle></el-button>
        <el-button type="success" icon="el-icon-check" circle></el-button>
        <el-button type="info" icon="el-icon-message" circle></el-button>
        <el-button type="warning" icon="el-icon-star-off" circle></el-button>
        <el-button type="danger" icon="el-icon-delete" circle></el-button>
    </el-row>
</div>
  
</template>

<script>
    export default {
        name:'About',
        mounted(){
          //console.log('%%', this.$route);
        },
        //通過路由規則，進入該組件時被調用
        beforeRouteEnter (to, from, next){
          console.log('APP--beforeRouteEnter', to, from)
          if(to.meta.isAuth){//判斷是否需要鑒權
              if(localStorage.getItem('school') === '尚硅谷'){
                  next();
              }else{
                  alert('學校名不對，無權限查看!');
              }
          }else{
              next();
          }
              },
        //通過路由規則，離開該組件時被調用
        beforeRouteLeave (to, from, next){
            console.log('APP--beforeRouteLeave', to, from)
            next();
        }
    }
</script>

<template>
    <div class="col-xs-offset-2 col-xs-8">
        <div class="page-header"><h2>Vue Router Demo</h2></div>
        <button @click="back">後退</button>
        <button @click="forward">前進</button>
        <button @click="testgo">測試一下go</button>
    </div>
</template>

<script>
    export default {
        name:'Banner',
        methods:{
            back(){
                this.$router.back();
            },
            forward(){
                this.$router.forward();
            },
            testgo(){
                this.$router.go(3); //傳入數字可前進可後退
            }
        }
    }
</script>

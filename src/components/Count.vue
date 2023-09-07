<template>
  <div>
    <h1>當前求和為:{{ sum }}</h1>
    <h3>當前求和放大10倍為:{{ bigSum }}</h3>
    <h3>我在{{school}},學習{{subject}}</h3>
    <h3 style="color: red">Person組件的總人數是:{{personList.length}}</h3>
    <select v-model.number="n">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
    </select>
    <!-- mapActions與mapMutations使用時，若需要傳遞參數，需要在模板中綁定是件時傳遞好參數，
    否則參數是事件對象 -->
    <button @click="increment(n)">+</button>
    <button @click="decrement(n)">-</button>
    <button @click="incrementOdd(n)">當前求和為奇數再加</button>
    <button @click="incrementWait(n)">等一等再加</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions} from 'vuex';
export default {
    name:'Count',
    data(){
        return{
            n:1,//用戶選擇的數字
            
        }
    },
    computed:{
        //借助mapState生成計算屬性,從state中讀取數據(對象寫法)
        //...mapState({he:'sum', xuexiao:'school', xueke:'subject'})
        //借助mapState生成計算屬性,從state中讀取數據(數組寫法)，計算屬性與state的數據同名
        //...mapState(['sum','school','subject', 'personList']),
        ...mapState('countAbout',['sum','school','subject']),
        ...mapState('personAbout',['personList']),
        /* *********************************************** */
        // bigSum(){
        //     return this.$store.getters.bigSum;
        // },
        //借助mapGetters生成計算屬性,從getters中讀取數據(對象寫法)
        // ...mapGetters({bigSum: 'bigSum'}),
        //借助mapGetters生成計算屬性,從getters中讀取數據(數組寫法)
        ...mapGetters('countAbout',['bigSum'])
        
    },
    methods:{
        //程序員親自寫方法
        // increment(){
        //    this.$store.commit('ADD', this.n)
        // },
        // decrement(){
        //     this.$store.commit('SUBTRACT', this.n)
        // },

        //借助mapMutations生成對應的方法,方法中會調用commit去聯繫mutations(對象寫法)
        ...mapMutations('countAbout',{increment:'ADD', decrement:'SUBTRACT'}),
        //借助mapMutations生成對應的方法,方法中會調用commit去聯繫mutations(數組寫法)
        //...mapMutations(['ADD', 'SUBTRACT']),

        /* ******************************************* */
        //程序員親自寫方法
        // incrementOdd(){
        //     this.$store.dispatch('addOdd', this.n)
        // },
        // incrementWait(){
        //      this.$store.dispatch('addWait', this.n);
        // }

        //借助mapActions生成對應的方法,方法中會調用dispatch去聯繫actions(對象寫法)
        ...mapActions('countAbout',{incrementOdd:'addOdd', incrementWait:'addWait'}),
        //借助mapActions生成對應的方法,方法中會調用dispatch去聯繫actions(數組寫法)
        // ...mapActions(['addOdd','addWait'])

    },
    mounted(){
        console.log(this.$store);
    }
}
</script>

<style>
    button{
        margin-left: 5px;
    }
</style>
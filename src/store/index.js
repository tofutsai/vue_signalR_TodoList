//該文件用於創建Vuex中最為核心的store
import Vue from 'vue';
//引入Vuex
import Vuex from 'vuex';
//引入chat.js
import chat from './chat.js'
//使用Vuex插件
Vue.use(Vuex);

//求和相關配置
const countOptions = {
    namespaced:true, // 模塊化配置命名空間,預設為false
    actions:{
        addOdd(context, value){
            if(context.state.sum % 2){
                context.commit('ADD', value);
            }
        },
        addWait(context, value){
           setTimeout(()=>{
                context.commit('ADD', value);
           },500);
        },
    },
    mutations:{
        ADD(state, value){
            console.log('mutations中ADD被調用了', value);
            state.sum += value;
        },
        SUBTRACT(state, value){
            console.log('mutations中SUBTRACT被調用了', value);
            state.sum -= value;
        },
    },
    state:{
        sum:0,//當前的和
        school:'尚硅谷',
        subject:'前端',
    },
    getters:{
        bigSum(state){
            return state.sum*10;
        }
    }
}

//人員管理相關配置
const personOptions = {
    namespaced:true,
    actions:{
        addPersonWang(context, value){
            if(value.name.indexOf('王') === 0){
                context.commit('ADD_PERSON', value);
            }else{
                alert('添加的人必須姓王!')
            }
        }
    },
    mutations:{
        ADD_PERSON(state, value){
            console.log('mutations中ADD_PERSON被調用了', value);
            state.personList.unshift(value);
        }
    },
    state:{
        personList:[
            {id:'001', name:'張三'}
        ]
    },
    getters:{
        firstPersonName(state){
            return state.personList[0].name;
        }
    }
}

//準備actions--用於響應組件中的動作
// const actions= {
//     //context 為上下文之意
//     // add(context, value){
//     //     context.commit('ADD', value);
//     // },
//     // subtract(context, value){
//     //     context.commit('SUBTRACT', value);
//     // },
//     //context 為上下文之意
//     addOdd(context, value){
//         if(context.state.sum % 2){
//             context.commit('ADD', value);
//         }
//     },
//     addWait(context, value){
//        setTimeout(()=>{
//             context.commit('ADD', value);
//        },500);
//     },
// }
// //準備mutations--用於操作數據(state)
// const mutations= {
//     ADD(state, value){
//         console.log('mutations中ADD被調用了', value);
//         state.sum += value;
//     },
//     SUBTRACT(state, value){
//         console.log('mutations中SUBTRACT被調用了', value);
//         state.sum -= value;
//     },
//     ADD_PERSON(state, value){
//         console.log('mutations中ADD_PERSON被調用了', value);
//         state.personList.unshift(value);
//     }
// }
// //準備state--用於存儲數據
// const state= {
//     sum:0,//當前的和
//     school:'尚硅谷',
//     subject:'前端',
//     personList:[
//         {id:'001', name:'張三'}
//     ]
// }
// //準備getters--用於將state中的數據進行加工
// const getters = {
//     bigSum(state){
//         return state.sum*10;
//     }
// }

//創建並暴露store
export default new Vuex.Store({
    modules:{
        countAbout:countOptions,
        personAbout:personOptions,
        chat
    }
});


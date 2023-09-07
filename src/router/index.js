//該文件專門用於創建整個應用的路由器
import VueRouter from "vue-router";

//引入組件
import About from '../pages/About'
import Home from '../pages/Home'
import News from '../pages/News'
import Message from '../pages/Message'
import Detail from '../pages/Detail'
import signalr from '../components/SignalR'
import signalrCenter from '../components/SignalRCenter'
import count from '../components/Count'

//創建並暴露一個路由器
const router = new VueRouter({
    mode:'history',
    routes:[
        {
            name:'About',
            path:'/about',
            component:About,
            meta:{isAuth:true, title:'關於'}
        },
        {
            name:'Home',
            path:'/home',
            component:Home,
            meta:{title:'主頁'},
            children:[
                {
                    name:'News',
                    path:'news',
                    component:News,
                    meta:{isAuth:true, title:'新聞'}, // meta屬性內可以放置自定義屬性
                    //獨享路由
                    // beforeEnter: (to, from, next) =>{
                    //     console.log('獨享路由守衛',to,from);
                    //     if(to.meta.isAuth){//判斷是否需要鑒權
                    //         if(localStorage.getItem('school') === '尚硅谷'){
                    //             next();
                    //         }else{
                    //             alert('學校名不對，無權限查看!');
                    //         }
                    //     }else{
                    //         next();
                    //     }
                    // }
                },
                {
                    name:'Message',
                    path:'message',
                    component:Message,
                    meta:{isAuth:true, title:'消息'},
                    children:[
                        {
                            name:'Detail',
                            path:'detail',
                            component:Detail,
                            meta:{isAuth:true, title:'詳情'},
                            //params的寫法(使用佔位符聲明接收params參數)
                            //path:'detail/:id/:title'
                            //props的第一種寫法，值為對象，該對象中的所有key-value都會以props形式傳給detail組件用
                            //props:{a:1,b:'hello'}

                            //props的第二種寫法，值為布林值，若為true，就會把該路由組件收到的所有params參數，以props的形式傳給Detail組件
                            //props:true,
                            
                            //props的第三種寫法，值為函數，會接收$route參數
                            props($route){
                                return{
                                    id:$route.query.id,
                                    title:$route.query.title
                                }
                            }
                        }
                        
                    ]
                },
            ]
        },
        {
            path:'/signalr',
            component:signalr
        },
        {
            path:'/signalrCenter',
            component:signalrCenter
        },
        {
            path:'/count',
            component:count
        }
    ]
})

//全局前置路由守衛---初始化的時候被調用、每次路由切換之前被調用
// router.beforeEach((to,from,next) =>{
//     console.log('前置路由守衛',to,from);
    
//     if(to.meta.isAuth){//判斷是否需要鑒權
//         if(localStorage.getItem('school') === '尚硅谷'){
//             next();
//         }else{
//             alert('學校名不對，無權限查看!');
//         }
//     }else{
//         next();
//     }
// });
//全局後置路由守衛---初始化的時候被調用、每次路由切換之後被調用
router.afterEach((to,from)=>{
    console.log('後置路由守衛',to,from);
    document.title = to.meta.title || '系統';
})

export default router
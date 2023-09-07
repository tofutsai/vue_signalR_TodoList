import axiosAPI from "./axiosAPI.js";
import PG from "./plugin.js";


const actions = {
    //儲存對話內容
    addChat(context, value){
        axiosAPI.instance
      .post("/Chat", value)
      .then((res) => {

      })
      .catch((error) => {
        console.log("error", error);
      });
    },
    async addChatImage(context, value){
       await axiosAPI.instanceForm
      .post("/Chat/Image", value)
      .then((res) => {
        if(res.data.Code == 200){
            context.commit('ADDCHATIMAGE', res.data.Data);
        }
        
      })
      .catch((error) => {
        console.log("error", error);

      });
    },
    //獲取聊天對象列表
    getChatMemberList(context, value){
        axiosAPI.instance.get(`/Chat/list?keyword=${value}`)
        .then((res) => {
            if(res.data.Code == 200){
                context.commit('GETCHATMEMBERLIST', res.data.Data);
            }
            else{
                context.commit('GETCHATMEMBERLIST', 0);
            }
            
        })
        .catch((error) => {
            console.log("error", error);
          });
    },
    //獲取特定聊天對象的聊天內容
    getChatMemberRecords(context, value){
        axiosAPI.instance.get(`/Chat/${value.chatRoomId}?type=${value.type}`)
        .then((res) => {
            if(res.data.Code == 200){
                context.commit('GETCHATMEMBERRECORDS', res.data.Data);
            }
        })
        .catch((error) => {
            console.log("error", error);
          });
    },
    //取得成員聊天未讀訊息數量
    getNotReadChatCount(context, value){
        axiosAPI.instance.get(`/Chat/notRead/${value}`)
        .then((res) => {
            if(res.data.Code == 200){
                context.commit('GETNOTREADCHATCOUNT', res.data.Data);
            }
            else{
                context.commit('GETNOTREADCHATCOUNT', 0);
            }
        })
        .catch((error) => {
            console.log("error", error);
          });
    }
};

const mutations = {
    //獲取聊天對象列表
    GETCHATMEMBERLIST(state, value){
        if(value != 0){
            value.forEach(element => {
                element.time = PG.getTime(element.time);
            });
            state.memberList = value;
        }
        else{
            state.memberList = [];
        }
    },
    //獲取聊天紀錄
    GETCHATMEMBERRECORDS(state, value){
        value.forEach(element => {
            element.time = PG.getTime(element.time);
        });
        state.messages = value;
    },
    //獲取未讀取訊息數量
    GETNOTREADCHATCOUNT(state, value){
        state.notReadCount = value;
    },
    //修改未讀取訊息數量
    CHANGENOTREADCOUNT(state, value){
        if(value != 0){
            state.notReadCount++;
        }else{
            state.notReadCount = value
        }
        
    },
    //獲取圖片url
    ADDCHATIMAGE(state, value){
        state.imageUrl = value[0].imageUrl;
    }
};

const state = {
    memberList:[],//聊天對象列表
    messages: [],
    notReadCount:'',
    imageUrl:'',
    serviceEmail:'CustomerService@chanchao.com.tw' //設定客服信箱
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
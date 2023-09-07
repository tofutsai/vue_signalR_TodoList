<template>
  <div class="messaging">
    <div class="inbox_msg">
      <div class="inbox_people">
        <div class="headind_srch">
          <div class="recent_heading">
            <h4>Recent</h4>
          </div>
          <div class="srch_bar">
            <div class="stylish-input-group">
              <input
                type="text"
                class="search-bar"
                placeholder="Search"
                v-model="inputKeyword"
                @keydown.enter.prevent="searchMember($event)"
              />
              <span class="input-group-addon">
                <button type="button" @click="searchMember($event)">
                  <i class="fa fa-search" aria-hidden="true"></i>
                </button>
                <button type="button" @click="searchClean($event)">
                  <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
              </span>
            </div>
          </div>
        </div>
        <div id="memberList" class="inbox_chat">
          <!--動態塞入人員資料-->
          <template v-for="(member, index) in memberList">
            <div
              class="chat_list"
              :key="index"
              :class="[isActive === index ? 'active_chat' : '']"
              @click="
                focusChat(
                  index,
                  member.chatRoomId,
                  member.memberEmail,
                  member.chatName
                )"
            >
              <div class="chat_people">
                <div class="chat_img">
                  <img src="../assets/head.jpg" alt="sunil" />
                </div>
                <div class="chat_ib">
                  <h5>
                    {{ member.chatName }}
                    <span class="chat_date">{{ member.time }}</span>
                    <p>{{ member.memberEmail }}</p>
                  </h5>

                  <p v-if="member.messageType == 'text'">
                    {{ member.message }}
                    <span v-show="member.notRead != 0 && isActive !== index">{{member.notRead}}</span>
                  </p>
                  <p v-else>
                    傳送了一張圖片
                    <span v-show="member.notRead != 0 && isActive !== index">{{member.notRead}}</span>
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <!----------------------------------------->
      <div id="chatBox" class="mesgs">
        <div id="js-roomBody" class="msg_history">
          <!--動態塞入聊天內容-->
          <!-- 註解：使用template來當迴圈容器，或是判斷用的容器，當條件達成時產出template內容 -->
          <template v-for="(item, index) in messagesFliter">
            <!-- other people -->
            <template v-if="item.chatEmail != serviceEmail">
              <div class="messageBox" :key="index">
                <img
                  src="../assets/head.jpg"
                  class="messageBox__user"
                  draggable="false"
                />
                <div class="messageBox__content">
                  <div class="messageBox__name">{{ item.chatName }}</div>
                  <div v-if="item.messageType == 'text'" class="messageBox__message">
                    <div class="messageBox__text">{{ item.message }}</div>
                    <div class="messageBox__readMore" @click="readMore($event)">
                      顯示更多
                    </div>
                  </div>
                  <div v-if="item.messageType == 'image'" class="messageBox__image">
                    <img :src="item.message" />
                  </div>
                </div>
                <div class="messageBox__time">{{ item.time }}</div>
              </div>
            </template>
            <!-- 區塊：self -->
            <template v-if="item.chatEmail == serviceEmail">
              <div class="messageBox messageBox--self" :key="index">
                <div class="messageBox__time">{{ item.time }}</div>
                <div class="messageBox__content">
                  <div v-if="item.messageType == 'text'" class="messageBox__message">
                    <div class="messageBox__text">{{ item.message }}</div>
                    <div class="messageBox__readMore" @click="readMore($event)">
                      顯示更多
                    </div>
                  </div>
                  <div v-if="item.messageType == 'image'" class="messageBox__image">
                    <img :src="item.message" />
                  </div>
                </div>
                <!-- <div
                  v-if="hoverMessageId === item.id"
                  class="messageBox__delete"
                >
                  <span @click="deleteMessage(hoverMessageId)">刪除</span>
                </div> -->
              </div>
            </template>
          </template>
        </div>
        <div class="type_msg" id="typeBar">
          <div class="input_msg_write">
            <textarea
              id="txtChat"
              placeholder="輸入訊息，Enter發送"
              :disabled="memberListFlag"
              v-model="inputMsg"
              autofocus
              @keydown.enter.prevent="sendMessage($event)"
            >
            </textarea>
          </div>

          <div class="roomBottom__tools">
            <div class="roomBottom__tools_upload">
              <input type="file" accept="image/*" @change="selectImage($event)" />
              <i class="fa fa-file-image-o" aria-hidden="true"></i>
              <span>{{imageName}}</span>
            </div>
            <!-- <button
              id="sendChat"
              class="msg_send_btn"
              type="button"
              @click="sendMessage($event)"
            >
              <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
            </button> -->
            <button type="button" class="btn btn-primary btn-sm" data-toggle="button" aria-pressed="false" autocomplete="off"
             @click="sendImage($event)">
                傳送圖片
            </button>
          </div>
        </div>
      </div>
      <!---------------------------------------->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import PG from "../store/plugin.js";

export default {
  data() {
    return {
      inputMsg: "", //輸入的訊息
      memberObj: {}, //聊天成員傳過來的物件
      serviceName: "", //客服名稱
      memberListFlag: true, //控制對話框是否可以輸入訊息
      memberId: 0, //聊天成員id唯一值
      memberEmail: "", //聊天成員email
      memberName: "",
      isActive: "", //控制添加css
      inputKeyword: "", //查詢聊天列表關鍵字
      imageName: "",//圖片名稱
      image: "", //圖片檔案
    };
  },
  created() {
    //先清除服務端指定的方法名稱
    this.signalr.off("getMsgFromMember");
    this.signalr.off("JoinMessage");
    this.signalr.on(
      "getMsgFromMember",
      (res, memberId, memberName, memberEmail, type) => {
        //取得訊息時間
        let time = PG.getTime("");
        //取得memberObj物件
        this.memberObj = {
          chatRoomId: memberId,
          chatName: memberName,
          memberEmail:memberEmail,
          chatEmail: memberEmail,
          serviceEmail: this.serviceEmail,
          message: res,
          time: time,
          notRead: 1,
          messageType:type
        };
        //console.log(this.memberObj);
        //深度拷貝
        this.messages.push(JSON.parse(JSON.stringify(this.memberObj)));
        //console.log(this.messages);
        //如果memberList列表為空
        if (this.memberList.length == 0) {
          this.memberList.push(this.memberObj);
        } //取代同memberId的內容，或將新的memberId加入memberList
        else {
          let filterIdArray = this.memberList.filter((member) => {
            return member.chatRoomId === this.memberObj.chatRoomId;
          });
          if (filterIdArray.length != 0) {
            this.memberList.some((member, index) => {
              if (member.chatRoomId === this.memberObj.chatRoomId) {
                member.message = this.memberObj.message;
                member.chatName = this.memberObj.chatName;
                member.time = this.memberObj.time;
                member.memberEmail = this.memberObj.memberEmail;
                member.messageType = this.memberObj.messageType
                //如果對話框沒有focus才加
                if (this.isActive !== index) {
                  member.notRead++;
                }
                return true; //跳出迴圈
              }
            });
          } else {
            this.memberList.unshift(this.memberObj);
            console.log(this.memberObj);
          }
        }
      }
    );
    //join message
    this.signalr.on("JoinMessage", (res, id, name, email) => {
      //設定客服名稱
      this.serviceName = name;
      //設定客服Email
      //this.serviceEmail = email;
      console.log(res);
    });
  },
  mounted() {
    this.signalr
      .start()
      .then(() => {
        console.log("連接成功");
        this.signalr
          .invoke("Join", this.serviceEmail)
          .then((res) => {
            //獲取聊天對象列表
            this.getChatMemberList("");
          })
          .catch((error) => {
            console.log("error : ", error);
          });
      })
      .catch((error) => {
        console.log("hub fail", error);
      });
  },
  updated() {
    // 判斷內容高度超過300就隱藏起來，把"顯示更多"按紐打開
    const messages = document.querySelectorAll(".messageBox__message");
    messages.forEach((message) => {
      if (message.offsetHeight >= 300) {
        message
          .querySelector(".messageBox__readMore")
          .setAttribute("style", "display: block");
      }
    });
    // 當畫面渲染完成，把聊天視窗滾到最底部(讀取最新消息)
    const roomBody = document.querySelector("#js-roomBody");
    roomBody.scrollTop = roomBody.scrollHeight;
  },
  beforeDestroy() {
    this.signalr.stop();
  },
  watch: {
    memberList: {
      //deep:true,
      handler(newValue, oldValue) {
        //console.log(newValue, oldValue);
        //聊天列表有變動，isActive就+1 維持css不跳動
        this.isActive += 1;
      },
    },
  },
  computed: {
    ...mapState("chat", ["memberList", "messages", "imageUrl", "serviceEmail"]),
    messagesFliter() {
      return this.messages.filter((message) => {
        return message.chatRoomId == this.memberId;
      });
    },
  },
  methods: {
    ...mapActions("chat", [
      "addChat",
      "addChatImage",
      "getChatMemberList",
      "getChatMemberRecords",
    ]),
    sendMessage(e) {
      let message = this.inputMsg;
      // 如果是按住shift則不傳送訊息(多行輸入)
      if (e.shiftKey) {
        return false;
      }
      // 如果輸入是空則不傳送訊息
      if (message.length <= 1 && message.trim() == "") {
        // 避免enter產生的空白換行
        e.preventDefault();
        return false;
      }
      //chat物件
      const chat = {
        chatRoomId: this.memberId,
        chatName: this.memberName,
        memberEmail: this.memberEmail,
        chatEmail: this.serviceEmail,
        serviceEmail: this.serviceEmail,
        message: message,
        isRead: false,
      };
      this.addChat(chat)
      .then(()=>{
        this.signalr
          .invoke("Send", message, this.serviceEmail, this.memberEmail, 'text') //這裡就是Hub中的方法  參數
          .then((res) => {
            //呼叫addChat 把聊天資料傳過去


            let time = PG.getTime("");
            const msg = {
              chatRoomId: this.memberId,
              chatName: this.memberName,
              memberEmail: this.memberEmail,
              chatEmail: this.serviceEmail,
              serviceEmail: this.serviceEmail,
              message: message,
              time: time,
              notRead: 1,
              messageType:'text'
            };
            this.messages.push(msg);

            //memberList更新
            this.memberList.some((member) => {
              if (member.chatRoomId === msg.chatRoomId) {
                member.message = msg.message;
                member.time = msg.time;
                member.messageType = msg.messageType
                return true;
              }
            });
          })
          .catch((error) => {
            console.log("error : ", error);
          });
          
        this.inputMsg = "";
      })
      .catch((error) => {

      });
    },
    //選擇圖片
    selectImage(e) {
      if(e.target.files.length != 0){
        this.imageName = e.target.files[0].name;
        this.image = e.target.files[0];
      }
      else{
        this.imageName = '';
      }
      
    },
    //傳送圖片訊息
    sendImage(e) {
      if (this.image != "") {
        //建立FormData物件
        var chatForm = new FormData();
        chatForm.append("file", this.image);
        chatForm.append("chatRoomId", this.memberId);
        chatForm.append("chatName", this.memberName);
        chatForm.append("memberEmail", this.memberEmail);
        chatForm.append("chatEmail", this.serviceEmail);
        chatForm.append("serviceEmail", this.serviceEmail);
        chatForm.append("message", "");
        chatForm.append("isRead", false);
        //呼叫addChatImage 把聊天圖片資料傳過去
        this.addChatImage(chatForm)
          .then(() => {
            this.signalr
                .invoke("Send", this.imageUrl, this.serviceEmail, this.memberEmail, 'image') //這裡就是Hub中的方法  參數
                .then((res) => {
                
                  let time = PG.getTime("");
                  const msg = {
                    chatRoomId: this.memberId,
                    chatName: this.memberName,
                    memberEmail: this.memberEmail,
                    chatEmail: this.serviceEmail,
                    serviceEmail: this.serviceEmail,
                    message: this.imageUrl,
                    time: time,
                    notRead: 1,
                    messageType: "image",
                  };
                  this.messages.push(msg);
                   //memberList更新
                  this.memberList.some((member) => {
                    if (member.chatRoomId === msg.chatRoomId) {
                      member.message = "傳送了一張圖片";
                      member.time = msg.time;
                      return true;
                    }
                  });
                  this.imageName = "";
                  this.image = "";
                })
                .catch((error) => {
                  console.log("error : ", error);
                });
          })
          .catch((error) => {
            console.log("error", error);
          });
        
      }
    },
    //搜尋特定聊天對象
    searchMember(e) {
      let keyword = this.inputKeyword;
      // 如果是按住shift則不傳送訊息(多行輸入)
      if (e.shiftKey) {
        return false;
      }

      //獲取關鍵字聊天對象列表
      this.getChatMemberList(keyword);
    },
    searchClean(e) {
      this.inputKeyword = "";
      //獲取聊天對象列表
      this.getChatMemberList("");
    },
    /* 顯示更多 */
    readMore(e) {
      // 把內容高度限制取消
      e.target.previousElementSibling.setAttribute(
        "style",
        "max-height: 100%;"
      );
      // 隱藏"顯示更多"按紐
      e.target.setAttribute("style", "display: none;");
    },
    //點擊對話框
    focusChat(index, chatRoomId, memberEmail, chatName) {
      //獲取特定成員聊天內容
      const data = {
        chatRoomId: chatRoomId,
        type: "service",
      };
      this.getChatMemberRecords(data);
      //獲取聊天成員id
      this.memberId = chatRoomId;
      //獲取聊天成員Email
      this.memberEmail = memberEmail;
      //獲取聊天成員name
      this.memberName = chatName;
      //開啟對話框輸入功能
      this.memberListFlag = false;
      //加上css
      this.isActive = index;
      //訊息綠色圈圈重新計數
      this.memberList.some((member) => {
        if (member.chatRoomId == chatRoomId) {
          member.notRead = 0;
          return true;
        }
      });
    },
  },
};
</script>

<style>
.container {
  max-width: 1170px;
  margin: auto;
}
img {
  max-width: 100%;
}
.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 40%;
  border-right: 1px solid #c4c4c4;
}
.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}
.top_spac {
  margin: 20px 0 0;
}

.recent_heading {
  float: left;
  width: 40%;
}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
}
.headind_srch {
  padding: 10px 29px 10px 20px;
  overflow: hidden;
  border-bottom: 1px solid #c4c4c4;
}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
  margin: auto;
}
.srch_bar input {
  border: 1px solid #cdcdcd;
  border-width: 0 0 1px 0;
  width: 80%;
  padding: 2px 0 4px 6px;
  background: none;
}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}
.srch_bar .input-group-addon {
  margin: 0 0 0 -27px;
}

.chat_ib h5 {
  font-size: 16px;
  color: #464646;
  margin: 0 0 8px 0;
}
.chat_ib h5 span {
  font-size: 13px;
  float: right;
}
.chat_ib p {
  font-size: 14px;
  color: #989898;
  margin: auto;
}
.chat_ib p span {
  font-size: 13px;
  float: right;
  color: rgb(238, 234, 234);
  background-color: #47a107;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  text-align: center;
}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people {
  overflow: hidden;
  clear: both;
}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
  cursor: pointer;
}
.chat_list:hover {
  background: #ebebeb;
}
.inbox_chat {
  height: 550px;
  overflow-y: scroll;
}

.active_chat {
  background: #ebebeb;
}

.incoming_msg_img {
  display: inline-block;
  width: 6%;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
}
.received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}
.received_withd_msg {
  width: 57%;
}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 55%;
}

.sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0;
  color: #fff;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.outgoing_msg {
  overflow: hidden;
  margin: 26px 0 26px;
}
.sent_msg {
  float: right;
  width: 46%;
}
.input_msg_write textarea {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
  border: none;
  resize: none;
  outline: none;
}

.type_msg {
  border-top: 1px solid #c4c4c4;
  position: relative;
}
.msg_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}
.messaging {
  padding: 0 0 50px 0;
}
.msg_history {
  height: 516px;
  overflow-y: auto;
}
.messageBox {
  padding: 5px 10px;
  position: relative;
}
.messageBox__user {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  vertical-align: top;
  display: inline-block;
  cursor: pointer;
}
.messageBox__content {
  max-width: 70%;
  display: inline-block;
}
.messageBox__name {
  margin: 5px 0px 5px 5px;
  font-size: 13px;
  color: #727c8a;
  vertical-align: top;
  cursor: pointer;
}
.messageBox__message {
  margin: 5px 0px 5px 5px;
  font-size: 12px;
  color: #35393d;
  letter-spacing: 0.6px;
  background-color: #e3e8eb;
  border-radius: 12px;
  line-height: 1.5;
  text-align: left;
  word-break: break-all;
  /*：與html的<pre></pre>同效果，可以使textarea的換行元素正常顯示 */
  white-space: pre-line;
}
.messageBox__text {
  padding: 8px 10px 9px 11px;
  max-height: 300px;
  overflow: hidden;
}
.messageBox__image {
  margin: 5px 25px 5px 5px;
}
.messageBox__image img {
  border-radius: 5px;
  max-width: 100%;
  max-height: 300px;
}
.messageBox__readMore {
  border-top: 1px solid #d9dbdd;
  margin-top: 6px;
  padding: 6px 13px 10px 13px;
  left: 0;
  right: 0;
  cursor: pointer;
  display: none;
}
.messageBox__time {
  transform: scale(0.7);
  color: #acb0b8;
  vertical-align: bottom;
  margin: 0px 0px 5px -5px;
  display: inline-block;
}
.messageBox--self {
  text-align: right;
}
.messageBox--self .messageBox__message {
  background-color: #aff47e;
  margin-right: 25px;
}
.messageBox--self .messageBox__message__text {
  padding: 8px 10px 9px 11px;
  max-height: 100%;
  overflow: unset;
}
.messageBox--self .messageBox__time {
  margin: 0px -10px 5px 0px;
}
.roomBottom__tools {
  border-top: solid 1px #e7e7e7;
  border-bottom: solid 2px #e7e7e7;
  background-color: #f6f6f6;
  height: 30px;
  padding: 0px 5px;
}
.roomBottom__tools button{
  float: right;
  height: 100%;
}
.roomBottom__tools_upload {
  height: 22px;
  margin: 4px;
  /* padding: 1px; */
  display: inline-block;
  position: relative;
  overflow: hidden;
}
.roomBottom__tools_upload:hover {
  border: solid 1px #dcdcdc;
}
.roomBottom__tools_upload input {
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  opacity: 0;
  position: absolute;
  cursor: pointer;
  /* 讓input file可以支援pointer要加pl100% */
  padding-left: 100%;
}
.roomBottom__tools_upload i {
  height: 100%;
}
.roomBottom__input {
  padding: 10px 10px 5px 10px;
}
</style>

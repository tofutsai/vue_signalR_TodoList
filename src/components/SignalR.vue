<template>
<div>
    <h2>SignalR測試</h2>
    <div class="chatRoomButton">
      <v-btn
        @click="joinSignalR()"
        class="mx-2"
        fab
        color="indigo"
        :disabled="dialog"
      >
        <v-icon> mdi-message-text </v-icon>
      </v-btn>
      <span v-show="notReadCount != 0">
        {{ notReadCount }}
      </span>
    </div>
    <div class="container" v-show="dialog">
      <!-- 區塊：chat room -->
      <div class="chatRoom">
        <!-- 區塊：head -->
        <div class="roomHead">
          <div class="roomHead__topButtons">
            <div class="roomHead__button close"></div>
            <div class="roomHead__button minimize"></div>
            <div class="roomHead__button zoom"></div>
          </div>
          <img
            src="../assets/head.jpg"
            class="roomHead__img"
            draggable="false"
          />
          <div class="roomHead__title">
            <span>客服對話</span>
            <v-btn
              color="red darken-1"
              @click="disconnection"
              style="float: right"
            >
              <v-icon> mdi-close-circle-outline </v-icon>
            </v-btn>
          </div>
        </div>
        <!-- 區塊：body -->
        <div id="js-roomBody" class="roomBody">
          <!-- 註解：使用template來當迴圈容器，或是判斷用的容器，當條件達成時產出template內容 -->
          <template v-for="(item, index) in messages">
            <!-- other people -->
            <template v-if="item.chatEmail != memberEmail">
              <div class="messageBox" :key="index">
                <img
                  src="../assets/head.jpg"
                  class="messageBox__user"
                  draggable="false"
                />
                <div class="messageBox__content">
                  <div class="messageBox__name">客服</div>
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
            <template v-if="item.chatEmail == memberEmail">
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
                  <!-- <div v-if="item.type == 'image'" class="messageBox__image">
                    <img :src="item.message" />
                  </div> -->
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
        <!-- 區塊：bottom -->
        <!-- 註解：使用:class來寫class是否顯示的判斷式{ class: 判斷式 } -->
        <div class="roomBottom">
          <div class="roomBottom__tools">
            <div class="roomBottom__tools_upload">
              <input
                type="file"
                accept="image/*"
                @change="selectImage($event)"
              />
              <!-- <img src="../assets/logo.png" /> -->
              <i class="fa fa-file-image-o" aria-hidden="true"></i>
              <span>{{ imageName }}</span>
            </div>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              data-toggle="button"
              aria-pressed="false"
              autocomplete="off"
              @click="sendImage($event)"
            >
              傳送圖片
            </button>
          </div>
          <div class="roomBottom__input">
            <!-- 若要再帶入原生js的event(e)到function中，必須使用$event當參數傳入 -->
            <textarea
              id="js-message"
              autofocus
              placeholder="輸入訊息，Enter發送"
              v-model="inputMsg"
              class="roomBottom__input__textarea"
              @keydown.enter="sendMessage($event)"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import PG from "../store/plugin.js";
export default {
  data() {
    return {
      dialog: false,
      inputMsg: "", //輸入的訊息
      memberName: "", //聊天會員名稱
      memberEmail: "", //聊天會員email
      memberId: "", //聊天會員Id
      imageName: "", //圖片名稱
      image: "", //圖片檔案
    };
  },
  created() {
    //先清除服務端指定的方法名稱
    this.signalr.off("getMsgFromService");
    this.signalr.off("JoinMessage");

    //join message
    this.signalr.on("JoinMessage", (res, id, name, email) => {
      console.log(res);
      //設定聊天成員名稱
      this.memberName = name;
      //設定聊天成員email
      this.memberEmail = email;
      //設定聊天會員id
      this.memberId = id;
    });
    //接收客服中心的訊息
    this.signalr.on("getMsgFromService", (res, serviceEmail, serviceName, type) => {
      let time = PG.getTime("");
      let notRead = 0;
      if (!this.dialog) {
        notRead = 0;
        this.CHANGENOTREADCOUNT(1);
      } else {
        notRead = 1;
      }
      const msg = {
        chatRoomId: this.memberId,
        chatName: serviceName,
        memberEmail: this.memberEmail,
        chatEmail: this.serviceEmail,
        serviceEmail: this.serviceEmail,
        message: res,
        time: time,
        notRead: notRead,
        messageType:type
      };
      this.messages.push(msg);
    });
  },
  mounted() {
    this.memberEmail = prompt("請輸入會員信箱:");
    this.signalr
      .start()
      .then(() => {
        console.log("連接成功");
        this.signalr
          .invoke("Join", this.memberEmail)
          .then((res) => {
            //取得成員聊天未讀訊息數量
            if (this.memberId !== "") {
              this.getNotReadChatCount(this.memberId);
            }
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
  computed: {
    ...mapState("chat", ["messages", "notReadCount", "imageUrl", "serviceEmail"]),
  },
  methods: {
    ...mapActions("chat", [
      "addChat",
      "addChatImage",
      "getChatMemberRecords",
      "getNotReadChatCount",
    ]),
    ...mapMutations("chat", ["CHANGENOTREADCOUNT"]),
    joinSignalR() {
      this.dialog = !this.dialog;
      //未讀數量歸0
      this.CHANGENOTREADCOUNT(0);

      //取得聊天對話訊息
      const data = {
        chatRoomId: this.memberId,
        type: "member",
      };
      this.getChatMemberRecords(data);
    },
    //傳送文字訊息
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
        chatEmail: this.memberEmail,
        serviceEmail: this.serviceEmail,
        message: message,
        isRead: false, //是否已讀取
        
      };
      this.signalr
        .invoke("Send", message, this.memberEmail, this.serviceEmail, 'text') //這裡就是Hub中的方法  參數
        .then((res) => {
          //呼叫addChat 把聊天資料傳過去
          this.addChat(chat);
          let time = PG.getTime("");
          const msg = {
            chatRoomId: this.memberId,
            chatName: this.memberName,
            memberEmail: this.memberEmail,
            chatEmail: this.memberEmail,
            serviceEmail: this.serviceEmail,
            message: message,
            time: time,
            notRead: 1,
            messageType: "text",
          };
          this.messages.push(msg);
        })
        .catch((error) => {
          console.log("error : ", error);
        });

      this.inputMsg = "";
      e.preventDefault();
    },
    //選擇圖片
    selectImage(e) {
      if (e.target.files.length != 0) {
        this.imageName = e.target.files[0].name;
        this.image = e.target.files[0];
        
      } else {
        this.imageName = "";
        this.image = "";
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
        chatForm.append("chatEmail", this.memberEmail);
        chatForm.append("serviceEmail", this.serviceEmail);
        chatForm.append("message", "");
        chatForm.append("isRead", false);
        //呼叫addChatImage 把聊天圖片資料傳過去
        this.addChatImage(chatForm)
          .then(() => {
            this.signalr
                .invoke("Send", this.imageUrl, this.memberEmail, this.serviceEmail, 'image') //這裡就是Hub中的方法  參數
                .then((res) => {
                
                  let time = PG.getTime("");
                  const msg = {
                    chatRoomId: this.memberId,
                    chatName: this.memberName,
                    memberEmail: this.memberEmail,
                    chatEmail: this.memberEmail,
                    serviceEmail: this.serviceEmail,
                    message: this.imageUrl,
                    time: time,
                    notRead: 1,
                    messageType: "image",
                  };
                  this.messages.push(msg);
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
    disconnection() {
      this.dialog = !this.dialog;
    },
    /** 顯示更多 */
    readMore(e) {
      // 把內容高度限制取消
      e.target.previousElementSibling.setAttribute(
        "style",
        "max-height: 100%;"
      );
      // 隱藏"顯示更多"按紐
      e.target.setAttribute("style", "display: none;");
    },
  },
};
</script>

<style scoped>
/* * {
  font-family: "微軟正黑體"; 
  margin: auto; 
} */
.container {
  padding: 0px;
}
.name {
  text-align: center;
  margin: 10px 50px 10px 0px;
  color: #333333;
}
.reset {
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: 10px;
  font-weight: 600;
  color: #333333;
  background-color: #cccccc;
  display: inline-block;
  cursor: pointer;
}
.chatRoom {
  border-radius: 5px;
  max-width: 500px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}
/* Head */
.roomHead {
  width: 100%;
  height: 85px;
  border-radius: 5px 5px 0px 0px;
  background-color: #2b364b;
  position: relative;
}
.roomHead__topButtons {
  padding: 2px 0px 5px 10px;
  text-align: left;
}
.roomHead__button {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  margin: 0px 1px;
  display: inline-block;
  cursor: pointer;
}
.close {
  background-color: #ff625a;
}
.minimize {
  background-color: #ffc02f;
}
.zoom {
  background-color: #28cb40;
}
.roomHead__img {
  width: 50px;
  height: 50px;
  margin: 0px 10px 6px 12px;
  border-radius: 50%;
  position: absolute;
  cursor: pointer;
}
.roomHead__title {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  height: 80px;
  margin: 5px 0px 0px 75px;
  position: absolute;
  cursor: pointer;
  width: 400px;
}
/* Body */
.roomBody {
  padding: 10px 0px;
  background-color: #fff;
  height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
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
.messageBox__readMore {
  border-top: 1px solid #d9dbdd;
  margin-top: 6px;
  padding: 6px 13px 10px 13px;
  left: 0;
  right: 0;
  cursor: pointer;
  display: none;
}
.messageBox__image {
  margin: 5px 25px 5px 5px;
}
.messageBox__image img {
  border-radius: 5px;
  max-width: 100%;
  max-height: 300px;
}
.messageBox__time {
  transform: scale(0.7);
  color: #acb0b8;
  vertical-align: bottom;
  margin: 0px 0px 5px -5px;
  display: inline-block;
}
.messageBox__delete {
  font-size: 12px;
  color: #acb0b8;
  margin-right: 25px;
  cursor: pointer;
}
.messageBox__progress {
  width: 25%;
  margin-right: 60px;
  border-radius: 5px;
  background-color: #d4d9e1;
  height: 6px;
}
.messageBox__progress--state {
  background-color: #00ce00;
  height: 6px;
  width: 10%;
  border-radius: 5px;
  float: right;
}
.messageBox__progress--number {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  color: #b7b7b7;
  margin-right: 35px;
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
/* Bottom */
.roomBottom {
  bottom: 0px;
  border-radius: 0px 0px 5px 5px;
  background-color: #ffffff;
}
.roomBottom__tools {
  border-top: solid 1px #e7e7e7;
  border-bottom: solid 2px #e7e7e7;
  background-color: #f6f6f6;
  height: 30px;
  padding: 0px 5px;
}
.roomBottom__tools button {
  float: right;
  height: 100%;
}
.roomBottom__tools_upload {
  height: 21px;
  /* margin: 5px;
  padding: 1px; */
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
.roomBottom__input__textarea {
  width: 100%;
  height: 60px;
  border: none;
  resize: none;
  outline: none;
  background-color: #ebebeb;
}
/* status */
.disable {
  pointer-events: none;
  background-color: #ebebeb;
}
/* modal */
.modal {
  z-index: 3;
  padding: 50px 0px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  animation: opac 0.8s;
  letter-spacing: 2px;
  text-align: unset;
}
.modal__container {
  margin: auto;
  position: relative;
  padding: 10px;
  outline: 0;
  max-width: 300px;
}
.modal__header {
  color: #fff;
  background-color: #2b364b;
  padding: 10px;
  text-align: center;
  border-radius: 5px 5px 0px 0px;
}
.modal__body {
  background-color: #fff;
  padding: 20px 50px;
  text-align: center;
}
.modal__body p {
  text-align: left;
  line-height: 24px;
}
.modal__img {
  max-width: 100%;
}
.modal__footer {
  color: #fff;
  background-color: #2b364b;
  height: 8px;
  border-radius: 0px 0px 5px 5px;
}
/* name set */
.userName {
  height: 30px;
  font-size: 16px;
  margin-bottom: 10px;
  border: solid 1px #cbcbcb;
  width: 70%;
  text-align: center;
  display: inline-block;
}
.button {
  font-size: 14px;
  color: #ffffff;
  background-color: #2b364b;
  padding: 10px 20px;
  display: inline-block;
  cursor: pointer;
}
.chatRoomButton {
  position: relative;
}
.chatRoomButton span {
  position: absolute;
  text-align: center;
  background-color: red;
  font-size: 13px;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  left: 50px;
}
/* media */
@media screen and (max-width: 425px) {
  .messageBox__content {
    max-width: 60%;
  }
}
@media screen and (max-width: 385px) {
  .messageBox__content {
    max-width: 50%;
  }
}
</style>

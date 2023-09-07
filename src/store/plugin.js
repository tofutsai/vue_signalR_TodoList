const moment = require("moment");

const Plugin = {
    mixin:{
        data(){
            return {};
        },
        computed: {},
        filters:{},
    },
    getTime(time){
        let chatTime = "";
        if(time != ""){
            const timeNumber = Number(time);
            chatTime = moment(timeNumber).format('HH:mm'); 
        }
        else{
            chatTime = moment().format('HH:mm'); 
        }
        
        return chatTime;
    }
}

export default Plugin;
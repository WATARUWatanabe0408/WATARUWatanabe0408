var lineToken = "token"; //LINE notify token
var get_interval = 5; //●分前～現在の新着メールを取得 #--トリガーの時間間隔をこれに合わせる


function send_line(Me){
 var payload = {'message' :   Me};
 var options ={
   "method"  : "post",
   "payload" : payload,
   "headers" : {"Authorization" : "Bearer "+ lineToken}  
 };
 UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}


function fetchContactMail() {
 //取得間隔
 var now_time= Math.floor(new Date().getTime() / 1000) ;//現在時刻を変換
 var time_term = now_time - ((60 * get_interval) + 3); //秒にして+3秒しておく
 
 //検索条件指定
 var strTerms = '(is:unread after:'+ time_term + ')';
 
 //取得
 var myThreads = GmailApp.search(strTerms);
 var myMsgs = GmailApp.getMessagesForThreads(myThreads);
 var valMsgs = [];
 
 for(var i = 0; i < myMsgs.length;i++){
  valMsgs[i] = " " + dayjs.dayjs(myMsgs[i][0].getDate()).format('YYYY/MM/DD HH:mm:ss') + "\n[from]" + myMsgs[i].slice(-1)[0].getFrom() + "\n\n[subject]" + myMsgs[i].slice(-1)[0].getSubject();
 }

 return valMsgs;
}

function main() {
 new_Me = fetchContactMail()
 if(new_Me.length > 0){
   for(var i = new_Me.length-1; i >= 0; i--){
     send_line(new_Me[i])
   }
 }
}
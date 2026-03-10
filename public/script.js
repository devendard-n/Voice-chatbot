const chat=document.getElementById("chat");
const input=document.getElementById("input");
const thinking=document.getElementById("thinking");
const history=document.getElementById("history");
const chatArea=document.getElementById("chatArea");

let conversations=JSON.parse(localStorage.getItem("conversations"))||[];
let currentChat=[];

/* voice recognition */

let recognition;

if("webkitSpeechRecognition" in window){

recognition=new webkitSpeechRecognition();

recognition.lang="en-US";

recognition.onresult=(event)=>{

input.value=event.results[0][0].transcript;

sendMessage();

};

}

/* start voice */

function startVoice(){

if(recognition){

recognition.start();

}

}

/* send message */

async function sendMessage(){

const message=input.value.trim();

if(!message) return;

chatArea.classList.remove("center-mode");
chatArea.classList.add("chat-mode");

addMessage(message,"user");

currentChat.push({role:"user",text:message});

input.value="";

thinking.style.display="block";

try{

const res=await fetch("http://localhost:3000/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({message})

});

const data=await res.json();

thinking.style.display="none";

const reply=data.reply;

addMessage(reply,"bot");

currentChat.push({role:"bot",text:reply});

saveConversation();

speak(reply);

}catch(err){

thinking.style.display="none";

addMessage("Server error","bot");

}

}

/* add message */

function addMessage(text,type){

const div=document.createElement("div");

div.classList.add("message",type);

div.innerText=text;

chat.appendChild(div);

chat.scrollTop=chat.scrollHeight;

}

/* voice reply */

function speak(text){

const speech=new SpeechSynthesisUtterance(text);

speech.lang="en-US";

window.speechSynthesis.speak(speech);

}

/* stop voice */

function stopVoice(){

window.speechSynthesis.cancel();

}

/* save chat */

function saveConversation(){

conversations.push([...currentChat]);

localStorage.setItem("conversations",JSON.stringify(conversations));

updateSidebar();

}

/* sidebar */

function updateSidebar(){

history.innerHTML="";

conversations.forEach((chat,index)=>{

const item=document.createElement("div");

item.className="history-item";

let title="Chat";

for(let msg of chat){

if(msg.role==="user"){
title=msg.text.slice(0,25);
break;
}

}

const span=document.createElement("span");

span.innerText=title;

span.onclick=()=>loadConversation(index);

const del=document.createElement("button");

del.innerText="🗑";

del.className="delete-btn";

del.onclick=(e)=>{

e.stopPropagation();

deleteConversation(index);

};

item.appendChild(span);
item.appendChild(del);

history.appendChild(item);

});

}

function loadConversation(index){

chat.innerHTML="";

const selected=conversations[index];

selected.forEach(msg=>{

addMessage(msg.text,msg.role);

});

}

function deleteConversation(index){

conversations.splice(index,1);

localStorage.setItem("conversations",JSON.stringify(conversations));

updateSidebar();

}

/* new chat */

function newChat(){

chat.innerHTML="";

currentChat=[];

chatArea.classList.remove("chat-mode");

chatArea.classList.add("center-mode");

}
function cleanText(text){

return text

/* remove markdown bold/italic */
.replace(/\*\*/g,"")
.replace(/\*/g,"")

/* remove headings */
.replace(/###/g,"")
.replace(/##/g,"")
.replace(/#/g,"")

/* remove bullet points */
.replace(/^- /gm,"")

/* remove numbered list formatting */
.replace(/^\d+\.\s/gm,"")

/* remove extra new lines */
.replace(/\n{2,}/g,"\n")

/* trim spaces */
.trim();

}

updateSidebar();
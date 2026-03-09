const chat=document.getElementById("chat");
const input=document.getElementById("input");
const thinking=document.getElementById("thinking");
const history=document.getElementById("history");

let conversations=JSON.parse(localStorage.getItem("conversations"))||[];
let currentChat=[];

/* clean AI response */

function cleanText(text){

return text
.replace(/\*\*/g,"")
.replace(/\*/g,"")
.replace(/###/g,"")
.replace(/##/g,"")
.replace(/#/g,"")
.replace(/-/g,"")
.replace(/\n\n/g,"\n");

}

/* send message */

async function sendMessage(){

const message=input.value.trim();

if(!message) return;

addMessage(message,"user");

currentChat.push({role:"user",text:message});

input.value="";

thinking.style.display="flex";

const res=await fetch("/chat",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message})

});

const data=await res.json();

thinking.style.display="none";

const reply=cleanText(data.reply);

addMessage(reply,"bot");

currentChat.push({role:"bot",text:reply});

saveConversation();

speak(reply);

}

/* add message */

function addMessage(text,type){

const div=document.createElement("div");

div.classList.add("message",type);

div.innerText=text;

chat.appendChild(div);

chat.scrollTop=chat.scrollHeight;

}

/* voice */

function speak(text){

const speech=new SpeechSynthesisUtterance(text);

speech.lang="en-US";

window.speechSynthesis.speak(speech);

}

/* stop voice */

function stopVoice(){

window.speechSynthesis.cancel();

}

/* enter send */

input.addEventListener("keypress",function(e){

if(e.key==="Enter"){

e.preventDefault();

sendMessage();

}

});

/* theme toggle */

const toggle=document.getElementById("themeToggle");

toggle.onclick=()=>{

document.body.classList.toggle("light");

toggle.innerText=document.body.classList.contains("light")?"🌙":"☀️";

};

/* save conversation */

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

/* title from first user question */

let title="New Chat";

for(let msg of chat){

if(msg.role==="user"){
title=msg.text.slice(0,30);
break;
}

}

const titleSpan=document.createElement("span");
titleSpan.innerText=title;

titleSpan.onclick=()=>loadConversation(index);

const del=document.createElement("button");
del.innerText="🗑";
del.className="delete-btn";

del.onclick=(e)=>{

e.stopPropagation();

deleteConversation(index);

};

item.appendChild(titleSpan);
item.appendChild(del);

history.appendChild(item);

});

}

/* load conversation */

function loadConversation(index){

chat.innerHTML="";

const selected=conversations[index];

selected.forEach(msg=>{

addMessage(msg.text,msg.role==="user"?"user":"bot");

});

}

/* delete conversation */

function deleteConversation(index){

conversations.splice(index,1);

localStorage.setItem("conversations",JSON.stringify(conversations));

updateSidebar();

}

/* new chat */

function newChat(){

chat.innerHTML="";
currentChat=[];

}

updateSidebar();
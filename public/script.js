const thinking = document.getElementById("thinking");
const aiContainer = document.getElementById("aiContainer");
const history = document.getElementById("history");

let recognition;

let conversations = JSON.parse(localStorage.getItem("conversations")) || [];

/* START VOICE */

function startVoice(){

if (!("webkitSpeechRecognition" in window)) {

thinking.innerText="Speech recognition not supported";

return;

}

recognition = new webkitSpeechRecognition();

recognition.lang = "en-US";

thinking.innerText="Listening...";

recognition.start();

recognition.onresult = async function(event){

let message = event.results[0][0].transcript;

thinking.innerText="AI is thinking...";

try{

const res = await fetch("/api/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({message})

});

const data = await res.json();

speak(data.reply);

saveConversation(message, data.reply);

}catch(err){

thinking.innerText="Server error";

}

};

}

/* AI SPEAK */

function speak(text){

const speech = new SpeechSynthesisUtterance(text);

speech.lang="en-US";

/* start animation */

aiContainer.classList.add("ai-speaking");

speech.onend = () =>{

aiContainer.classList.remove("ai-speaking");

thinking.innerText="Tap AI to speak";

};

window.speechSynthesis.speak(speech);

}

/* STOP BUTTON */

function stopVoice(){

window.speechSynthesis.cancel();

if(recognition){
recognition.stop();
}

aiContainer.classList.remove("ai-speaking");

thinking.innerText="Stopped";

}

/* SAVE HISTORY */

function saveConversation(user,bot){

conversations.push([
{role:"user",text:user},
{role:"bot",text:bot}
]);

localStorage.setItem("conversations",JSON.stringify(conversations));

updateSidebar();

}

/* SIDEBAR */

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

function deleteConversation(index){

conversations.splice(index,1);

localStorage.setItem("conversations",JSON.stringify(conversations));

updateSidebar();

}

function newChat(){

thinking.innerText="Tap AI to speak";

}

updateSidebar();
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const history = document.getElementById("history");

const faq = {

courses:
"Available courses include B.Tech, BCA, MCA, MBA, M.Tech and Diploma programs.",

admission:
"Admissions are based on entrance exams, merit lists and counseling procedures.",

fees:
"Course fees generally range from ₹50,000 to ₹2,00,000 per year depending on the program.",

placements:
"Average placement package is around ₹5 LPA. Top recruiters include TCS, Infosys, Accenture and Capgemini.",

hostel:
"Separate hostel facilities are available for boys and girls with WiFi and mess facilities.",

scholarship:
"Merit-based, sports and government scholarships are available for eligible students."

};

function addMessage(text,type){

const div=document.createElement("div");

div.className=
type==="user"
? "user-msg"
: "bot-msg";

div.innerText=text;

chatBox.appendChild(div);

chatBox.scrollTop=
chatBox.scrollHeight;
}

function getReply(question){

question=question.toLowerCase();

if(question.includes("course"))
return faq.courses;

if(question.includes("admission"))
return faq.admission;

if(question.includes("fee"))
return faq.fees;

if(question.includes("placement"))
return faq.placements;

if(question.includes("hostel"))
return faq.hostel;

if(question.includes("scholarship"))
return faq.scholarship;

return "Please ask about courses, admissions, fees, placements, hostel or scholarships.";
}

function sendMessage(){

let text=input.value.trim();

if(text==="") return;

addMessage(text,"user");

let li=document.createElement("li");
li.textContent=text;
history.appendChild(li);

setTimeout(()=>{
addMessage(getReply(text),"bot");
},500);

input.value="";
}

sendBtn.addEventListener("click",sendMessage);

input.addEventListener("keypress",function(e){
if(e.key==="Enter"){
sendMessage();
}
});

document.querySelectorAll(".faq-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

let topic=btn.dataset.topic;

addMessage(btn.innerText,"user");

setTimeout(()=>{
addMessage(faq[topic],"bot");
},300);

});

});

document.getElementById("newChat")
.addEventListener("click",()=>{

chatBox.innerHTML=`
<div class="bot-msg">
👋 New chat started. How can I help you?
</div>
`;

});
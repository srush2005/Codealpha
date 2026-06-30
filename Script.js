const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");
const count = document.getElementById("count");

const languages = {
    auto: "Detect Language",
    en: "English", hi: "Hindi", mr: "Marathi", bn: "Bengali",
    ta: "Tamil", te: "Telugu", gu: "Gujarati", kn: "Kannada",
    ml: "Malayalam", fr: "French", de: "German", es: "Spanish"
};

// Fill dropdowns
for (let code in languages) {
    let opt1 = new Option(languages[code], code);
    sourceLang.add(opt1);
    if (code !== "auto") {
        let opt2 = new Option(languages[code], code);
        targetLang.add(opt2);
    }
}

sourceLang.value = "auto";
targetLang.value = "hi";

// Text counter helper
function updateCounter() {
    count.innerText = `${inputText.value.length} / 2000`;
}

inputText.addEventListener("input", updateCounter);

// Translation Logic
async function translateText() {
    const text = inputText.value.trim();
    if (!text) return;

    outputText.placeholder = "Processing...";
    
    let sLang = sourceLang.value;
    let tLang = targetLang.value;

    const apiSource = sLang === "auto" ? "en" : sLang;

    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${apiSource}|${tLang}`;
        const res = await fetch(url);
        const data = await res.json();
        outputText.value = data.responseData.translatedText;
    } catch (err) {
        showToast("Connection Error");
    }
}

// Clear Logic
function clearInput() {
    inputText.value = "";
    outputText.value = "";
    count.innerText = "0 / 2000";
}

// Swap Logic
document.getElementById("swapBtn").onclick = () => {
    if(sourceLang.value === "auto") {
        showToast("Select a language to swap");
        return;
    }
    const temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp;
};

// Speak Logic (Text-to-Speech)
function speakText(id) {
    const val = document.getElementById(id).value;
    if (!val) return;
    const utterance = new SpeechSynthesisUtterance(val);
    utterance.lang = id === "inputText" ? (sourceLang.value === "auto" ? "en-US" : sourceLang.value) : targetLang.value;
    window.speechSynthesis.speak(utterance);
}

// Microphone Logic (Speech-to-Text)
let recognition;
function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        showToast("Speech recognition not supported in this browser.");
        return;
    }

    if (recognition) {
        recognition.stop();
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = sourceLang.value === "auto" ? "en-US" : sourceLang.value;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const micIcon = document.getElementById("micIcon");
    
    recognition.onstart = () => {
        micIcon.classList.add("recording");
        showToast("Listening...");
    };

    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        if (inputText.value) {
            inputText.value += " " + speechToText;
        } else {
            inputText.value = speechToText;
        }
        updateCounter();
    };

    recognition.onerror = (event) => {
        showToast("Error status: " + event.error);
        micIcon.classList.remove("recording");
        recognition = null;
    };

    recognition.onend = () => {
        micIcon.classList.remove("recording");
        recognition = null;
    };

    recognition.start();
}

// Copy Logic
function copyText() {
    if(!outputText.value) return;
    navigator.clipboard.writeText(outputText.value);
    showToast("Copied to clipboard");
}

// Toast
function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 2500);
}
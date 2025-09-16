<template>
  <div class="Flare-Dust-typewriter" style="text-align: center;">
    <span class="qm">“ </span>
    <span ref="text" class="msg"></span>
    <span class="qm"> ”</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import TypeIt from "typeit";

const text = ref(null);
let typeItInstance = null;

const fallbackQuotes = [
  "星辰大海，永不止步",
  "未来可期，光芒万丈",
  "心怀浪漫宇宙，也珍惜人间日常",
  "热爱可抵岁月漫长",
  "所有的美好，都会如约而至"
];

let quotes = [];
let quoteIndex = 0;

// 🔹 获取 API 语录
async function fetchQuote() {
  try {
    const res = await fetch("https://v1.hitokoto.cn/?encode=json");
    const data = await res.json();
    return data.hitokoto || data.text || null;
  } catch {
    return null;
  }
}

// 🔹 初始化语录数组
async function loadQuotes() {
  for (let i = 0; i < 5; i++) {
    const q = await fetchQuote();
    if (q) quotes.push(q);
  }
  if (quotes.length === 0) quotes.push(...fallbackQuotes);
}

// 🔹 开始打字效果
function startTyping() {
  function typeNextQuote() {
    if (!text.value) return;

    typeItInstance = new TypeIt(text.value, {
      strings: [quotes[quoteIndex]],
      speed: 100,
      deleteSpeed: 60,
      lifeLike: true,
      cursorChar: "<span class='cursorChar'>|</span>",
      waitUntilVisible: true,
      afterComplete: () => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        typeNextQuote();
      }
    }).go();
  }

  typeNextQuote();
}

onMounted(async () => {
  await loadQuotes();
  startTyping();
});

onUnmounted(() => {
  if (typeItInstance) typeItInstance.destroy();
});
</script>

<style scoped>
@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes cursorBlink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

.msg, .qm {
  background: linear-gradient(90deg, #00CED1, #1E90FF, #00CED1);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 10s ease infinite;
  letter-spacing: 1.5px;
  font-family: "STZhongsong", "华文中宋", serif;
  font-size: 30px;
  font-weight: 900;
  text-shadow: 1px 1px 1.2px rgba(0,0,0,0.25);
}

.msg ::v-deep .cursorChar {
  display: inline-block;
  margin-left: 2px;
  background: linear-gradient(90deg, #00CED1, #1E90FF, #00CED1);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 8s linear infinite, cursorBlink 1s step-start infinite;
}

@media screen and (min-width: 960px) and (max-width: 1200px) {
  .msg, .qm { font-size: 22px; }
}
@media (max-width: 960px) {
  .Flare-Dust-typewriter { min-height: 80px; }
  .msg, .qm { font-size: 18px; animation: gradientFlow 7s ease infinite; }
}
</style>
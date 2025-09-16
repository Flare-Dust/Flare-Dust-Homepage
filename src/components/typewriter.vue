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
let quotesIndex = 0; // 当前语录索引

// 备用语录
const fallbackQuotes = [
  "星辰大海，永不止步",
  "未来可期，光芒万丈",
  "心怀浪漫宇宙，也珍惜人间日常",
  "热爱可抵岁月漫长",
  "所有的美好，都会如约而至"
];

// 初始化打字效果
function initializeTypeIt(quotes) {
  if (typeItInstance) {
    typeItInstance.destroy(); // 销毁旧实例
  }

  typeItInstance = new TypeIt(text.value, {
    strings: [quotes[quotesIndex]],
    cursorChar: "<span class='cursorChar'>|</span>",
    speed: 100,
    deleteSpeed: 60,
    deleteDelay: 500,
    lifeLike: true,
    breakLines: false,
    loop: false,
    afterStringTyped: () => {
      setTimeout(() => {
        quotesIndex = (quotesIndex + 1) % quotes.length;
        initializeTypeIt(quotes);
      }, 500);
    },
  }).go();
}

// 获取单条语录（API）
async function fetchQuote() {
  try {
    const response = await fetch("https://v1.hitokoto.cn/?encode=json");
    const data = await response.json();
    return data.hitokoto || data.text || null;
  } catch {
    return null;
  }
}

onMounted(async () => {
  const quotes = [];
  for (let i = 0; i < 5; i++) {
    const q = await fetchQuote();
    if (q) quotes.push(q);
  }
  if (quotes.length === 0) quotes.push(...fallbackQuotes);
  initializeTypeIt(quotes);
});

onUnmounted(() => {
  if (typeItInstance) {
    typeItInstance.destroy();
    typeItInstance = null;
  }
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
  animation: gradientFlow 8s ease infinite;
  letter-spacing: 2px;
  font-family: "STZhongsong", "华文中宋", serif; /* 华文中宋 */
  font-size: 28px;
  font-weight: 900; /* 加粗 */
  text-shadow: 1px 1px 1px rgba(0,0,0,0.3); /* 增强粗感 */
}

.msg ::v-deep .cursorChar {
  display: inline-block;
  margin-left: 2px;
  background: linear-gradient(90deg, #00CED1, #1E90FF, #00CED1);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 6s linear infinite, cursorBlink 1s step-start infinite;
}

@media screen and (min-width: 960px) and (max-width: 1200px) {
  .msg, .qm { font-size: 20px; }
}
@media (max-width: 960px) {
  .Flare-Dust-typewriter { min-height: 76px; }
  .msg, .qm { font-size: 16px; animation: gradientFlow 5s ease infinite; }
}
</style>
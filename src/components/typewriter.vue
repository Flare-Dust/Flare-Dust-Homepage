<template>
  <div class="Flare-Dust-typewriter" style="text-align: center;">
    <span class="qm">“ </span>
    <span ref="text" class="msg fade-text"></span>
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

// 初始化打字效果
function initializeTypeIt(quotes) {
  if (typeItInstance) {
    typeItInstance.destroy();
    text.value.innerHTML = ""; // 清空之前的内容
  }

  typeItInstance = new TypeIt(text.value, {
    strings: quotes,          // 语录数组
    cursorChar: "<span class='cursorChar'>|</span>", // 光标样式
    speed: 100,               // 打字速度
    deleteSpeed: 70,          // 删除速度
    lifeLike: true,           // 模拟真人打字效果
    breakLines: false,        // 不自动换行
    loop: true,               // 循环打字
    beforeString: () => {
      text.value.classList.remove("fade-in");
      text.value.classList.add("fade-out"); // 文本切换时淡出效果
    },
    afterString: () => {
      setTimeout(() => {
        text.value.classList.remove("fade-out");
        text.value.classList.add("fade-in"); // 文本切换后淡入效果
      }, 150);
    }
  }).go();
}

// 获取单条语录（来自 API）
async function fetchQuote() {
  try {
    const response = await fetch("https://v1.hitokoto.cn/?encode=json");
    const data = await response.json();
    return data.hitokoto || data.text || null;
  } catch {
    return null; // 如果API失败，返回空值
  }
}

// 页面加载时获取语录并初始化
onMounted(async () => {
  const quotes = [];
  // 获取5条语录
  for (let i = 0; i < 5; i++) {
    const q = await fetchQuote();
    if (q) quotes.push(q);
  }

  // 如果API失败，则使用备用语录
  if (quotes.length === 0) quotes.push(...fallbackQuotes);
  
  initializeTypeIt(quotes);
});

// 页面卸载时销毁打字实例
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

/* 光标闪烁动画 */
@keyframes cursorBlink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

/* 文本样式和渐变动画 */
.msg, .qm {
  background: linear-gradient(90deg, #00CED1, #1E90FF, #00CED1);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 8s ease infinite; /* 渐变流动效果 */
  letter-spacing: 2px;
  font-family: Arial, sans-serif;
  font-size: 25px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25); /* 文字阴影效果 */
}

/* 光标样式与渐变动画 */
.msg ::v-deep .cursorChar {
  display: inline-block;
  margin-left: 2px;
  background: linear-gradient(90deg, #00CED1, #1E90FF, #00CED1);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 6s linear infinite, cursorBlink 1s step-start infinite;
}

/* 文本淡入淡出效果 */
.fade-text { transition: opacity 0.8s ease; }
.fade-in { opacity: 1; }
.fade-out { opacity: 0; }

@media screen and (min-width: 960px) and (max-width: 1200px) {
  .msg, .qm { font-size: 20px; }
}

@media (max-width: 960px) {
  .Flare-Dust-typewriter { min-height: 76px; }
  .msg, .qm { font-size: 16px; animation: gradientFlow 5s ease infinite; }
}
</style>
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
  // 如果已有 TypeIt 实例则销毁
  if (typeItInstance) {
    typeItInstance.destroy();
  }

  // 创建新的 TypeIt 实例
  typeItInstance = new TypeIt(text.value, {
    strings: [quotes[quotesIndex]], // 当前语录
    cursorChar: "<span class='cursorChar'>|</span>", // 光标样式
    speed: 100,                      // 打字速度
    deleteSpeed: 50,                 // 删除速度
    deleteDelay: 500,                // 删除延迟
    lifeLike: true,                  // 模拟真人打字效果
    breakLines: false,               // 不自动换行
    loop: false,                     // 不循环
    afterStringTyped: () => {        // 当前语录播放完后切换
      setTimeout(() => {
        // 更新语录索引
        quotesIndex = (quotesIndex + 1) % quotes.length;
        initializeTypeIt(quotes); // 重新初始化并加载下一条语录
      }, 500); // 延迟500ms后切换
    },
    // 删除效果
    deleteDelay: 500,               // 删除延迟
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

  // 启动打字效果
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

@media screen and (min-width: 960px) and (max-width: 1200px) {
  .msg, .qm { font-size: 20px; }
}

@media (max-width: 960px) {
  .Flare-Dust-typewriter { min-height: 76px; }
  .msg, .qm { font-size: 16px; animation: gradientFlow 5s ease infinite; }
}
</style>
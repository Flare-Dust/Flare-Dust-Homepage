<template>
  <div class="Flare-Dust-typewriter" style="text-align: center;">
    <span class="qm">“</span>
    <span ref="text" class="msg"></span>
    <span class="qm">”</span>
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

// 获取语录的函数，API故障时会使用备用语录
async function fetchQuote() {
  try {
    const res = await fetch("https://v1.hitokoto.cn/?encode=json");
    const data = await res.json();
    return data.hitokoto || data.text || null;
  } catch {
    return null;
  }
}

// 加载语录
async function loadQuotes() {
  for (let i = 0; i < 5; i++) {
    const q = await fetchQuote();
    if (q) quotes.push(q);
  }
  if (quotes.length === 0) quotes.push(...fallbackQuotes);
}

// 初始化TypeIt实例并开始打字
function startTyping() {
  if (typeItInstance) typeItInstance.destroy();  // 确保销毁之前的实例

  typeItInstance = new TypeIt(text.value, {
    strings: [quotes[quoteIndex]], // 当前显示的语录
    speed: 100,                     // 打字速度
    deleteSpeed: 60,                // 删除速度
    lifeLike: true,                 // 模拟真人打字效果
    cursorChar: "<span class='cursorChar'>|</span>",  // 光标样式
    waitUntilVisible: true,         // 确保元素显示完才开始打字
    afterStringTyped: () => {      // 每次打字完成后执行
      setTimeout(() => {
        // 逐字删除并进入下一条语录
        typeItInstance.reset().delete().go();
        quoteIndex = (quoteIndex + 1) % quotes.length; // 切换语录
        startTyping();  // 继续显示下一个语录
      }, 500);
    },
  }).go();
}

onMounted(async () => {
  await loadQuotes();
  startTyping(); // 启动打字效果
});

onUnmounted(() => {
  if (typeItInstance) {
    typeItInstance.destroy(); // 销毁实例
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
  animation: gradientFlow 10s ease infinite; /* 渐变流动效果 */
  letter-spacing: 1.5px; /* 字距 */
  font-family: "STZhongsong", "华文中宋", serif; /* 华文中宋字体 */
  font-size: 30px;
  font-weight: 900; /* 加粗 */
  text-shadow: 1px 1px 1.2px rgba(0, 0, 0, 0.25); /* 文字阴影效果 */
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
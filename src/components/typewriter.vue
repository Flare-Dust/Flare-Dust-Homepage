<template>
  <div class="Flare-Dust-typewriter" style="text-align: center;">
    <span class="qm">“ </span><span ref="text" class="msg"></span><span class="qm"> ”</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import TypeIt from "typeit";

const text = ref(null);
let typeItInstance = null;

// 🔹 备用语录数组（API 挂了时使用）
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
    text.value.innerHTML = "";
  }

  typeItInstance = new TypeIt(text.value, {
    strings: quotes,       // 循环显示语录
    cursorChar: "<span class='cursorChar'>|<span>",
    speed: 100,            // 打字速度
    deleteSpeed: 70,       // 删除速度
    lifeLike: true,        // 模拟真人打字
    breakLines: false,
    loop: true             // 循环显示
  }).go();
}

// 获取单条语录（来自 API）
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

  // 🔹 初始尝试获取 5 条 API 语录
  for (let i = 0; i < 5; i++) {
    const q = await fetchQuote();
    if (q) quotes.push(q);
  }

  // 🔹 如果 API 挂了，启用备用语录
  if (quotes.length === 0) {
    quotes.push(...fallbackQuotes);
  }

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
.msg, .qm {
  color: #ADD8E6; /* 浅蓝色 */
  letter-spacing: 2px;
  font-family: "华文中宋", serif;
  font-size: 25px;
  font-weight: 900; /* 增加字体粗细 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.msg ::v-deep.cursorChar {
  display: inline-block;
  margin-left: 2px;
  color: #ADD8E6; /* 浅蓝色 */
}

@media screen and (min-width: 960px) and (max-width: 1200px) {
  .msg, .qm {
    font-size: 20px;
  }
}

@media (max-width: 960px) {
  .Flare-Dust-typewriter {
    min-height: 76px;
  }

  .msg, .qm {
    font-size: 16px;
  }
}
</style>
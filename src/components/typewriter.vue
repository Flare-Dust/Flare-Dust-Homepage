<template>
  <div class="DazzlingDust-typewriter" style="text-align: center;">
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
    typeItInstance.destroy();  // 销毁上一个实例
    text.value.innerHTML = ""; // 清空文本内容
  }

  typeItInstance = new TypeIt(text.value, {
    strings: quotes,          // 显示语录
    cursorChar: "<span class='cursorChar'>|</span>", // 光标样式
    speed: 100,               // 打字速度
    deleteSpeed: 70,          // 删除速度
    lifeLike: true,           // 模拟真人打字效果
    breakLines: false,        // 不自动换行
    loop: true,               // 循环显示语录
    afterStringTyped: () => {
      setTimeout(() => {
        // 逐字删除并切换到下一条语录
        typeItInstance.reset().delete().go();
      }, 500); // 延迟删除
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
    return null;
  }
}

onMounted(async () => {
  const quotes = [];

  // 获取 5 条语录
  for (let i = 0; i < 5; i++) {
    const q = await fetchQuote();
    if (q) quotes.push(q);
  }

  // 如果 API 请求失败，使用备用语录
  if (quotes.length === 0) {
    quotes.push(...fallbackQuotes);
  }

  // 初始化打字效果
  initializeTypeIt(quotes);
});

onUnmounted(() => {
  if (typeItInstance) {
    typeItInstance.destroy(); // 销毁实例
    typeItInstance = null;
  }
});
</script>

<style scoped>
.msg, .qm {
  color: #00CED1; /* 蓝青色 */
  letter-spacing: 2px;
  font-family: "STZhongsong", "华文中宋", serif; /* 使用华文中宋字体 */
  font-size: 25px;
  font-weight: 900; /* 加粗 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.msg ::v-deep.cursorChar {
  display: inline-block;
  margin-left: 2px;
  color: #00CED1;
}

@media screen and (min-width: 960px) and (max-width: 1200px) {
  .msg, .qm {
    font-size: 20px;
  }
}

@media (max-width: 960px) {
  .DazzlingDust-typewriter {
    min-height: 76px;
  }

  .msg, .qm {
    font-size: 16px;
  }
}
</style>
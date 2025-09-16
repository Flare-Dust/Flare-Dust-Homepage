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
let quotes = []; // 用来存储语录

// 🔹 备用语录数组（API 挂了时使用）
const fallbackQuotes = [
  "星辰大海，永不止步",
  "未来可期，光芒万丈",
  "心怀浪漫宇宙，也珍惜人间日常",
  "热爱可抵岁月漫长",
  "所有的美好，都会如约而至"
];

// 初始化打字效果
function initializeTypeIt() {
  if (typeItInstance) {
    typeItInstance.destroy();  // 销毁上一个实例
    text.value.innerHTML = ""; // 清空文本内容
  }

  // 每次从新的语录中开始打字
  typeItInstance = new TypeIt(text.value, {
    strings: quotes,          // 显示语录
    cursorChar: "<span class='cursorChar'>|</span>", // 光标样式
    speed: 100,               // 打字速度
    deleteSpeed: 70,          // 删除速度
    lifeLike: true,           // 模拟真人打字效果
    breakLines: false,        // 不自动换行
    loop: false,              // 只显示一次
    afterStringTyped: () => {
      setTimeout(() => {
        // 逐字删除并切换到下一条语录
        typeItInstance.reset().delete().go();
        setTimeout(() => {
          loadNextQuote(); // 加载下一个语录
        }, 1000); // 延迟后切换语录
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

// 加载下一条语录
async function loadNextQuote() {
  const newQuote = await fetchQuote();
  if (newQuote) {
    quotes = [newQuote]; // 只显示一条新语录
    initializeTypeIt();  // 重新初始化打字效果
  } else {
    // 如果获取不到新语录，使用备用语录
    quotes = [fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]];
    initializeTypeIt();  // 重新初始化打字效果
  }
}

onMounted(() => {
  loadNextQuote(); // 初始化加载第一个语录
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
  color: #00CED1; /* 光标颜色 */
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
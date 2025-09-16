<template>
  <div class="Flare-Dust-typewriter" style="text-align: center;">
    <span class="qm">“ </span><span ref="text" class="msg"></span><span class="qm"> ”</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TypeIt from 'typeit'
import config from '../config.js';  // 引入外部配置（如果有）

const text = ref(null)

onMounted(() => {
  let configdata = null;
  
  // 获取外部配置
  if (import.meta.env.VITE_CONFIG) {
    configdata = JSON.parse(import.meta.env.VITE_CONFIG);
  } else {
    configdata = config;  // 默认配置
  }

  // 初始化打字效果
  new (TypeIt)(text.value, {
    strings: configdata.typeWriterStrings, // 循环显示语录
    cursorChar: "<span class='cursorChar' style='font-size: 26px;color: #00CED1;'>|</span>", // 光标字符
    speed: 100,            // 打字速度
    deleteSpeed: 70,       // 删除速度
    lifeLike: true,        // 模拟真人打字
    cursor: true,          // 显示光标
    breakLines: false,     // 不换行
    loop: true,            // 循环显示
  }).go()
})
</script>

<style scoped>
.msg, .qm {
  color: #00CED1; /* 蓝青色 */
  letter-spacing: 2px;
  font-family: "华文中宋", serif; /* 字体设置为华文中宋 */
  font-size: 25px;
  font-weight: bold; /* 加粗 */
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
  .Flare-Dust-typewriter {
    min-height: 76px;
  }

  .msg, .qm {
    font-size: 16px;
  }
}
</style>
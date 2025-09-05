<template>
    <div class="DazzlingDust-typewriter" style="text-align: center;"><span class="qm">“ </span><span ref="text" class="msg"></span><span class="qm"> ”</span></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TypeIt from 'typeit'

const text = ref(null)

// 获取语录API数据
async function fetchQuotes(count = 20) {
    const quotes = [];
    try {
        // 获取多条语录
        for (let i = 0; i < count; i++) {
            const response = await fetch('https://api.mir6.com/api/yulu');
            const data = await response.json();
            if (data.code === 200 && data.text) {
                quotes.push(data.text);
            }
            // 添加延迟避免请求过快
            if (i < count - 1) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        
        // 如果成功获取到语录，返回
        if (quotes.length > 0) {
            console.log(`成功获取${quotes.length}条语录`);
            return quotes;
        }
    } catch (error) {
        console.error('获取语录失败:', error);
    }
    
    // 如果API获取失败，返回默认语录
    console.warn('API获取失败，使用默认语录');
    return [
        "每一次跌倒，都是为了更好地站起来",
        "生活不止眼前的苟且，还有诗和远方的田野",
        "愿你出走半生，归来仍是少年",
        "山高路远，我们继续前行",
        "星光不问赶路人，时光不负有心人"
    ];
}

onMounted(async () => {
    // 从API获取语录
    const quotes = await fetchQuotes(6); // 获取6条语录
    
    new (TypeIt)(text.value, {
        strings: quotes,
        cursorChar: "<span class='cursorChar' style='font-size: 26px;color: var(--DazzlingDust-vcard-color);'>|<span>",//用于光标的字符。HTML也可以
        speed: 150,
        lifeLike: true,// 使打字速度不规则
        cursor: true,//在字符串末尾显示闪烁的光标
        breakLines: false,// 控制是将多个字符串打印在彼此之上，还是删除这些字符串并相互替换
        loop: true,//是否循环
    }).go()
})

</script>
 
<style scoped>
.msg, .qm{
    color: var(--DazzlingDust-vcard-color);
    letter-spacing: 2px;
    font-family: Arial, sans-serif;
    font-size: 25px;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}
 
.msg ::v-deep.cursorChar {
    display: inline-block;
    margin-left: 2px;
}
@media screen and (min-width: 960px) and (max-width: 1200px)  {
    .msg, .qm{
        font-size: 20px;
    }
}
@media (max-width: 960px){
    .DazzlingDust-typewriter{
        min-height: 76px;   
    }
    .msg, .qm{
        font-size: 16px;
    }
}
</style>
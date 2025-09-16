<template>
  <div class="DazzlingDust-typewriter" style="text-align: center;">
    <span class="qm">“ </span><span ref="text" class="msg"></span><span class="qm"> ”</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import TypeIt from 'typeit'

const text = ref(null)
let typeItInstance = null
let updateTimer = null // 用于去抖动更新
let displayedQuotes = new Set() // 记录已经显示过的语录
let backgroundQuotes = [] // 后台静默获取的语录，不主动显示

// 初始化TypeIt打字效果 - 用于首次显示
function initializeTypeIt(quotes, isFirstTime = true) {
    if (typeItInstance) {
        typeItInstance.destroy(); // 销毁旧实例
        text.value.innerHTML = ''; // 清空内容
    }

    console.log(`🎯 ${isFirstTime ? '初始化' : '更新'}打字效果，共${quotes.length}条语录`);

    const isError = quotes.length === 1 && (quotes[0].includes('失败') || quotes[0].includes('错误'));

    if (!isError && isFirstTime) {
        // 记录首次显示的语录
        quotes.forEach(quote => displayedQuotes.add(quote));
        console.log(`📝 记录已显示语录，当前已显示${displayedQuotes.size}条`);
    }

    // 使用 TypeIt 进行打字效果
    typeItInstance = new TypeIt(text.value, {
        strings: quotes,
        cursorChar: "<span class='cursorChar' style='font-size: 26px;color: var(--DazzlingDust-vcard-color);'>|<span>",
        speed: isError ? 100 : 150,
        lifeLike: true,
        cursor: true,
        breakLines: false,
        loop: !isError,
    }).go();
}

// 静默存储后台获取的语录
function storeBackgroundQuotes(allQuotes) {
    const newQuotes = allQuotes.filter(quote => !displayedQuotes.has(quote));

    if (newQuotes.length === 0) {
        console.log('📝 后台无新语录');
        return;
    }

    backgroundQuotes = allQuotes.slice(); // 保存所有语录
    console.log(`📚 后台静默获取完成，新增${newQuotes.length}条语录 (总共${backgroundQuotes.length}条可用)`);
}

// 获取一批语录（每批最多5条）
async function fetchBatch(batchSize = 5) {
    const quotes = [];

    try {
        console.log(`📦 获取${batchSize}条语录...`);

        for (let i = 0; i < batchSize; i++) {
            try {
                const response = await fetch('https://v1.hitokoto.cn/?encode=json', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const raw = await response.text();
                let data;
                try {
                    data = JSON.parse(raw);
                } catch (parseError) {
                    throw new Error("返回的不是合法 JSON: " + raw.slice(0, 100));
                }

                // 确保有text字段
                if (!data.text && data.hitokoto) {
                    data.text = data.hitokoto;
                }

                if (data && data.text) {
                    quotes.push(data.text);
                    console.log(`✅ 获取: "${data.text}"`);
                }

                if (i < batchSize - 1) {
                    await new Promise(resolve => setTimeout(resolve, 200)); // 小延迟，避免请求过快
                }

            } catch (fetchError) {
                console.error(`❌ 单条获取失败:`, fetchError);
                continue;
            }
        }

    } catch (error) {
        console.error('❌ 批次获取错误:', error);
    }

    return quotes;
}

// 渐进式获取语录
async function fetchQuotesProgressively(onFirstBatch, onUpdate, maxBatches = 10) {
    const allQuotes = [];
    const batchSize = 5;
    let consecutiveFailures = 0;
    const maxConsecutiveFailures = 2;
    let firstBatchDisplayed = false;

    console.log(`🎯 开始渐进式获取语录，每批次${batchSize}条，最多${maxBatches}批次`);

    for (let batch = 0; batch < maxBatches; batch++) {
        console.log(`📦 第${batch + 1}批次`);

        const batchQuotes = await fetchBatch(batchSize);

        if (batchQuotes.length > 0) {
            allQuotes.push(...batchQuotes);
            consecutiveFailures = 0;
            console.log(`✅ 已累计获取 ${allQuotes.length} 条语录`);

            if (!firstBatchDisplayed) {
                console.log(`🚀 第一批获取成功，立即显示${allQuotes.length}条语录`);
                onFirstBatch(allQuotes.slice()); // 显示第一批
                firstBatchDisplayed = true;
            } else {
                console.log(`🔄 更新显示，现有${allQuotes.length}条语录`);
                onUpdate(allQuotes.slice()); // 更新显示
            }

            if (batch < maxBatches - 1) {
                console.log('⏳ 批次间隔500ms...');
                await new Promise(resolve => setTimeout(resolve, 500)); // 批次间隔
            }
        } else {
            consecutiveFailures++;
            console.warn(`⚠️ 第${batch + 1}批次获取失败 (连续失败${consecutiveFailures}次)`);

            if (!firstBatchDisplayed && batch === 0) {
                console.warn('❌ 第一批获取失败，返回错误');
                return false;
            }

            if (consecutiveFailures >= maxConsecutiveFailures) {
                console.warn(`⚠️ 连续${maxConsecutiveFailures}批次失败，停止后续获取`);
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // 失败后稍等重试
        }
    }

    console.log(`🎉 渐进式获取完成，总共获取${allQuotes.length}条语录`);
    return firstBatchDisplayed;
}

onMounted(async () => {
    console.log('🚀 开始渐进式获取API语录...');

    // 第一批获取成功的回调 - 立即显示
    const handleFirstBatch = (quotes) => {
        console.log(`🎬 第一批语录显示，共${quotes.length}条`);
        initializeTypeIt(quotes, true); // 初始化打字效果
    };

    // 后续批次获取成功的回调 - 静默存储，不打断当前显示
    const handleUpdate = (allQuotes) => {
        console.log(`📥 后台获取到更多语录，共${allQuotes.length}条`);
        storeBackgroundQuotes(allQuotes);
        console.log('🔇 后续批次已静默处理，不会打断当前打字效果');
    };

    try {
        const success = await fetchQuotesProgressively(handleFirstBatch, handleUpdate);

        if (!success) {
            console.warn('⚠️ 第一批语录获取失败，显示错误提示');
            const errorQuote = ["API获取失败，请稍后刷新页面重试"];
            initializeTypeIt(errorQuote);
        }
    } catch (error) {
        console.error('❌ API获取出现异常:', error);
        const errorQuote = ["网络错误，请检查网络连接后刷新页面"];
        initializeTypeIt(errorQuote);
    }
});

onUnmounted(() => {
    if (typeItInstance) {
        console.log('🧹 清理TypeIt实例');
        typeItInstance.destroy();
        typeItInstance = null;
    }

    if (updateTimer) {
        console.log('🧹 清理更新定时器');
        clearTimeout(updateTimer);
        updateTimer = null;
    }

    console.log('🧹 清理语录相关数据');
    displayedQuotes.clear();
    backgroundQuotes = [];
});
</script>

<style scoped>
.msg, .qm {
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
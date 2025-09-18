<template>
    <div class="Flare-Dust-typewriter" style="text-align: center;"><span class="qm">“ </span><span ref="text" class="msg"></span><span class="qm"> ”</span></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import TypeIt from 'typeit'

const text = ref(null)
let typeItInstance = null
let updateTimer = null // 用于去抖动更新
let displayedQuotes = new Set() // 记录已经显示过的语录
let backgroundQuotes = [] // 后台静默获取的语录，不主动显示

// API获取成功前不显示任何内容，等待获取完成后直接显示结果

// 初始化TypeIt打字效果 - 用于首次显示
function initializeTypeIt(quotes, isFirstTime = true) {
    // 如果已有实例，先销毁
    if (typeItInstance) {
        typeItInstance.destroy();
        text.value.innerHTML = ''; // 清空内容
    }
    
    console.log(`🎯 ${isFirstTime ? '初始化' : '更新'}打字效果，共${quotes.length}条语录`);
    
    // 判断是否是错误信息
    const isError = quotes.length === 1 && (quotes[0].includes('失败') || quotes[0].includes('错误'));
    
    if (!isError && isFirstTime) {
        // 记录首次显示的语录
        quotes.forEach(quote => displayedQuotes.add(quote));
        console.log(`📝 记录已显示语录，当前已显示${displayedQuotes.size}条`);
    }
    
    typeItInstance = new TypeIt(text.value, {
        strings: quotes,
        cursorChar: "<span class='cursorChar' style='font-size: 26px;color: var(--Flare-Dust-vcard-color);'>|<span>",
        speed: isError ? 100 : 150, // 错误信息打字更快
        lifeLike: true,
        cursor: true,
        breakLines: false,
        loop: !isError, // 错误信息不循环，语录正常循环
    }).go();
}

// 静默存储后台获取的语录，不打断当前显示
function storeBackgroundQuotes(allQuotes) {
    // 筛选出未显示过的新语录
    const newQuotes = allQuotes.filter(quote => !displayedQuotes.has(quote));
    
    if (newQuotes.length === 0) {
        console.log('📝 后台无新语录');
        return;
    }
    
    // 静默存储新语录，不打断当前显示
    backgroundQuotes = allQuotes.slice(); // 保存完整的语录列表
    console.log(`📚 后台静默获取完成，新增${newQuotes.length}条语录 (总共${backgroundQuotes.length}条可用)`);
    console.log('👁️ 当前显示不会被打断，后台语录已准备就绪');
    console.log('💡 提示：刷新页面可获得包含新语录的完整体验');
}

// 可选：手动切换到后台语录（当前未使用，但保留扩展性）
function switchToBackgroundQuotes() {
    if (backgroundQuotes.length === 0) {
        console.log('📝 没有后台语录可供切换');
        return;
    }
    
    const newQuotes = backgroundQuotes.filter(quote => !displayedQuotes.has(quote));
    if (newQuotes.length === 0) {
        console.log('📝 没有新的后台语录');
        return;
    }
    
    console.log(`🔄 手动切换到后台语录，${newQuotes.length}条新内容`);
    newQuotes.forEach(quote => displayedQuotes.add(quote));
    initializeTypeIt(newQuotes, false);
}

// 获取一批语录（每批最多5条)
// 主用 API： https://api.apiopen.top/api/sentences
// 备用 API： https://v1.jinrishici.com/all.json
async function fetchBatch(batchSize = 5) {
    const quotes = [];
    
    try {
        console.log(`📦 获取${batchSize}条语录...`);
        
        for (let i = 0; i < batchSize; i++) {
            try {
                // ===== 主用 API：随机语录（api.apiopen.top） =====
                const response = await fetch('https://api.apiopen.top/api/sentences', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`主API HTTP Error: ${response.status}`);
                }
                
                const text = await response.text();
                const data = JSON.parse(text);
                
                // 兼容几种可能的返回格式，优先取最合理的字段
                let quoteText = "";
                if (data) {
                    // 常见结构： { result: { name: "..." } } 或 { result: [ { name: "..." } ] }
                    if (data.result) {
                        if (Array.isArray(data.result)) {
                            quoteText = data.result[0]?.name || (typeof data.result[0] === 'string' ? data.result[0] : "");
                        } else if (typeof data.result === 'object') {
                            quoteText = data.result.name || data.result.sentence || data.result.content || "";
                        } else if (typeof data.result === 'string') {
                            quoteText = data.result;
                        }
                    }
                    // 其它备选字段
                    if (!quoteText && data.name) quoteText = data.name;
                    if (!quoteText && data.content) quoteText = data.content;
                    if (!quoteText && data.hitokoto) quoteText = data.hitokoto;
                    if (!quoteText && data.text) quoteText = data.text;
                }
                
                if (quoteText) {
                    quotes.push(quoteText);
                    console.log(`✅ 获取 (主API): "${quoteText}"`);
                } else {
                    // 如果主API返回格式无法识别，则抛出以触发备用API
                    throw new Error('主API返回格式无法识别或无内容');
                }
                
                // 批内延迟
                if (i < batchSize - 1) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                
            } catch (fetchError) {
                console.error(`⚠️ 主API失败或返回异常，尝试备用API:`, fetchError);
                
                // ===== 备用 API：古诗词（jinrishici） =====
                try {
                    const res2 = await fetch('https://v1.jinrishici.com/all.json', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                        }
                    });
                    
                    if (!res2.ok) {
                        throw new Error(`备用API错误: ${res2.status}`);
                    }
                    
                    const text2 = await res2.text();
                    const data2 = JSON.parse(text2);
                    
                    // jinrishici 常见字段： { content: "...", origin: {...}, author: "..." }
                    let backupText = "";
                    if (data2) {
                        backupText = data2.content || data2.origin?.content || "";
                        // 可以拼接，保持简洁（可选）
                        if (!backupText && data2.origin && typeof data2.origin === 'object') {
                            // origin 里有时是 { title: "...", content: "..." }
                            backupText = data2.origin.content || "";
                        }
                    }
                    
                    if (backupText) {
                        quotes.push(backupText);
                        console.log(`✅ 获取 (备用API): "${backupText}"`);
                    } else {
                        console.warn('❌ 备用API返回空内容或格式不支持');
                    }
                    
                    // 批内延迟
                    if (i < batchSize - 1) {
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                } catch (backupError) {
                    console.error('❌ 备用API也失败:', backupError);
                    // 本条跳过，继续下一条
                }
            }
        }
        
    } catch (error) {
        console.error('❌ 批次获取错误:', error);
    }
    
    return quotes;
}

// 渐进式获取语录 - 第一批获取后立即显示，后续批次在后台继续
async function fetchQuotesProgressively(onFirstBatch, onUpdate, maxBatches = 10) {
    const allQuotes = [];
    const batchSize = 5; // 每次最多5条
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
            
            // 第一批获取成功后立即显示
            if (!firstBatchDisplayed) {
                console.log(`🚀 第一批获取成功，立即显示${allQuotes.length}条语录`);
                onFirstBatch(allQuotes.slice()); // 传递副本
                firstBatchDisplayed = true;
            } else {
                // 后续批次获取成功后更新显示
                console.log(`🔄 更新显示，现有${allQuotes.length}条语录`);
                onUpdate(allQuotes.slice()); // 传递副本
            }
            
            // 批次间隔
            if (batch < maxBatches - 1) {
                console.log('⏳ 批次间隔500ms...');
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } else {
            consecutiveFailures++;
            console.warn(`⚠️ 第${batch + 1}批次获取失败 (连续失败${consecutiveFailures}次)`);
            
            // 如果第一批就失败了，返回错误
            if (!firstBatchDisplayed && batch === 0) {
                console.warn('❌ 第一批获取失败，返回错误');
                return false;
            }
            
            // 连续失败太多次就停止
            if (consecutiveFailures >= maxConsecutiveFailures) {
                console.warn(`⚠️ 连续${maxConsecutiveFailures}批次失败，停止后续获取`);
                break;
            }
            
            // 失败后稍微等待再重试
            await new Promise(resolve => setTimeout(resolve, 1000));
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
        initializeTypeIt(quotes, true); // 标记为首次显示
    };
    
    // 后续批次获取成功的回调 - 静默存储，不打断当前显示
    const handleUpdate = (allQuotes) => {
        console.log(`📥 后台获取到更多语录，共${allQuotes.length}条`);
        
        // 静默存储，不打断当前显示的内容
        storeBackgroundQuotes(allQuotes);
        
        console.log('🔇 后续批次已静默处理，不会打断当前打字效果');
    };
    
    try {
        // 使用渐进式获取
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
})

// 组件销毁时清理TypeIt实例和相关数据
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
    
    // 清理语录相关数据
    console.log('🧹 清理语录相关数据');
    displayedQuotes.clear();
    backgroundQuotes = [];
})

</script>
 
<style scoped>
.msg, .qm{
    color: var(--Flare-Dust-vcard-color);
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
    .Flare-Dust-typewriter{
        min-height: 76px;   
    }
    .msg, .qm{
        font-size: 16px;
    }
}
</style>
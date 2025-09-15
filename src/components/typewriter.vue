<template>
  <div class="app-container">
    <h1 class="title">语录展示</h1>
    <button @click="loadQuotes" class="btn">获取语录</button>
    <ul class="quote-list">
      <li v-for="(quote, index) in quotes" :key="index" class="quote-item">
        {{ quote }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "QuoteApp",
  data() {
    return {
      quotes: [],
      // ✅ 备用语录，API 挂掉时使用
      fallbackQuotes: [
        "星辰大海，路在脚下。",
        "代码即诗，逻辑亦美。",
        "再平凡的石头，也有属于它的光。",
        "保持热爱，奔赴山海。",
        "静下来，才听得见心声。"
      ]
    };
  },
  mounted() {
    // ✅ 页面加载时自动加载语录
    this.loadQuotes();
  },
  methods: {
    async loadQuotes() {
      let result = await fetchBatch(5);
      // 如果 API 没返回数据，就用备用语录
      if (!result || result.length === 0) {
        console.warn("⚠️ API 无响应，使用备用语录。");
        result = this.fallbackQuotes;
      }
      this.quotes = result;
    }
  }
};

// ✅ 批量获取语录
async function fetchBatch(batchSize = 5) {
  const quotes = [];

  try {
    console.log(`📦 获取${batchSize}条语录...`);

    for (let i = 0; i < batchSize; i++) {
      try {
        const response = await fetch("https://v1.hitokoto.cn/?encode=json", {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*"
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

        // 👇 兼容字段
        if (!data.text && data.hitokoto) {
          data.text = data.hitokoto;
        }

        if (data && data.text) {
          quotes.push(data.text);
          console.log(`✅ 获取: "${data.text}"`);
        }

        if (i < batchSize - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (fetchError) {
        console.error(`❌ 单条获取失败:`, fetchError);
        continue;
      }
    }
  } catch (error) {
    console.error("❌ 批次获取错误:", error);
  }

  return quotes;
}
</script>

<style scoped>
.app-container {
  text-align: center;
  padding: 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  margin-bottom: 20px;
  cursor: pointer;
}

.quote-list {
  list-style: none;
  padding: 0;
}

.quote-item {
  margin: 10px 0;
  font-size: 18px;
  color: #333;
}
</style>
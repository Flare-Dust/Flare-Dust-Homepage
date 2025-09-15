async function fetchBatch(batchSize = 5) {
  const quotes = [];

  try {
    console.log(`📦 获取${batchSize}条语录...`);

    for (let i = 0; i < batchSize; i++) {
      try {
        const response = await fetch("https://v1.hitokoto.cn/?encode=json", {
          method: "GET",
          headers: {
            "Accept": "application/json, text/plain, */*"
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        // 避免 text/ref 命名冲突
        const raw = await response.text();
        let data;
        try {
          data = JSON.parse(raw);
        } catch (parseError) {
          throw new Error("返回的不是合法 JSON: " + raw.slice(0, 100));
        }

        if (data && data.hitokoto) {
          quotes.push(data.hitokoto);
          console.log(`✅ 获取: "${data.hitokoto}"`);
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
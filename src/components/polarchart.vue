<template>
  <!-- GitHub统计卡片 -->
  <div class="github-stats-card">
    <div class="github-stats-container">
      <img 
        src="https:https://github-readme-stats.vercel.app/api?username=Flare-Dust&show_icons=true&theme=tokyonight&hide_title=true&count_private=true&bg_color=00000000&border_color=00000000"
        alt="GitHub Stats"
        class="github-stats-image"
        @error="onImageError"
        @load="onImageLoad"
      />
      <div v-if="loading" class="loading-placeholder">
        <div class="loading-text">加载GitHub统计中...</div>
      </div>
      <div v-if="error" class="error-placeholder">
        <div class="error-text">加载失败</div>
      </div>
    </div>
  </div>
  
  <!-- 访问计数器卡片 -->
  <div class="visitor-counter-card">
    <div class="visitor-counter">
      <img 
        src="https://count.getloli.com/@Flare-Dust?name=Flare-Dust&theme=morden-num&padding=9&offset=0&align=center&scale=1&pixelated=1&darkmode=auto"
        alt="访问计数器"
        class="counter-image"
        @error="onCounterError"
        @load="onCounterLoad"
      />
      <div v-if="counterLoading" class="counter-loading">
        <div class="counter-loading-text">加载计数器中...</div>
      </div>
      <div v-if="counterError" class="counter-error">
        <div class="counter-error-text">计数器加载失败</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'polarChart',
  data() {
    return {
      loading: true,
      error: false,
      counterLoading: true,
      counterError: false,
    };
  },
  methods: {
    onImageLoad() {
      this.loading = false;
      this.error = false;
    },
    onImageError() {
      this.loading = false;
      this.error = true;
    },
    onCounterLoad() {
      this.counterLoading = false;
      this.counterError = false;
    },
    onCounterError() {
      this.counterLoading = false;
      this.counterError = true;
    },
  },
};
</script>

<style scoped>
.github-stats-card {
  margin: 1.25rem;
  margin-top: -1rem;
  padding: -0.5rem;
  backdrop-filter: blur(var(--DazzlingDust-blur));
  border-radius: 5%;
  color: var(--DazzlingDust-vcard-color);
  max-width: 300px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 添加与v-card相同的样式 */
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.visitor-counter-card {
  margin: 1.25rem;
  margin-top: -1rem;
  padding: 0.5rem;
  backdrop-filter: blur(var(--DazzlingDust-blur));
  border-radius: 5%;
  color: var(--DazzlingDust-vcard-color);
  max-width: 300px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 添加与v-card相同的样式 */
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.github-stats-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.github-stats-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.loading-placeholder,
.error-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  text-align: center;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

.error-text {
  color: #ff5722;
  font-size: 14px;
}

/* 访问计数器样式 */
.visitor-counter {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.counter-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.counter-loading,
.counter-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  text-align: center;
}

.counter-loading-text,
.counter-error-text {
  color: #666;
  font-size: 12px;
}

.counter-error-text {
  color: #ff5722;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .github-stats-card {
    max-width: 270px;
    margin: 1.25rem;
  }
  
  .visitor-counter-card {
    max-width: 270px;
    margin: 1.25rem;
  }
}
</style>
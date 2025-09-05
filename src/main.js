import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Iconify支持
import { Icon } from '@iconify/vue'

// 自定义图标集配置
const customIcons = {
  component: Icon,
}

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'iconify', // 使用Iconify作为默认图标集
        aliases: {
          // 为常用图标创建别名，保持向后兼容
          'mdi-skip-previous': 'material-symbols:skip-previous',
          'mdi-play': 'material-symbols:play-arrow',
          'mdi-pause': 'material-symbols:pause',
          'mdi-skip-next': 'material-symbols:skip-next',
          'mdi-cog': 'material-symbols:settings',
          'mdi-key-chain': 'material-symbols:vpn-key',
          'mdi-information': 'material-symbols:info',
          '$error': 'material-symbols:error',
        },
        sets: {
          iconify: customIcons,
        },
    },
    defaults: {
        VCard: {
            variant: 'tonal',
        },
    },
})
const app = createApp(App);
app.config.warnHandler = () => {};
app.use(vuetify).mount('#app')


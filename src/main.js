import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入图片懒加载插件
import lazyPlugin from 'vue3-lazy'
//引入element-plus的message组件的样式
import 'element-plus/es/components/message/style/css'

//注册全局事件总线
import mitt from 'mitt'

const $bus = {}

const emitter = mitt()

$bus.on = emitter.on

$bus.emit = emitter.emit

$bus.off = emitter.off

const app = createApp(App)
//在注册全局方法时需要这样找到app实例
app._context.app.config.globalProperties.$bus = $bus

import * as ELIcons from '@element-plus/icons-vue'
for (let iconName in ELIcons) {
    app.component(iconName, ELIcons[iconName])
}


app.use(store).use(router).use(lazyPlugin, {
    loading: require('@/assets/loading.jpg'), // 图片加载时默认图片
    error: require('@/assets/error.jpg')// 图片加载失败时默认图片
}).mount('#app')




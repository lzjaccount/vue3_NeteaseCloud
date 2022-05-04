<template>
  <div class="aside">
    <el-menu
      :active-text-color="`var(--${theme}-text-tint)`"
      :background-color="`var(--${theme}-aside-bg-color)`"
      class="el-menu-vertical-demo"
      default-active="1"
      :text-color="`var(--${theme}-text-color)`"
      style="border: 0"
    >
      <el-menu-item index="1" @click="$router.push('/recommend')">
        <el-icon><span class="iconfont icon-yinle1"></span></el-icon>
        <span>个性推荐</span>
      </el-menu-item>
      <el-menu-item index="2" @click="$router.push('/songlist')">
        <el-icon><span class="iconfont icon-gedan2"></span></el-icon>
        <span>歌单</span>
      </el-menu-item>
      <el-menu-item index="3" @click="$router.push('/rankinglist')">
        <el-icon><span class="iconfont icon-paixing"></span></el-icon>
        <span>排行榜</span>
      </el-menu-item>
      <el-menu-item index="4" @click="$router.push('/artist')">
        <el-icon><span class="iconfont icon-yonghutianchong"></span></el-icon>
        <span>歌手</span>
      </el-menu-item>
      <el-menu-item index="5" @click="$router.push('/mv')">
        <el-icon><span class="iconfont icon-shexiangtou"></span></el-icon>
        <span>MV</span>
      </el-menu-item>
      <el-menu-item index="6" @click="$router.push('/newmusic')">
        <el-icon><span class="iconfont icon-yinle"></span></el-icon>
        <span>最新音乐</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  setup() {
    //获取操作vuex的方法
    let { state } = useStore();

    //获取主题颜色
    let theme = computed(() => {
      return state.theme;
    });
    return {
      theme,
    };
  },
};
</script>

<style lang="scss" scoped>
.aside {
  width: 16%;
  height: 100%;
  .el-menu-vertical-demo {
    height: 100%;
  }
}
</style>
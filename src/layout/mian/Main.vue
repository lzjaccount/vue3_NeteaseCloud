<template>
  <div
    class="main"
    :style="{
      'background-color': `var(--${theme}-bg-color)`,
      color: `var(--${theme}-text-color)`,
    }"
  >
    <div class="main-box">
      <router-view></router-view>
    </div>
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
.main {
  width: 84%;
  padding: 20px 25px;
  overflow: hidden;
  background-color: #fff;
  .main-box {
    width: calc(100% + 45px);
    height: 100%;
    overflow-y: scroll;
  }
}
</style>
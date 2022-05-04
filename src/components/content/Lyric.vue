<template>
  <div class="lyric">
    <div class="box">
      <div
        class="content"
        :style="{
          transform: `translateY(-${activeLyricIndex * 40}px)`,
        }"
      >
        <div
          class="item"
          v-for="(item, index) in lyric"
          :key="index"
          :style="{
            color:
              index == activeLyricIndex
                ? `var(--${theme}-text-tint)`
                : `var(--${theme}-text-color)`,
          }"
        >
          {{ item.content ? item.content : "&nbsp;" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  props: ["lyric", "activeLyricIndex"],
  setup() {
    //获取操作vuex的方法
    let { state } = useStore();

    //获取主题颜色
    let theme = computed(() => {
      return state.theme;
    });
    return { theme };
  },
};
</script>

<style lang="scss" scoped>
.lyric {
  position: fixed;
  left: 50%;
  bottom: 70px;
  height: 40px;
  transform: translateX(-50%);
  width: 70%;
  overflow: hidden;
  z-index: 98;
  .box {
    width: calc(100% + 20px);
    height: 40px;
    transition: all 0.5s;
    .content {
      .item {
        text-align: center;
        font-size: 30px;
        line-height: 40px;
        color: var(--light-text-tint);
      }
    }
  }
}
</style>
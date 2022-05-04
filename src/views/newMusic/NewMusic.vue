<template>
  <div class="new-music">
    <div class="type-select">
      <ul>
        <li
          v-for="item in type"
          :key="item.value"
          :style="{
            color:
              item.value == currentType
                ? `var(--${theme}-text-tint)`
                : `var(--${theme}-text-color)`,
            'border-bottom-color':
              item.value == currentType
                ? `var(--${theme}-text-tint)`
                : `var(--${theme}-text-color)`,
          }"
          @click="changeType(item.value)"
        >
          {{ item.content }}
        </li>
      </ul>
    </div>
    <MusicTable :data="playerList" />
  </div>
</template>

<script>
import { getTopSongs, getSongsDetail } from "@/api/newMusic.js";
import { songDetail } from "@/api/album.js";
import { reactive, toRefs, computed } from "vue";
import MusicTable from "@/components/content/MusicTable.vue";
import { useStore } from "vuex";
export default {
  components: {
    MusicTable,
  },
  setup() {
    let data = reactive({
      type: [
        { value: 0, content: "全部" },
        { value: 7, content: "华语" },
        { value: 96, content: "欧美" },
        { value: 8, content: "日本" },
        { value: 16, content: "韩国" },
      ],
      currentType: 0,
      //播放列表
      playerList: [],
    });

    //首先获取全部的最新歌曲
    getNewMusic(0);

    //获取最新歌曲的方法
    function getNewMusic(type) {
      getTopSongs(type).then((res) => {
        if (res.code == 200) {
          //获取歌曲信息
          for (let i = 0; i < res.data.length; i++) {
            getSongsDetail(res.data[i].id).then((res) => {
              if (res.code == 200) {
                //利用封装类处理歌曲信息
                let music = new songDetail(res.songs);
                data.playerList.push(music);
              }
            });
          }
        }
      });
    }

    //改变type
    function changeType(value) {
      data.currentType = value;
      data.playerList = [];
      getNewMusic(data.currentType);
    }
    //获取操作vuex的方法
    let { state } = useStore();

    //获取主题颜色
    let theme = computed(() => {
      return state.theme;
    });

    return {
      ...toRefs(data),
      changeType,
      theme,
    };
  },
};
</script>

<style lang="scss" scoped>
.new-music {
  .type-select {
    ul {
      display: flex;
      li {
        font-size: 14px;
        padding: 10px;
        cursor: pointer;
        &:hover {
          color: var(--tag-color);
          border-bottom: 2px solid var(--tag-color);
        }
      }
      .active_li {
        color: var(--tag-color);
        border-bottom: 2px solid var(--tag-color);
      }
    }
  }
}
</style>
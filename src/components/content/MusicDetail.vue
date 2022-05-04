 <template>
  <div
    class="music-detail"
    :style="{
      'background-color': `var(--${theme}-bg-color)`,
      color: `var(--${theme}-text-color)`,
    }"
  >
    <div class="content">
      <div class="close" @click="close">
        <span class="iconfont icon-suofang"></span>
      </div>
      <div
        class="music-info"
        :style="{
          'background-color': `var(--${theme}-bg-color)`,
          color: `var(--${theme}-text-color)`,
        }"
      >
        <div class="music-img">
          <div class="big-bg">
            <div class="min-img" :class="{ rotate: isPlayer }">
              <img :src="musicInfo.pic" alt="" />
            </div>
          </div>
          <div class="music-bar">
            <img src="../../assets/player/play-bar.png" alt="" />
          </div>
        </div>
        <div class="music-lyric">
          <div class="title">
            <h2 class="music-name">{{ musicInfo.name }}</h2>
            <p class="author">{{ musicInfo.artist }}</p>
          </div>
          <div class="lyric" v-if="lyric.length > 0">
            <div
              class="box"
              :style="{
                transform: `translateY(-${
                  activeLyricIndex <= 3 ? 0 : 40 * (activeLyricIndex - 3)
                }px)`,
              }"
            >
              <p
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
              </p>
            </div>
          </div>
          <div class="no-lyric" v-else>暂无歌曲</div>
        </div>
      </div>
      <Comment :id="musicInfo.id" :type="2" />
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import Comment from "@/components/content/Comment.vue";
export default {
  props: ["lyric", "musicInfo", "activeLyricIndex", "isPlayer"],
  components: {
    Comment,
  },
  setup(props, context) {
    function close() {
      context.emit("close");
    }

    console.log(props.lyric);

    //获取操作vuex的方法
    let { state } = useStore();

    //获取主题颜色
    let theme = computed(() => {
      return state.theme;
    });
    return { close, theme };
  },
};
</script>

<style lang="scss" scoped>
.music-detail {
  position: fixed;
  right: 0;
  left: 0;
  top: 58px;
  bottom: 60px;
  overflow-y: scroll;
  background-color: #fff;
  z-index: 9;

  .content {
    position: relative;
    width: 60%;
    margin: 0 auto;
    .close {
      position: absolute;
      top: 5px;
      right: -50px;
      width: 50px;
      height: 50px;
      background-color: #ffb800;
      color: #fff;
      text-align: center;
      line-height: 50px;
      .iconfont {
        font-size: 30px;
      }
    }
    .music-info {
      display: flex;
      width: 100%;
      height: 400px;
      // background: radial-gradient(#ccc, #ccc, #fff, #fff);
      margin-bottom: 15px;
      .music-img {
        width: 55%;
        position: relative;
        .big-bg {
          height: 220px;
          width: 220px;
          margin: 0 auto;
          margin-top: 100px;
          border-radius: 50%;
          background-color: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          .min-img {
            height: 160px;
            width: 160px;
            animation: rotate 15s linear infinite;
            animation-play-state: paused;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .rotate {
            animation-play-state: running;
          }
        }
        .music-bar {
          position: absolute;
          top: 10px;
          left: 48%;
          height: 150px;
          width: 100px;
          img {
            width: 100%;
          }
        }
      }
      .music-lyric {
        width: 45%;
        height: 100%;
        .title {
          height: 75px;
          padding: 15px;
          h2 {
            margin-bottom: 5px;
          }
        }
        .lyric {
          height: calc(100% - 75px);
          overflow-y: scroll;
          .box {
            transition: all 0.5s;
            .item {
              line-height: 40px;
              font-size: 13px;
            }
            .active-lyric {
              color: var(--light-text-tint);
            }
          }
        }
      }
      .no-lyric {
        font-size: 15px;
      }
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
<template>
  <div
    class="footer"
    :style="{
      'background-color': `var(--${theme}-footer-bg-color)`,
      color: `var(--${theme}-text-color)`,
    }"
  >
    <div class="player">
      <span
        class="iconfont icon-shangyishou"
        @click="preMusic"
        :style="{ color: `var(--${theme}-text-tint)` }"
      ></span>
      <span
        class="iconfont icon-zanting"
        v-show="isPlayer"
        @click="pauseMusic"
        :style="{ color: `var(--${theme}-text-tint)` }"
      ></span>
      <span
        class="iconfont icon-bofang1"
        v-show="!isPlayer"
        @click="playerMusic"
        :style="{ color: `var(--${theme}-text-tint)` }"
      ></span>
      <span
        class="iconfont icon-xiayishou"
        @click="nextMusic"
        :style="{ color: `var(--${theme}-text-tint)` }"
      ></span>
    </div>
    <div class="progress">
      <div class="progress-bar">
        <span class="active-time">{{ currentTime }}</span>
        <div class="bar-box" @click="barClick">
          <div
            class="bar-active"
            :style="{
              width: `${musicProgress}%`,
              'background-color': `var(--${theme}-text-tint)`,
            }"
          >
            <div class="dot">
              <div
                class="min-dot"
                :style="{
                  'background-color': `var(--${theme}-text-tint)`,
                }"
              ></div>
            </div>
          </div>
        </div>
        <span class="all-time">{{ currentMusicInfo.time }}</span>
      </div>
      <div class="volume">
        <span class="iconfont icon-24gf-volumeHigh"></span>
        <div class="volume-box" @click="volumeClick">
          <div
            class="volume-active"
            :style="{
              width: `${volumeProgress}%`,
              'background-color': `var(--${theme}-text-tint)`,
            }"
          >
            <div class="dot">
              <div
                class="min-dot"
                :style="{
                  'background-color': `var(--${theme}-text-tint)`,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="operate">
      <div class="order">
        <a title="顺序播放" v-show="playOrder == 0" @click="cutPalyOrder(0)"
          ><span class="iconfont icon-shunxubofang"></span
        ></a>
        <a title="单曲循环" v-show="playOrder == 1" @click="cutPalyOrder(1)"
          ><span class="iconfont icon-danqubofang"></span
        ></a>
        <a title="随机播放" v-show="playOrder == 2" @click="cutPalyOrder(2)"
          ><span class="iconfont icon-24gl-shuffle"></span
        ></a>
      </div>
      <div class="lyric">
        <a
          title="歌词"
          @click="lyricCut"
          :style="{ color: lyricIsShow ? `var(--${theme}-text-tint)` : '' }"
          ><span class="iconfont icon-geciweidianji"></span
        ></a>
      </div>
      <div class="musicList">
        <a
          title="歌单"
          @click="cutasideMusic"
          :style="{
            color: asideMusicIsShow ? `var(--${theme}-text-tint)` : '',
          }"
          ><span class="iconfont icon-gedan"></span
        ></a>
      </div>
    </div>
    <div class="music-info" v-if="url">
      <div class="img">
        <img :src="currentMusicInfo.pic" alt="" />
        <div class="mask" @click="detailPageIsShow = true">
          <span class="iconfont icon-fangda"></span>
        </div>
      </div>
      <div class="info">
        <div class="music-name">{{ currentMusicInfo.name }}</div>
        <div class="author">{{ currentMusicInfo.album }}</div>
      </div>
    </div>
    <audio
      :src="url"
      autoplay
      id="audio"
      @timeupdate="MusicTimeUpdate"
      @ended="PlayerEnd"
    ></audio>
    <transition name="music">
      <MusicDetail
        v-if="detailPageIsShow"
        @close="closeMusicDetail"
        :lyric="lyric"
        :musicInfo="currentMusicInfo"
        :activeLyricIndex="activeLyricIndex"
        :isPlayer="isPlayer"
      />
    </transition>
    <transition name="aside">
      <AsideMusicList
        :list="list"
        v-if="asideMusicIsShow"
        @close="cutasideMusic"
        :index="index"
      />
    </transition>
    <Lyric
      :lyric="lyric"
      :activeLyricIndex="activeLyricIndex"
      v-if="lyricIsShow"
    />
  </div>
</template>

<script>
import {
  onMounted,
  ref,
  getCurrentInstance,
  reactive,
  toRefs,
  computed,
} from "vue";
import { getMusicUrl, getLyric } from "@/api/music-detail.js";
import { ElMessage } from "element-plus";
import { secToMinute, minuteToSec } from "../../utils/tool.js";
import MusicDetail from "@/components/content/MusicDetail.vue";
import AsideMusicList from "@/components/content/AsideMusicList.vue";
import Lyric from "@/components/content/Lyric.vue";
import { useStore } from "vuex";
export default {
  components: {
    MusicDetail,
    AsideMusicList,
    Lyric,
  },
  setup(props, context) {
    //当前播放音乐所有信息
    let musicInfo = reactive({
      id: 0,
      list: [],
      currentMusicInfo: {},
      index: 0,
      url: "",
      //音乐对象
      audioObj: null,
      lyric: [],
      //音乐播放当前时间
      currentTime: "00:00",
      //活动歌词索引
      activeLyricIndex: 0,
    });
    //当前是否处于播放状态
    const isPlayer = ref(false);
    onMounted(() => {
      //获取audio标签元素
      musicInfo.audioObj = document.querySelector("#audio");
    });

    //获取$bus事件总线
    const $bus = getCurrentInstance().appContext.config.globalProperties.$bus;
    $bus.on("playerMusic", (data) => {
      // console.log(data.list);
      musicInfo.id = data.id;
      musicInfo.list = data.list;
      musicInfo.index = data.index;
      musicInfo.currentMusicInfo = data.list[data.index];
      //获取url
      getUrl(musicInfo.id);
      //获取歌词
      getMusicLyric(musicInfo.id);
    });
    //获取音乐url方法
    function getUrl(id) {
      getMusicUrl(id).then((res) => {
        // console.log(res);
        if (res.code == 200) {
          if (!res.data[0].url) {
            return ElMessage({
              message: "音频地址不可用",
              type: "warning",
            });
          }
          musicInfo.url = res.data[0].url;
          isPlayer.value = true;
        } else {
          ElMessage({
            message: "获取音乐url失败",
            type: "warning",
          });
        }
      });
    }
    //获取歌词
    async function getMusicLyric(id) {
      musicInfo.lyric = [];
      let result = await getLyric(id);
      if (result.code !== 200) {
        return ElMessage.error({
          message: "获取歌词失败",
        });
      }
      let reg = /\[(.*)\](.*)/g;
      result.lrc.lyric.replace(reg, ($1, $2, $3) => {
        musicInfo.lyric.push({ time: minuteToSec($2), content: $3 });
      });
      // console.log(musicInfo.lyric);
    }

    //音乐进度条默认进度
    let musicProgress = ref(0);
    //音乐进度条点击
    function barClick(e) {
      //改变界面的进度条进度
      let pageX = document.querySelector(".bar-box").offsetLeft;
      let width = document.querySelector(".bar-box").offsetWidth;
      musicProgress.value = ((e.pageX - pageX) / width) * 100;
      //改变音乐进度
      let alltime = minuteToSec(musicInfo.currentMusicInfo.time);
      musicInfo.audioObj.currentTime = (alltime * musicProgress.value) / 100;
    }

    //音量进度条默认进度
    let volumeProgress = ref(100);
    //音量进度点击
    function volumeClick(e) {
      //改变音量进度条
      let pageX = document.querySelector(".volume-box").offsetLeft;
      let width = document.querySelector(".volume-box").offsetWidth;
      volumeProgress.value = ((e.pageX - pageX) / width) * 100;
      //改变音量大小
      musicInfo.audioObj.volume =
        volumeProgress.value / 100 < 0 ? 0 : volumeProgress.value / 100;
    }

    //播放顺序 0代表顺序播放 1代表单曲循环 2代表随机播放
    let playOrder = ref(0);
    //切换播放顺序
    function cutPalyOrder(order) {
      if (order == 0) {
        return (playOrder.value = 1);
      } else if (order == 1) {
        return (playOrder.value = 2);
      } else if (order == 2) {
        return (playOrder.value = 0);
      }
    }

    //暂停音乐
    function pauseMusic() {
      musicInfo.audioObj.pause();
      isPlayer.value = false;
    }
    //播放音乐
    function playerMusic() {
      if (!musicInfo.url) {
        return;
      }
      musicInfo.audioObj.play();
      isPlayer.value = true;
    }

    //音乐播放时间改变时触发
    function MusicTimeUpdate() {
      //获取音频当前播放时间
      let currentTime = musicInfo.audioObj.currentTime;
      //音乐总时间（秒）
      let timeArr = musicInfo.currentMusicInfo.time.split(":");
      let allTime = timeArr[0] * 60 + parseInt(timeArr[1]);
      //求音乐进度条百分比
      musicProgress.value = (currentTime / allTime) * 100;
      //更新界面中的当前播放时间
      musicInfo.currentTime = secToMinute(currentTime);
      //计算活动歌词索引

      for (let i = 0; i < musicInfo.lyric.length; i++) {
        if (
          musicInfo.audioObj.currentTime >=
          musicInfo.lyric[musicInfo.lyric.length - 1].time
        ) {
          return (musicInfo.activeLyricIndex = musicInfo.lyric.length - 1);
        }
        if (
          musicInfo.audioObj.currentTime > musicInfo.lyric[i].time &&
          musicInfo.audioObj.currentTime < musicInfo.lyric[i + 1].time
        ) {
          return (musicInfo.activeLyricIndex = i);
        }
      }
    }

    //音乐播放结束
    function PlayerEnd() {
      isPlayer.value = false;
      nextMusic();
    }

    //下一首
    function nextMusic() {
      let index;
      if (playOrder.value == 0) {
        //循序播放
        index = musicInfo.index + 1;
        if (musicInfo.index == musicInfo.list.length - 1) {
          index = 0;
        }
      } else if (playOrder.value == 1) {
        //单曲循环
        index = musicInfo.index;
      } else {
        //随机播放
        index = Math.floor(Math.random() * (musicInfo.list.length - 0)) + 0;
      }
      //清空音频地址，否则切换时地址一样会导致音频没有改变
      musicInfo.url = "";
      let list = musicInfo.list;
      let id = musicInfo.list[index].id;
      let data = { index, list, id };
      $bus.emit("playerMusic", data);
    }
    //上一首
    function preMusic() {
      let index;
      if (playOrder.value == 0) {
        //循序播放
        index = musicInfo.index - 1;
        if (musicInfo.index == 0) {
          index = musicInfo.list.length - 1;
        }
      } else if (playOrder.value == 1) {
        //单曲循环
        index = musicInfo.index;
      } else {
        //随机播放
        index = Math.floor(Math.random() * (musicInfo.list.length - 0)) + 0;
      }
      //清空音频地址，否则切换时地址一样会导致音频没有改变
      musicInfo.url = "";
      let list = musicInfo.list;
      let id = musicInfo.list[index].id;
      let data = { index, list, id };
      $bus.emit("playerMusic", data);
    }

    //控制音乐详情页显示
    let detailPageIsShow = ref(false);
    function closeMusicDetail() {
      detailPageIsShow.value = false;
    }

    //控制音乐列表显示
    let asideMusicIsShow = ref(false);
    function cutasideMusic() {
      asideMusicIsShow.value = !asideMusicIsShow.value;
    }

    //控制歌词的显示
    let lyricIsShow = ref(false);
    function lyricCut() {
      lyricIsShow.value = !lyricIsShow.value;
    }

    //获取操作vuex的方法
    let { state } = useStore();

    //获取主题颜色
    let theme = computed(() => {
      return state.theme;
    });

    return {
      barClick,
      musicProgress,
      volumeProgress,
      volumeClick,
      playOrder,
      cutPalyOrder,
      ...toRefs(musicInfo),
      isPlayer,
      pauseMusic,
      playerMusic,
      MusicTimeUpdate,
      PlayerEnd,
      nextMusic,
      preMusic,
      detailPageIsShow,
      closeMusicDetail,
      asideMusicIsShow,
      cutasideMusic,
      lyricIsShow,
      lyricCut,
      theme,
    };
  },
};
</script>

<style lang="scss" scoped>
.footer {
  position: relative;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: var(--light-footer-bg-color);
  .player {
    width: 17%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    span {
      font-size: 30px;
      font-weight: 800;
      cursor: pointer;
    }
  }
  .progress {
    display: flex;
    flex: 1;
    height: 100%;
    font-size: 15px;
    justify-content: space-around;
    .progress-bar {
      width: 75%;
      display: flex;
      align-items: center;
      .active-time {
        width: 8%;
        line-height: 60px;
        flex-shrink: 0;
      }
      .bar-box {
        flex: 1;
        height: 4px;
        background-color: #ccc;
        border-radius: 2px;
        cursor: pointer;
        .bar-active {
          position: relative;
          height: 100%;
          width: 50%;
          background-color: #0c73c2;
          border-radius: 2px;
          transition: all 0.3s;
          .dot {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #fff;
            border: 1px solid #ccc;
            .min-dot {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: #0c73c2;
            }
          }
        }
      }
      .all-time {
        width: 8%;
        line-height: 60px;
        text-align: right;
        flex-shrink: 0;
      }
    }
    .volume {
      width: 15%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .iconfont {
      }
      .volume-box {
        width: 80%;
        height: 4px;
        background-color: #ccc;
        border-radius: 2px;
        cursor: pointer;
        .volume-active {
          position: relative;
          height: 100%;
          width: 100%;
          background-color: #0c73c2;
          border-radius: 2px;
          transition: all 0.3s;
          .dot {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #fff;
            border: 1px solid #ccc;
            .min-dot {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: #0c73c2;
            }
          }
        }
      }
    }
  }
  .operate {
    width: 15%;
    height: 100%;
    display: flex;
    div {
      width: 33%;
      text-align: center;
      line-height: 60px;
      a {
        span {
          font-weight: 800;
          font-size: 19px;
        }
      }
    }
  }
  .music-info {
    position: absolute;
    display: flex;
    justify-content: space-between;
    left: 0;
    top: -60px;
    width: 16%;
    height: 100%;
    padding: 2px;
    .img {
      position: relative;
      width: 33%;
      &:hover .mask {
        visibility: visible;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
      .mask {
        visibility: hidden;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba($color: #000000, $alpha: 0.3);
        .iconfont {
          color: #ccc;
          font-size: 40px;
          cursor: pointer;
        }
      }
    }
    .info {
      width: 60%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .music-name {
        width: 100%;
        font-weight: 800;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .author {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.music-enter-from,
.music-leave-to {
  transform: translateY(500px);
}
.music-enter-to,
.music-leave-from {
  transform: translateY(0);
}
.music-enter-active,
.music-leave-active {
  transition: all 0.5s;
}

.aside-enter-from,
.aside-leave-to {
  transform: translateX(600px);
}
.aside-enter-to,
.aside-leave-from {
  transform: translateX(0);
}
.aside-enter-active,
.aside-leave-active {
  transition: all 0.8s;
}
</style>
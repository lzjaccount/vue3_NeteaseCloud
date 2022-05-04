<template>
  <div
    class="header"
    :style="{
      'background-color': `var(--${theme}-header-bg-color)`,
      color: `var(--${theme}-text-color)`,
    }"
  >
    <div class="left">
      <div class="menu">
        <div class="item">
          <span
            class="iconfont icon-shouye"
            @click="$router.push('/recommend')"
          ></span>
        </div>
        <div class="item">
          <span class="iconfont icon-suofang" @click="exitFullScreen"></span>
        </div>
        <div class="item">
          <span class="iconfont icon-fangda" @click="fullScreen"></span>
        </div>
      </div>
      <div class="from-to">
        <span
          class="iconfont icon-xiangzuojiantou"
          @click="$router.go(-1)"
        ></span>
        <span
          class="iconfont icon-xiangyoujiantou"
          @click="$router.go(1)"
        ></span>
      </div>
    </div>
    <div class="right">
      <div class="search">
        <input
          type="text"
          placeholder="请输入内容"
          @focus="searchFocus"
          @blur="searchBlur"
          @input="searchInput"
          v-model="keyword"
        />
        <span class="iconfont icon-sousuo"></span>
        <!-- 热搜列表 -->
        <div
          class="hot"
          v-show="hotListIsShow"
          :style="{
            'background-color': `var(--${theme}-footer-bg-color)`,
            color: `var(--${theme}-text-color)`,
          }"
        >
          <div
            class="sanjiao"
            :style="{
              'border-bottom-color': `var(--${theme}-footer-bg-color)`,
            }"
          ></div>
          <div class="box">
            <div class="scroll">
              <div
                class="hot-item"
                v-for="(item, index) in hotList"
                :key="index"
                @click="
                  $router.push({
                    path: '/searchresult',
                    query: { keyword: item.searchWord },
                  })
                "
              >
                <div class="index" :class="{ red: index < 4 }">
                  {{ index + 1 }}
                </div>
                <div class="content">
                  <div class="top">
                    <div class="name">{{ item.searchWord }}</div>
                    <div class="count">{{ item.score }}</div>
                  </div>
                  <div class="bottom">{{ item.content }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 搜索建议 -->
        <div class="search-recommend" v-show="recommendListIsShow">
          <div class="sanjiao"></div>
          <div class="title">
            搜索<span style="color: #0c73c2">{{ keyword }}</span
            >相关的结果>
          </div>
          <div class="song item" v-if="recommendList.songs">
            <div class="title">
              <span class="iconfont icon-icon-test"></span>
              单曲
            </div>
            <div
              class="recommend-item"
              v-for="item in recommendList.songs"
              :key="item.id"
              @click="player(item.id)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="song item" v-if="recommendList.artists">
            <div class="title">
              <span class="iconfont icon-yonghutianchong"></span>
              歌手
            </div>
            <div
              class="recommend-item"
              v-for="item in recommendList.artists"
              :key="item.id"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="song item" v-if="recommendList.albums">
            <div class="title">
              <span class="iconfont icon-gedan"></span>
              专辑
            </div>
            <div
              class="recommend-item"
              v-for="item in recommendList.albums"
              :key="item.id"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="song item" v-if="recommendList.playlists">
            <div class="title">
              <span class="iconfont icon-yinle2"></span>
              歌单
            </div>
            <div
              class="recommend-item"
              v-for="item in recommendList.playlists"
              :key="item.id"
              @click="
                $router.push({
                  path: '/songlistdetail',
                  query: { id: item.id },
                })
              "
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="user">
        <div class="user-touxiang"></div>
        <div class="theme">
          <span class="iconfont icon-tubiao-" @click="showThemeDialog"></span>
          <div class="dialog" v-show="themeDialogIsShow">
            <h3>主题</h3>
            <div class="color">
              <div class="color-item" @click="cutTheme('light')">优雅百</div>
              <div class="color-item" @click="cutTheme('dark')">炫酷黑</div>
              <div class="color-item" @click="cutTheme('green')">清新绿</div>
            </div>
            <div class="sanjiao"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRefs, getCurrentInstance, computed } from "vue";
import { hotSearchDetail, Suggest } from "@/api/search.js";
import { songDetail, getSongsDetail } from "@/api/album.js";
import fullScreen from "../../utils/fullScreen.js";
import { exitFullScreen } from "../../utils/exitFullScreen.js";
import { useStore } from "vuex";
export default {
  components: {},
  setup() {
    //获取事件总线
    const $bus = getCurrentInstance().appContext.config.globalProperties.$bus;
    //获取操作vuex的方法
    let { state, commit } = useStore();

    //获取主题颜色
    let theme = computed(() => {
      return state.theme;
    });

    //主题选择对话框隐藏显示功能
    let themeDialogIsShow = ref(false);
    function showThemeDialog() {
      themeDialogIsShow.value = !themeDialogIsShow.value;
    }

    //搜索功能
    let searchDate = reactive({
      //热搜列表
      hotList: [],
      hotListIsShow: false,
      //搜索建议
      recommendList: {},
      recommendListIsShow: false,

      keyword: "",
    });
    //用于防抖
    let timer = null;

    //获取热搜列表
    function getHotSearchList() {
      hotSearchDetail().then((res) => {
        if (res.code == 200) {
          searchDate.hotList = res.data;
        }
      });
    }
    //获取多重匹配
    function getRecommendList(key) {
      Suggest(key).then((res) => {
        if (res.code == 200) {
          searchDate.recommendList = res.result;
        }
      });
    }
    //获取焦点
    function searchFocus() {
      if (searchDate.keyword.trim()) {
        return (searchDate.recommendListIsShow = true);
      }
      getHotSearchList();
      searchDate.hotListIsShow = true;
    }
    //失去焦点
    function searchBlur() {
      //延迟隐藏，因为上面有元素有点击事件，不延时的话导致点击事件不能被触发
      setTimeout(() => {
        searchDate.hotListIsShow = false;
        searchDate.recommendListIsShow = false;
      }, 200);
    }
    //输入事件
    function searchInput(e) {
      if (!searchDate.keyword.trim()) {
        searchDate.hotListIsShow = true;
        searchDate.recommendListIsShow = false;
        clearTimeout(timer);
        return;
      }
      clearTimeout(timer);

      timer = setTimeout(() => {
        searchDate.hotListIsShow = false;
        getRecommendList(searchDate.keyword);
        searchDate.recommendListIsShow = true;
      }, 500);
    }

    //搜索建议的单曲点击
    function player(id) {
      let list = [];
      getSongsDetail(id).then((res) => {
        let music = new songDetail(res.songs);
        list.push(music);
        $bus.emit("playerMusic", { list, id, index: 0 });
      });
    }

    //切换主题
    function cutTheme(theme) {
      commit("setTheme", theme);
    }

    return {
      themeDialogIsShow,
      showThemeDialog,
      searchFocus,
      ...toRefs(searchDate),
      searchBlur,
      searchInput,
      player,
      fullScreen,
      exitFullScreen,
      cutTheme,
      theme,
    };
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  height: 58px;
  padding: 0 15px;
  background-color: var(--light-bg-color);
  .left {
    display: flex;
    width: 15%;
    .menu {
      display: flex;
      width: 50%;
      justify-content: space-between;
      align-items: center;
      &:hover .item .iconfont {
        top: 0;
      }
      .item {
        position: relative;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        // text-align: center;
        line-height: 18px;
        overflow: hidden;
        cursor: pointer;
        .iconfont {
          position: absolute;
          top: -20px;
          left: 50%;
          margin-left: -5px;
          font-size: 10px;
          font-weight: 800;
          transition: all 0.5s;
        }
      }
      .item:nth-child(1) {
        background-color: #ed655a;
      }
      .item:nth-child(2) {
        background-color: #e0c04c;
      }
      .item:nth-child(3) {
        background-color: #72be47;
      }
    }
    .from-to {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
  .right {
    width: 85%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .search {
      position: relative;
      width: 200px;
      input {
        padding: 0 10px;
        height: 32px;
        width: 100%;
      }
      .hot {
        position: absolute;
        left: 15px;
        top: 46px;
        width: 400px;
        height: 500px;
        border: 1px solid #ccc;
        border-radius: 5px;
        z-index: 100;
        background-color: #fff;
        .sanjiao {
          position: absolute;
          left: 20px;
          top: -20px;
          border: 10px solid transparent;
          border-bottom-color: #ccc;
        }
        .box {
          height: 100%;
          width: 100%;
          overflow-y: scroll;
          .scroll {
            padding: 15px;
            .hot-item {
              display: flex;
              align-items: center;
              cursor: pointer;
              .index {
                width: 10%;
                padding: 15px 0;
                font-size: 13px;
                text-align: center;
              }
              .red {
                color: var(--main-color);
              }
              .content {
                .top {
                  display: flex;
                  font-size: 14px;
                  .name {
                    margin-right: 10px;
                  }
                  .count {
                    color: #999;
                  }
                }
                .bottom {
                  color: #999;
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
      .search-recommend {
        position: absolute;
        left: 15px;
        top: 46px;
        width: 400px;
        border: 1px solid #ccc;
        border-radius: 5px;
        z-index: 100;
        background-color: #fff;
        padding: 15px;
        font-size: 13px;
        color: #666;
        .sanjiao {
          position: absolute;
          left: 20px;
          top: -20px;
          border: 10px solid transparent;
          border-bottom-color: #ccc;
        }
        .title {
          margin: 10px 0;
        }
        .item {
          margin: 10px 0;
          .title {
            margin: 5px 0;
          }
          .recommend-item {
            padding-left: 13px;
            margin: 5px 0;
            cursor: pointer;
            &:hover {
              color: var(--light-icon-active-color);
            }
          }
        }
      }
      .icon-sousuo {
        position: absolute;
        right: 5px;
        top: 8px;
      }
    }
    .user {
      display: flex;
      align-items: center;
      .user-touxiang {
        height: 35px;
        width: 35px;
        border-radius: 50%;
        background-color: #ccc;
      }
      .theme {
        position: relative;
        .iconfont {
          font-size: 35px;
          margin: 0 20px;
        }
        .dialog {
          position: absolute;
          bottom: -104px;
          left: -115px;
          width: 180px;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 5px;
          z-index: 999;
          h3 {
            text-align: center;
            padding: 5px 0;
          }
          .color {
            display: flex;
            .color-item {
              flex: 1;
              height: 55px;
              text-align: center;
              line-height: 55px;
              cursor: pointer;
            }
            .color-item:nth-child(1) {
              background-color: #f9f9f9;
              color: #16181c;
            }
            .color-item:nth-child(2) {
              background-color: #16181c;
              color: #fff;
            }
            .color-item:nth-child(3) {
              background-color: #3eb874;
              color: #f9f9f9;
            }
          }
          .sanjiao {
            position: absolute;
            top: -21px;
            right: 15px;
            border: 10px solid transparent;
            border-bottom-color: #ccc;
          }
        }
      }
    }
  }
}
</style>
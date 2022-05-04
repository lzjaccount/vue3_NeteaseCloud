<template>
  <div class="search-result">
    <div class="title">
      <span class="keyword">{{ keyword }}</span>
      共找到<span class="count">{{ count }}</span
      >个<span class="type">{{ activeTag }}</span>
    </div>
    <el-tabs class="demo-tabs" v-model="currentTab" @tab-click="handleClick">
      <el-tab-pane label="单曲" :name="1">
        <MusicTable :data="song" />
      </el-tab-pane>
      <el-tab-pane label="歌手" :name="100">
        <div class="artist-list">
          <div class="item" v-for="item in artist" :key="item.id">
            <img :src="item.picUrl" alt="" />
            <div class="right">
              <div class="name">{{ item.name }}</div>
              <div class="zjcount">专辑数：{{ item.albumSize }}</div>
              <div class="mvcount">MV数：{{ item.mvSize }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="歌单" :name="1000">
        <SongList :data="playerList" />
      </el-tab-pane>
      <el-tab-pane label="专辑" :name="10">
        <div class="albums-list">
          <div class="item" v-for="item in albums" :key="item.id">
            <img :src="item.picUrl" alt="" />
            <div class="right">
              <div class="name">{{ item.name }}</div>
              <div class="time">
                发布时间：{{ myFormatDate(item.publishTime) }}
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" :name="1004">
        <div class="mvlist">
          <div
            class="mv-item"
            v-for="item in mv"
            :key="item.id"
            @click="$router.push({ path: '/mvdetail', query: { id: item.id } })"
          >
            <img :src="item.cover" alt="" />
            <div class="mv-name">{{ item.name }}</div>
            <div class="mv-author">{{ item.artistName }}</div>
            <span class="iconfont icon-bofang1"></span>
            <div class="playCount">
              <span class="iconfont icon-shexiangtou1"></span>
              {{ formatNumber(item.playCount) }}
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { reactive, toRefs, watch, ref } from "vue";
import { Search } from "@/api/search.js";
import { songDetail, getSongsDetail } from "@/api/album.js";
import MusicTable from "@/components/content/MusicTable.vue";
import SongList from "@/components/content/songList.vue";
import { myFormatDate, formatNumber } from "../../utils/tool.js";
export default {
  components: {
    MusicTable,
    SongList,
  },
  setup() {
    const $route = useRoute();
    let keyword = ref($route.query.keyword);

    //搜索数据
    let data = reactive({
      currentTab: 1,
      //单曲数据
      song: [],
      //歌手数据
      artist: [],
      //歌单
      playerList: [],
      //专辑
      albums: [],
      mv: [],
      //当前选中的tab搜索数量
      count: 0,
      //当前选中的tab
      activeTag: "单曲",
    });

    //默认获取单曲结果
    getSearchResult(keyword.value, 1);

    //获取搜索结果
    async function getSearchResult(key, type) {
      let res = await Search(key, type);
      data.song = [];
      // console.log(res);
      //单曲时需要处理数据
      if (res.code == 200) {
        if (type == 1) {
          for (let i = 0; i < res.result.songs.length; i++) {
            let res2 = await getSongsDetail(res.result.songs[i].id);
            let music = new songDetail(res2.songs);
            data.song.push(music);
            data.count = data.song.length;
            data.activeTag = "单曲";
          }
        } else if (type == 100) {
          data.artist = res.result.artists;
          data.count = data.artist.length;
          data.activeTag = "歌手";
        } else if (type == 1000) {
          data.playerList = res.result.playlists;
          data.count = data.playerList.length;
          data.activeTag = "歌单";
        } else if (type == 10) {
          data.albums = res.result.albums;
          data.count = data.albums.length;
          data.activeTag = "专辑";
        } else if (type == 1004) {
          data.mv = res.result.mvs;
          data.count = data.mv.length;
          data.activeTag = "MV";
        }
      }
    }

    //tab切换
    function handleClick() {
      getSearchResult(keyword.value, data.currentTab);
    }

    //监听路由的变化，初始化数据，避免路由重复组件复用导致数据没有更新
    watch($route, (to, from) => {
      console.log(to);
      keyword.value = to.query.keyword;
      Object.assign(data, {
        currentTab: 1,
        //单曲数据
        song: [],
        //歌手数据
        artist: [],
        //歌单
        playerList: [],
        //专辑
        albums: [],
        mv: [],
        //当前选中的tab搜索数量
        count: 0,
        //当前选中的tab
        activeTag: "单曲",
      });
      //默认获取单曲结果
      getSearchResult(keyword.value, 1);
    });

    return {
      keyword,
      ...toRefs(data),
      handleClick,
      myFormatDate,
      formatNumber,
    };
  },
};
</script>

<style lang="scss" scoped>
.search-result {
  .title {
    font-size: 13px;
    .keyword,
    .count {
      color: var(--tag-color);
      font-size: 15px;
    }
  }
  .artist-list {
    .item {
      display: flex;
      padding: 10px 0;
      cursor: pointer;
      img {
        width: 5%;
        border-radius: 5px;
        margin-right: 8px;
      }
      .right {
      }
    }
  }
  .albums-list {
    .item {
      display: flex;
      padding: 10px 0;
      cursor: pointer;
      img {
        width: 5%;
        border-radius: 5px;
        margin-right: 8px;
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
  .mvlist {
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
    .mv-item {
      width: 22%;
      margin-right: 3%;
      margin-bottom: 10px;
      position: relative;
      &:hover .icon-bofang1 {
        display: block;
      }
      img {
        width: 100%;
        height: 120px;
      }
      .mv-name {
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .mv-author {
        font-size: 12px;
        color: #777;
      }
      .icon-bofang1 {
        position: absolute;
        font-size: 40px;
        color: #e83c3c;
        left: 50%;
        top: 50px;
        transform: translate(-50%);
        display: none;
      }
      .playCount {
        position: absolute;
        top: 0;
        right: 0;
        padding: 5px 10px;
        color: #fff;
        font-size: 14px;
        background-color: rgba($color: #000000, $alpha: 0.3);
      }
    }
  }
}
</style>
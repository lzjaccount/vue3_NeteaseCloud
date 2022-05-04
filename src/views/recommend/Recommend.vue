<template>
  <div class="recommend">
    <!-- 轮播图 -->
    <el-carousel :interval="4000" type="card" height="220px" trigger="click">
      <el-carousel-item v-for="(item, index) in bannerList" :key="index">
        <img :src="item.imageUrl" alt="" style="width: 100%; height: 100%" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommendSong">
      <div class="title">推荐歌单</div>
      <div class="list">
        <song-list :data="songList" />
      </div>
    </div>
    <!-- 独家送放 -->
    <div class="unique">
      <div class="title">独家放送</div>
      <div class="uniqueList">
        <div class="item" v-for="item in unique" :key="item.id">
          <img :src="item.picUrl" alt="" />
          <div class="con">{{ item.name }}</div>
          <div class="icon">
            <span class="iconfont icon-shexiangtou"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="newSong">
      <div class="title">最新音乐</div>
      <div class="songList">
        <div
          class="songItem"
          v-for="(item, index) in newSong"
          :key="item.id"
          @click="playerMusic(item.id, index)"
        >
          <div class="index">{{ index + 1 }}</div>
          <div class="img">
            <img v-lazy="item.picUrl" alt="" />
          </div>
          <div class="info">
            <div class="name">{{ item.name }}</div>
            <div class="company">{{ item.song.album.company }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBanner,
  getPersonalized,
  getPrivateContent,
  getNewSong,
} from "@/api/recommend.js";
import { getSongsDetail, songDetail } from "@/api/album.js";
import SongList from "@/components/content/songList.vue";
import { ref, reactive, toRefs, getCurrentInstance } from "vue";
export default {
  components: {
    SongList,
  },
  setup() {
    const $bus = getCurrentInstance().appContext.config.globalProperties.$bus;
    //数据
    let recommendData = reactive({
      bannerList: [],
      songList: [],
      unique: [],
      newSong: [],
      playerMusic: [],
    });
    //获取轮播图
    getBanner().then((res) => {
      if (res.code == 200) {
        recommendData.bannerList = res.banners;
      }
    });
    //获取推荐歌单
    getPersonalized(10).then((res) => {
      if (res.code == 200) {
        recommendData.songList = res.result;
      }
    });
    //获取独家放送
    getPrivateContent().then((res) => {
      if (res.code == 200) {
        recommendData.unique = res.result;
      }
    });
    //获取最新音乐
    getNewSong().then((res) => {
      if (res.code == 200) {
        recommendData.newSong = res.result;
        //获取最新音乐所有歌曲
        for (let i = 0; i < res.result.length; i++) {
          getSongsDetail(res.result[i].id).then((res) => {
            let song = new songDetail(res.songs);
            recommendData.playerMusic.push(song);
          });
        }
        // console.log(recommendData.playerMusic);
      }
    });

    //最新音乐播放
    function playerMusic(id, index) {
      $bus.emit("playerMusic", { id, index, list: recommendData.playerMusic });
    }
    return { ...toRefs(recommendData), playerMusic };
  },
};
</script>

<style lang="scss" scoped>
.recommend {
  width: 80%;
  margin: 0 auto;
}
.el-carousel {
  width: 70%;
  margin: 15px auto;
}
.el-carousel-item img {
  width: 100%;
  height: 100%;
}
.recommendSong {
  .title {
    font-size: 16px;
    padding: 15px 0;
    font-weight: 800;
  }
}
.unique {
  .title {
    font-size: 16px;
    padding: 15px 0;
    font-weight: 800;
  }
  .uniqueList {
    display: flex;
    justify-content: space-between;
    .item {
      position: relative;
      width: 30%;
      img {
        width: 100%;
      }
      .con {
        font-size: 14px;
      }
      .icon {
        position: absolute;
        top: 5px;
        left: 5px;
        height: 25px;
        width: 25px;
        border-radius: 50%;
        background-color: rgba($color: #000000, $alpha: 0.4);
        text-align: center;
        line-height: 25px;
      }
      .icon {
        color: #fff;
      }
    }
  }
}
.newSong {
  .title {
    font-size: 16px;
    padding: 15px 0;
    font-weight: 800;
    border-bottom: 1px solid #ccc;
  }
  .songList {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .songItem {
      display: flex;
      align-items: center;
      width: 45%;
      margin-top: 15px;
      cursor: pointer;
      .index {
        padding: 0 15px;
      }
      .img {
        width: 50px;
        height: 50px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        margin-left: 10px;
        .name {
          margin: 5px 0;
        }
        .company {
          margin: 5px 0;
        }
      }
    }
  }
}
</style>
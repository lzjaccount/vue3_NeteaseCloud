<template>
  <div class="songListDetail">
    <div class="header">
      <div class="img">
        <img :src="base.coverImgUrl" alt="" />
      </div>
      <div class="songInfo">
        <div class="title">
          <div class="left">
            <div class="btn">歌单</div>
            <div class="name">{{ base.name }}</div>
          </div>
          <div class="count">
            <div class="songCount">歌曲数<br />{{ base.trackCount }}</div>
            <div class="play">播放数<br />{{ playerCount }}</div>
          </div>
        </div>
        <div class="author">
          <img :src="base.creator.avatarUrl" alt="" class="tx" />
          <div class="name">{{ base.creator.nickname }}</div>
          <div class="createTime">
            创建时间：{{ myFormatDate(base.createTime) }}
          </div>
        </div>
        <div class="btns">
          <el-button type="danger">
            <span class="iconfont icon-bofang1"></span>
            播放全部
          </el-button>
          <el-button :icon="Search">
            <span class="iconfont icon-shoucang"></span>收藏({{
              base.subscribedCount
            }})
          </el-button>
          <el-button :icon="Search">
            <span class="iconfont icon-fenxiang"></span> 分享({{
              base.shareCount
            }})
          </el-button>
        </div>
        <div class="tags">
          标签：<span>{{ base.tags.join("/") }}</span>
        </div>
        <div class="desc">
          {{ base.description }}
        </div>
      </div>
    </div>
    <div class="content">
      <el-tabs class="demo-tabs" v-model="tabsActive">
        <el-tab-pane label="歌曲列表" name="list">
          <MusicTable :data="music" />
        </el-tab-pane>
        <el-tab-pane :label="`评论(${base.commentCount})`" name="comment">
          <Comment :id="songid" :type="1" />
        </el-tab-pane>
        <el-tab-pane label="收藏者" name="collect">
          <div class="collect">
            <div class="item" v-for="item in collectAuthor" :key="item.userId">
              <img :src="item.avatarUrl" alt="" />
              <div class="name">{{ item.nickname }}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getMusicListDetail,
  getSongsDetail,
  songDetail,
  getSub,
} from "@/api/album.js";
import { useRoute } from "vue-router";
import MusicTable from "@/components/content/MusicTable.vue";
import Comment from "@/components/content/Comment.vue";
import { reactive, toRefs, computed } from "vue";
import { myFormatDate } from "../../utils/tool.js";
export default {
  components: {
    MusicTable,
    Comment,
  },
  setup() {
    const $route = useRoute();
    const songid = $route.query.id;
    //tabs默认选择的标签
    let tabsActive = "list";

    const data = reactive({
      //基本信息
      base: {},
      music: [],
      //收藏者
      collectAuthor: [],
    });
    //获取歌单基本信息
    getMusicListDetail(songid).then((res) => {
      if (res.code == 200) {
        data.base = res.playlist;
        //获取歌单所有歌曲
        for (let i = 0; i < res.playlist.trackIds.length; i++) {
          getSongsDetail(res.playlist.trackIds[i].id).then((res) => {
            let song = new songDetail(res.songs);
            data.music.push(song);
          });
        }
      }
    });
    //获取收藏者
    getSub(songid, 30).then((res) => {
      if (res.code == 200) {
        data.collectAuthor = res.subscribers;
      }
    });

    const playerCount = computed(() => {
      return (data.base.playCount / 10000).toFixed(1) + "万";
    });

    return { tabsActive, ...toRefs(data), playerCount, songid, myFormatDate };
  },
};
</script>

<style lang="scss" scoped>
.songListDetail {
  .header {
    display: flex;
    justify-content: space-between;
    .img {
      width: 20%;
      img {
        width: 100%;
      }
    }
    .songInfo {
      width: 80%;
      padding: 0 15px;
      .title {
        display: flex;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          .btn {
            padding: 8px 10px;
            color: red;
            border: 1px solid red;
            border-radius: 4px;
            margin-right: 10px;
          }
          .name {
            font-size: 17px;
            font-weight: 800;
          }
        }
        .count {
          display: flex;
          .songCount,
          .play {
            padding: 5px 10px;
            font-size: 15px;
            text-align: center;
          }
          .play {
            border-left: 1px solid #ccc;
          }
        }
      }
      .author {
        display: flex;
        align-items: center;
        font-size: 14px;
        img {
          height: 30px;
          width: 30px;
          border-radius: 50%;
        }
        .name {
          margin: 0 10px;
        }
        .createTime {
        }
      }
      .btns {
        margin: 15px 0;
      }
      .tags {
        margin: 15px 0;
        span {
          color: var(--tag-color);
        }
      }
      .desc {
        overflow: hidden;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  .content {
    margin-top: 15px;
    .collect {
      display: flex;
      flex-wrap: wrap;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 10%;
        margin-bottom: 10px;
        img {
          width: 50%;
          border-radius: 50%;
          margin-bottom: 5px;
        }
        .name {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
      }
    }
  }
}
</style>
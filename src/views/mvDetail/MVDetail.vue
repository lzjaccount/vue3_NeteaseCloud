<template>
  <div class="mv-detail">
    <div class="left">
      <div class="mv-name">
        <div class="mv">mv</div>
        <div class="name">{{ baseInfo.name }}</div>
      </div>
      <video :src="url" controls autoplay muted></video>
      <Comment :id="id" :type="3" />
    </div>
    <div class="rigth">
      <div class="title">MV介绍</div>
      <div class="createTime">发布时间：{{ baseInfo.publishTime }}</div>
      <div class="playerCount">播放次数：{{ baseInfo.playCount }}</div>
      <div class="desc">
        {{ baseInfo.desc }}
      </div>
      <div class="recommend-mv">相关推荐</div>
      <div class="mv-list">
        <div
          class="mv-item"
          v-for="item in recommendMV"
          :key="item.id"
          @click="$router.push({ path: '/mvdetail', query: { id: item.id } })"
        >
          <img :src="item.picUrl" alt="" />
          <div class="mv-name">
            <div class="mv">mv</div>
            <div class="name">{{ item.name }}</div>
          </div>
          <div class="playerCount">
            <span class="iconfont icon-shexiangtou1"></span>
            {{ item.playCount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { reactive, toRefs, ref, watch } from "vue";
import { getMvDetail, getMVUrl, Personalized } from "@/api/mv.js";
import Comment from "@/components/content/Comment.vue";
export default {
  components: {
    Comment,
  },
  setup() {
    const $route = useRoute();
    let id = ref($route.query.id);

    //mv数据
    let mv = reactive({
      baseInfo: {},
      url: "",
      comment: [],
      recommendMV: [],
    });

    getMVBaseInfo(id.value);
    getURL(id.value);
    getRecommendMv();

    function getMVBaseInfo(id) {
      //获取mv信息
      getMvDetail(id).then((res) => {
        //   console.log(res);
        if (res.code == 200) {
          mv.baseInfo = res.data;
        }
      });
    }

    function getURL(id) {
      //获取mv url
      getMVUrl(id).then((res) => {
        //   console.log(res);
        if (res.code == 200) {
          mv.url = res.data.url;
        }
      });
    }

    function getRecommendMv() {
      //获取推荐mv
      Personalized().then((res) => {
        // console.log(res);
        if (res.code == 200) {
          mv.recommendMV = res.result;
        }
      });
    }

    //监听路由变化防止点击相关mv跳转同一路由数据不更新
    watch(
      $route,
      (newvalue, oldvalue) => {
        // console.log(newvalue);
        id.value = newvalue.query.id;
        getMVBaseInfo(id.value);
        getURL(id.value);
        getRecommendMv();
      },
      { deep: true }
    );

    //相关mv点击更新数据
    function update(ids) {
      id.value = ids;
      getMVBaseInfo(id.value);
      getURL(id.value);
      getRecommendMv();
    }
    return {
      ...toRefs(mv),
      id,
      update,
    };
  },
};
</script>

<style lang="scss" scoped>
.mv-detail {
  display: flex;
  width: 85%;
  margin: 0 auto;
  .left {
    width: 70%;
    .mv-name {
      display: flex;
      align-items: center;
      font-size: 16px;
      .mv {
        padding: 4px 9px;
        border: 1px solid var(--main-color);
        color: var(--main-color);
        border-radius: 4px;
        margin: 0 10px;
      }
    }
    video {
      width: 100%;
      margin: 10px 0;
    }
  }
  .rigth {
    width: 30%;
    padding: 0 5px;
    .title,
    .recommend-mv {
      font-size: 18px;
      padding: 7px 0;
    }
    .createTime,
    .playerCount,
    .desc {
      margin: 7px 0;
      font-size: 13px;
    }
    .mv-list {
      .mv-item {
        position: relative;
        width: 75%;
        margin: 10px 5px;
        cursor: pointer;
        img {
          width: 100%;
        }
        .mv-name {
          display: flex;
          align-items: center;
          font-size: 14px;
          .mv {
            padding: 4px 5px;
            border: 1px solid var(--main-color);
            color: var(--main-color);
            border-radius: 4px;
            margin: 5px 0;
            margin-right: 5px;
          }
          .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .playerCount {
          position: absolute;
          top: 0;
          right: 0;
          padding: 4px 6px;
          background-color: rgba($color: #000000, $alpha: 0.3);
          color: #fff;
          margin: 0;
        }
      }
    }
  }
}
</style>
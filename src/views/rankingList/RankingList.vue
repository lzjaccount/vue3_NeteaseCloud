<template>
  <div class="ranking">
    <div class="official">
      <div class="title">官方榜</div>
      <div class="list">
        <div
          class="item"
          v-for="item in official"
          :key="item.id"
          @click="
            $router.push({ path: 'songlistdetail', query: { id: item.id } })
          "
        >
          <img v-lazy="item.coverImgUrl" alt="" />
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="global">
      <div class="title">全球榜</div>
      <div class="list">
        <div
          class="item"
          v-for="item in global"
          :key="item.id"
          @click="
            $router.push({ path: 'songlistdetail', query: { id: item.id } })
          "
        >
          <img v-lazy="item.coverImgUrl" alt="" />
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRankList } from "@/api/ranking.js";
import { reactive, toRefs } from "vue";
export default {
  setup() {
    let data = reactive({
      //官方榜
      official: [],
      //全球榜
      global: [],
    });
    //获取排行榜信息
    getRankList().then((res) => {
      //   console.log(res);
      if (res.code == 200) {
        data.official = res.list.slice(0, 4);
        data.global = res.list.slice(4);
      }
    });

    return {
      ...toRefs(data),
    };
  },
};
</script>

<style lang="scss" scoped>
.ranking {
  width: 80%;
  margin: 0 auto;
  .official {
    .title {
      font-size: 14px;
      font-weight: 800;
      padding: 10px 0;
    }
    .list {
      display: flex;

      flex-wrap: wrap;
      .item {
        width: 19%;
        margin-bottom: 10px;
        margin-right: 1%;
        cursor: pointer;
        img {
          width: 100%;
        }
        .name {
          font-size: 14px;
          text-align: center;
        }
      }
    }
  }
  .global {
    margin-top: 30px;
    .title {
      font-size: 14px;
      font-weight: 800;
      padding: 10px 0;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 19%;
        margin-bottom: 10px;
        margin-right: 1%;
        cursor: pointer;
        img {
          width: 100%;
        }
        .name {
          font-size: 14px;
          text-align: center;
        }
      }
    }
  }
}
</style>
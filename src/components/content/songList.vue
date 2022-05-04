<template>
  <div class="list">
    <div
      class="songitem"
      v-for="item in data"
      :key="item.id"
      @click="toDetail(item.id)"
    >
      <img v-lazy="item.picUrl || item.coverImgUrl" alt="" />
      <div class="img-desc">{{ item.name }}</div>
      <div class="count">
        <span class="iconfont icon-erji"></span
        >{{ formatNumber(item.playCount) }}
      </div>
      <div class="bofang">
        <span class="iconfont icon-bofang1"></span>
      </div>
      <div class="recommend">{{ item.copywriter }}</div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { formatNumber } from "../../utils/tool.js";
export default {
  props: ["data"],
  setup(data, context) {
    const $router = useRouter();
    // const $route=useRoute()
    function toDetail(id) {
      $router.push({ path: "/songlistdetail", query: { id } });
    }

    return { toDetail, formatNumber };
  },
};
</script>

<style lang="scss" scoped>
.songitem {
  position: relative;
  width: 17%;
  overflow: hidden;
  margin-bottom: 10px;
  &:hover .bofang {
    opacity: 1;
  }
  &:hover .recommend {
    top: 0;
  }
  &:hover .count {
    top: -20px;
  }
  img {
    height: 160px;
    width: 100%;
    border-radius: 4px;
  }
  .img-desc {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .count {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    line-height: 20px;
    padding: 0 4px;
    width: 100%;
    background-color: rgba($color: #000000, $alpha: 0.4);
    color: #fff;
    text-align: right;
    transition: all 0.5s;
  }
  .bofang {
    position: absolute;
    bottom: 49px;
    left: 5px;
    color: #b82525;
    opacity: 0;
    transition: all 0.5s;
    .iconfont {
      font-size: 30px;
    }
  }
  .recommend {
    position: absolute;
    top: -20px;
    left: 0;
    height: 20px;
    line-height: 20px;
    padding: 0 4px;
    width: 100%;
    background-color: rgba($color: #000000, $alpha: 0.4);
    color: #fff;
    transition: all 0.5s;
  }
}
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
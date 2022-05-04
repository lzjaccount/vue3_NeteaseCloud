<template>
  <div class="mv">
    <div class="language">
      <div class="name">语种:</div>
      <div
        class="select-item"
        :style="{
          color:
            item == selectArea
              ? `var(--${theme}-text-tint)`
              : `var(--${theme}-text-color)`,
        }"
        v-for="(item, index) in area"
        :key="index"
        @click="changeArea(item)"
      >
        {{ item }}
      </div>
    </div>
    <div class="type">
      <div class="name">分类:</div>
      <div
        class="select-item"
        :style="{
          color:
            item == selectType
              ? `var(--${theme}-text-tint)`
              : `var(--${theme}-text-color)`,
        }"
        v-for="(item, index) in type"
        :key="index"
        @click="changeType(item)"
      >
        {{ item }}
      </div>
    </div>
    <div class="nameStart">
      <div class="name">排序:</div>
      <div
        class="select-item"
        :style="{
          color:
            item == selectOrder
              ? `var(--${theme}-text-tint)`
              : `var(--${theme}-text-color)`,
        }"
        v-for="(item, index) in order"
        :key="index"
        @click="changeOrder(item)"
      >
        {{ item }}
      </div>
    </div>
    <div class="mvlist">
      <div
        class="mv-item"
        v-for="item in mv"
        :key="item.id"
        @click="$router.push({ path: '/mvdetail', query: { id: item.id } })"
      >
        <img v-lazy="item.cover" alt="" />
        <div class="mv-name">{{ item.name }}</div>
        <div class="mv-author">{{ item.artistName }}</div>
        <span class="iconfont icon-bofang1"></span>
        <div class="playCount">
          <span class="iconfont icon-shexiangtou1"></span>
          {{ formatNumber(item.playCount) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AllMv } from "@/api/mv.js";
import { reactive, toRefs, computed } from "vue";
import { useStore } from "vuex";
import { formatNumber } from "../../utils/tool.js";
export default {
  setup() {
    let data = reactive({
      area: ["全部", "内地", "港台", "欧美", "日本", "韩国"],
      order: ["上升最快", "最热", "最新"],
      type: ["全部", "官方版", "原生", "现场版", "网易出品"],
      selectArea: "全部",
      selectOrder: "上升最快",
      selectType: "全部",
      //分页数据
      pagesize: 20,
      pagenum: 1,
      total: 0,
      //mv数据
      mv: [],
    });
    //先获取数据
    getMVdata("全部", "全部", "上升最快", 20, 1);

    //改变选中项
    function changeArea(value) {
      data.selectArea = value;
      getMVdata(data.selectArea, data.selectType, data.selectOrder, 20, 1);
    }
    function changeType(value) {
      data.selectType = value;
      getMVdata(data.selectArea, data.selectType, data.selectOrder, 20, 1);
    }
    function changeOrder(value) {
      data.selectOrder = value;
      getMVdata(data.selectArea, data.selectType, data.selectOrder, 20, 1);
    }

    //获取mv数据
    function getMVdata(area, type, order, pagesize, pagenum) {
      AllMv(area, type, order, pagesize, pagenum).then((res) => {
        // console.log(res);
        if (res.code == 200) {
          data.mv = res.data;
        }
      });
    }
    //获取操作vuex的方法
    let { state } = useStore();

    //获取主题颜色
    let theme = computed(() => {
      return state.theme;
    });

    return {
      ...toRefs(data),
      changeOrder,
      changeArea,
      changeType,
      formatNumber,
      theme,
    };
  },
};
</script>

<style lang="scss" scoped>
.mv {
  width: 85%;
  margin: 0 auto;
  .language,
  .type,
  .nameStart {
    display: flex;
    align-items: center;
    font-size: 14px;
    .name {
      padding-right: 20px;
    }
    .select-item {
      padding: 10px;
      cursor: pointer;
    }
    .active {
      color: var(--tag-color);
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
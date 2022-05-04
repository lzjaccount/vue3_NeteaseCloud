<template>
  <div class="asideMusicList">
    <div class="title">播放列表</div>
    <div class="close" @click="close">X</div>
    <div class="data">
      <el-table
        :data="list"
        stripe
        style="width: 100%"
        :fit="false"
        @row-click="cutPlayer"
      >
        <el-table-column type="index" width="80" />
        <el-table-column
          prop="name"
          label="音乐标题"
          width="180"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <span
              class="iconfont icon-24gf-volumeHigh"
              style="color: #0c73c2"
              v-if="index == scope.$index"
            ></span>
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="artist"
          label="歌手"
          width="180"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="time" label="时长" width="80" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";
export default {
  props: ["list", "index"],
  setup(props, context) {
    const $bus = getCurrentInstance().appContext.config.globalProperties.$bus;
    //关闭音乐列表
    function close() {
      context.emit("close");
    }
    //切换音乐
    function cutPlayer(row, column) {
      let id = row.id;
      let list = props.list;
      let index = props.list.findIndex((item) => item.id == id);
      //   console.log(id, list, index);
      let data = { id, list, index };
      $bus.emit("playerMusic", data);
    }
    return {
      close,
      cutPlayer,
    };
  },
};
</script>

<style lang="scss" scoped>
.asideMusicList {
  position: fixed;
  width: 40%;
  top: 58px;
  bottom: 60px;
  right: 0;
  z-index: 99;
  background: #fff;
  box-shadow: 0 0 10px 2px #ccc;
  border-radius: 5px;

  .title {
    height: 30px;
    text-align: center;
    line-height: 30px;
  }
  .close {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 17px;
    cursor: pointer;
  }
  .data {
    overflow-y: scroll;
    height: calc(100% - 30px);
  }
}
</style>
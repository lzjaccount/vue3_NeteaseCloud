<template>
  <div
    class="tableList"
    :style="{
      'background-color': `var(--${theme}-bg-color)`,
      color: `var(--${theme}-text-color)`,
    }"
  >
    <el-table
      style="width: 100%"
      :data="data"
      border
      :style="{
        'background-color': `var(--${theme}-bg-color)`,
        color: `var(--${theme}-text-color)`,
      }"
    >
      <el-table-column type="index" width="50" />
      <el-table-column label="操作" width="80" align="center">
        <template #default="scope">
          <span class="iconfont icon-icon-"></span>
          <span
            class="iconfont icon-bofang1"
            @click="player(scope.row, scope.$index)"
          ></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="音乐标题"
        width="250"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="artist" label="歌手" width="250" />
      <el-table-column prop="album" label="专辑" width="250" />
      <el-table-column prop="time" label="时长" />
    </el-table>
  </div>
</template>

<script>
import { getCurrentInstance, computed } from "vue";
import { useStore } from "vuex";
export default {
  props: ["data"],
  setup(props) {
    //获取事件总线
    const $bus = getCurrentInstance().appContext.config.globalProperties.$bus;

    function player(row, index) {
      let data = { list: props.data, id: row.id, index };
      //将音乐列表，音乐id，音乐索引带过去
      $bus.emit("playerMusic", data);
    }

    //获取操作vuex的方法
    let { state } = useStore();

    //获取主题颜色
    let theme = computed(() => {
      return state.theme;
    });
    return { player, theme };
  },
};
</script>

<style lang="scss" scoped>
</style>
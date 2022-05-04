<template>
  <div class="artist">
    <div class="language">
      <div class="name">语种:</div>
      <div
        class="select-item"
        :style="{
          color:
            item.value == languageSelect
              ? `var(--${theme}-text-tint)`
              : `var(--${theme}-text-color)`,
        }"
        v-for="item in language"
        :key="item.value"
        @click="changeLanguage(item.value)"
      >
        {{ item.content }}
      </div>
    </div>
    <div class="type">
      <div class="name">分类:</div>
      <div
        class="select-item"
        :style="{
          color:
            item.value == cateSelect
              ? `var(--${theme}-text-tint)`
              : `var(--${theme}-text-color)`,
        }"
        v-for="item in cate"
        :key="item.value"
        @click="changeType(item.value)"
      >
        {{ item.content }}
      </div>
    </div>
    <div class="nameStart">
      <div class="name">筛选:</div>
      <div
        class="select-item"
        :style="{
          color:
            item.value == nameStartSelect
              ? `var(--${theme}-text-tint)`
              : `var(--${theme}-text-color)`,
        }"
        v-for="item in nameStart"
        :key="item.value"
        @click="changeNameStart(item.value)"
      >
        {{ item.content }}
      </div>
    </div>
    <div class="artistList">
      <div class="artist-item" v-for="item in artist" :key="item.id">
        <img v-lazy="item.picUrl" alt="" />
        <div class="name">{{ item.name }}</div>
      </div>
    </div>
    <!-- <el-pagination
      :currentPage="pagenum"
      :page-size="pagesize"
      layout="prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
  </div>
</template>

<script>
import { areas, types, Fnames } from "./data.js";
import { getArtist } from "@/api/artist.js";
import { reactive, toRefs, ref, computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    //语种
    let language = reactive(areas);
    //分类
    let cate = reactive(types);
    //首字母
    let nameStart = reactive(Fnames);
    //分页数据
    let pagenum = ref(1);
    let pagesize = ref(18);

    //获取一下歌手数据
    getArtistList(-1, -1, -1, pagesize.value, pagenum.value);

    //选中的数据
    let selece_data = reactive({
      languageSelect: -1,
      cateSelect: -1,
      nameStartSelect: -1,
      //歌手数据
      artist: [],
    });

    //改变选中的值
    function changeLanguage(value) {
      selece_data.languageSelect = value;
      //重新获取数据
      getArtistList(
        selece_data.languageSelect,
        selece_data.cateSelect,
        selece_data.nameStartSelect,
        pagesize.value,
        pagenum.value
      );
    }
    function changeType(value) {
      selece_data.cateSelect = value;
      //重新获取数据
      getArtistList(
        selece_data.languageSelect,
        selece_data.cateSelect,
        selece_data.nameStartSelect,
        pagesize.value,
        pagenum.value
      );
    }
    function changeNameStart(value) {
      selece_data.nameStartSelect = value;
      //重新获取数据
      getArtistList(
        selece_data.languageSelect,
        selece_data.cateSelect,
        selece_data.nameStartSelect,
        pagesize.value,
        pagenum.value
      );
    }

    //获取歌手数据的方法
    function getArtistList(language, cate, nameStart, pagesize, pagenum) {
      getArtist(language, cate, nameStart, pagesize, pagenum).then((res) => {
        // console.log(res);
        if (res.code == 200) {
          selece_data.artist = res.artists;
        }
      });
    }

    //分页功能
    // function handleSizeChange(newsize) {}
    // function handleCurrentChange(newpage) {}
    //获取操作vuex的方法
    let { state } = useStore();

    //获取主题颜色
    let theme = computed(() => {
      return state.theme;
    });

    return {
      language,
      cate,
      nameStart,
      ...toRefs(selece_data),
      changeLanguage,
      changeType,
      changeNameStart,
      theme,
    };
  },
};
</script>

<style lang="scss" scoped>
.artist {
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
  .artistList {
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    .artist-item {
      width: 15%;
      margin-right: 1.6%;
      margin-bottom: 15px;
      cursor: pointer;
      img {
        width: 100%;
      }
      .name {
      }
    }
  }
}
</style>
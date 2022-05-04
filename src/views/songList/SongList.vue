<template>
  <div class="song">
    <div class="select">
      <div class="content" @click="selectBoxIsShow = !selectBoxIsShow">
        <span class="select-acive">{{ selece_tag }}</span>
        <el-icon><arrow-down-bold /></el-icon>
      </div>
      <transition name="select">
        <div class="option" v-show="selectBoxIsShow">
          <div class="sanjiao">
            <el-icon :size="40" color="#ccc"><caret-top /></el-icon>
          </div>
          <div class="title">全部歌单分类</div>
          <div class="box">
            <div class="scroll">
              <el-button class="all" @click="changeTag('全部')"
                >全部歌单</el-button
              >
              <div
                class="option-item"
                v-for="(item, index) in categories"
                :key="index"
              >
                <div class="left">{{ item }}</div>
                <div class="rigth">
                  <ul>
                    <li
                      v-for="(item2, index2) in sub.filter(
                        (item) => item.category == index
                      )"
                      :key="index2"
                      @click="changeTag(item2.name)"
                    >
                      {{ item2.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="hot-tag">
      <div class="hot">热门标签：</div>
      <div class="tag">
        <ul>
          <li
            :class="{ active: item.name == selece_tag }"
            v-for="(item, index) in hot_tags"
            :key="index"
            @click="changeTag(item.name)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
    <Songlist :data="list" />
    <el-pagination
      :currentPage="pagenum"
      :page-size="pagesize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { ref, reactive, toRefs } from "vue";
import {
  getCatList,
  getMusicListHot,
  getHighquality,
  getPlayList,
} from "@/api/album.js";
import Songlist from "@/components/content/songList.vue";
export default {
  components: {
    Songlist,
  },
  setup() {
    //控制歌单分类选项的显示
    let selectBoxIsShow = ref(false);

    //歌单分类数据
    let categoryDate = reactive({
      all: {},
      //全部分类
      categories: [],
      //子分类
      sub: [],
      //热门歌单tag
      hot_tags: [],
      //被选中的分类
      selece_tag: "全部",
      //歌单列表
      list: [],
      total: 0,
      pagenum: 1,
      pagesize: 20,
    });

    //获取歌单分类
    getCatList().then((res) => {
      // console.log(res);
      if (res.code == 200) {
        categoryDate.all = res.all;
        categoryDate.categories = res.categories;
        categoryDate.sub = res.sub;
      }
    });

    //获取热门歌单tag
    getMusicListHot().then((res) => {
      if (res.code == 200) {
        categoryDate.hot_tags = res.tags;
      }
    });

    //获取全部歌单
    getSongList("全部", categoryDate.pagesize, categoryDate.pagenum);

    //改变选中的分类
    function changeTag(name) {
      categoryDate.selece_tag = name;
      //隐藏选择框
      selectBoxIsShow.value = false;
      categoryDate.pagenum = 1;
      getSongList(name, categoryDate.pagesize, categoryDate.pagenum);
    }

    //根据选中的tag获取歌单数据
    function getSongList(cat, limit, offset) {
      getPlayList(cat, limit, offset).then((res) => {
        if (res.code == 200) {
          categoryDate.list = res.playlists;
          categoryDate.total = res.total;
        }
        // console.log(res);
      });
    }
    //分页功能
    function handleSizeChange(newsize) {
      categoryDate.pagesize = newsize;
      getSongList(
        categoryDate.selece_tag,
        categoryDate.pagesize,
        categoryDate.pagenum
      );
    }
    function handleCurrentChange(newpage) {
      categoryDate.pagenum = newpage;
      getSongList(
        categoryDate.selece_tag,
        categoryDate.pagesize,
        categoryDate.pagenum
      );
    }

    return {
      selectBoxIsShow,
      ...toRefs(categoryDate),
      changeTag,
      handleSizeChange,
      handleCurrentChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.song {
  width: 80%;
  margin: 0 auto;

  .select {
    display: flex;
    position: relative;
    .content {
      padding: 10px 25px;
      border-radius: 5px;
      border: 1px solid #ccc;
      cursor: pointer;
    }
    .option {
      position: absolute;
      top: 55px;
      background: #fff;
      width: 520px;
      height: 340px;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 5px;
      color: #515a6e;
      z-index: 9;
      .sanjiao {
        position: absolute;
        left: 40px;
        top: -29px;
      }
      .title {
        height: 30px;
        line-height: 30px;
        font-weight: 800;
        border-bottom: 1px solid #ccc;
        font-size: 14px;
      }
      .box {
        overflow: hidden;
        height: calc(100% - 30px);
        .scroll {
          height: 100%;
          overflow-y: scroll;
          width: calc(100% + 20px);
          .all {
            width: calc(100% - 20px);
            margin: 5px 0;
            font-size: 12px;
          }
          .option-item {
            display: flex;
            margin-bottom: 15px;
            .left {
              width: 20%;
              font-size: 16px;
              text-align: center;
            }
            .rigth {
              width: 80%;
              ul {
                display: flex;
                flex-wrap: wrap;
                li {
                  width: 19%;
                  border: 1px solid #ccc;
                  padding: 9px 0;
                  text-align: center;
                  cursor: pointer;
                  &:hover {
                    border-color: var(--light-icon-active-color);
                    color: var(--light-icon-active-color);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .hot-tag {
    display: flex;
    align-items: center;
    .hot {
      width: 10%;
    }
    .tag {
      width: 90%;
      ul {
        display: flex;
        li {
          width: 10%;
          padding: 15px 0;
          text-align: center;
          cursor: pointer;
          &:hover {
            color: var(--light-icon-active-color);
          }
        }

        .active {
          color: var(--light-icon-active-color);
        }
      }
    }
  }
}
.select-enter-from,
.select-leave-to {
  opacity: 0;
}
.select-enter-to,
.select-leave-from {
  opacity: 1;
}
.select-enter-active,
.select-leave-active {
  transition: all 0.5s;
}
</style>
<template>
  <div class="comment">
    <textarea id="" rows="10"></textarea>
    <el-button>评论</el-button>
    <div class="commentList">
      <div class="title">精彩评论</div>
      <div class="item" v-for="item in comment" :key="item.commentId">
        <div class="left">
          <img :src="item.user.avatarUrl" alt="" />
        </div>
        <div class="right">
          <div class="commentInfo">
            <span class="name">{{ item.user.nickname }}：</span>
            <span class="content">{{ item.content }}</span>
          </div>
          <div class="time">
            {{ myFormatDate(item.time) }}
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      style="margin: 10px auto; text-align: center"
      :currentPage="pagenum"
      :page-size="pagesize"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getRecommends } from "@/api/album.js";
import { musicRecommend } from "@/api/music-detail.js";
import { getMVComment } from "@/api/mv.js";
import { reactive, toRefs, watch, ref } from "vue";
import { myFormatDate } from "../../utils/tool.js";
import { useRoute } from "vue-router";
export default {
  //type 1为歌单列表的评论信息，2代表歌曲评论信息
  props: ["id", "type"],
  setup(props) {
    const $route = useRoute();
    let id = ref(props.id);
    //分页功能
    let data = reactive({
      pagenum: 1,
      pagesize: 10,
      total: 0,
      comment: [],
    });
    function handleSizeChange(newsize) {
      data.pagesize = newsize;
      getDate(data.pagesize, data.pagenum);
    }
    function handleCurrentChange(newpagenum) {
      data.pagenum = newpagenum;
      getDate(data.pagesize, data.pagenum);
    }

    // 根据歌单id获取评论信息
    //1获取的是歌单评论，2是歌曲评论，3是mv评论
    function getDate(pagesize, pagenum) {
      if (props.type == 1) {
        getRecommends(id.value, pagesize, pagenum).then((res) => {
          if (res.code == 200) {
            data.comment = res.comments;
            data.total = res.total;
          }
        });
      } else if (props.type == 2) {
        musicRecommend(id.value, pagesize, pagenum).then((res) => {
          if (res.code == 200) {
            data.comment = res.comments;
            data.total = res.total;
          }
        });
      } else if (props.type == 3) {
        getMVComment(id.value, pagesize, pagenum).then((res) => {
          if (res.code == 200) {
            data.comment = res.comments;
            data.total = res.total;
          }
        });
      }
    }
    getDate(data.pagesize, data.pagenum);

    //监听路由变化防止点击相关mv跳转同一路由数据不更新
    watch(
      $route,
      (newvalue, oldvalue) => {
        // console.log(newvalue);
        id.value = newvalue.query.id;
        getDate(data.pagesize, data.pagenum);
      },
      { deep: true }
    );

    return {
      handleSizeChange,
      handleCurrentChange,
      ...toRefs(data),
      myFormatDate,
    };
  },
};
</script>

<style lang="scss" scoped>
textarea {
  width: 100%;
}
.commentList {
  .title {
    font-size: 16px;
    font-weight: 800;
    margin: 15px 0;
  }
  .item {
    display: flex;
    align-items: center;
    padding: 10px 10px;
    &:nth-child(odd) {
      // background-color: #f9f9f9;
    }
    .left {
      width: 50px;
      height: 50px;
      flex-shrink: 0;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
      }
    }
    .right {
      margin: 0 10px;
      font-size: 15px;
      .commentInfo {
        margin: 10px 0;
        .name {
          color: var(#0c73c2);
        }
        .content {
        }
      }
      .time {
      }
    }
  }
}
</style>
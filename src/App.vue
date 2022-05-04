<template>
  <div id="nav">
    <Header></Header>
    <main>
      <Aside />
      <Main />
    </main>
    <Footer />
  </div>
</template>
<script>
import Header from "./layout/header/Header.vue";
import Footer from "./layout/footer/Footer.vue";
import Aside from "./layout/aside/Aside.vue";
import Main from "./layout/mian/Main.vue";
import { useStore } from "vuex";
export default {
  components: {
    Header,
    Footer,
    Aside,
    Main,
  },
  setup() {
    //获取主题颜色
    let { commit } = useStore();
    commit("getTheme");
  },
};
</script>
<style lang="scss">
@import url(./styles/base.css);
@import url(./styles/font/iconfont.css);
main {
  display: flex;
  width: 100%;
  height: calc(100vh - 118px);
}
</style>

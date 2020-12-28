<template>
  <div class="home">
    <div class="content-left">
      <sidebarLeft></sidebarLeft>
    </div>
    <div class="content-right">
      <sidebarNav></sidebarNav>
      <div class="content-right-cont">
        <router-view :key="$route.query.t"/>
<!--        <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->
        <filBottom :isLogin=false>

        </filBottom>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue } from 'vue-property-decorator';
import sidebarLeft from '@/components/sidebarLeft.vue';
import sidebarNav from '@/components/sidebarNav.vue';
import filBottom from '@/components/filBottom.vue'
import store from "@/store";

@Component({
  components: {
    sidebarLeft,
    sidebarNav,
    filBottom
  },
})

export default class Home extends Vue {
  // data
  public niceNmae: string = 'caomingrui';
  public name: any = store.state.name;

}
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 100%;

  .content-left {
    width: 190px;
    height: 100%;
  }

  .content-right {
    width: calc(100% - 190px);
    background: rgb(239, 239, 246);
    height: 100%;

    .content-right-cont {
      margin-top: 67px;
      padding: 20px 60px;
      height: calc(100% - 110px);
      overflow-y: scroll;
    }
  }
}
</style>

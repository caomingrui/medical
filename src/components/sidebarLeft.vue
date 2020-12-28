<template>
  <div class="sidebarLeft">
    <div class="sidebar-left-cont">
      <img src="../assets/img/logo.png" alt="">
      <div v-for="item in barList" :key="item.label" :class="item.name.indexOf(pathName)>=0?'checkBar': ''" @click="clearPath(item.name[0])">
        <img :src="item.name.indexOf(pathName)>=0?item.checkIcon: item.icon" alt=""><router-link :to='{path: item.path, query: {t: Date.now()}}'>{{ item.label }}</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import {Component, Vue, Watch} from 'vue-property-decorator';
import store from "@/store";
interface RouteType {
  name: string;
  params?: any;
}

@Component({
  components: {

  },
})

export default class sidebarLeft extends Vue {
  /**
   * data
   * */
  public barList: any = [{'label': '首页', 'path': '/home/cont/0', 'name': ["HomeCont"], 'icon': require("../assets/img/sidebar_home.png"), 'checkIcon': require("../assets/img/sidebar_home_check.png")},
    {'label': '期刊', 'path': '/home/journal/0/all', 'name': ["all", "class", "list"], 'icon': require("../assets/img/sidebar_article.png"), 'checkIcon': require("../assets/img/sidebar_article_check.png")},
    {'label': '全网搜索', 'path': '/home/globalSearch/0', 'name': ['globalSearch'], 'icon': require("../assets/img/sidebar_search.png"), 'checkIcon': require("../assets/img/sidebar_search_check.png")},
    {'label': '我的收藏', 'path': '/home/myCollection/0', 'name': ['myCollection'], 'icon': require("../assets/img/sidebar_collect.png"), 'checkIcon': require("../assets/img/sidebar_collect_check.png")},
    {'label': '个人设置', 'path': '/home/personalSettings/0', 'name': ['personalSettings'], 'icon': require("../assets/img/sidebar_sett.png"), 'checkIcon': require("../assets/img/sidebar_sett_check.png")}
  ];
  public pathName: any = '';

  created() {
    this.pathName = this.$route.name;
  }

  /**
   * @param { string } pathName -- 跳转路径名称
   * */
  clearPath(pathName: string) {
    console.log('我被点击了嘛');
    let time: string = String(Date.now());
    this.$router.push({name: pathName, params: {id: '0', t: time}});
    if (pathName == 'all') {
      store.commit('changeJournal', 0);
    }
  }

  /**
   * watch
   * */
  @Watch('$route')
  get$route(newVal: RouteType, oldVal: RouteType) {
    console.log(newVal)
    this.pathName = newVal.name;
  };
}
</script>

<style scoped lang="scss">
.sidebarLeft {
  width: 100%;
  background-color: rgb(255, 255, 255);
  position: relative;
  text-align: center;

  .sidebar-left-cont {
    width: 100%;
    height: 520px;
    position: absolute;
    top: 0;

    display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box; /* 老版本语法: Firefox (buggy) */
    display: flex-; /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    //display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */

    flex-direction: column;
    -webkit-box-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -webkit-flex-direction: column;
    //flex-direction: column;

    justify-content: space-between;
    &> img {
      width: 100%;
      display: inline-block;
      margin: 0 auto;
    }

    a {
      text-decoration: none;
      font-size: 14px;
      color: #000000;
    }

    &>div {
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      border-left: 3px solid transparent;

      img {
        vertical-align: -4px;
        width: 18px;
        height: 18px;
        margin-right: 10px;
      }
    }
  }
}
.checkBar {
  border-left: 3px solid #0066cc !important;
}
</style>
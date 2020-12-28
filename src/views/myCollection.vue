<template>
  <div class="myCollection">
    <div class="myCollection-cont">
      <div v-for="(item, ind) in articleMess" :key="item">
        <articleListView :articleMess="item" :articleInd="ind" @refreshPage="refreshPage" ></articleListView>
      </div>
      <div class="advertis">
        <a href="../#/advertis" target="_blank">
          <img src="../assets/img/advertis.jpg" alt="">
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import {Component, Vue, Watch} from 'vue-property-decorator';
import articleListView from "@/components/articleListView.vue";
import store from "@/store";
interface RouteType {
  name: string;
  params?: any;
}

@Component({
  components: {
    articleListView
  },
})

export default class sidebarLeft extends Vue {
  [key:string]:any;
  public articleMess: any = [];

  // activated(){
  //   this.pageCollection();
  // }

  created() {
    this.pageCollection();
  }

  mounted() {
    this.refresh();
  }

  refresh() {
    setTimeout(() => {
      if (this.$route.params.id == '0') {
        this.$router.push({name: 'myCollection', params: {id: 'ref'}});
      }
      else if (this.$route.params.id == 'ref') return
      // window.history.go(0);
    }, 1000)
  }

  /**
   * page collection list
   * /{source}/article/findArticle
   * followCount --- collectionNumber
   */
  public pageCollection(): void {
    let self = this;
    this.$request.get('/api/h5/article/findArticle?pageNo=0')
    .then((res: any) => {
      if (res.code == '00000000') {
        console.log('--------- 我的收藏查询ok --------------');
        console.log(res.data);
        let data = res.data;
        let articleObj: any = {};
        let arr: any = [];
        data.map((da: any) => {
          articleObj.id = da.articleId;
          articleObj.followCount = da.followCount;
          arr.push(da.articleId);
          self.articleMess.push(da.articleId);
        })

        // self.articleMess.push(arr);

        //self.articleMess.push(articleObj);

        // let i = 0;
        // let timer = setInterval(function(){
        //   if (Object.prototype.toString.call(data) != "[object Undefined]") {
        //     let articleObj: any = {};
        //     articleObj.id = data[i].articleId;
        //     articleObj.followCount = da.followCount;
        //     self.articleMess.push(articleObj);
        //     i++;
        //     if(i > arr.length-1){
        //       clearInterval(timer);
        //     }
        //   }
        // },800);

        self.pageCollectNum(arr);
      }
      else {
        console.log('--------- 我的收藏查询异常 -------------');
      }
    })
  }

  /**
   * 查询文章列表 收藏数
   * */
  pageCollectNum(arr: any) {
    let self = this;
    this.$request.get('/api/h5/article/findFollowCount?ids=' + arr)
      .then((res: any) => {
        console.log(res)
        if (res.code == '00000000') {
          console.log('-------- 收藏数量查询ok -----------');
          // self.collectNum = res.data;
          store.commit('saveCollectNumberList', res.data)
          // store.dispatch('saveCollectNumberList', res.data)
          localStorage.setItem('saveCollectNumberList', JSON.stringify(res.data))
        }
        else {
          console.log('-------- 收藏数量查询no -----------');
          self.$message.error(res.message);
        }
      })
  }

  /**
   * cancel_collection_callback_sync_page
   * */
  public refreshPage() {
    this.pageCollection();
  }

  /**
   * watch
   * */
  @Watch('$route')
  get$route(newVal: any, oldVal: any) {
    // alert(newVal)
    // alert(oldVal)
    console.log(newVal);
  };

}
</script>

<style scoped lang="scss">
.advertis {
  position: fixed;
  right: 6%;
  top: 88px;
  cursor: pointer;

  img {
    width: 100%;
  }
}
</style>
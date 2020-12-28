<template>
  <div class="globalSearch">

    <!-- 搜索后头部展示 -->
    <div class="nav" v-if="searchState">
        <div class="nav-left">
          <img src="../assets/img/sidebar_search.png" alt="">
          <input type="text" v-model="searchCont" @keyup.enter="search('empty')">
        </div>
        <div class="nav-right">
          <div class="nav-right-but" @click="globalSearch('empty')">
            搜索
          </div>
        </div>
      </div>

    <!-- 未搜索展示 -->
    <div class="globalSearch-alert" v-if="!searchState">
      <div class="globalSearch-alert-left">
        <img src="../assets/img/sidebar_search.png" alt="">
        <input type="text" v-model="searchCont" placeholder="搜索内容" ref="getFocus" @keyup.enter="search('empty')">
      </div>
      <div class="globalSearch-alert-right" @click="search('empty')">
        <div>搜索</div>
      </div>
    </div>

    <!-- 搜索内容 -->
    <div class="globalSearch-cont" v-if="searchState">
      <div class="" v-for="(item, ind) in articleIdList" :key="item">
        <articleListView :articleMess="item" :articleInd="ind"></articleListView>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
/* eslint-disable */
import {Component, Vue, Watch} from 'vue-property-decorator';
import articleListView from "@/components/articleListView.vue";
import store from "@/store";
import x2js from "x2js";
interface RouteType {
  name: string;
  params?: any;
}

@Component({
  components: {
    articleListView
  },
})

export default class GlobalSearch extends Vue {
  [key:string]:any;
  /**
   * data
   * */
  public searchState: Boolean = false;
  public searchCont: string = '';
  public articleIdList: any = [];
  rollerNum: number = 0;
  page: number = 0; // 请求页面
  finished: boolean = true; // 滚动条 避免反复触发


  created() {
    setInterval(() => {
      this.rollerNum ++;
    }, 1000);

    setTimeout(() => {
      this.listenerFunction();
    }, 8000);
  }

  mounted() {
    (this.$refs.getFocus as any).focus();
    this.rollerNum = 0;
    this.page = 0; // 请求页面
    this.finished = true; // 滚动条 避免反复触发
  }

  /**
   * methods
   * */
  public search(isempty: string = ''): void {
    this.searchState = true;
    this.globalSearch(isempty);
  }

  /**
   * 全局搜索 -- db 测试写死
   * */
  async globalSearch(isempty: string = ''){
    let self = this;
    this.finished = true;

    if (isempty != '') {
      self.articleIdList = [];
    }

    this.$axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&RetStart='+ this.page * 10 +'&RetMax=10&term=' + this.searchCont + '&sort="Recently Added"')
    .then((res: any) => {
      console.log(res);
      let node = res.data;
      let X2js = new x2js();
      let jsonObj: any = X2js.xml2js(node);

      let arr = jsonObj.eSearchResult.IdList.Id;
      if (Object.prototype.toString.call(arr) == "[object Undefined]") {
        this.$message({
          message: '未搜到相关内容, 请尝试其他关键词',
          type: 'warning'
        });
      }
      else {
        let i = 0;
        let timer = setInterval(function(){
          if (Object.prototype.toString.call(arr) != "[object Undefined]") {
            if (Object.prototype.toString.call(arr) != "[object Array]") {
              if (self.articleIdList.includes(arr)) return
              self.articleIdList.push(arr);
            }
            else {
              self.articleIdList.push(arr[i]);
            }
            i++;
            if(i > arr.length-1){
              clearInterval(timer);
            }
          }
        },800);
        self.pageCollectNum(arr);
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
            localStorage.setItem('saveCollectNumberList', JSON.stringify(res.data))
          }
          else {
            console.log('-------- 收藏数量查询no -----------');
            self.$message.error(res.message);
          }
        })
    }

  /**
   * 添加滚动条事件
   * */
  listenerFunction(): void {
    let dom: any = document.querySelector('.content-right-cont');
    dom.addEventListener('scroll', this.handleScroll, true);
  }

  handleScroll () {
      if (this.$route.name != "globalSearch") return;
      let dom: any = document.querySelector('.content-right-cont');
      console.log('搜索')
      if (dom.scrollHeight - dom.scrollTop <= 940 && this.finished) {
        console.log(this.rollerNum);
        if (this.rollerNum < 8) {
          this.$message({
            message: '加载完才能下拉刷新哦num' + this.rollerNum,
            type: 'warning'
          });
        }
        else {
          this.finished = false;
          this.page = this.page + 1;
          this.globalSearch();
          console.log('我到底了嘛！');
        }
      }
  }

  /**
   * watch
   * */
  @Watch('$route')
  get$route(newVal: RouteType, oldVal: RouteType) {
    console.log(newVal.params.id)
  };
}
</script>

<style scoped lang="scss">
  .globalSearch {
    width: 100%;
    height: 100%;
    position: relative;

    .nav {
      position: fixed;
      width: calc(100% - 330px);
      padding-right: 80px;
      left: 250px;
      top: 0;
      line-height: 66px;
      background: #efeff6;
      height: 66px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 2;

  .nav-left {
    display: flex;
    align-items: center;
    width: 80%;

    img {
      margin-right: 45px;
    }

    input {
      border: none;
      outline: none;
      background:transparent;
      width: 80%;
    }
  }

  .nav-right {
    cursor: pointer;
    width: 140px;
    height: 50px;
    border-radius: 10px;
    background: #0066CC;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 50px;
    text-align: center;
    letter-spacing: 1px;
  }
}

    .globalSearch-alert {
      padding: 0 40px;
      //width: 920px;
      width: 60%;
      min-width: 634px;
      height: 100px;
      background: #ffffff;   
      box-shadow: 0px 2px 4px 0px rgba(0, 102, 204, 0.1);
      border-radius: 0px 10px 10px 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      top: 74px;
      left: 16%;

      .globalSearch-alert-left {
        display: flex;
        align-items: center;
        width: 80%;

        img {
          width: 25.84px;
          height: 25.84px;
          margin-right: 33px;
          cursor: pointer;
        }

        input {
          border: none;
          outline: none;
          height: 30px;
          line-height: 30px;
          font-size: 22px;          
          font-weight: 600;
          width: 80%;
          color: #ccc;
          line-height: 30px;
          letter-spacing: 1px;

          &::-webkit-input-placeholder { /* WebKit browsers */
            font-size: 22px;
            font-weight: 600;
            color: #DADADA;
            line-height: 30px;
            letter-spacing: 1px;
          }
        }
      }

      .globalSearch-alert-right {
        cursor: pointer;
        width: 140px;
        height: 50px;
        border-radius: 10px;
        background: #0066CC;
        font-size: 16px;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 50px;
        text-align: center;
        letter-spacing: 1px;
      }
    }
  }

  .advertis {
    position: absolute;
    top: 88px;
    left: 16%;
    width: 66%;
    cursor: pointer;

    img {
      width: 100%;
    }
  }
</style>
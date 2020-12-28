<template>
  <div class="journal">

    <!--期刊详细-->
    <div class="journal-shows" v-if="showState==3">
      <div class="journal-shows-nav">
        <img :src="journalImg" alt="">
        <span>{{journalName}}</span>
      </div>
      <div class="journal-shows-cont">
        <div v-for="(item, index) in articleIdList" :key="item">
          <articleListView :articleMess="item" :articleInd="index"></articleListView>
        </div>
      </div>
    </div>

    <div class="advertis" v-if="showState==3">
      <a href="../#/advertis" target="_blank">
        <img src="../assets/img/advertis.jpg" alt="">
      </a>
    </div>

    <div v-if="showState!=3">
      <!--<articleListView></articleListView>-->
      <div class="defaultAll" v-if="showState==0">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin: 25px 0 30px 0;">
          <el-breadcrumb-item v-for="(item, index) in bread_crumbs" :key="item.label"
                              :to="{ path: item.path }" @click.native="test(index)">{{item.label}}</el-breadcrumb-item>
        </el-breadcrumb>
        <router-view />
      </div>

      <!--我的订阅-->
      <div class="myJournal" v-if="showState==1">
        <div class="myJournal-list" v-for="item in subscriptionList" :key="item.id">
          <div class="myJournal-list-img" @click="openJournalList(item.nlmTitleAbbreviation, item.periodicalTitle, item.imgUrlMin, item.nlmId)">
              <img :src="item.imgUrlMin" alt="">
              <span>{{ item.periodicalTitle }}</span>
          </div>
          <div class="myJournal-list-but" @click="unsubscribe(item.id)">
              取消订阅
          </div>
        </div>
      </div>
    </div>

    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
      <span>确定取消订阅吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="canceleSubscription()">确 定</el-button>
      </span>
    </el-dialog>
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

export default class Journal extends Vue {
  [key:string]:any;
  /**
   * data
   * */
  public showState: any = 0;
  public journalName: string = '';
  public bread_crumbs: any = store.state.journalList;
  public subscriptionList: any = [{}]; // 写死走通流程
  public articleIdList: any = [];
  journalImg: string = '';
  rollerNum: number = 0;
  page: number = 0; // 请求页面
  finished: boolean = true; // 滚动条 避免反复触发

  currentPerId: string = '';//
  dialogVisible: boolean = false;//

  created() {
    this.bread_crumbs = store.state.journalList;
    this.showState = this.$route.params.id;

    setInterval(() => {
      this.rollerNum ++;
    }, 1000);

    setTimeout(() => {
      this.listenerFunction();
    }, 8000);
  }

  mounted() {
    this.pageSubscribe();
    if (this.$route.params.id == '3') {
      if (store.state.periodicalArticlesList) {
        this.journalName = store.state.periodicalArticlesList.name;
        this.journalImg = store.state.periodicalArticlesList.img;
        this.pageJournalArticleList(store.state.periodicalArticlesList.keyword);

        this.page = 0;
        this.finished = true;
      }
    }
  }

  /**
   * methods
   * */
 test(ind: any) {
    store.commit('changeJournal', ind)
  }

  /**
   * page my subscribe journal 查看订阅
   * /{source}/periodical/findPeriodical
   * */
  pageSubscribe() {
    let self = this;
    this.$request.get('/api/h5/periodical/findPeriodical')
    .then((res: any) => {
      if (res.code == "00000000") {
        console.log('---------- 查询订阅成功啦 ----------');
        self.subscriptionList = res.data;
      }
      else {
        console.log('---------- 查询订阅失败啦 ----------');
        self.$message.error(res.message);
      }
    })
  }

  /**
   * 跳转期刊下文章列表
   * */
  openJournalList(keyword: any, title: any, img: any, id: any) {

    let obj = {
      name: title,
      keyword,
      img,
      id
    };

    localStorage.setItem('periodicalArticlesList', JSON.stringify(obj))
    store.commit('savePeriodicalArticlesList', obj)

    this.$router.push({name: 'all', params: {id: '3'}});
    this.journalName = title;
    this.journalImg = img;
    this.pageJournalArticleList(keyword);
  }

  /**
   * 查询期刊下文章列表
   * @param { string } term -- 搜索期刊下文章列表
   * */
  pageJournalArticleList(term: string) {
    let self = this;
    this.finished = true;
    // self.articleIdList = [];
    this.$axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&RetStart='+ this.page * 10 +'&RetMax=10&term=' + term + '&sort="Recently Added"')
    .then((res: any) => {
      let node = res.data;
      let X2js = new x2js();
      let jsonObj: any = X2js.xml2js(node);
      console.log('json --------------------')
      console.log(jsonObj)
      console.log('json --------------------')
      console.log(jsonObj.eSearchResult.IdList.Id);
      let arr: any = jsonObj.eSearchResult.IdList.Id;
      // self.articleIdList = jsonObj.eSearchResult.IdList.Id;

      let i = 0;
      let timer = setInterval(function(){
        if (Object.prototype.toString.call(arr) != "[object Undefined]") {
          self.articleIdList.push(arr[i]);
          i++;
          if(i > arr.length-1){
            clearInterval(timer);
          }
        }
      },1000);
      self.pageCollectNum(arr);
    })
  }

  /**
   * 取消期刊订阅
   * /{source}/periodical/unsubscribe
   * id --- 期刊 id
   * */
  canceleSubscription() {
    let self = this;
    let id = self.currentPerId;
    this.$request.get('/api/h5/periodical/unsubscribe?id=' + id)
    .then((res: any) => {
      if (res.code == '00000000') {
        console.log('-------- 取消期刊订阅ok ------------');
        self.pageSubscribe();
        self.$message('取消成功');
        self.dialogVisible = false;
      }
      else {
        console.log('-------- 取消期刊订阅不ok ------------');
        this.$message.error(res.message);
      }
    })
  }

  /**
   *
   * */
  unsubscribe(id: string) {
    this.currentPerId = id;
    this.dialogVisible = true;
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
    let dom: any = document.querySelector('.journal-shows-cont');
    dom.addEventListener('scroll', this.handleScroll, true);
  }

  handleScroll () {
    let dom: any = document.querySelector('.journal-shows-cont');
    console.log('期刊详情')
    if (dom.scrollHeight - dom.scrollTop <= 701 && this.finished) {
      if (this.rollerNum < 8) {
        this.$message({
          message: '加载完才能下拉刷新哦',
          type: 'warning'
        });
      }
      else {
        this.page = this.page + 1;
        this.finished = false;
        let term = store.state.periodicalArticlesList.keyword;
        this.pageJournalArticleList(term);
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
    this.showState = newVal.params.id;
    console.log(store.state.currentJournals);

    this.pageSubscribe();
    let type = Object.prototype.toString.call(store.state.currentJournals);
    if (type == "[object Object]") {
      this.pageJournalArticleList(store.state.currentJournals.nlmTitleAbbreviation);
      this.journalName = store.state.currentJournals.periodicalTitle;
      this.journalImg = store.state.currentJournals.imgUrlMin;
    }
    else {

    }
  };

  @Watch('bread_crumbs')
  getBread_crumbs(newVal: any, oldVal: any) {
    this.bread_crumbs = newVal;

  };
}
</script>

<style scoped lang="scss">
.journal {
  width: 100%;

  .journal-shows {
    width: 100%;
    height: 100%;

    .journal-shows-nav {
      padding: 20px 30px;
      width: calc(70% - 50px);
      height: 60px;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      border-radius: 5px;
      margin-bottom: 40px;

      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }

      span {
        margin-left: 13px;
        font-size: 22px;
        font-weight: 600;
        color: #2B2B2B;
        line-height: 30px;
      }
    }

    .journal-shows-cont {
      width: 103%;
      height: 700px;
      overflow-y: scroll;
    }
  }

  .defaultAll {
    width: 100%;

    //.defaultAll-cont {
    //  display: flex;
    //  justify-content: space-between;
    //  align-items: center;
    //  flex-wrap: wrap;
    //
    //  .journal {
    //    width: 130px;
    //    height: 202px;
    //    padding: 55px;
    //    cursor: pointer;
    //    box-shadow: rgb(215, 215, 224) 0px 0px 0px 1px inset, rgba(68, 55, 133, 0.1) 0px 2px 5px 0px;
    //    text-align: center;
    //
    //    img {
    //      width: 135px;
    //      height: 135px;
    //    }
    //
    //    label {
    //      font-size: 16px;
    //      font-weight: bold;
    //      color: rgb(155, 155, 155);
    //      display: inline-block;
    //      margin-top: 35px;
    //    }
    //  }
    //}

  }

  .myJournal {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

     .myJournal-list {
      width: 200px;
      color: #323232;
      font-size: 14px;
      font-weight: bold;
      height: 310px;
      background-color: #ffffff;
      box-shadow: rgb(215, 215, 224) 0px 0px 0px 1px inset;
      margin: 10px 25px 85px 25px;
      line-height: 50px;
      cursor: pointer;
      border-radius: 5px;
      
      .myJournal-list-img {
          width: 100%;
          height: 273px;
          position: relative;
          text-align: center;

          img {
            width: 96%;
            height: 98%;
            margin-top: 2%;
          }

          &>span {
            position: absolute;
            display: block;
            bottom: 0;
            line-height: 19px;
            width: 95%;
            left: 2.5%;
            color: #fff;
            text-align: center;

            background: rgba(0,0,0,.5);
            padding: 5px 0;
            min-height: 3.5em;
          }
      }

      .myJournal-list-but {
          height: 37px;
          line-height: 37px;
          font-weight: 500;
          color: #9C9C9C;
          text-align: center;
      }
    }
  }
}

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
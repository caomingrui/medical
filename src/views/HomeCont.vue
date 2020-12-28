<template>
  <div class="HomeCont">
    <!--num == 4 展示 文章详情-->
    <div class="article-details" v-if="num == 4">
      <articleListView></articleListView>
      <div class="article-recomm">
        <div class="recommed-nav" style="width: 70%;margin: 50px 0 30px 0;">相关推荐</div>
        <div class="recommed-bot">
<!--          <div v-for="item in recommendList" :key="item">-->
            <articleListView v-for="item in recommendList" :key="item" :articleMess="articleCollectsList[item].articleId"
                             :abstract="false" :articleInd="item" :recomArticle="false"></articleListView>
<!--          </div>-->
        </div>
      </div>
    </div>

    <div v-if="num != 4">
      <div v-if="num==0">
        <div v-if="articleIdList.length > 0">
          <div v-for="(item, ind) in articleIdList" :key="ind">
            <articleListView :articleMess="item" :articleInd="ind"></articleListView>
          </div>
        </div>
        <div v-if="guideState" style="line-height: 2em" v-html="guidedBy">
        </div>
      </div>

      <div v-if="num != 0">
        <div v-if="journalRetrievalSatet">
            <div v-for="(item, ind) in moduleContList" :key="ind" :style="item.id == num?'': 'display: none'">
              <div v-if="isCont">未检索到相关内容，换一下关键词试试吧</div>
              <div v-for="(da, index) in item.cont" :key="da" :style="isCont?'display:none': ''">
                <articleListView :articleMess="da" :articleInd="index"></articleListView>
              </div>
            </div>
        </div>
        <div v-else>
          未订阅期刊，没有检索到相关内容，订阅期刊试试吧
        </div>
      </div>
    </div>

    <div class="advertis">
      <a href="../#/advertis" target="_blank">
        <img src="../assets/img/advertis.jpg" alt="">
      </a>
    </div>

  </div>
</template>

<script lang="ts">
/* eslint-disable */
import articleListView from "@/components/articleListView.vue";
import {Component, Vue, Watch} from 'vue-property-decorator';
import store from "@/store";
import x2js from "x2js";
import service from "@/utils/request";
// import fa from "element-ui/src/locale/lang/fa";

interface RouteType {
  params: any;
}

@Component({
  components: {
    articleListView
  },
})

export default class HomeCont extends Vue {
  [key:string]: any;
  /**
   * data
   * */
  public num: string = this.$route.params.id;
  myJournalList: any = []; // 查询阅期刊规则
  retrieveContent: any = store.state.retrieveCont;
  articleIdList: any = []; // 订阅期刊列表
  retrieveList: any = []; // 检索列表

  moduleContList: any = store.state.retrieveContList;
  articleCollectsList: any = store.state.collectNumberList;// 文章收藏列表
  moduleList: any = []; // 模块信息

  page: number = 0; // 请求页码
  limit: number = 10;// 每次请求数量
  finished: boolean = true;// 翻页只触发一次
  isCont: boolean = false; // 搜索不到时显示
  detailsAboutStatus: number = store.state.detailsAboutStatus; // 文章详情状态

  journalRetrievalSatet: boolean = true; //取消订阅  期刊检索内容状态

  recommendList: any = this.randomData(); // 推荐文章索引列表

  picRetrieve: string = require('../assets/img/retrieve.png');
  picCollect: string = require('../assets/img/collection.png');

  guidedBy: any = `<p style="font-weight: bold;font-size: 17px">第一步：挑选您经常浏览的期刊</p>
                  <p style="font-size: 17px">您可以在“全部期刊”中浏览并订阅感兴趣的、日常需要的学术期刊。一旦您关注了该期刊，该期刊会成为您的学术内容数据来源。</p>
                  <p style="font-weight: bold;margin-top: 20px;font-size: 17px">第二步：设置您关注的学术关键字</p>
                  <p style="font-size: 17px">“<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAXVBMVEUAAACAgIAzMzMzMzM8PDw0NDQzMzM4ODg3Nzc1NTU0NDQ1NTU0NDQ1NTU0NDQ0NDQzMzMzMzMzMzM0NDQ0NDQzMzMzMzMzMzM0NDQzMzM0NDQ0NDQ0NDQzMzMzMzMfDypqAAAAHnRSTlMAAgUKEScoKSorLDpFUmtxeNHS09TV1t/o8Pb7/P4kUhi9AAAATklEQVQY02NgoCPgRgcgQXEeLmTAKwZWKsGCpI9VFMqQZIaLsYnAmVJMUAa7MJImaUYwxSGE4gRZEMEpiOYwOSBGF2OQAWKBgRTk44cwARffBAMsCmHVAAAAAElFTkSuQmCC">”按钮是设置关键字的地方。关键字是您日常关注的学术内容，可以是一个词语，也可以通过Boolean运算符进行组合，关键字可以修改、删除、增加。</p>
                  <p style="font-size: 17px">设置期刊与关键字后，您的订阅页面会以时间优先的逻辑显示您关注的期刊中与关键字相关的最新学术内容。</p>
                  <p style="font-weight: bold;margin-top: 20px;font-size: 17px">第三步：把精彩的内容收藏起来</p>
                  <p style="font-size: 17px">您可以把看不完的、精彩的学术内容进行收藏，通过点击学术内容页的“<img style="width: 25px;vertical-align: middle" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAB0VBMVEUAAAD0+P31+f31+f72+f32+/73+/33+/74+/74/P75/P77/f77/f/8/f78/v/9/v79/v/+///////p8vvp8vzq8/vq8/zr8/vr8/zs9Pvs9Pzt9Pzt9fzu9fzw9vzw9v3x9vzx9v3x9/3y9/zy9/3z9/3z+P3e6/jf6/jf7Pjf7Prg7Pjg7Prh7fri7/rk7/rl8Prl8Pvm8Prm8Pvn8frn8fvo8fvo8vvp8fvv9f3b6fjc6vjd6vjk8Pvs9Pzt9fzd6/rj7vrg6/rg7frx9vzn8fvx9vzj7vrk7/rs9Pzu9fzp8fvw9vzs8/zu9Pzz+P30+f3p8fvr8/vt9Pzw9v32+f72+v7u9fzv9v3z+P33+v7v9vz0+P33+v74+v7z9/33+v75+/70+P33+v75+/76+/76/P77/P/3+v34+v76/P77/P/8/f/5+/76+/76/P76/P/7/P78/f/7/P78/f78/f/9/f/9/v/9/f/9/v/+/v8AZswEaMwRcM8YdNAZddEhetIietIje9MmfdMnfdM3h9c7iddDjtlKktpent5vqeKDtOaQvOmYweqawuukyO2nyu271vHE2/PG3PPH3fTc6vjz9/z4+v35+/77/P79/f4nFzozAAAAe3RSTlMA5ubm5ubm5ubm5ubm5ubm5ubm5+fn5+fn5+fn5+fn5+fn5+fn5+fo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6enp6enp6urr6+zt7e7u7u7v7/Hx8fHy8vL09PT19fX19vb39/j4+Pn5+fr6+vv7+/v7/Pz8/Pz8/f39/f3+/v6z+HueAAADCElEQVRIx73W91/aQBQA8CbGQBIyaIxRIIoYY0EhBQ22avfeu3bvvW3tsLF7793a+2t7d2FkAf7U9wt87uX7eXchvJdFi/5PLA6JeD2CySCBl4mSJPEoJEkMMh/B1/McyzIMTTNMlOUEXvIhD4E5dD1DtRGGrqf1foMgI0xMQLXCCQYMReg9qY0HL87MXju9a7nWZ5A0K7gr1QkqwUUpIpM6Alxxf72mk3QMbc9P4CH4WASC28AfuzWjPcrVTJXAEgJLGckTICxWZQimZioECzKdAA3igDYQqZoqEXmWzKwEDeNKyqgah8TjLQQA0ymDdgwmcFsxKq2CpnEuSTCCWCMSFzESoEVs7yVZVAYRuK0okTzeigAljY7jEImjMkpLAaa7CYaPxzHhGSIR+AU/PQuYZRkKloEkLsIiZX/6r20/969dTRBRh0gskTrmT7+0bXvevyjD02DCM7oSUsS2A1vbqpExCRGO6rH8yReIBMpcUAeikMB9taW2uBPzX97alXj8/od3ZzrNY0Koh+urH21/uIjVQ3GIMIZyvr76tBkZ0doRgaeXZ1zLfvHBlSsmSUxoXZ51b3jOI766U2aqLYZJuuOG55CPXOI7CCNwY6e8N7Mu3nkTxRTpkP7OnZ7EnzqZ85KlGj6LFDW6VngSn8NvFwAPrV7nJrNEwvRkXjUi+8f6IgIkIkdqI/cCR/kGXqOPX+5EXjEYHj1jQqSvvMGdeWLbP/GXN7b923PDuglWcp5kQy2ABcQO9LyI+P8SI7XSvgUQvC/8f4kLtK7kW4ttJQ31GKddsKRmrWkl7hYUnYadDBNRoA3VPNSC5EZxEVcfKy1pLs4WXH2s0i2L65qJm8Njrm5Z6cmK2cRczlqenlzp/Io52UhMZS1v56/OF6U4eDJUrM2P+udLbYqVhiduBcDeQVMOTrHarJTN7PhRz6+xaTJvqSGzsj6RE+Xi0OT45qlLdx5cP7Nn9USuUFLCJ7J77ndaxcJQNpfLDufNkbLacO573y5URZY75M6uRNO3iwW/w/wDyf04nihlj74AAAAASUVORK5CYII=">”按钮即可进行收藏，方便后续的阅读。</p>
                  <p style="font-weight: bold;margin-top: 20px;font-size: 17px">第四步：对全网进行搜索</p>
                  <p style="font-size: 17px">您可以在“全网搜索”中搜索更多的学术内容。搜索范围不限制与您关注的期刊，所有的数据均来源于Pubmed，搜索结果以时间优先的逻辑呈现。</p>
                  <p style="font-weight: bold;margin-top: 20px;font-size: 17px">第五步：设置个人的信息</p>
                  <p style="font-size: 17px">在个人设置栏目中，您可以随时设置您的个人信息，也可以浏览本站的协议内容。</p>
                  <p style="font-weight: bold;margin-top: 20px;font-size: 17px">第六步：Q&A、反馈</p>
                  <p style="font-size: 17px">一些常见的网站使用问题，都可以在“帮助”中找到，希望能帮到您。另外，我们渴望得到您的反馈，以对我们日后的工作进行指导，谢谢。</p>`;

  guideState: boolean = false; // 引导状态

  lineTrem: string = ''// 当前检索内容

  /**
   * 生命周期
   * */
  created() {
    this.retrieveContent = store.state.retrieveCont;
    this.myJournal();
    setTimeout(() => {
      this.listenerFunction();
    }, 10000);
    this.num = this.$route.params.id;
    this.queryModel(this.num);

    this.moduleContList = store.state.retrieveContList;

  }

  public mounted() {
    // alert(this.articleCollectsList)
    this.num = this.$route.params.id;
    this.retrieveContent = store.state.retrieveCont;
    this.moduleContList = store.state.retrieveContList;
    this.articleCollectsList = store.state.collectNumberList;// 文章收藏列表
    this.detailsAboutStatus = store.state.detailsAboutStatus;

    this.page = 0; // 请求页码
    this.limit = 10;// 每次请求数量
    this.finished = true;// 翻页只触发一次
    this.isCont = false; // 搜索不到时显示
  }

  beforeDestroy () {
    document.removeEventListener("scroll", this.listenerFunction);
  }

  /**
   * 订阅期刊
   * */
  myJournal() {
    let self = this;
    this.$request.get('/api/h5/periodical/findPeriodical')
      .then((res: any) => {
        if (res.code == "00000000") {
          console.log('---------- 查询订阅成功啦 ----------');

          if (res.data.length > 0 && res.data != null) {
            self.guideState = false;
          }
          else {
            self.guideState = true;
          }
          res.data.map((da: any) => {
            self.myJournalList.push(da.nlmTitleAbbreviation);
          })
          self.subscribeJournal();
        }
        else {
          console.log('---------- 查询订阅失败啦 ----------');
          self.$message.error(res.message);
        }
      })
  }

  /**
   * 订阅期刊 tab 切换查询
   * */
  myJournalTab() {
    return new Promise(resolve => {
      let self = this;
      this.$request.get('/api/h5/periodical/findPeriodical')
          .then((res: any) => {
            if (res.code == "00000000") {
              console.log('---------- 查询订阅成功啦 ----------');
              resolve(res.data);
            }
            else {
              console.log('---------- 查询订阅失败啦 ----------');
              self.$message.error(res.message);
            }
          })
    })
  }

  /**
   * 搜索订阅期刊
   * ("123123"[Journal]) AND ("123123"[Journal])
   * */
  subscribeJournal(cond: string = '', isEmpty: string = '') {

    let list = store.state.retrieveContList;
    // 下拉判断是否为全部订阅期刊 防止多次触发状态处理
    if (this.num == '0') {
      this.finished = true;
    }
    else {
      list.map((res: any) => {
        if (res.id == this.num) {
         res.state = true;
        }
      })
    }

    let self = this;
    let str = '';
    this.myJournalList.map((res: any, ind: any) => {
      let type = this.myJournalList.length == ind + 1?'': 'OR';
      str += `"${res}"[Journal]${type}`;
    })

    if (cond != '') {
      str = str + `AND(${cond})`;
    }

    let page: any;
    if (this.num == '0') {
      page = this.page;
    }
    else {
      list.map((res: any) => {
        if (res.id == this.num) {
          page = res.page;
        }
      })
    }

    // self.articleIdList = [];
    this.$axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&RetStart=' + page * 10 +'&RetMax=10&term=' + str + '&sort="Recently Added"')
      .then((res: any) => {
        console.log(res);
        let node = res.data;
        let X2js = new x2js();
        let jsonObj: any = X2js.xml2js(node);
        let arr = jsonObj.eSearchResult.IdList.Id;

        if (arr != undefined) {
          let state = false, lineDa: any;
          let i = 0;
          let timer = setInterval(function(){
            if (Object.prototype.toString.call(arr) != "[object Undefined]") {
              if (cond != '') {

                list.map((da: any) => {
                  if (da.id == self.num) {
                    state = true;
                    // if (isEmpty != '') {
                    //   console.log('------------------------- 清空！！！！！！！！！ ------------------------------')
                    //   lineDa = [];
                    // }
                    // else {
                      lineDa = da.cont;
                    // }
                  }
                })
                // lineDa = res.cont;
                if (state) {
                  console.log(arr)
                  if (Object.prototype.toString.call(arr) == "[object String]") {
                    if (lineDa.indexOf(arr) == -1) {
                      lineDa.push(arr);
                    }
                  }
                  else if (Object.prototype.toString.call(arr) == "[object Array]") {
                    if (lineDa.indexOf(arr[i]) == -1) {
                      console.log(arr[i])
                      lineDa.push(arr[i]);
                    }
                  }
                }
              }
              else {
                if (Object.prototype.toString.call(arr) == "[object String]") {
                  if (self.articleIdList.indexOf(arr) == -1) {
                    self.articleIdList.push(arr);
                  }
                }
                else if (Object.prototype.toString.call(arr) == "[object Array]") {
                  if (self.articleIdList.indexOf(arr[i]) == -1) {
                    self.articleIdList.push(arr[i]);
                  }
                }
              }
              i++;
              if(i > arr.length-1){
                clearInterval(timer);
              }
            }
          },800);
          self.pageCollectNum(arr);
        }
        else {
          self.isCont = true;
        }
      })
      .catch(function(error: any) {
        console.log(error);
        // if (self.num != '4') {
        //   setTimeout(() => {
        //     window.history.go(0);
        //   }, 400)
        // }
      });
  }

  /**
   * 查询文章列表 收藏数
   * */
  pageCollectNum(arr: any) {
    let arrList: any;
    if (Object.prototype.toString.call(arr) == "[object String]") {
      arrList = [arr]
    }
    else if (Object.prototype.toString.call(arr) == "[object Array]") {
      arrList = arr;
    }
    let self = this;
    this.$request.get('/api/h5/article/findFollowCount?ids=' + arrList)
      .then((res: any) => {
        console.log(res)
        if (res.code == '00000000') {
          console.log('-------- 收藏数量查询ok -----------');
          store.commit('saveCollectNumberList', res.data);
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
      dom.addEventListener('scroll', this.handleScroll, true)
  }

  handleScroll () {
    if (this.num != '4' && this.$route.name == "HomeCont") {
      let dom: any = document.querySelector('.content-right-cont');
      // 下拉判断是否为全部订阅期刊 防止多次触发状态处理
      let state;
      let list: any = store.state.retrieveContList;
      if (this.num == '0') {
        state = this.finished;
      }
      else {
        list.map((res: any) => {
          if (res.id == this.num) {
            state = res.state;
          }
        })
      }
      console.log('首页' + (dom.scrollHeight - dom.scrollTop))
      if (dom.scrollHeight - dom.scrollTop <= 941 && state) {

        // 下拉判断是否为全部订阅期刊 页码及状态处理
        if (this.num == '0') {
          this.finished = false;
          this.page = this.page + 1;
          this.subscribeJournal();
        }
        else {
          list.map((res: any) => {
            if (res.id == this.num) {
              res.state = false;
              res.page = res.page + 1;
            }
          })
          this.subscribeJournal(this.lineTrem);
        }

        // if (this.num != '0') {
        //   this.subscribeJournal('3');
        // }
        // else {
        //   this.subscribeJournal();
        // }
        console.log('我到底了嘛！')
      }
    }
  }

  /**
   * 查询模块
   * /{source}/model/findModel
   * */
  queryModel(num: any, isEmpty: string = '') {
    // debugger
    let self = this;
    service.get( '/api/h5/model/findModel')
      .then((res: any) => {
        console.log(res.data);
        if (res.code == "00000000") {
          console.log('------- 查询模块成功啦 -------');
          self.moduleList = res.data;
          self.moduleList.map((da: any) => {
            if (da.id == num) {
              self.retrieveReplace(da.modelRule, isEmpty);
            }
          })
        }
        else {
          console.log('------- 查询模块操作失败 -------');
          self.$message.error(res.message);
        }
      })
  }

  /**
   * 检索替换
   * */
  retrieveReplace(rule: string, isEmpty: string = '') {
    let a1 = '(' + rule.replace(/@NB#/g, ')AND(') + ')';
    let a2 = '(' + a1.replace(/@SB#/g, ')OR(') + ')';
    let a3 = '(' + a2.replace(/@NT#/g, ')NOT(') + ')';
    this.lineTrem = a3;
    this.subscribeJournal(a3 , isEmpty);
  }

  /**
   * 生成4个随机数
   * */
  randomData() {
    var arr_4=new Array()
    function getRandom(min: any, max :any)
    {
      //随机数
      var random = Math.random()*(max-min)+min;
      //向下取整
      random = Math.floor(random);

      if(arr_4.length < 4)
      {
        for(var i=0;i<=arr_4.length;i++)
        {
          if(random==arr_4[i])
          {
            break;
          }
          else
          {
            if(i==arr_4.length)
            {arr_4.push(random);break;}
          }
        };
        getRandom(0,10);
      }
    }
    getRandom(0,10);
    return arr_4;
  }

  @Watch('$route')
  get$route(newVal: RouteType, oldVal: RouteType) {
    if (newVal.params.id == 0 || newVal.params.id == 4 ) {
      // window.history.go(0);
    }

    this.num = this.$route.params.id;
    // alert(this.num)
    this.moduleContList = store.state.retrieveContList;
    this.articleCollectsList = store.state.collectNumberList;// 文章收藏列表
    this.isCont = false;
    this.detailsAboutStatus = store.state.detailsAboutStatus;

    // alert(123)

    this.queryModel(this.num, 'empty');
    this.myJournalTab()
      .then((res: any) => {
        if (res.length == 0 || res == null) {
          this.journalRetrievalSatet = false;
        }
      })
  }

  @Watch('retrieveContent')
  getRetrieveContent(newVal: any, oldVal: any) {
    this.retrieveContent = store.state.retrieveCont;
    console.log(store.state.retrieveCont)
  }
}
</script>

<style scoped lang="scss">
.HomeCont {
  width: 100%;
  height: 100%;

  .article-details {
    width: 100%;
    height: 830px;
    //overflow-y: scroll;

    .article-recomm {
      width: 100%;
      height: 690px;

      .recommed-nav {
        text-align: center;
        font-size: 16px;
      }

      .recommed-bot {
        width: 73%;
        display: flex;
        flex-wrap: wrap;

        &>div{
          width: 46%;
          margin-right: 4%;
        }

        .recommed {
          width: 460px;
          border-radius: 5px;
          background-color: #ffffff;
          margin: 10px;

          .recommed-nav {
            padding: 0 20px;
            width: calc(100% - 40px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 70px;
            line-height: 70px;
            border-bottom: 2px solid rgb(248, 248, 251);

            .recomm-nav-left {
              display: flex;
              font-size: 16px;
              align-items: center;

              img {
                width: 30px;
                height: 30px;
                margin-right: 10px;
              }
            }

            .recomm-nav-right {
              color: rgb(165, 165, 176);
            }
          }

          .recomm-cont {
            padding: 24px;

            .recomm-cont-title {
              font-size: 21px;
              font-weight: 600;
              color: #2B2B2B;
              line-height: 24px;
              padding-bottom: 20px;
            }

            .recomm-cont-author {
              color: #a5a5b0;
              font-size: 14px;
              margin-bottom: 20px;
              height: 1em;
              overflow: hidden;
            }
          }

          .recomm-but {
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 2px solid rgb(248, 248, 251);
            height: 70px;

            .recomm-but-right {
              display: flex;
              align-items: center;

              div {
                background-color: rgb(252, 199, 230);
                color: rgb(249, 70, 135);
                font-size: 16px;
                font-weight: bold;
                margin-right: 15px;
                border-radius: 3px;
                text-decoration: none;
                padding: 7px 25px;
                cursor: pointer;
              }

              img {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}

.module-tab {
  position: fixed;
  min-width: 320px;
  z-index: 10;
  top: 0;
  display: flex;
  left: 300px;

  &>div {
    padding: 24px 0;
    cursor: pointer;
  }
}

.checkStyle {
  border-bottom: 2px solid #0066cc;
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

.boldFont {
  font-weight: bold;
}
</style>
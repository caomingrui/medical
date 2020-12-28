<template>
  <div class="articleListView" v-if="isShowState?(articleTitle.length!=''?true: false): false">
    <div class="view-nav">
      <div class="view-nav-left" >
        <img :src="defaultPic" alt="">
        <div>
          {{ journalTitle.length>50?journalTitle.slice(0, 50)+'...': journalTitle}}
        </div>
      </div>
      <div class="view-nav-right">{{time}}</div>
    </div>
    <div class="view-main" @click="jumpDetailsArticle()">
      <a :href="recomArticle?(navShowState==4?'javascript:void(0)': openUrl2): openUrl2" :target="recomArticle?(navShowState==4?'': '_blank'): '_blank'" style="text-decoration: none;">
        <div class="view-main-title" :style="!recomArticle?'height: 87px;line-height: 1.6em;overflow: hidden;': ''">{{ articleTitle }}</div>
        <div class="view-main-author" >{{ articleAuthor }}</div>
        <div class="view-main-img" v-if="!recomArticle?false :showPic">
          <img :src="articleImg" alt="" ref="pic">
        </div>
        <div class="view-main-abstract" v-if="abstract" :style="navShowState == 4?'max-height: 140px;': ''" v-html="articleAbstract"></div>
      </a>
    </div>
    <div class="view-footer">
      <div class="view-footer-left"></div>
      <div class="view-footer-right" v-if="recomArticle">
        <div v-if="navShowState == 4" class="view-footer-right-full-text" @click="dialogVisible = true">获取全文</div>
        <div class="collection_num">
          <img src="../assets/img/collection_num.png" alt="">
          <span>{{ collectNum }}</span>
        </div>
        <div class="collection_but">
          <img @click="cancelCollection()" v-if="isCollectState" src="../assets/img/collection_check.png" alt="">
          <img @click="collection()" v-else-if="!collect_state" src="../assets/img/collection.png" alt="">
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="45%" title="1">
      <div class="get-bounc">
        <div class="title" @click="openLink()">原文链接</div>
        <div class="doi">DOI: <span @click="openLink()">{{ DOI }}</span></div>
        <p>*如不能通过原文链接或DOI获取原文, 请输入邮箱地址, 点击"求助"获取</p>
        <div class="but-help">
          <input class="but-help-left" type="text" v-model="helpEmail">
          <div class="but-help-right" @click="forHelp()">求助</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <p style="opacity: 0;">0</p>
      </span>
    </el-dialog>

  </div>
</template>

<script lang="ts">
/* eslint-disable */
import {Component, Vue, Watch, Prop} from 'vue-property-decorator';
import store from "@/store";
import axios from "axios"
import X2JS from 'x2js'
interface RouteType {
  name: any;
  params: any
}

@Component


export default class ArticleListView extends Vue {
  [key:string]:any;
  //props
  @Prop({ type: String, required: true, default: ''}) articleMess !: any;

  @Prop({type: Number, required: true, default: ''}) articleInd !: any;

  @Prop({type: Boolean, required: true, default: 'true'}) abstract !: any;

  @Prop({type: Boolean, required: true, default: 'true'}) recomArticle !: any;

  // data
  public defaultPic: any = require("../assets/img/default_journal_pic.png");// 期刊头像
  public journalTitle: string = "Journal of Hazardous Materials";// 期刊名称
  public articleTitle: string = "";// 文章标题
  public articleAuthor: string = "";// 文章作者
  public articleImg: string = "";//文章配图
  public time: string | undefined = "";
  public collection_num: number = 2; // 可能作废
  public articleAbstract: string = "";// 文章摘要
  public navShowState: any = 0;
  public dialogVisible: boolean = false;
  public DOI: string = "https://doi.org/10.1080/14686996.2020.1800366";
  public articleId: any = store.state.currentArticle;
  collect_state: boolean = false;
  storeCollectNumList: any = store.state.collectNumberList;
  collectNum: any = 0;
  isCollectState: boolean = false;
  helpEmail: string = '';
  showPic: boolean = false; // 默认不展示图片
  test: any = 0;

  openUrl: string = '../#/home/cont/4';
  openUrl2: string = '../#/home/cont/4'; // 内测

  isShowState: boolean = true; // 文章模块显示状态

  // public email: string = store.state.userMess.email;

  // 多余
  public arrayObjArticle: any = [];
  public obj: any = {};
  public onlieArr: any = [];


  /**
   * 生命周期
   * */
  public created() {
    this.navShowState = this.$route.params.id;
    this.initializeData();
  }

  public mounted() {
    console.log('loading-mounted');
    console.log(this.articleId);
    this.testArticleData();
    this.navShowState = this.$route.params.id;
    this.articleId = store.state.currentArticle;
    this.initializeData();
    // console.log(this.$refs.pic.offsetHeight)
    // console.log(this.$refs.pic.offsetHeight)
    console.log('执行？')
    // this.$refreshToken();
  }

  /**
   * methods
   * 3 ---> 文章标题跳转
   * 4 ---> 文章内容详细跳转
   * */
  // public jumpDetails() {
  //   this.$router.push({name: 'all', params: {id: '3'}})
  // }

  public jumpDetailsArticle() {
    if (Object.prototype.toString.call(this.articleMess) == "[object Object]") {
      store.commit('saveArticleId', this.articleMess.id);
      localStorage.setItem('saveArticleId', this.articleMess.id);
    }
    else {
      store.commit('saveArticleId', this.articleMess);
      localStorage.setItem('saveArticleId', this.articleMess);
    }
    store.commit('saveCurrentFileInd', this.articleInd);
    store.commit('saveDetailsAboutStatus', 4);
    // this.$router.push({name: 'HomeCont', params: {id: '4'}});
    // // window.history.go(0)
    // this.navShowState = 4;
  }

  /**
   * 初始化
   * */
  initializeData() {
    console.log('right?')
    this.storeCollectNumList = store.state.collectNumberList;

    this.isCollection();

    // 是否收藏页 - 改变收藏状态
    if (this.$route.name == 'myCollection') {
      this.isCollectState = true;
    }

    // 处理用户信息 - 邮箱
    let userMess = store.state.userMess;
    if (Object.prototype.toString.call(userMess) == "[object Object]") {
      this.helpEmail = userMess.email;
    }
    else {
      this.helpEmail = JSON.parse(userMess).email;
    }

    // 收藏数量列表
    if (Object.prototype.toString.call(this.articleMess) !== "[object Object]") {
      if (this.storeCollectNumList) {
        console.log(this.storeCollectNumList)
        // this.collectNum = this.storeCollectNumList[this.articleInd].followCount;
        this.storeCollectNumList.map((res: any) => {
          if (res.articleId == this.judgeArticleId()) {
            console.log(res.followCount)
            // alert(res.followCount)
            this.test = res.followCount
            this.collectNum = res.followCount;
          }
        })
      }
    }
    else {
      this.collectNum = this.articleMess.followCount;
    }
  }

  /**
   *  cancel collection Article
   *  /{source}/article/unfollow
   *  id -- ArticleId
   */
  public cancelCollection() {
    let self = this;
    let id = this.judgeArticleId();
    this.$request.get('/api/h5/article/unfollow?id=' + id)
    .then((res: any) => {
      if (res.code == '00000000') {
        console.log('-------- 取消收藏yes -----------');
        self.collect_state = false;
        self.isCollectState = false;
        if (self.collectNum > 0) {
          self.collectNum = Number(self.collectNum) - 1;
        }
        self.$message('取消成功');
        self.$emit('refreshPage');
      }
      else {
        console.log('-------- 取消收藏no -----------');
        this.$message.error(res.message);
      }
    })
  }

  /**
   * collection Article
   * /{source}/article/follow
   * id -- ArticleId
   * */
  public collection() {
    let self = this;
    let id = this.judgeArticleId();
    this.$request.get('/api/h5/article/follow?id=' + id)
      .then((res: any) => {
        if (res.code == '00000000') {
          console.log('-------- 收藏yes -----------');
          self.collect_state = true;
          self.isCollectState = true;
          self.collectNum = Number(self.collectNum) + 1;
          self.$message('收藏成功');
        }
        else {
          console.log('-------- 收藏no -----------');
          self.$message.error(res.message);
        }
      })
  }

  /**
   * 是否被收藏
   **/
  isCollection() {
    let self = this;
    let id = this.judgeArticleId();
    this.$request.get('/api/h5/article/checkIsFollow?id=' + id)
      .then((res: any) => {
        console.log(res)
        if (res.code == '00000000') {
          console.log('-------- 是否被收藏查询ok -----------');
          if (!res.data) {
            self.isCollectState = false;
            self.collect_state = false;
          }
          else {
            // alert(12312)
            self.isCollectState = true;
            self.collect_state = true;
          }
        }
        else {
          console.log('-------- 是否被收藏查询no -----------');
          self.$message.error(res.message);
        }
      })
  }

  /**
   * 帮助 - 求助原文
   * /{source}/help/requestLiterature
   * email	是	String	邮箱
      articleTitle	是	String	文章标题
   * */
  forHelp() {
    let regExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/; // 邮箱正则
    if (!regExp.test(this.helpEmail)) {
      this.$message({ message: '请输入合法邮箱地址', type: 'warning'});
    }
    else {
      let self = this;
      let parme = {
        email: this.helpEmail,
        articleTitle: this.articleTitle
      }

      this.$request.post('/api/h5/help/requestLiterature', parme)
        .then((res: any) => {
          console.log(res)
          if (res.code == '00000000') {
            console.log('-------- 帮助求助原文ok -----------');
            self.$message("已经成功通过邮箱求助原文，该文献会在24小时内发送到您的邮箱");
          }
          else {
            console.log('-------- 帮助求助原文操作失败 -----------');
            self.$message.error(res.message);
          }
        })
    }
  }

  // doi 新标签页打开
  public openLink() {
    window.open(this.DOI);
  }

  // 测试获取文章数据
  public testArticleData(): void {
    let self = this;
    let id = this.judgeArticleId();
    axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id='+ id +'&retmode=xml')
    .then((res: any) => {

      // xml 转 json
      let node = res.data;
      let x2js = new X2JS();
      let jsonObj: any = x2js.xml2js(node);

      let path = jsonObj.PubmedArticleSet.PubmedArticle;  // 共用json路径

      if (this.navShowState == 3) {
        if (path.MedlineCitation.MedlineJournalInfo.NlmUniqueID != store.state.periodicalArticlesList.id) {
          this.isShowState = false;
        }
        else {
          this.isShowState = true;
        }
      }
      else {
        this.isShowState = true;
      }
      // 约定期刊
      console.log('约定期刊')
      // console.log(path.MedlineCitation.Article.Journal.JournalIssue);
      self.journalTitle = path.MedlineCitation.Article.Journal.Title;

      this.articleTitle = path.MedlineCitation.Article.ArticleTitle;
      let author = path.MedlineCitation.Article.AuthorList.Author ;

      // 更新时间
      // let time = path.MedlineCitation.Article.Journal.JournalIssue.PubDate;
      let time = path.PubmedData.History.PubMedPubDate;

      let times = '';
      console.log(time)
      time.map((res: any) => {
        console.log(res)
        console.log(res._PubStatus)
        if (res._PubStatus == "pubmed") {
          for (let t in res) {
            if (t == '_PubStatus' || t == 'Hour' || t == 'Minute') return;
            times += res[t] + '-';
          }
        }
      })

      this.time = this.timeFn(times);

      // 拼接图片
      let imgPath =  path.PubmedData.ArticleIdList.ArticleId;
      var id1, id2;

      imgPath.map((list: any, ind: number) => {

        if (list._IdType == 'doi') {
          this.DOI = "https://doi.org/" + list.__text;
          id1 = list.__text.substring(list.__text.lastIndexOf("/") + 1);
        }
        else if (list._IdType == 'pmc') {
          id2 = list.__text.slice(3)
        }
      })

      this.articleImg = 'https://www.ncbi.nlm.nih.gov/pmc/articles/instance/'+ id2 +'/bin/'+ id1 +'fig1.jpg';
      this.checkImgExists(this.articleImg)
      .then((succ: any) => {
        console.log(succ)
        this.showPic = true;
      })
      .catch((err)=>{
        console.log(err)
        this.showPic = false;
      })

      this.articleAbstract = path.MedlineCitation.Article.Abstract.AbstractText;

      if (author) {
        // 拼接作者名
        author.map((list: any, ind: number) => {
          let suffix = ind==author.length-1?'': ', '
          this.articleAuthor += list.ForeName + suffix;
        })
      }

      // let xmlNode = this.createXml(node).documentElement.childNodes[1];
      // this.traverseXml(xmlNode);
    })
  }

  /**
   * 判断图片是否存在
   * */
  checkImgExists(imgurl: any) {
    console.log('check - img - is')
    return new Promise(function(resolve, reject) {
      var ImgObj = new Image(); //判断图片是否存在
      ImgObj.src = imgurl;
      ImgObj.onload = function(res) {
        resolve(res);
      }
      ImgObj.onerror = function(err) {
        reject(err)
      }
    })
  }

  // judge store article id is null
  public judgeArticleId(): number | string {
    let id;
    if (Object.prototype.toString.call(this.articleMess) == "[object Object]") {
      if (this.articleMess.id != undefined && this.articleMess.id != null && this.articleMess.id.length > 0) {
        id = this.articleMess.id;
        console.log('haha')
      }
      else {
        console.log('再者')
        id = this.articleId;
      }
    }
    else {
      if (this.articleMess != undefined && this.articleMess != null && this.articleMess.length > 0) {
        id = this.articleMess;
        console.log('xixi')
      }
      else {
        console.log('再者')
        id = this.articleId;
      }
    }
    console.log('当前id：' + id);
    return id;
  }

  // 时间差
  timeFn(d1: any) {
    var dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
    var dateEnd = new Date();//获取当前时间
    var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    var leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000))//计算出小时数

    var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数

    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000)
    let str;
    if (dayDiff < 1) {
      str = Math.round(hours) < 0? (-Math.round(hours)) + '小时前': Math.round(hours) + '小时前';
    }
    else if (dayDiff >= 1 && dayDiff < 30) {
      str = Math.round(dayDiff) < 0? ( - Math.round(dayDiff)) + '天前': Math.round(dayDiff) + '天前';
    }
    else if (dayDiff >= 30 && dayDiff <= 365) {
      str = Math.round(dayDiff/30) < 0? (- Math.round(dayDiff/30)) + '月前': Math.round(dayDiff/30) + '月前';
    }
    else if (dayDiff > 365) {
      str = Math.round(dayDiff/365) < 0? (- Math.round(dayDiff/365))+ '年前': Math.round(dayDiff/365) + '年前';
    }
    return str;
  }

  // 遍历 xml 节点
  public traverseXml(xml: any): void {
    // return new Promise((resolve: any, reject: any) => {
      let node = xml.childNodes;

      // 遍历第一层
      for ( let i = 0; i < node.length; i++) {

        // 判断是否为节点
        if (node[i].nodeType == 1) {
          // resolve(node[i])

          // 有点多余
          if (node[i].childNodes && node[i].childNodes.length > 0) {

            // 判断是否存在子节点
            if (node[i].childNodes.length > 1 && node[i].nodeName != "#text") {
              // console.log(node[i].nodeName)
              let childList = this.del_ff(node[i]);
              let arr = []
              let chidArr = []
              // 遍历处理后字节点信息
              for (let key of childList) {
                console.log(key.nodeName)

                // 判断上个数组是否存在key 存在不创建对象
                let state = false;
                this.onlieArr.map((res: any) => {
                  if (res == node[i].nodeName) {
                    state = true;
                  }
                })
                if (state) {
                  console.log('存在')
                  console.log(key)
                  chidArr.push(key.nodeName)
                  console.log(i)
                  console.log(node[i].nodeName)
                }
                else {
                  console.log('不存在')
                  arr.push(key.nodeName)
                  this.onlieArr = arr;
                  this.obj[node[i].nodeName] = arr;
                }
                // }
              }
              console.log(chidArr)
              this.arrayObjArticle.push(this.obj)
              this.traverseXml(node[i]);
            }
            else {
            }
            // console.log(node[i]);
            // this.traverseXml(node[i]);
          }
          else {
            console.log(1);
            // console.log(node[i].nodeValue)
          }
        }
        else {
          if (node[i].nodeValue.trim().length != 0) {
            // console.log(node[i].nodeValue);
          }
        }
      }
    // })
  }

  // 去除 节点#text 获取子节点数组
  del_ff(elem: any): any {
    var elem_child = elem.childNodes;
    for (var i = 0; i < elem_child.length; i++) {
      if (elem_child[i].nodeName == "#text" && !/\s/.test(elem_child.nodeValue)) {
        elem.removeChild(elem_child[i]);
      }
    }
    return elem_child
  }

  // xml 字符串 转对象
  createXml(str: string){
    if(document.all){
      var xmlDom=new ActiveXObject("Microsoft.XMLDOM")
      xmlDom.loadXML(str)
      return xmlDom
    }
    else
      return new DOMParser().parseFromString(str, "text/xml")
  }

  /**
   * watch
   * */
  @Watch('$route')
  get$route(newVal: any) {
    console.log(newVal)
    this.navShowState = newVal.params.id;
    this.articleId = store.state.currentArticle;
    this.initializeData();
  };

}
</script>

<style lang="scss">
.articleListView {
  width: 70%;
  //height: 608px;
  background: rgb(255, 255, 255);
  border-radius: 4px;
  position: relative;
  transition: .6s;
  margin-bottom: 20px;

  .el-dialog__title {
    opacity: 0;
  }

  &:hover {
    box-shadow:  20px 20px 60px #c2c2c2,
    -20px -20px 60px #ffffff;
  }

  .view-nav {
    padding: 0 20px;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid rgb(248, 248, 251);
    font-size: 16px;

    .view-nav-left {
      display: flex;
      align-items: center;
      cursor: pointer;

      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }


    }

    .view-nav-right {
      color: rgb(165, 165, 176);
    }
  }

  .view-main {
    padding: 24px;
    //height: 418.9px;
    border-bottom: 2px solid rgb(248, 248, 251);
    cursor: pointer;

    .view-main-title {
      font-size: 22px;
      font-weight: 600;
      color: #2B2B2B;
      line-height: 30px;
      padding-bottom: 20px;
    }

    .view-main-author {
      color: rgb(165, 165, 176);
      font-size: 14px;
      padding-bottom: 20px;
      height: 1em;
      line-height: 2em;
      overflow: hidden;
    }

    .view-main-img {
      width: 500px;
      height: 200px;
      margin: 5px 0 20px;
      padding: 5px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .view-main-abstract {
      font-size: 14px;
      line-height: 24px;
      max-height: 70px;
      overflow: hidden;
      color: #2B2B2B;
    }
  }

  .view-footer {
    padding: 0 20px;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .view-footer-right {
      display: flex;
      align-items: center;

      & img {
        cursor: pointer;
      }

      .collection_num {
        font-size: 14px;
        font-weight: 400;
        color: #0066CC;
        line-height: 20px;
        margin-right: 38px;

        & img {
          width: 18px;
          height: 18px;
          margin-right: 5px;
        }
      }

      .collection_but {

        & img {
          width: 40px;
          height: 40px;
        }
      }

      .view-footer-right-full-text {
        border-radius: 3px;
        background-color: rgb(252, 199, 230);
        color: rgb(249, 70, 135);
        font-size: 16px;
        font-weight: bold;
        text-decoration: none;
        padding: 7px 25px;
        margin-right: 15px;
        cursor: pointer;
      }
    }
  }
}

.get-bounc {
  width: 100%;
  height: 100%;
  text-align: center;

  .title {
    width: 5em;
    padding: 13px 20px;
    margin:  0 auto;
    cursor: pointer;
    margin-bottom: 20px;

    background: #F7F7FA;
    border-radius: 5px;
    border: 1px solid #D9D9D9;
  }

  .doi {
    font-size: 15px;
    margin-bottom: 10px;

    span {
      cursor: pointer;
      color: #0066CC;
    }
  }

  p {
    font-size: 12px;
    margin-bottom: 60px;
  }

  .but-help {
    width: 60%;
    display: flex;
    margin: 0 auto;
    justify-content: space-between;
    margin-bottom: 40px;

    border-radius: 5px;
    border: 1px solid #D9D9D9;

    .but-help-left {
      width: 200px;
      outline: none;
      border: none;
    }

    .but-help-right {
      border-left: 1px solid #ccc;
      text-align: center;
      cursor: pointer;
      padding: 13px 40px;
      background: #F7F7FA;

      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      border-bottom-right-radius: 5px;
      border-top-right-radius: 5px;
    }

    input {
      color: #0066CC;
      padding: 13px 20px;
      border-bottom-left-radius: 5px;
      border-top-left-radius: 5px;
    }
  }
}
</style>
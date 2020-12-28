<template>
  <div class="sidebarNav">
    <div class="sidebar-nav-left">
      <div class="home-nav" v-if="navShowState ==3 || navShowState ==4">
        <span @click="upward()" v-if="routeThis == 'all'">
          <img src="../assets/img/left.png" alt="">
        </span>
      </div>

      <div class="home-nav" v-else-if="routeThis == 'HomeCont'">
        <span @click="tabCheck(0)" :class="navShowState==0?'checkStyle': ''">全部</span>
        <span v-for="item in moduleList" @click="tabCheck(item.id)" :key="item.id"
              :class="navShowState==item.id?'checkStyle': ''">{{item.modelName}}</span>
<!--        <span @click="tabCheck(1)" :class="navShowState==1?'checkStyle': ''">检索</span>-->
      </div>

      <div class="home-nav" v-else-if="routeThis == 'all'||routeThis == 'class'||routeThis == 'list'">
        <span @click="journalTabCheck(0)" :class="navShowState==0?'checkStyle': ''">全部期刊</span>
        <span @click="journalTabCheck(1)" :class="navShowState==1?'checkStyle': ''">我的期刊</span>
      </div>

      <!-- 搜索头部 -->
      <div class="home-nav nav" v-else-if="routeThis == 'globalSearch'"></div>

      <div class="home-nav" v-else-if="routeThis == 'myCollection'">
        <span>我的收藏</span>
      </div>

      <div class="home-nav" v-else-if="routeThis == 'personalSettings'">
        <span class="checkStyle">个人设置</span>
      </div>

    </div>
    <div class="sidebar-nav-right">
      <div class="help" @click="feedback()">
        <img src="../assets/img/help.png" alt="">
      </div>
      <div class="retrieve" @click="openRetrieve()">
        <img src="../assets/img/retrieve.png" alt="">
      </div>
      <div class="user-mess">
        <img @click="showBut()" :src="userHeadImg" alt="" @error="defImg()">
        <span @click="showBut()">{{ userName }}</span>
        <div v-if="log_out" @click="hideBut()">
          <div @click="clickLogOut()">退出登录</div>
        </div>
      </div>
    </div>
    <helpFeedback :helpFeedback_state="helpFeedbackState" @closeHelpFeedback="closeHelpFeedback"></helpFeedback>

    <!--检索弹框-->
    <el-dialog title="检索" :visible.sync="dialogVisible" width="50%" append-to-body="true" :before-close="handleClose">
      <div class="add-retrieve" v-if="initial_state">
        <div class="add-retrieve-cont">
          <p>创建检索模板</p>
          <i @click="inputRetrieve()" class="el-icon-circle-plus"></i>
        </div>
      </div>
      <div>
        <div v-for="item in moduleList" :key="item.id" class="moduleList" :style="moduleState?'': 'display: none'">
          {{ item.modelName }}
          <span @click="changeModel(item.modelRule, item.id, item.modelName)">
            <img src="../assets/img/change.png" alt="">
          </span>
          <span @click="deleteModel(item.id)">
            <img src="../assets/img/cancle.png" alt="">
          </span>
        </div>
      </div>
      <div class="input-retrieve-cont" v-if="input_initial_state">
        <p v-if="!changeRuleState || !retrieveNam">输入查询关键字</p>
<!--        {{ checkRetrieveList }}-->
        <div v-if="checkRetrieveList.length >=2">
          <div v-for="(item, index) in checkRetrieveList" :key="index">
            <div v-if="item.input.length>0">
              <p>( {{item.input}} )</p>
              <p class="lastFont">{{item.conditions==''?'AND': item.conditions=='@NB#'?'AND': item.conditions=='@SB#'?'OR': item.conditions=='@NT#'?'NOT': item.conditions}}</p>
            </div>
          </div>
        </div>

<!--        检索内容-->
        <div class="input-retrieve-cont-com" v-if="!retrieveNam">
          <div v-for="(item, index) in checkRetrieveList" :key="index">
            <div>
              <el-select v-model="item.keyword" placeholder="关键字" >
                <el-option  v-for="item in keywordList" :key="item.value" :label="item.label"  :value="item.value"> </el-option>
              </el-select>
              <el-input v-model="item.input" placeholder="请输入内容" @input.native="addRetrieveList(index)"></el-input>
              <span v-if="index!=0" @click="delRetrieveList(index)">
                <img src="../assets/img/delet.png" alt="">
              </span>
            </div>
            <div>
              <el-select v-model="item.conditions" placeholder="AND">
                <el-option  v-for="item in options" :key="item.value" :label="item.label"  :value="item.value"> </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="retrieve-nam-cont" v-if="retrieveNam">
          <p>请给模块起一个名字吧</p>
          <input type="text" v-model="moduleName">
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <div v-if="initial_state">创建检索模块获取最新相关的研究</div>
        <div v-if="!initial_state" class="dialog-footer-but">
          <span></span>
          <!--修改规则-->
          <div v-if="changeRuleState" @click="changeRules()">保存</div>
          <!--条件到命名-->
          <div v-else-if="!retrieveNam" @click="clickNext()">下一步</div>
          <!--命名到提交-->
          <div v-else-if="retrieveNam" @click="nextSearch()">保存</div>
        </div>
      </span>
    </el-dialog>

    <el-dialog
        title="提示"
        :visible.sync="deleteModuleState"
        width="30%" append-to-body="true">
      <span>确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="deleteModuleState = false">取 消</el-button>
    <el-button type="primary" @click="canceleModule()">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Watch } from 'vue-property-decorator';
import router from "@/router";
import store from '@/store';
import helpFeedback from '@/components/helpFeedback.vue';
import service from '../utils/request.js';
import x2js from "x2js";

/**
 * 接口
 * */
interface RouteType {
  name: string;
  params: any;
}

@Component({
  components: {
    helpFeedback
  },
})

export default class SidebarNav extends Vue {
  [key:string]:any;

  /**
   * data
   * */
  public routeThis: any = 'HomeCont';
  public tabState: number = 0; // home nav tab check state
  public journalTabState: number = 0; // journal nav tab check state
  public navShowState: any = 0;
  public userMess: any = '';

  private initial_state: boolean = true; // 检索初始化状态
  private dialogVisible: boolean = false; // 检索弹框状态
  private input_initial_state: boolean = false; // 输入检索弹框状态
  private retrieveNam: boolean = false; //检索命名弹框显示状态
  private options:any[] = [{
    value: 'AND',
    label: 'AND'
  }, {
    value: 'OR',
    label: 'OR'
  }, {
    value: 'NOT',
    label: 'NOT'
  }];
  private value: string = '';
  checkRetrieveList: any = [{'input': '', 'keyword': '', 'conditions': ''}];
  keywordList: object[] = [{value: '[Full Text]', label: '关键字'}, {value: '[Author]', label: '作者'}];
  moduleName: string = ''; // 模块名称
  helpFeedbackState: boolean = false; // 意见反馈弹框状态
  moduleList: object[] = []; // 查询检索模块 存储
  // myJournalList: any = []; // 订阅期刊列表
  storageArr: any = [];
  userHeadImg: string = ''; // 用户头像
  userName: string = ''; // 用户名
  log_out: boolean = false; // 退出登录
  moduleState: boolean = false;
  defaultImg: string = require("../assets/img/default_avatar.png"); // 设置默认头像

  changeRuleState: boolean = false; // 修改规则按钮状态
  changeState: boolean = false; // 告诉规则到命名 - 修改 上面状态
  changeModelId: any = null; // 被修改模块Id
  // passExp: any = /^[A-Za-z0-9-]+\(^\s+\)|(\s+$)|\s+\$/; // 检索关键字正则
  passExp: any = /^[\w\u4e00-\u9fa5\--][\s\w\u4e00-\u9fa5\--]*[\w\u4e00-\u9fa5\--]$/ // 检索关键字正则

  deleteModuleState: boolean = false; // 删除模块提示
  deleteModuleId: string = '';// 删除模块id

  moduleContList: any = [];

  /**
   * 生命周期
   * */
  public created() {
    this.routeThis = this.$route.name;
    this.navShowState = this.$route.params.id;
    this.getUserMess();

    this.queryModel();

    this.mySubscribeJournal();
  }

  /**
   * methods
   * home nav tab check function
   * */
  public tabCheck(num: number) {
    this.tabState = num;
    let numPath = String(num);
    this.changeRoute(numPath)
  }

  /**
   * journal nav tab check function
   * */
  public journalTabCheck(num: number) {
    this.journalTabState = num;
    let numPath = String(num);
    this.$router.push({name: 'all', params: {id: numPath}});
    store.commit('changeJournal', 0);
  }

  /**
   * change line route params id
   * */
  public changeRoute(num: string) {
    store.state.retrieveContList.map((da: any) => {
      da.cont = [];
      da.page = 0;
      da.state = true;
    })
    store.commit('saveRetrieveContList', store.state.retrieveContList);
    this.$router.push({name: this.routeThis, params: {id: num}});
  }

  /**
   * input retrieve show window
   * */
  private inputRetrieve() {
    this.initial_state = false;
    this.input_initial_state = true;
    this.moduleState = false;
  }

  /**
   * return to layer
  **/
  public upward() {
    window.location.href="javascript:history.go(-1)";
  }

  /**
   * get User message
   * /{source}/user/findUserInfo
   */
  public getUserMess() {
    let self = this;
    service.get( '/api/h5/user/findUserInfo')
      .then((res: any) => {
        if (res.code == "00000000") {
          self.userHeadImg = res.data.headImageMax;
          self.userName = res.data.username;
          localStorage.setItem('userMess', JSON.stringify(res.data));
          store.commit('saveUserMess', res.data);
        }
        else if (res.code == "900171") {
          console.log('去登陆啦')
        }
      })
    }

  /**
   * 删除检索数组
   * @param { number } ind -- 索引数组列表
   * */
  delRetrieveList(ind: number) {
    this.checkRetrieveList.splice(ind, 1);
    this.checkRetrieveList = this.checkRetrieveList;
  }

  /**
   * 第一次输入框 输入 追加数组
   * @param { number } ind -- 索引数组列表
   * */
  addRetrieveList(ind: number) {
    let index: number = ind + 2;
    let obj = {'input': '', 'keyword': '', 'conditions': ''};
    if (this.checkRetrieveList.length >= index) return;
    if (this.checkRetrieveList.length == 5) return;
    this.checkRetrieveList.push(obj);
  }

  openRetrieve() {
    let self = this;
    this.mySubscribeJournal()
    .then((da: any) => {
      if (da.length > 0) {
        self.dialogVisible = true;
      }
      else {
        this.$message({
          message: '请先订阅期刊',
          type: 'warning'
        });
      }
    })
  }

  /**
   * 我的订阅
   * */
  mySubscribeJournal() {
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
   * 修改规则提胶
   * /{source}/model/editModel
   * id	是	long	模块ID
     modelName	是	String	模块名
     modelRule	是	String	检索规则
   * */
  changeRules() {
    let self = this;

    if (this.moduleName.trim() == '') {
      this.$message({ message: '模块名不得为空', type: 'warning' });
    }
    else {
      let parme = {
        id: this.changeModelId,
        modelName: this.moduleName,
        modelRule: this.pieceModelRule()
      }

      service.put( '/api/h5/model/editModel', parme)
        .then((res: any) => {
          console.log(res.data);
          if (res.code == "00000000") {
            console.log('------- 修改模块成功啦 -------');
            self.$message(res.message);

            store.commit('saveRetrieveCont', self.pieceModelRule());
            self.queryModel()
              .then((da: any) => {
                da.map((item: any, index: any) => {
                  self.dialogVisible = false;
                  self.initState();
                  if (index + 1 == da.length) {
                    setTimeout(() => {
                      this.$router.push({name: 'HomeCont', params: {id: item.id}});
                    }, 500)
                  }
                })
              })
          }
          else {
            console.log('------- 修改模块操作失败 -------');
            self.$message.error(res.message);
          }
        })
    }
  }

  /**
   * 设置条件后下一步操作
   * */
  clickNext() {
    if (this.checkRetrieveList[0].input.replace(/^\s+|\s+$/g,"").length == 0) {
      this.$message({
        message: '请输入一条查询条件',
        type: 'warning'
      });
    }
    else {
      let state = false;
      this.checkRetrieveList.map((res: any) => {
        if (res.input.length > 0) {
          console.log(res.input)
          console.log(this.passExp.test(res.input))
          if (this.passExp.test(res.input) && res.input.replace().length <= 50) {
            this.retrieveNam = true;
            if (this.changeState) {
              this.changeRuleState = true;
            }
            state = false;
          }
          else {
            console.log(res.input + this.passExp.test(res.input))
            state = true;
          }
        }
      })

      if (state) {
        this.$message({
          message: '”关键字仅支持英文、空格、中划线、数字，最多30个字符“',
          type: 'warning'
        });
        state = false;
        return;
      }
    }
  }

  /**
   * 拼凑关键字
   * */
  pieceModelRule(): string {
    let str = '';
    this.checkRetrieveList.map((res: any, ind: number) => {
      if (res.input == '') return;
      str += res.input;
      if (ind + 1 < this.checkRetrieveList.length - 1) {
        if (res.conditions == '' || res.conditions == 'AND') {
          str += '@NB#';
        }
        else if (res.conditions == 'OR') {
          str += '@SB#';
        }
        else if (res.conditions == 'NOT') {
          str += '@NT#';
        }
      }
    })
    return str;
  }

  showBut() {
    this.log_out = true;
  }

  hideBut() {
    this.log_out = false;
  }

  /**
   * 退出登录
   * */
  clickLogOut() {
    localStorage.clear();
    window.history.go(0);
  }

  /**
   * 模块弹框关闭监听
   * */
  handleClose(done: any) {
    done();
    this.initState();
  }

  /**
   * init window all state
   * changeRuleState
   * */
  initState() {
    this.initial_state = true;
    this.input_initial_state = false;
    this.retrieveNam = false;
    this.moduleName = '';
    this.changeRuleState = false;
    this.changeState = false;
    this.checkRetrieveList = [{'input': '', 'keyword': '', 'conditions': ''}];
    this.keywordList = [{value: '[Full Text]', label: '关键字'}, {value: '[Author]', label: '作者'}];
  }

  /**
   * 设置默认头像
   * */
  defImg(event: any){
    let img: any = event.srcElement;
    img.src = this.defaultImg;
    img.onerror = null; //防止闪图
  }

  /**
   * 下一步检索关键内容  -- 创建模块
   * /{source}/model/createModel
   * modelName	是	String	模块名
     modelRule	是	String	检索规则
   * */
  nextSearch() {
    if (this.moduleName.trim() == '') {
      this.$message({ message: '模块名不得为空', type: 'warning' });
    }
    else {
      let self = this;
      let parme = {
        modelName: this.moduleName,
        modelRule: this.pieceModelRule()
      };

      store.commit('saveRetrieveList', this.checkRetrieveList);
      service.post( '/api/h5/model/createModel', parme)
        .then((res: any) => {
          console.log(res.data);
          if (res.code == "00000000") {
            console.log('------- 创建模块成功啦 -------');
            self.$message(res.message);
            // self.subscribeJournal();
            store.commit('saveRetrieveCont', self.pieceModelRule());
            self.queryModel()
            .then((da: any) => {
              da.map((item: any, index: any) => {
                self.dialogVisible = false;
                self.initState();
                if (index + 1 == da.length) {
                  setTimeout(() => {
                    this.$router.push({name: 'HomeCont', params: {id: item.id}});
                  }, 500)
                }
              })
            })
          }
          else {
            console.log('------- 创建模块操作失败 -------');
            self.$message.error(res.message);
          }
        })
    }
  }

  /**
   * 查询模块
   * /{source}/model/findModel
   * */
  queryModel() {
    return new Promise(resolve => {
      let self = this;
      service.get( '/api/h5/model/findModel')
          .then((res: any) => {
            if (res.code == "00000000") {
              console.log('------- 查询模块成功啦 -------');
              self.moduleList = res.data;
              this.moduleContList = [];
              res.data.map((da: any) => {
                let obj: any = {};
                obj.id = da.id;
                obj.cont = [];
                obj.page = 0;
                obj.state = true;

                this.moduleContList.push(obj)
              })
              if (res.data.length > 0) {
                self.moduleState = true;
              }
              store.commit('saveRetrieveContList', this.moduleContList);
              resolve(res.data);
            }
            else {
              console.log('------- 查询模块操作失败 -------');
              self.$message.error(res.message);
            }
          })
    })
  }

  /**
   * 删除模块
   * @param { string } modelId -- 模块id
   * /{source}/model/deleteModel
   * */
  deleteModel(modelId: string) {
    this.deleteModuleId = modelId;
    this.deleteModuleState = true;
  }

  canceleModule() {
    let self = this;
    let modelId = this.deleteModuleId;
    service.delete( '/api/h5/model/deleteModel/' + modelId)
        .then((res: any) => {
          console.log(res.data);
          if (res.code == "00000000") {
            console.log('------- 删除模块成功啦 -------');
            self.queryModel();
            self.$message(res.message);
            self.deleteModuleState = false;
          }
          else {
            console.log('------- 删除模块操作失败 -------');
            self.$message.error(res.message);
          }
        })
  }

  /**
   * step2
   * /{source}/model/editModel
   * */
  changeModel(item: any, id: any = null, name: string = '') {
    // debugger
    this.initial_state = false;
    this.input_initial_state = true;
    this.moduleState = false;
    this.retrieveNam = false;

    this.changeState = true;
    // if (this.checkRetrieveList.length == 1) {
    //   if (this.checkRetrieveList[0].input == '' && this.checkRetrieveList[0].conditions == '') {
    //     this.checkRetrieveList = [];
    //   }
    // }

    if (id != null) {
      this.changeModelId = id;
    }

    if (name != '') {
      this.moduleName = name;
    }

    let self = this;
    let rules = item;
    // alert(rules)
    console.log(rules);
    let obj = [
        {name: '@NB#', ind: rules.indexOf('@NB#')},
        {name: '@SB#', ind: rules.indexOf('@SB#')},
        {name: '@NT#', ind: rules.indexOf('@NT#')},
    ];
    function compare(key: any){
      return function(a: any, b: any){
        let value1 = a[key];
        let value2 = b[key];
        return value1 - value2;
      }
    }

    let list = obj.sort(compare('ind'));
    function deconstruction() {
      if (list[0].ind != -1) {

        let obj: any = {};
        obj.input = rules.substring(0, list[0].ind);
        obj.conditions = list[0].name=="@NB#"?'AND': list[0].name=="@SB#"?'OR': list[0].name=="@NT#"?'NOT': '';
        obj.keyword = '';
        if (rules.slice(list[0].ind + 4).indexOf('@NB#') != -1 || rules.slice(list[0].ind + 4).indexOf('@SB#') != -1 || rules.slice(list[0].ind + 4).indexOf('@NT#') != -1) {
          self.changeModel(rules.slice(list[0].ind + 4));
        }
        else {
          let obj2 = {
            input: rules.slice(list[0].ind + 4),
            conditions: '',
            keyword: ''
          }
          self.checkRetrieveList.unshift(obj2);
          console.log(obj2)
        }
        console.log(obj)
        self.checkRetrieveList.unshift(obj)
      }
      else if (list[1].ind != -1) {
        let obj: any = {};
        obj.input = rules.substring(0, list[1].ind);
        obj.conditions = list[1].name=="@NB#"?'AND': list[1].name=="@SB#"?'OR': list[1].name=="@NT#"?'NOT': '';
        obj.keyword = '';
        if (rules.slice(list[1].ind + 4).indexOf('@NB#') != -1 || rules.slice(list[1].ind + 4).indexOf('@SB#') != -1 || rules.slice(list[1].ind + 4).indexOf('@NT#') != -1) {
          self.changeModel(rules.slice(list[1].ind + 4));
        }
      else {
        let obj2 = {
          input: rules.slice(list[1].ind + 4),
          conditions: '',
          keyword: ''
        }
          self.checkRetrieveList.unshift(obj2);
      }
        console.log(obj)
        self.checkRetrieveList.unshift(obj);
      }
      else if (list[2].ind != -1) {
        let obj: any = {};
        obj.input = rules.substring(0, list[2].ind);
        obj.conditions = list[2].name=="@NB#"?'AND': list[2].name=="@SB#"?'OR': list[2].name=="@NT#"?'NOT': '';
        obj.keyword = '';
        if (rules.slice(list[2].ind + 4).indexOf('@NB#') != -1 || rules.slice(list[2].ind + 4).indexOf('@SB#') != -1 || rules.slice(list[2].ind + 4).indexOf('@NT#') != -1) {
          self.changeModel(rules.slice(list[2].ind + 4));
        }
        else {
          let obj2 = {
            input: rules.slice(list[2].ind + 4),
            conditions: '',
            keyword: ''
          }
          self.checkRetrieveList.unshift(obj2);
        }
        console.log(obj)
        self.checkRetrieveList.unshift(obj)
      }
      else {
        console.log('是我2')
        let obj2 = {
          input: rules,
          conditions: '',
          keyword: ''
        }
        self.checkRetrieveList.unshift(obj2);
        return ''
      }
    }
    deconstruction();
    console.log(self.checkRetrieveList)
  }

  /**
   * 意见反馈
   * */
  feedback() {
    console.log('123123')
    this.helpFeedbackState = true;
  }

  /**
   * 关闭反馈
   * */
  closeHelpFeedback() {
    this.helpFeedbackState = false;
  }

  /**
   * watch
   * */
  @Watch('$route')
  get$route(newVal: RouteType, oldVal: RouteType) {
    console.log(newVal)
    this.routeThis = newVal.name;
    this.navShowState = newVal.params.id;
    // alert(12)
    this.userHeadImg = store.state.userMess.headImageMax;
    this.userName = store.state.userMess.username;
    this.$refreshToken();
  };

  @Watch('dialogVisible')
  getDialogVisible(newVal: any, oldVal: any) {
    if (newVal) {
      this.queryModel();
    }
  };

}
</script>

<style lang="scss">
@import '../assets/css/publicScss';

.sidebarNav {
  width: calc(100% - 250px);
  height: 66px;
  padding-left: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(209, 209, 217);
  position: fixed;
  top: 0;
  z-index: 2;

  .sidebar-nav-left {
    height: 100%;
    position: relative;

    & span {
      height: 100%;
      margin-right: 35px;
      display: inline-block;
      line-height: 66px;
      cursor: pointer;
    }

    .home-nav {
      font-size: 16px;
      font-weight: 400;
      color: #000000;
      line-height: 22px;

      & img {
        width: 26px;
        height: 20px;
        vertical-align: middle;
      }
    }
  }

  .sidebar-nav-right {
    //width: 250px;
    display: flex;
    align-items: center;

    &>div {
      margin-right: 27px;
      cursor: pointer;
    }

    img {
      width: 20px;
      height: 20px;
    }

    span {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 22px;
      vertical-align: top;
      margin-left: 8px;
    }

    .user-mess {
      position: relative;

      &>img {
        border-radius: 50%;
        vertical-align: middle;
      }

      &>div {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        &>div {
          position: relative;
          top: 50px;
          right: -93%;
          width: 4em;
          background: #FFFFFF;
          padding: 5px 10px;
          box-shadow: 5px 5px 11px #c2c2c2, -5px -5px 11px #ffffff;
          cursor: pointer;
        }
      }
    }
  }
}

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

  .nav-left {
    display: flex;
    align-items: center;

    img {
      margin-right: 45px;
    }

    input {
      border: none;
      outline: none;
      background:transparent;
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

.checkStyle {
  border-bottom: 2px solid #0066cc;
}

.add-retrieve {
  padding: 50px ;
  text-align: center;

  i {
    cursor: pointer;
    font-size: 22px;
    margin-top: 15px;
    color: #2C73FF;
  }
}

.dialog-footer {
  text-align: center;
  background: #F7F7FA;

  .dialog-footer-but {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &>div {
      @include but(16px, #fff, 48px, #2C73FF, 5px);
      width: 140px;
      height: 48px;
    }
  }
}

.input-retrieve-cont {
  text-align: center;
  padding: 25px 50px;

  &>p {
    @include font(16px, #333, 22px);
    margin-bottom: 30px;
    font-weight: 400;
  }

  .input-retrieve-cont-com {
    width: 100%;

    &>div {

      & >>> .el-dropdown-menu el-popper {
        z-index: 20100 !important;
      }

      &>div {
        display: flex;
        //justify-content: space-between;
        align-items: center;

        .el-dropdown-link {
          width: 7em;
        }
      }

      &>div:first-child {

        &>.el-select {
          width: 90px;
          margin-right: 15px;
        }

        &>.el-input {
          width: 75%;
          margin-right: 20px;

          .el-input__inner {
            background: #F7F7FA;
            border-radius: 5px;
          }
        }

        &>span {
          display: inline-block;
          //width: 23px;
          //height: 23px;
          //background: #323232;
          //margin-left: 20px;
          //border-radius: 50%;
          cursor: pointer;
        }
      }

      &>div:last-child {
        width: 100px;
        margin: 20px auto;
      }

      &>.el-dropdown-link {
        line-height: 60px;
      }

      & >>> .el-select {

        .el-input__inner {
          border: none;
        }
      }
    }
  }

  .retrieve-nam-cont {
    width: 100%;

    &>p {
      margin: 30px;
      @include font(16px, #333, 22px);
    }

    &>input {
      width: 100%;
      border: none;
      border-bottom: 2px solid #2C73FF;
      outline: none;
      @include font(16px, #333, 22px);
    }
  }
}

.input-retrieve-cont-com >>> .el-select .el-input el-input--suffix .el-input__inner {
  border: none;
}

.el-upload--picture-card {
  width: 90px;
  height: 90px;
  line-height: 100px;
}

.el-upload-list--picture-card .el-upload-list__item-thumbnail,
.el-upload-list--picture-card .el-upload-list__item{
  width: 90px;
  height: 90px;
}

.moduleList {
  width: 260px;
  height: 20px;
  line-height: 20px;
  background: #FFFFFF;
  box-shadow: 0px 3px 11px 0px #ECECFA;
  border-radius: 5px;
  cursor: pointer;
  padding: 20px 15px;
  margin: 0 auto;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-around;
  align-items: center;
}

.lastFont {
  font-size: 16px;
  font-weight: 600;
  color: #2C73FF;margin-bottom: 15px;
}

.el-dialog__header,
.el-dialog__footer{
  background: #F7F7FA;
}

.el-dialog__footer {
  padding: 15px 20px 15px;
  text-align: right;
  box-sizing: border-box;
}
</style>
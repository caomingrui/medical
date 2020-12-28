<template>
  <div class="personalSettings">
    <div class="personalSettings-cont">
      <div class="personalSettings-cont-top">
        <div class="bread_crumbs" v-if="!levelState_1" >
          <span v-for="(item, index) in bread_crumbs" :key="item">
            <span @click="indexShow(index)" style="cursor: pointer;font-size: 22px;">{{ item }}</span><span v-if="index<bread_crumbs.length-1">  >  </span>
          </span>
        </div>
        <div class="setting-level-1" v-if="levelState_1">
          <div class="setting-level-1-list" @click="instructions('instructions')">
            <div class="level-1-list-left">用户须知</div>
            <div class="level-1-list-right">></div>
          </div>
          <div class="setting-level-1-list" @click="instructions('admin')">
            <div class="level-1-list-left">账号管理</div>
            <div class="level-1-list-right">></div>
          </div>
          <div class="setting-level-1-list">
            <div class="level-1-list-left" @click="clickLogOut()">退出登录</div>
            <div class="level-1-list-right"></div>
          </div>
        </div>
        <div v-if="secondary_type=='instructions'">
          <div class="setting-level-2" v-if="levelState_2">
              <div class="setting-level-2-list">
              <div class="level-2-list-left">
                <a href="../../../#/userAgre" target="_blank">用户协议</a>
              </div>
              <div class="level-2-list-right">></div>
            </div>
            <div class="setting-level-2-list">
              <div class="level-2-list-left">
                <a href="../../../#/privacyPolicy" target="_blank">隐私政策</a>
              </div>
              <div class="level-2-list-right">></div>
            </div>
            <div class="setting-level-2-list">
              <div class="level-2-list-left">
                <a href="../../../#/aboutUs" target="_blank">关于我们</a>
              </div>
              <div class="level-2-list-right">></div>
            </div>
          </div>
        </div>
        <div v-if="secondary_type=='admin'">
          <div class="setting-level-2" v-if="levelState_2">
              <div class="setting-level-2-list" @click="lowerClick('headImg')">
              <div class="level-2-list-left">用户头像</div>
              <div class="level-2-list-right">></div>
            </div>
            <div class="setting-level-2-list" @click="lowerClick('changName')">
              <div class="level-2-list-left">用户名修改</div>
              <div class="level-2-list-right">></div>
            </div>
            <div class="setting-level-2-list" @click="lowerClick('changPass')">
              <div class="level-2-list-left">密码修改</div>
              <div class="level-2-list-right">></div>
            </div>
            <div class="setting-level-2-list" @click="lowerClick('changUnitNatures')">
              <div class="level-2-list-left">单位性质</div>
              <div class="level-2-list-right">></div>
            </div>
          </div>
        </div>
        <div class="setting-level-3" v-if="levelState_3">

          <div v-if="tertiary_nodule_state.changName" class="headImg">
            <input type="text" v-model="changUserrMess.changName">
            <el-button type="primary" @click="saveUserName()" :disabled="changUserrMess.changName == $store.state.userMess.username">保存</el-button>
          </div>

          <!--on-success -&#45;&#45; 成功回调-->
          <!--before-uploadv &#45;&#45; 上传前的钩子 -->
          <div v-if="tertiary_nodule_state.headImg" class="headImg">
            <el-upload
                class="avatar-uploader"
                action="/api/h5/resource/uploadImg"
                name="imgFile"
                :on-success="handImgSuccess"
                :data="imgObj"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload">
              <img v-if="imgPath" :src="imgPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button type="primary" @click="saveHeadImg()">更换头像</el-button>
            <div style="margin: -20px 0 20px 0;">
              <p>点击头像图片可进行更换</p>
              <p>支持图片格式：JPG、PNG</p>
            </div>
          </div>

          <div v-if="tertiary_nodule_state.changPass" class="messStyle marginPass">
            <div>
              <label for="">原先密码</label>
              <el-input type="password" v-model="changUserrMess.oldPassword"></el-input>
            </div>
            <div>
              <label for="">修改密码</label>
              <el-input type="password" v-model="changUserrMess.newPassword"></el-input>
            </div>
            <div>
              <label for="">确认密码</label>
              <el-input type="password" v-model="changUserrMess.newSecondPassword"></el-input>
            </div>

            <el-button type="primary" @click="saveNewPassword()">保存</el-button>
          </div>

          <div v-if="tertiary_nodule_state.changUnitNatures" class="messStyle marginPass">
            <div>
              <label for="">单位机构</label>
              <el-select v-model="register_mess.industry" placeholder="单位性质">
                <el-option label="企业" value="4"></el-option>
                <el-option label="事业单位" value="3"></el-option>
                <el-option label="科研机构" value="2"></el-option>
                <el-option label="高等学校" value="1"></el-option>
                <el-option label="其他" value="0"></el-option>
              </el-select>
            </div>

            <div>
              <label for="">专业领域</label>
              <el-select v-model="register_mess.professionalField" placeholder="专业领域">
                <el-option label="工业技术" value="8"></el-option>
                <el-option label="农业科学" value="7"></el-option>
                <el-option label="医药卫生" value="6"></el-option>
                <el-option label="基础科学" value="5"></el-option>
                <el-option label="科教文艺" value="4"></el-option>
                <el-option label="经济财政" value="3"></el-option>
                <el-option label="社会科学" value="2"></el-option>
                <el-option label="哲学政法" value="1"></el-option>
                <el-option label="其他" value="0"></el-option>
              </el-select>
            </div>

            <div>
              <label for="">职位</label>
              <el-select v-model="register_mess.position" placeholder="职位">
                <el-option label="企业员工" value="6"></el-option>
                <el-option label="学生" value="5"></el-option>
                <el-option label="科研助理" value="4"></el-option>
                <el-option label="研究员" value="3"></el-option>
                <el-option label="课题组负责人" value="2"></el-option>
                <el-option label="学术带头人" value="1"></el-option>
                <el-option label="其他" value="0"></el-option>
              </el-select>
            </div>

            <el-button type="primary" @click="saveRegisterMess()">保存</el-button>
          </div>
        </div>
      </div>
      <div class="personalSettings-cont-bottom">
        Version {{ version }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import {Component, Vue, Watch} from 'vue-property-decorator';
import store from "@/store";
import service from "@/utils/request";
interface RouteType {
  name: string;
  params?: any;
}

@Component({
  components: {

  },
})

export default class PersonalSettings extends Vue {
  [key:string]:any;
  /**
   * data
   * */
  public version: string = "1.0.1";
  public levelState_1: boolean = true;
  public levelState_2: boolean = false;
  public levelState_3: boolean = false;
  public bread_crumbs: any = ['个人设置'];
  public bread_crumbs_html: string = `<span ><span>`;
  public secondary_type: string = '';
  public match: any = {
    instructions: '用户须知',
    admin: '账号管理',
    changName: '用户名修改',
    headImg: '用户头像',
    changPass: '修改密码',
    changUnitNatures: '单位性质'
  };
  tertiary_nodule_state: any = {
    changName: false,
    headImg: false,
    changPass: false,
    changUnitNatures: false
  };
  changUserrMess: any = {
    changName: store.state.userMess.username,
    oldPassword: '',
    newPassword: '',
    newSecondPassword: '',
  };
  imgObj: any = { imgName: '' };// 修改头像 名称
  imgPath: string = store.state.userMess.headImageMax; // 头像修改地址
  register_mess: any = {
    industry: '',
    position: '',
    professionalField: ''
  }; // 单位信息

  saveState_2: string = ''; // 跳转二级保存状态
  longBallPicturesState: boolean = false;
  industryList: any = [{'val': '企业', 'key': '4'}, {'val': '事业单位', 'key': '3'},
    {'val': '科研机构', 'key': '2'}, {'val': '高等学校', 'key': '1'}, {'val': '其他', 'key': '0'}];
  professionalFieldList: any = [{'val': '工业技术', 'key': '8'}, {'val': '农业科学', 'key': '7'},
    {'val': '医药卫生', 'key': '6'}, {'val': '基础科学', 'key': '5'}, {'val': '科教文艺', 'key': '4'}, {'val': '经济财政', 'key': '3'},
    {'val': '社会科学', 'key': '2'}, {'val': '哲学政法', 'key': '1'}, {'val': '其他', 'key': '0'}
  ];
  positionList: any = [{'val': '企业员工', 'key': '6'}, {'val': '学生', 'key': '5'},
    {'val': '科研助理', 'key': '4'}, {'val': '研究员', 'key': '3'},
    {'val': '课题组负责人', 'key': '2'}, {'val': '学术带头人', 'key': '1'},
    {'val': '其他', 'key': '0'}
  ];

  created() {
    this.changUserrMess.changName = store.state.userMess.username;
    this.imgPath = store.state.userMess.headImageMax;
  }

  mounted() {
    this.getUserMess()
    .then((res: any) => {
      this.changUserrMess.changName = res.username;
      this.imgPath = res.headImageMax;
    })
  }

  /**
   * methods
   * 一级点击
   * */
  public level1Click():void {
    this.levelState_1 = false;
    this.levelState_2 = true;
  }

  /**
   * methods
   * 二级点击
   * */
  public level2Click():void {
    this.levelState_1 = false;
    this.levelState_2 = false;
    this.levelState_3 = true;
  }

  /**
   * 三级显示
   * */
  levelThreeShows(key: string) {
    console.log('嗯哼')
    for (let i in this.tertiary_nodule_state) {
      this.tertiary_nodule_state[i] = false;
    }
    this.tertiary_nodule_state[key] = true;
  }

  /**
   * 用户须知点击
  */
  public instructions(str: string):void {
    console.log('我被点击了？');
    console.log(str)
    this.saveState_2 = str;
    this.level1Click();
    this.secondary_type = str;
    this.breadCrumbs(str)
  }

  /**
   * 二级转三级
   * */
  lowerClick(str: string) {
    console.log('我被点击了2？');
    console.log(str)
    this.level2Click();
    this.levelThreeShows(str);
    this.secondary_type = str;
    this.breadCrumbs(str)
  }

  /**
   * 修改用户名称
   * /{source}/user/editUserInfo
   * */
  saveUserName(mess: string = '') {
    let parmes = {
      username: this.changUserrMess.changName
    };

    if (mess == '') {
      // alert(1);
      this.isRepeatUserName();
    }
    let self = this;
    this.$request.put('/api/h5/user/editUserInfo', parmes)
    .then((res: any) => {
      if (res.code == "00000000") {
        if (mess ! = '') {
          self.$message(res.message);
        }
        self.getUserMess();
        window.history.go(0);
      }
      else {
        if (mess ! = '') {
          self.$message(res.message);
        }
      }
    });
  }

  /**
   * 用户名 检查用户名是否重复
   * /{source}/sign/checkUsername
   * */
  isRepeatUserName(): any {
    return new Promise(resolve => {
      let self = this;
      this.$axios.get('/api/h5/sign/checkUsername?username=' + this.changUserrMess.changName)
          .then( (res: any) => {
            console.log(res)
            if (res.data.code == "00000000") {
              if (res.data.data) {
                self.$message('该用户名已存在, 请重新输入');
              }
              else {

              }
            }
            else {
              console.log('用户名效验失败');
            }
          })
    })
  }

  /**
   * 修改密码
   * /{source}/user/editPassword
   * beforePassword	是	String	原密码
      newPassword	是	String	新密码
   oldPassword: '',
   newPassword: '',
   newSecondPassword: '',
   * */
  saveNewPassword() {

    if (this.oldPassword == this.newPassword) {
      this.$message({ message: '修改密码不能与旧密码一样', type: 'warning'});
    }
    else {
      if (this.changUserrMess.newPassword == this.changUserrMess.newSecondPassword) {

        let passExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/; //密码效验

        if (this.changUserrMess.oldPassword.replace().length < 10 || this.changUserrMess.newPassword.replace().length > 20 || !passExp.test(this.changUserrMess.newSecondPassword)) {
          this.$message({ message: '密码格式错误：请输入10-20位英文和数字组合', type: 'warning'});
        }
        else {
          let parmes = {
            beforePassword: this.changUserrMess.oldPassword,
            newPassword: this.changUserrMess.newSecondPassword,
          };

          let self = this;
          this.$request.put('/api/h5/user/editPassword', parmes)
              .then((res: any) => {
                if (res.code == "00000000") {
                  console.log("------ 修改密码成功 -------");
                  this.$message('修改密码成功');
                }
                else {
                  console.log("------ 修改密码操作失败 -------");
                  this.$message.error(res.message);
                }
              });
        }
      }
      else {
        this.$message({
          message: '两次密码输入不一致',
          type: 'warning'
        });
      }
    }
  }

  /**
   * 上传前的钩子
   * @param file 文件
   */
  beforeAvatarUpload(file: any) {
    console.log(file);
    this.imgObj.imgName = file.name;
  }

  /**
   * 图片上传成功回调
   * @param response 响应体
   * */
  handImgSuccess(response: any) {
    if (response.code == "00000000") {
      console.log('-------- 图片上传成功 ---------');
      this.imgPath = response.data;
      this.longBallPicturesState = true;
    }
    else {
      console.log('-------- 图片上传操作失败 ---------');
    }
  }

  /**
   * 修改头像
   * /{source}/user/editHeadImage
   * imgUrl	是	String	用户头像url
   * */
  saveHeadImg() {
    let self = this;
    if (this.longBallPicturesState) {
      this.$request.put('/api/h5/user/editHeadImg?imgUrl=' + this.imgPath)
          .then((res: any) => {
            if (res.code == "00000000") {
              console.log("------ 修改头像成功 -------");
              self.$message('跟换成功');
              self.saveUserName('mess');
            }
            else {
              console.log("------ 修改密码操作失败 -------");
              self.$message.error(res.message);
            }
          });
    }
    else {
      this.$message({
        message: '请先选择头像',
        type: 'warning'
      });
    }
  }



  /**
   * 修改单位相关信息
   * industry	否	int	单位性质
     professionalField	否	int	专业领域
     position	否	int	职位
   * */
  saveRegisterMess() {
    let parmes = {
      industry: Number(this.register_mess.industry),
      professionalField:  Number(this.register_mess.professionalField),
      position:  Number(this.register_mess.position)
    };

    let self = this;
    this.$request.put('/api/h5/user/editUserInfo', parmes)
      .then((res: any) => {
        if (res.code == "00000000") {
          self.$message(res.message);
        }
        else {
          this.$message.error(res.message);
        }
      });
  }

  /**
   * 面包屑
  */
  public breadCrumbs(str: string):void {
    let addStr = this.match[str];
    this.bread_crumbs.push(addStr);
  }
  /**
   * 面包屑跳转
  */
 public indexShow(num: number) {
   let ind = num + 1;
   if (ind == 1) {
     this.levelState_1 = true;
     this.levelState_2 = false;
     this.levelState_3 = false;
     let state = false;
     this.bread_crumbs = ['个人设置'];
     this.bread_crumbs.map((res: any, index: any) => {
       if (index > num) {
         state = true;
       }
     })
     if (state) {
       this.bread_crumbs.splice(ind, 1)
     }
   }
   else if (ind == 2) {
     this.levelState_1 = false;
     this.levelState_2 = true;
     this.levelState_3 = false;
     let state = false;
     this.secondary_type = this.saveState_2;
     console.log(this.secondary_type)
     this.bread_crumbs.map((res: any, index: any) => {
       if (index > num) {
         state = true;
       }
     })
     if (state) {
       this.bread_crumbs.splice(ind, 1)
     }
   }
   console.log(this.bread_crumbs);
 }

  /**
   * get User message
   * /{source}/user/findUserInfo
   */
  public getUserMess() {
    return new Promise(resolve => {
      let self = this;
      service.get( '/api/h5/user/findUserInfo')
        .then((res: any) => {
          if (res.code == "00000000") {
            localStorage.setItem('userMess', JSON.stringify(res.data));
            store.commit('saveUserMess', res.data);

            self.industryList.map((da: any) => {
              if (da.key == res.data.industry) {
                self.register_mess.industry = da.val
              }
            })

            self.professionalFieldList.map((da: any) => {
              if (da.key == res.data.professionalField) {
                self.register_mess.professionalField = da.val
              }
            })

            self.positionList.map((da: any) => {
              if (da.key == res.data.position) {
                self.register_mess.position = da.val
              }
            })

            resolve(res.data);
          }
          else if (res.code == "900171") {
            console.log('去登陆啦')
          }
        })
    })
  }

  /**
   * 退出登录
   * */
  clickLogOut() {
    localStorage.clear();
    window.history.go(0)
  }

  /**
   * watch
   * */
}
</script>

<style lang="scss">
.personalSettings {
  width: 100%;
  height: 100%;
  position: relative;

  .personalSettings-cont {
    width: 952px;
    background-color: #ffffff;
    border-radius: 5px;
    position: absolute;
    top: 100px;
    left: calc(50% - 500px);
    padding: 24px;

    .personalSettings-cont-top {
      width: 100%;
      position: relative;

      .setting-level-1,.setting-level-2 {
        padding: 104px 114px;

        .setting-level-1-list,.setting-level-2-list {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 5px;
          font-size: 22px;
          color: rgb(50, 50, 50);
          font-weight: bold;
          cursor: pointer;
        }

        & a {
          text-decoration: none;
          color: rgb(50, 50, 50);
        }
      }
    }

    .personalSettings-cont-bottom {
      width: 100%;
      height: 45px;
      border-top: 2px solid #f8f8fb;
      text-align: center;
      color: #9b9ba7;
      font-size: 16px;
      line-height: 75px;
    }
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.headImg {
  width: 100%;
  text-align: center;

  &>input {
    width: 320px;
    height: 42px;
    display: block;
    line-height: 42px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
    line-height: 25px;
    margin: 177px auto 33px auto;
    outline: none;
    border-radius: 4px;
    border: 1px solid #CDD7E0;
  }

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 100px auto 20px auto;
  }

  .el-button {
    margin-bottom: 70px;
    width: 140px;
    height: 48px;
    border-radius: 24px;
  }
}

.marginPass {
  margin: 80px auto 0 auto;
}

.messStyle {
  width: 100%;
  text-align: center;

  &>div {
    width: 410px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    margin-bottom: 20px;

    &>label {
      display: inline-block;
      width: 5em;
      font-size: 16px;
      font-weight: 300;
      color: #333333;
      line-height: 22px;
    }

    &>.el-select>.el-input>input {
      width: 300px;
      height: 48px;
      background: #F7F7FA;
      border-radius: 5px;
    }

    &>.el-input>input {
      width: 300px;
      height: 48px;
      background: #F7F7FA;
      border-radius: 5px;
      outline: none;
    }
  }

  .el-button {
    margin-bottom: 70px;
    width: 140px;
    height: 48px;
    border-radius: 24px;
  }
}

.avatar-uploader .el-upload {
  border: none;
}
</style>
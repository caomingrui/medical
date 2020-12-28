<template>
  <div class="logInToRegister">
    <div class="logInToRegister-cont">
        <div class="logInToRegister-cont-left">
            <img src="../assets/img/login_register_back.png" alt="">
        </div>
        <div class="logInToRegister-cont-right">
            <div class="register-cont" v-if="register_state">
                <div class="cont-nav">注册</div>
                <div class="cont-input">
                  <div>
                    <input type="text" placeholder="用户名" v-model="register_mess.username" @blur="isRepeatUserName()">
                    <span v-if="repeatUserName" class="font-red">该用户名已存在, 请重新输入</span>
                  </div>
                  <div>
                    <input type="text" placeholder="电子邮箱地址" v-model="register_mess.email" @blur="isRepeatEmail()">
                    <span v-if="repeatEmail" class="font-red">该邮箱已被注册, 请重新输入</span>
                  </div>
                  <div>
                    <input type="password" placeholder="账号密码" v-model="register_mess.password">
                  </div>
                </div>
                <div class="cont-mess">
                    <span></span>
                    <a href="#" @click="goLigin()">已有账号去登录</a>
                    <span></span>
                </div>
                <div class="cont-but" @click="createAcc()">创建账号</div>
            </div>

            <div class="login-cont" v-if="login_state">
                <div class="cont-nav cont-bottom">登录</div>
                <div class="cont-input">
                    <input type="text" placeholder="用户名/电子邮箱" v-model="login_mess.username">
                    <input type="password" placeholder="账号密码" v-model="login_mess.password">
                </div>
                <div class="cont-mess text">
                    <a href="#" @click="goRegister()">注册</a>
                    <a href="#" @click="forgotPass()">忘记密码？</a>
                </div>
                <div class="cont-but" @click="login()">登录</div>
            </div>

            <div class="person-cont" v-if="person_state">
                <div class="cont-nav">个人资料</div>
                <div class="cont-input">
                    <el-select v-model="register_mess.industry" placeholder="单位/机构">
                      <el-option label="企业" value="4"></el-option>
                      <el-option label="事业单位" value="3"></el-option>
                      <el-option label="科研机构" value="2"></el-option>
                      <el-option label="高等学校" value="1"></el-option>
                      <el-option label="其他" value="0"></el-option>
                    </el-select>

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

                    <el-select v-model="register_mess.position" placeholder="职位">
                      <el-option label="企业员工" value="6"></el-option>
                      <el-option label="学生" value="5"></el-option>
                      <el-option label="研究助理" value="4"></el-option>
                      <el-option label="研究员" value="3"></el-option>
                      <el-option label="课题组负责人" value="2"></el-option>
                      <el-option label="学术带头人" value="1"></el-option>
                      <el-option label="其他" value="0"></el-option>
                    </el-select>

                    <input type="text" placeholder="手机号（选填）" v-model="register_mess.phoneNumber">
                </div>
                <div class="rules">
                  <el-checkbox v-model="rulesState">我已阅读并同意接受<a href="../#/userAgre" target="_blank" style="color: #2C73FF">用户协议</a>及
                    <a href="../#/privacyPolicy" target="_blank" style="color: #2C73FF">隐私政策</a></el-checkbox>
                </div>
                <div class="cont-mess change-mess">
                    <span></span>
                    <span @click="goRegister()">上一步</span>
                    <span></span>
                </div>
                <div class="cont-but" @click="register()">注册</div>
            </div>

            <div class="person-cont" v-if="reset_state">
              <div class="cont-nav">重置密码</div>
              <div class="cont-input" style="margin-bottom: 105px;margin-top: 50px;">
                <input type="text" placeholder="电子邮箱地址" v-model="back_mess.email">
              </div>
              <div class="cont-mess change-mess" style="margin-bottom: 125px">
                <span></span>
                <span @click="goLigin()">返回登录</span>
                <span></span>
              </div>
              <div class="cont-but" @click="sendEmail()">发送重置邮箱</div>
            </div>

            <div class="person-cont" v-if="reset_code_state">
              <div class="cont-nav">重置密码</div>
              <div class="cont-input" style="margin-bottom: 105px;margin-top: 50px;">
                <input type="text" placeholder="邮箱验证码" v-model="back_mess.code">
              </div>
              <div class="cont-mess change-mess" style="margin-bottom: 125px">
                <span></span>
                <span @click="previousStep()">上一步</span>
                <span></span>
              </div>
              <div class="cont-but" @click="goChangePass()">确定</div>
            </div>

            <div class="person-cont" v-if="reset_pass_state">
              <div class="cont-nav">重置密码</div>
              <div class="cont-input" style="margin-bottom: 105px;margin-top: 50px;">
                <input type="password" placeholder="修改密码" v-model="back_mess.oldPassword">
                <input type="password" placeholder="确认密码" v-model="back_mess.password">
              </div>
              <div class="cont-mess change-mess">
                <span></span>
                <span @click="goRegisterPass()">上一步</span>
                <span></span>
              </div>
              <div class="cont-but" @click="changePass()">确定</div>
            </div>

        </div>
    </div>
    <filBottom :isLogin=true></filBottom>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue } from 'vue-property-decorator';
import sidebarLeft from '@/components/sidebarLeft.vue';
import sidebarNav from '@/components/sidebarNav.vue';
import filBottom from "@/components/filBottom.vue";
import store from "@/store";
import axios from 'axios'
interface RegisterMess {
  [key: string]: any
}

@Component({
  components: {
    filBottom
  },
})

export default class logInToRegister extends Vue {
  [key:string]:any;
  // data
  public register_state: boolean = false;
  public login_state: boolean = true;
  public person_state: boolean = false;
  public reset_state: boolean = false;
  public reset_code_state: boolean = false;
  public reset_pass_state: boolean = false;
  public register_mess: RegisterMess = {username: '', email: '', password: '', industry: '',
                      professionalField: '', position: '', phoneNumber: '' };
  public login_mess: RegisterMess = {username: '', password: ''};
  public back_mess: RegisterMess = {email: '', password: '', code: '', oldPassword: ''};
  repeatUserName: boolean = false; // 用户名重复提示
  repeatEmail: boolean = false; // 邮箱重复提示
  rulesState: boolean = false;


  created() {
    this.localCacheMess();
  }

  /**
   * 校验注册时的单位信息
   * 返回true则表示校验失败 不允通过
   **/
  checkSignInfo(num: string) {
    return typeof num != "number" && num == '' || num == null;
  }


  /**
   * 注册 -- 操作
   * /{source}/sign/sign
   * */
  register(): void {
    if (this.rulesState) {
      let self =this;
      if (this.checkSignInfo(this.register_mess.industry) || this.checkSignInfo(this.register_mess.professionalField) || this.checkSignInfo(this.register_mess.position)) {
        this.$message({
          message: '请选择单位/机构、专业领域、职位',
          type: 'warning'
        });
      }
      else {
        this.$axios.post('/api/h5/sign/sign', {
          username: this.register_mess.username,
          email: this.register_mess.email,
          password: this.register_mess.password,
          industry: Number(this.register_mess.industry)==0? 0: Number(this.register_mess.industry),
          professionalField: Number(this.register_mess.professionalField)==0?'': Number(this.register_mess.professionalField),
          position: Number(this.register_mess.position)==0? 0: Number(this.register_mess.position),
          phoneNumber: this.register_mess.phoneNumber
        })
        .then((res: any)=> {
          console.log(res)
          if (res.data.code == "00000000") {
            self.$message('注册成功');
            self.register_mess = {username: '', email: '', password: '', industry: '',
              professionalField: '', position: '', phoneNumber: '' };
            self.accordingHide('login_state');
          }
          else {
            this.$message.error(res.data.message);
          }
        })
      }
    }
    else {
      this.$message({
        message: '请勾选“我已阅读并同意接受用户协议及隐私政策”',
        type: 'warning'
      });
    }
  }

  //创建账号
  createAcc(): void {

    if (this.repeatUserName) {
      this.$message({ message: '该用户名已存在, 请重新输入', type: 'warning'});
    }
    else if (this.repeatEmail) {
      this.$message({ message: '该邮箱已被注册, 请重新输入', type: 'warning'});
    }
    else {



      let userName = this.register_mess.username;
      let email = this.register_mess.email;
      let password = this.register_mess.password;
      let regExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/; // 邮箱正则
      let passExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/; //密码效验

      if (userName.replace().length == 0 || email.replace().length == 0 || password.replace().length == 0) {
        this.$message({ message: '用户名.邮箱.密码不得为空', type: 'warning'});
      }
      else {
        if (userName.replace().length < 4 || userName.replace().length > 15) {
          this.$message({ message: '请输入4到15位合法字符', type: 'warning'});
          return;
        }
        else if (!regExp.test(email)) {
          this.$message({ message: '请输入合法邮箱地址', type: 'warning'});
          return;
        }
        else if (password.replace().length < 10 || password.replace().length > 20 || !passExp.test(password)) {
          this.$message({ message: '密码格式错误：请输入10-20位英文和数字组合', type: 'warning'});
          return;
        }
        else {
          this.accordingHide('person_state');
        }
      }
    }
  }

  // 去登陆
  goLigin(): void {
     this.accordingHide('login_state');
  }

  // 去注册
  goRegister(): void {
    this.accordingHide('register_state');
  }

  //返回 邮箱验证码
  goRegisterPass(): void {
    this.accordingHide('reset_code_state');
  }

  /**
   *  登录 业务 处理
   * /{source}/sign/login
   */
  login(): void {
    let params = {
      username: this.login_mess.username,
      password: this.login_mess.password
    }

    let self = this;
    this.$axios.post('/api/h5/sign/login', params)
      .then( (res: any) => {
        console.log(res)
        if (res.data.code == "00000000") {
          let token: string = res.data.data.token;
          localStorage.setItem('token', token);
          store.commit('setToken', token);
          self.$message('登录成功');
          localStorage.setItem('username', self.login_mess.username);
          localStorage.setItem('password', self.login_mess.password);
          self.$router.push({name: 'HomeCont', params: {id: '0'}});
        }
        else {
          self.$message.error(res.data.message);
        }
      })
  }

  /**
   * 判断本地是否存在缓存
   * */
  localCacheMess() {
    this.login_mess.username =  localStorage.getItem('username');
    this.login_mess.password = localStorage.getItem('password');
  }

  /**
   * 用户名 输入框失焦点 检查用户名是否重复
   * /{source}/sign/checkUsername
   * */
  isRepeatUserName(): void {
      let self = this;
      this.$axios.get('/api/h5/sign/checkUsername?username=' + this.register_mess.username)
          .then( (res: any) => {
            console.log(res)
            if (res.data.code == "00000000") {
              if (res.data.data) {
                self.repeatUserName = true;
              }
              else {
                self.repeatUserName = false;
              }
            }
            else {
              console.log('用户名效验失败');
            }
          })
  }

  /**
   * 邮箱是否重复
   * /{source}/sign/checkEmail
   * */
  isRepeatEmail() {
    let self = this;
    this.$axios.get('/api/h5/sign/checkEmail?email=' + this.register_mess.email)
        .then( (res: any) => {
          console.log(res)
          if (res.data.code == "00000000") {
            if (res.data.data) {
              self.repeatEmail = true;
            }
            else {
              self.repeatEmail = false;
            }
          }
          else {
            console.log('邮箱效验失败');
          }
        })
  }

  // 忘记密码
  forgotPass(): void {
    this.accordingHide('reset_state');
  }

  /**
   * 填写邮箱 - 发送邮箱验证码
   * /{source}/sign/sendEmail
   * */
  sendEmail(): void {
    let params = {
      email: this.back_mess.email
    }
    let regExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/; // 邮箱正则
    let email = this.back_mess.email;

    if (!regExp.test(email)) {
      this.$message({ message: '请输入合法邮箱地址', type: 'warning'});
    }
    else {
      let self = this;
      this.$axios.get('/api/h5/sign/sendEmail?email=' + email)
          .then( (res: any) => {
            console.log(res)
            if (res.data.code == "00000000") {
              self.$message('发送成功');
              setTimeout(() => {
                this.accordingHide('reset_code_state');
              }, 2000)
            }
            else {
              self.$message.error(res.data.message);
            }
          })
    }
  }

  // 重置填写邮箱验证码上一步
  previousStep(): void {
    this.accordingHide('reset_state');
  }

  // 填写验证码下一步
  goChangePass(): void {
    this.accordingHide('reset_pass_state');
  }

  /**
   * 修改密码
   * /{source}/user/retrievePassword
   * */
  changePass(): void {
    if (this.back_mess.oldPassword != this.back_mess.password) {
      this.$message.error('两次密码输入不一致');
      this.back_mess.oldPassword = '';
      this.back_mess.password = '';
    }
    else {
      let passExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/; //密码效验
      if (this.back_mess.password.replace().length < 10 || this.back_mess.password.replace().length > 20 || !passExp.test(this.back_mess.password)) {
          this.$message({ message: '密码格式错误：请输入10-20位英文和数字组合', type: 'warning'});
      }
      else {
        let params = {
          email: this.back_mess.email,
          code: this.back_mess.code,
          password: this.back_mess.password
        }

        let self = this;
        this.$axios.post('/api/h5/sign/retrievePassword', params)
            .then( (res: any) => {
              console.log(res)
              if (res.data.code == "00000000") {
                self.$message('修改密码成功');
                setTimeout(() => {
                  self.accordingHide('login_state');
                }, 2000)
              }
              else {
                self.$message.error(res.data.message);
              }
            })
      }
    }
  }

  // 显示影藏控制
  accordingHide(key: string): void {
    let arr: any = ['register_state', 'login_state', 'person_state', 'reset_state', 'reset_code_state', 'reset_pass_state'];
    let arrState: boolean = false;
    arr.map((res: string) => {
       if (res == key) {
         arrState = true;
       }
       else {
         this[res] = false;
       }
    })
    if (arrState) {
      this[key] = true;
    }
  }
}
</script>

<style lang="scss">
.logInToRegister {
    width: 100%;
    height: 100%;
    background-color: #ffffff;

    .logInToRegister-cont {
        width: 1000px;
        height: 600px;
        position: absolute;
        top: calc(50% - 300px);
        left: calc(50% - 500px);
        box-shadow: 0px 3px 20px 0px rgba(200, 222, 244, 0.89);
        border-radius: 10px;
        display: flex;
        justify-content: space-between;

        &>div {
          width: 50%;
        }

        .logInToRegister-cont-left {


            img {
                width: 100%;
                height: 100%;
            }
        }

        .logInToRegister-cont-right {
            padding: 57px 75px 48px 75px;
            width: calc(50% - 105px);

            .cont-nav {
                font-size: 30px;
                font-weight: 500;
                color: #333333;
                line-height: 42px;
                letter-spacing: 6px;
                width: 100%;
                text-align: center;
            }

            .cont-bottom {
                margin-bottom: 45px;
            }

            .cont-input {
                width: 100%;

                .el-select {
                  width: 100%;
                  border-bottom: 1px solid #DEDEDE;

                  input {
                    margin: 0;
                    padding: 0;
                  }
                }

                input {
                    width: 100%;
                    display: block;
                    height: 45px;
                    line-height: 45px;
                    border: none;
                    outline: none;
                    border-bottom: 1px solid #DEDEDE;
                    margin-bottom: 32px;
                }

            }
            .cont-mess {
                width: 100%;
                font-size: 20px;
                font-weight: 400;
                color: #2C73FF;
                line-height: 28px;
                width: 100%;
                text-align: center;
                margin-top: 49px;
                margin-bottom: 77px;
                display: flex;
                justify-content: space-between;

              & a {
                color: #2C73FF;
              }
            }

            .change-mess {
                margin: 0;
                margin: 36px auto 57px auto;
                cursor: pointer;
            }

            .cont-but {
                width: 100%;
                height: 60px;
                line-height: 60px;
                background: #2C73FF;
                border-radius: 30px;
                text-align: center;
                cursor: pointer;
                font-size: 22px;
                font-weight: 500;
                color: #FFFFFF;
                letter-spacing: 1px;
            }
        }
    }
}

.logInToRegister .logInToRegister-cont .logInToRegister-cont-right .cont-input .el-select {
  width: 100%;
  margin-bottom: 15px;
  border-bottom: 1px solid #DEDEDE;
}

.text>a {
  text-decoration: none;
}
.font-red {
  color: red;
}
</style>

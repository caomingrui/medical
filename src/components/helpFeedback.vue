<template>
  <div class="helpFeedback" v-if="helpFeedback_state">
    <div class="helpFeedback-cont">
      <div class="cont-nav">
        <span></span>
        <img @click="close()" src="../assets/img/help_cancel.png" alt="">
      </div>
      <div class="cont-help" v-if="help_state">
        <label for="">帮助&意见反馈</label>
        <div class="cont-help-main">
          <p>点击您想了解的问题</p>
          <div v-for="(item, index) in questionList" :key="index" style="cursor: pointer;">
            <img src="../assets/img/sidebar_article.png" alt="">
            <span @click="problemDescription(item.answer)">{{ item.problem }}</span>
          </div>
        </div>
        <div class="cont-help-bot" @click="feedback()">
            <span>意见反馈</span>
            <img src="../assets/img/to_left.png" alt="">
        </div>
      </div>
      <div class="cont-description cont-help" v-if="help_desc_state">
        <div class="cont-feedback-nav" @click="return_one()">
          <img src="../assets/img/views_return.png" alt="">
        </div>
        <div class="cont-help-main" style="max-height: 100%">
          <p>问题描述</p>
          <div v-html="lineDesc" style="display: revert;line-height: 2em;max-height: 400px;overflow-y: scroll"></div>
        </div>
      </div>
      <div class="cont-feedback" v-if="feedback_state">
        <div class="cont-feedback-nav" @click="return_one()">
          <img src="../assets/img/views_return.png" alt="">
        </div>
        <div class="cont-feedback-main">
          <div class="cont-feedback-main-nav">
            提交您的问题和意见
          </div>
          <div class="cont-feedback-main-cont">
            <div>
              <label for="">标题</label>
              <input type="text" placeholder="20字以内" v-model="questionTitle">
            </div>
            <div>
              <label for="">描述</label>
              <textarea style="width: 295px;" name="" id="" cols="30" 
              rows="10" placeholder="200字以内" v-model="remark"></textarea>
<!--              <div class="upload-pic-but">-->
<!--                <img src="../assets/img/sidebar_sett.png" alt="">-->
<!--                <span>上传图片</span>  -->
<!--              </div>-->

              <el-upload
                  action="/api/h5/resource/uploadImg"
                  name="imgFile"
                  limit=5
                  :data="imgName"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :before-upload="beforeAvatarUpload"
                  :on-remove="handleRemove"
                  :on-success="handImgSuccess">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>

            </div>

            <div class="submit" @click="submitOpinions()">提交</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Prop, Vue } from 'vue-property-decorator';
import store from "@/store";

@Component
export default class HelpFeedback extends Vue {
  [key:string]:any;

  @Prop() private msg!: string;
  @Prop({ type: Boolean, required:true ,default:'' }) helpFeedback_state !: any;

  // data
  public help_state: boolean = true;
  public feedback_state: boolean = false;
  dialogImageUrl: string =  '';
  dialogVisible: boolean = false;
  questionTitle: string = ''; //标题
  remark: string = ''; // 问题描述
  imgName: any = {
    imgName: '1.png'
  };
  feedbackImgList: any = []; // 意见反馈图片列表

  questionList: any = [{'problem': '我可以在本站中能找到什么内容？', 'answer': '学术有方目前专注于生命科学、生物医学类学术内容，一切学术内容来源于PUBMED，囊括所有生命科学、生物医学的国际刊物、文献。未来，本站将会纳入更多领域的学术内容，敬请期待。'},
    {'problem': '学术有方的所有内容是否全部可用？', 'answer': '学术有方会在学术内容呈现页面显示文献标题、摘要、DOI和全文链接。有些内容是开放获取的，这意味着内容的全文（文献）可以通过DOI或全文链接免费获得。然而，大多数学术内容都是需要付费订阅该杂志才能查' +
          '看论文全文，这与您所在的机构单位是否订阅了相关的期刊有关。如果您是订阅特定期刊的机构单位的成员，您应该使用您的机构网络登录（确保您是在机构内网络），这样你就可以直接查阅那本杂志上的论文全文了。'},
    {'problem': '我的订阅有什么？', 'answer': '您的订阅显示了您所关注的期刊上发表的与关键字相关的学术内容，这些学术内容按时间顺序列出。'},
    {'problem': '什么是关键字？', 'answer': '关键字是您日常关注的内容，可以是一个词语，也可以通过Boolean运算符进行组合。关键字会影响到您的订阅页面所呈现的学术内容。'},
    {'problem': '什么是Boolean运算符？', 'answer': `<p>在本站设置新的关键字时，可以使用Boolean运算符AND、OR和NOT。</p>
                                            <p>1）AND将返回包含标题或文献摘要中两个关键字的学术内容。这会缩小搜索范围。</p>
                                            <p>例如：cat AND dog将返回标题或摘要中同时带有cat和dog两个单词的学术内容。</p>
                                            <p>2）OR将返回包含标题或文献摘要中两个术语的学术内容。这会扩大了搜索范围。</p>
                                            <p>例如：cat OR dog将返回标题或摘要中带有单词cat或dog的学术内容。</p>
                                            <p>3）NOT返回论文标题或文献摘要中包含第一项但不包含第二项的学术内容。这会缩小搜索范围。</p>
                                            <p>例如：cat NOT dog将返回标题或文献摘要中包含cat一词的论文，而标题或文献摘要中不包含dog一词的论文。</p>
                                            <p>4）可以组合Boolean运算符来创建更复杂的关键字。</p>
                                            <p>例如，cat OR dog AND mouse将返回包含单词cat和mouse或同时包含单词dog和mouse的学术内容。</p>`},
    {'problem': '关键字能用中文吗？', 'answer': '目前还不支持中文期刊，因此不支持中文关键字。'},
    {'problem': '我如何保存一篇文献以便以后阅读', 'answer': '您可以通过单击内容页面的右下角的收藏图标为文献添加书签。通过单击导航栏中的收藏图标，您可以随时查看已添加书签的文献。'},
    {'problem': '如何整理收藏书签？', 'answer': '该功能将会在后续推出，敬请期待。'},
    {'problem': '我怎样才能分享文献', 'answer': '目前，本站不支持学术内容直接分享，但希望每一位用户可以邀请身边的伙伴注册并进行使用。'},
    {'problem': '无法登录我的帐户时，我应该如何做', 'answer': `<p>如果您在登录时遇到问题，以下是一些帮助您的提示：</p>
                                                    <p>1） 检查您是否登录到正确的帐户。</p>
                                                    <p>2） 如果您输入的电子邮箱地址是正确的，但忘记了密码，可通过请求重置密码获取修改密码的链接。</p>
                                                    <p>3） 检查你的邮件收件箱密码重置电子邮件。</p>
                                                    <p>4） 如果登录时仍有问题，请与我们联系。</p>`},
    {'problem': '我可以修改我的电子邮件地址吗？', 'answer': '目前不提供修改电子邮箱地址功能'},
    {'problem': '为什么我看到本站的推广广告？', 'answer': '首先也是最重要的一点是，本站采用自愿付费形式，同时并存永久免费使用形式。这正是我们对研究人员所做工作的核心所在：让您轻松地了解最新的学术内容。然而，为了支持这一任务并保持本站的免费，我们需要建立一个商业模式，即推广广告。'}
  ]; // 问题收录
  lineDesc: any = '';
  help_desc_state: boolean = false; // 问题描述弹框显示状态


  created() {
    this.initFeedback();
  }

  // methods  -- 返回上一级
  return_one(): void {
    this.feedback_state = false;
    this.help_state = true;
    this.help_desc_state = false;
  }

  // 意见反馈
  feedback(): void {
    this.feedback_state = true;
    this.help_state = false;
  }

  // close 
  close(): void {
    this.initFeedback();
    this.helpFeedback_state = false;
    this.$emit('closeHelpFeedback');
  }

  // /**
  //  * 问题描述返回
  //  * */
  // return_help() {
  //   this.feedback_state = false;
  //   this.help_state = false;
  //   this.help_desc_state = false;
  // }

  /**
   * 问题列表点击
   * @param { any } desc  -- 描述
   * */
  problemDescription(desc: any) {
    this.help_desc_state = true;
    this.help_state = false;
    this.lineDesc = desc;
  }

  /**
   * 提交意见
   * /{source}/feedback/submitFeedback
   * */
  submitOpinions() {
    let self = this;
    let questionTitle: any = this.questionTitle;
    let remark: any = this.remark;
    if (questionTitle.replace().length == 0 || remark.replace().length == 0) {
      this.$message({
        message: '请输入意见反馈标题和描述',
        type: 'warning'
      });
    }
    else {
      let parms = {
        email: store.state.userMess.email,
        questionTitle: this.questionTitle,
        remark: this.remark,
        images: this.feedbackImgList
      }
      this.$request.post('/api/h5/feedback/submitFeedback', parms)
          .then((res: any) => {
            if (res.code == '00000000') {
              console.log('-------- 意见反馈yes -----------');
              self.$message('提交成功');
              self.close();
            }
            else {
              console.log('-------- 意见反馈操作失败 -----------');
              self.$message.error(res.message);
            }
          })
    }
  }

  /**
   * 初始化 意见反馈
   * */
  initFeedback() {
    this.help_state = true;
    this.feedback_state = false;
    this.dialogImageUrl = '';
    this.dialogVisible = false;
    this.questionTitle = '';
    this.remark = '';
  }

  /**
   * 上传前的钩子
   * @param file 文件
   */
  beforeAvatarUpload(file: any) {
    console.log(file);
    this.imgName.imgName = file.name;
  }

  /**
   * 图片上传成功回调
   * @param response 响应体
   * */
  handImgSuccess(response: any) {
    if (response.code == "00000000") {
      console.log('-------- 图片上传成功 ---------');
      this.feedbackImgList.push(response.data);
    }
    else {
      console.log('-------- 图片上传操作失败 ---------');
    }
  }

  /**
   * 删除文件前的钩子
   * @param file 文件
   * @param fileList 文件列表
   */
  handleRemove(file: any, fileList: any) {
    console.log(file, fileList);
  }

  /**
   * 点击文件列表中已上传的文件时的钩子
   * @param file
   */
  handlePictureCardPreview(file: any) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.helpFeedback {
  position:absolute;
  top: 94px;
  right: 165px;

  .helpFeedback-cont {
    width: 345px;
    height: 100%;
    background: #F5F7F9;
    box-shadow: 0px 4px 13px 0px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    position: relative;
    padding: 22px;

    .cont-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;

      img {
        width: 15px;
        height: 15px;
        cursor: pointer;
      }
    }

    .cont-help,
    .cont-feedback {

      label {
        font-size: 22px;
        font-weight: 500;
        color: #0B0B0B;
        line-height: 30px;
      }

      .cont-help-main {
        padding: 30px 18px 45px 18px;
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        border: 1px solid #D7DEE4;
        background: #ffffff;
        padding-bottom: 39px;
        margin-top: 25px;
        max-height: 280px;
        overflow-y: scroll;

        &::-webkit-scrollbar {
          display: none;
        }

        p {    
          font-size: 14px;
          font-weight: 400;
          color: #69707F;
          line-height: 20px;
        }

        &>div {
          padding: 11px 14px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
          background: #F3F5F7;
          border-radius: 4px;
          margin-top: 10px;
          display: flex;
          align-items: center;

          img {
            margin-right: 5px;
          }
        }
      }

      .cont-help-bot {
        margin-top: 16px;
        margin-bottom: 23px;
        padding: 16px 21px;
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        border: 1px solid #D7DEE4;
        font-size: 18px;
        font-weight: 500;
        color: #0B0B0B;
        cursor: pointer;
      }
    }
  }
  .cont-feedback {

    .cont-feedback-nav {
      width: 48px;
      padding: 2px 6px;
      //background-color: #9096A4;
      border-radius: 8px;
      font-size: 12px;
      /* font-weight: 600; */
      color: #FFFFFF;
      line-height: 20px;
      cursor: pointer;

      &>img {
        width: 60px;
      }
    }

    .cont-feedback-main {
      margin-top: 25px;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
      border-radius: 10px;
      padding: 18px;

      .cont-feedback-main-nav {
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          line-height: 22px;
      }
      
      .cont-feedback-main-cont {
          margin-top: 25px;

          &>div {
            margin-bottom: 15px;

            label {
              display: block;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              margin-bottom: 5px;
            }

            input {
              display: block;
              padding: 6px 5px;
              width: 95%;
              border-radius: 4px;
              border: 1px solid #CDD7E0;
            }

            textarea {
              width: 90%;
              height: 120px;
              border-radius: 4px;
              padding: 6px 5px;
              border: 1px solid #CDD7E0;
            }

            .upload-pic-but {        
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 33px;
              background: linear-gradient(180deg, #FEFEFE 0%, #F3F5F7 100%);
              border-radius: 4px;
              border: 1px solid #CDD7E0;
              text-align: center;
              cursor: pointer;
              margin-bottom: 20px;

              img,span {
                vertical-align: middle;
              }
            }
          }
      }

      .submit {
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        background: #EDEDF6;
        box-shadow: 0px 3px 5px 0px #E3E3E3;
        border-radius: 4px;
        border: 1px solid #CFCFD7;
        padding: 6px ;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
</style>

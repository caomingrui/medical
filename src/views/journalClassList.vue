<template>
  <div class="journalClassList">
    <div class="journal-list" v-for="item in JournallList" :key="item.id">
        <div class="journal-list-img" @click="openDetails(item, item.nlmTitleAbbreviation, item.periodicalTitle, item.imgUrlMin, item.nlmId)">
            <img :src="item.imgUrlMin" alt="">
            <span>{{ item.periodicalTitle }}</span>
        </div>
        <div class="journal-list-but" >
            <span v-if="!item.isSubscribe" @click="subJournal(item.id)">订阅</span>
            <span v-else @click="canceleSubscription(item.id)">取消订阅</span>
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

export default class JournalClassList extends Vue {
  [key:string]:any;

  /**
   * data
   * */
  JournallList: any = []; // 期刊列表
  subscribeState: boolean = false; // 取消订阅状态

  created() {
    this.pageJournallList();
  }

  /**
   * methods
   * 期刊進入詳細文章列表
   * @param { string } journalShort  -- 期刊详情
   * */
  public openDetails(journalShort: any, keyword: any, title: any, img: any, id: any) {
      let obj = {
        name: title,
        keyword,
        img,
        id
      };

      localStorage.setItem('periodicalArticlesList', JSON.stringify(obj));
      store.commit('savePeriodicalArticlesList', obj);
      store.commit('saveCurrentJournals', journalShort);
      this.$router.push({name: 'all', params: {id: '3'}});
  }

  /**
   * 订阅期刊
   * /{source}/periodical/subscribe
   * @param { string } journalId -- 期刊id
   * */
  public subJournal(journalId: string) {
    let self = this;
    this.$request.get('/api/h5/periodical/subscribe?id=' + journalId)
    .then((res: any) => {
      if (res.code == '00000000') {
        console.log('-------- 期刊订阅ok ------------');
        self.JournallList.map((da: any) => {
          if (journalId == da.id) {
            da.isSubscribe = true;
          }
        })
        self.JournallList = self.JournallList;
        self.$message(res.message);
      }
      else {
        console.log('-------- 期刊订阅不ok ------------');
        this.$message.error(res.message);
      }
    })
  }

  /**
   * 小类 ID 查询期刊列表
   * periodical/findPeriodicalByMajorId
   * */
  pageJournallList() {
    let id = store.state.checkProfessionalId;

    if (id != null) {
      let self = this;
      this.$request.get('/api/server/periodical/findPeriodicalByMajorId?majorId=' + id)
        .then( (res: any) => {
          console.log(res)
          if (res.code == "00000000") {
            console.log('查询期刊列表成功');
            self.JournallList = res.data;
          }
          else {
            self.$message.error(res.message);
          }
        })
    }
    else {
      this.$router.push({path: '/home/journal/0/all'});
    }
  }

  /**
   * 取消期刊订阅
   * /{source}/periodical/unsubscribe
   * id --- 期刊 id
   * */
  canceleSubscription(id: string) {
    let self = this;
    this.$request.get('/api/h5/periodical/unsubscribe?id=' + id)
      .then((res: any) => {
        if (res.code == '00000000') {
          console.log('-------- 取消期刊订阅ok ------------');

          self.JournallList.map((da: any) => {
            if (id == da.id) {
              da.isSubscribe = false;
            }
          })
          self.JournallList = self.JournallList;
          self.$message('取消成功');
        }
        else {
          console.log('-------- 取消期刊订阅不ok ------------');
          this.$message.error(res.message);
        }
      })
  }

  /**
   * watch
   * */
  @Watch('$route')
  get$route(newVal: RouteType, oldVal: RouteType) {
    console.log(newVal)
  };
}
</script>

<style scoped lang="scss">
.journalClassList {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .journal-list {
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

    .journal-list-img {
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

        background: rgba(0,0,0,.4);
        padding: 5px 0;
        min-height: 3.5em;
      }
    }

    .journal-list-but {
        height: 37px;
        line-height: 37px;
        font-weight: 500;
        color: #9C9C9C;
        text-align: center;

      &>span {
        display: inline-block;
        width: 100%;
      }
    }
  }

}
</style>
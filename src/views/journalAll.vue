<template>
<div class="journalAll">
  <div class="defaultAll-cont">
    <div class="journal" v-for="item in subjectList" :key="item.id" @click="onJournal(item.id, item.subjectName)">
      <div class="journal-cont">
        <img :src="item.imgUrlMin" alt="">
        <label for="">{{ item.subjectName }}</label>
      </div>
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

export default class sidebarLeft extends Vue {
  [key:string]:any;
  /**
   * data
   * */
  public bread_crumbs: any = [{'label': '所有期刊', 'path': '/journal/0/all'}];
  public subjectList: any = [];

  created() {
    this.pageAllSubject();
  }

  /**
   * methods
   * @param {number} id --- 大类.科目 id
   * @param {string} title --- 大类.科目 title
   * */
  onJournal(id: number, title: string) {
    store.commit('saveCheckSubjectId', id);
    this.$router.push({name: 'class'});
    let lineArr = {'arr': {'label': title, 'path': '/home/journal/0/class'}, 'ind': 1};
    store.commit('setJournalList', lineArr);
  }

  /**
   * 查询所有科目 -- 最大类
   * /{source}/subject/findAllSubject
   * */
  pageAllSubject() {
    let self = this;
    this.$request.get('/api/server/subject/findAllSubject')
        .then( (res: any) => {
          console.log(res)
          if (res.code == "00000000") {
              console.log('查询最大类列表成功');
              self.subjectList = res.data;
          }
          else {
            self.$message.error(res.message);
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
.journalAll {
  width: 100%;
  height: 100%;

  .defaultAll-cont {
    display: flex;
    //justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    .journal {
      width: 130px;
      height: 202px;
      padding: 55px;
      cursor: pointer;
      box-shadow: rgb(215, 215, 224) 0px 0px 0px 1px inset, rgba(68, 55, 133, 0.1) 0px 2px 5px 0px;
      text-align: center;
      margin-right: 25px;
      margin-bottom: 25px;

      img {
        width: 135px;
        height: 135px;
      }

      label {
        font-size: 16px;
        font-weight: bold;
        color: rgb(155, 155, 155);
        display: inline-block;
        margin-top: 35px;
      }
    }
  }
}

</style>
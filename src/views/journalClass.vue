<template>
  <div class="journalClass">
    <div v-for="item in professionalList" :key="item" @click="openClass(item.id, item.majorName)">
      {{item.majorName}}
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
  public journalList: any = [
      {'label': '考古学', 'id': ''}, {'label': '人文艺术', 'id': ''}, {'label': '经典', 'id': ''},
    {'label': '保护', 'id': ''}, {'label': '历史', 'id': ''}
      ];
  public professionalList: any = [];

  created() {
    this.pageProfessionalList();
  }

  /**
   * methods
   * 打開期刊
   * @param { number } id --- 专业id
   * @param { string } title --- 专业title
   * */
  openClass(id: number, title: string) {
    console.log('my click it right?');
    store.commit('saveCheckProfessionalId', id);
    this.$router.push({name: 'list', params: {id: '0'}});
    let lineArr = {'arr': {'label': title, 'path': '/home/journal/0/list'}, 'ind': 2};
    store.commit('setJournalList', lineArr);
  }

  /**
   * 学科.大类 ID 查询专业列表
   * major/findMajorBySubjectId
   * */
  pageProfessionalList() {
    let id = store.state.checkSubjectId;
    let self = this;
    this.$request.get('/api/server/major/findMajorBySubjectId?subjectId=' + id)
        .then( (res: any) => {
          console.log(res)
          if (res.code == "00000000") {
            console.log('查询最小类列表成功');
            self.professionalList = res.data;
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
.journalClass {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &>div {
    padding: 0 20px;
    width: 260px;
    color: #323232;
    font-size: 14px;
    font-weight: bold;
    height: 50px;
    background-color: #ffffff;
    box-shadow: rgb(215, 215, 224) 0px 0px 0px 1px inset;
    margin: 10px;
    line-height: 50px;
    cursor: pointer;
  }
}
</style>
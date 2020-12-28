import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface TypeState {
  token: string | null;
  name?: string; // 测试...
  userMess: any;
  journalList: any;
  currentArticle: any;
  retrieveList: any;
  checkSubjectId: number | null;
  checkProfessionalId: number | null;
  collectNumberList: any;
  currentFileInd: number | string;
  currentJournals: any;
  retrieveCont: any;
  retrieveContList: any; // 检索id列表
  detailsAboutStatus: any;
  periodicalArticlesList: any; // 期刊下文章信息
}

const initPageState = (): TypeState => {
  const state: TypeState = {
    token: localStorage.getItem('token'),
    journalList: [{'label': '全部期刊', 'path': '/home/journal/0/all'}],
    userMess: localStorage.getItem('userMess'),
    currentArticle: localStorage.getItem('saveArticleId'),
    name: 'caomingrui',
    retrieveList: null,
    checkSubjectId: null,
    checkProfessionalId: null,
    collectNumberList: (JSON.parse as any)(localStorage.getItem('saveCollectNumberList')),
    currentFileInd: 0,
    currentJournals: null,
    retrieveCont: null,
    retrieveContList: [],
    detailsAboutStatus: 0,
    periodicalArticlesList: (JSON.parse as any)(localStorage.getItem('periodicalArticlesList')),
  };
  return state
}

const store = new Vuex.Store({
  state: initPageState,
  mutations: {
    /**
     * 存储token
     * */
    setToken(state: any, token: string) {
      state.token = token;
    },

    /**
     * 修改面包屑
     * */
    setJournalList(state: any, arr: any) {
      let addState = false;
      state.journalList.map((res: any, index: any) => {
        if (index <= arr.ind) {
          addState = true;
        }
        else {
          state.journalList.splice(arr.ind +1, 1, arr.arr)
        }
      })
      if (addState) {
        state.journalList.push(arr.arr);
      }
      console.log( state.journalList )
    },

    /**
     * 回溯删除数组
     * */
    changeJournal(state: any, ind: any) {
      state.journalList.splice(ind+1, state.journalList.length)
    },

    /**
     * save user Message
     * */
    saveUserMess(state: any, mess: any) {
      state.userMess = mess;
    },

    /**
     * save_current_article_id
     * */
    saveArticleId(state: any, id: number | string) {
      state.currentArticle = id;
    },

    /**
     * 保存检索数组
     * */
    saveRetrieveList(state: any, list: any) {
      state.retrieveList = list;
    },

    /**
     * 保存大类.科目 当前点击id
     * */
    saveCheckSubjectId(state: any, id: number) {
      state.checkSubjectId = id;
    },

    /**
     * 保存专业.小类 当前点击id
     * */
    saveCheckProfessionalId(state: any, id: number) {
      state.checkProfessionalId = id;
    },

    /**
     * 保存收藏数值列表
     * @param state
     * @param list
     */
    saveCollectNumberList(state: any, list: any) {
      state.collectNumberList = list;
    },

    /**
     * 保存当前文件索引
     * @param state
     * @param ind
     */
    saveCurrentFileInd(state: any, ind: number | string) {
      state.currentFileInd = ind;
    },

    /**
     * 保存当前点击期刊
     * */
    saveCurrentJournals(state: any, name: any) {
      state.currentJournals = name;
    },

    /**
     * 保存检索内容
     * @param state
     * @param cont
     */
    saveRetrieveCont(state: any, cont: any) {
      state.retrieveCont = cont;
    },

    /**
     * 保存检索id列表
     * */
    saveRetrieveContList(state: any, list: any) {
      state.retrieveContList = list;
    },

    /**
     * 更改详情状态
     * */
    saveDetailsAboutStatus(state: any, change: any) {
      state.detailsAboutStatus = change;
    },

    /**
     * 保存当前点击期刊信息
     * */
    savePeriodicalArticlesList(state: any, list: any) {
      state.periodicalArticlesList = list;
    }
  },
  actions: {
    /**
     * 异步保存收藏数值列表
     * */
    increment(context, list: any) {
      context.commit("saveCollectNumberList", list);
    },
  }
})

export default store
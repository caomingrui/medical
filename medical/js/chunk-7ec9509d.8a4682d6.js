(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7ec9509d"],{"11eb":function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"myCollection"},[a("div",{staticClass:"myCollection-cont"},[e._l(e.articleMess,(function(t,o){return a("div",{key:t},[a("articleListView",{attrs:{articleMess:t,articleInd:o},on:{refreshPage:e.refreshPage}})],1)})),e._m(0)],2)])},i=[function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"advertis"},[o("a",{attrs:{href:"../#/advertis",target:"_blank"}},[o("img",{attrs:{src:a("618d"),alt:""}})])])}],c=(a("d81d"),a("d4ec")),n=a("bee2"),r=a("262e"),s=a("2caf"),l=a("9ab4"),u=a("60a3"),f=a("94bf"),d=a("0613"),p=function(e){Object(r["a"])(a,e);var t=Object(s["a"])(a);function a(){var e;return Object(c["a"])(this,a),e=t.apply(this,arguments),e.articleMess=[],e}return Object(n["a"])(a,[{key:"created",value:function(){this.pageCollection()}},{key:"mounted",value:function(){this.refresh()}},{key:"refresh",value:function(){var e=this;setTimeout((function(){if("0"==e.$route.params.id)e.$router.push({name:"myCollection",params:{id:"ref"}});else if("ref"==e.$route.params.id)return}),1e3)}},{key:"pageCollection",value:function(){var e=this;this.$request.get("/main/h5/article/findArticle?pageNo=0").then((function(t){if("00000000"==t.code){console.log("--------- 我的收藏查询ok --------------"),console.log(t.data);var a=t.data,o={},i=[];a.map((function(t){o.id=t.articleId,o.followCount=t.followCount,i.push(t.articleId),e.articleMess.push(t.articleId)})),e.pageCollectNum(i)}else console.log("--------- 我的收藏查询异常 -------------")}))}},{key:"pageCollectNum",value:function(e){var t=this;this.$request.get("/main/h5/article/findFollowCount?ids="+e).then((function(e){console.log(e),"00000000"==e.code?(console.log("-------- 收藏数量查询ok -----------"),d["a"].commit("saveCollectNumberList",e.data),localStorage.setItem("saveCollectNumberList",JSON.stringify(e.data))):(console.log("-------- 收藏数量查询no -----------"),t.$message.error(e.message))}))}},{key:"refreshPage",value:function(){this.pageCollection()}},{key:"get$route",value:function(e,t){console.log(e)}}]),a}(u["c"]);Object(l["a"])([Object(u["d"])("$route")],p.prototype,"get$route",null),p=Object(l["a"])([Object(u["a"])({components:{articleListView:f["a"]}})],p);var g=p,h=g,v=(a("d98c"),a("2877")),m=Object(v["a"])(h,o,i,!1,null,"4d3a983e",null);t["default"]=m.exports},"618d":function(e,t,a){e.exports=a.p+"img/advertis.b55b32f0.jpg"},"65ca":function(e,t,a){},d98c:function(e,t,a){"use strict";var o=a("65ca"),i=a.n(o);i.a}}]);
<template>
  <div class="filBottom" :style="isLogin?'width: 100%': 'width: calc(100% - 190px)'">
    <div >
      <p>@2020 xueshu.work版权所有 粤ICP备2020106461号-1</p>
      <p><img src="~@/assets/img/fil.png" alt=""> 粤公网安备 44060802000236号</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLogin: Boolean
  },
  name: "filBottom",
  data() {
    return {

    }
  },
}
</script>

<style scoped lang="sass">

.filBottom
  position: fixed
  background-color: #efeff6
  right: 0
  bottom: 0

  &>div
    width: 1200px
    margin: 0 auto
    text-align: center
    font-size: 14px
    color: #666

    img
      vertical-align: middle
      width: 12px

    &>p
      margin: 5px 0

</style>

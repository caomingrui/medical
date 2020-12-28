<template>
  <div class="aboutUs" >
    <div>
      <p class="font" style="width: 100%;text-align: center;font-size: 24px;margin-bottom: 30px">关于我们</p>

      <p> 学术有方简介</p>

      <p>我们是什么 学术有方成立于2020年9月，致力打造一个为科研学者提供便捷的学术支持的网站。创始人是临床医学、医学免疫学专业的硕士研究生，深知科研学者获取学术内容的途径与需求，希望通过联动、多元化的方式，从学术内容分发、科研项目管理、科研领域活动开展等多方面促进科研学者日常工作效率提高、灵活应变、思维拓宽。如今，学术有方已经产生出第一版的工作平台，通过关键字、期刊的设定，根据科研学者个性化学术内容需求进行推送，并可进行收藏及学术内容下载，是科研学者日常工作的必不可少的获取学术内容的主要来源。</p>

      <p>名字的由来 克雷洛夫说到“无知的人就跟猪一样的盲目，他们嘲笑知识，讥笑学问，鄙夷地把学术的成就一脚踢开，却不知道自己正享受着学术上的一切成果”。学术，是科研学者的生命中最为重要的工作。无论您是学生还是教授，抑或是行业工作者，都是维护学术正确、稳定发展的一员。方，道也；有方，则有道。学术有方，就是为科研学者在学术探索的过程中提供正确且便捷的途径。</p>

      <p>愿景 学术有方倡导高效工作、敏捷运行，通过提供丰富功能，改善科研学者日常工作的不便利，让学术内容、科研工作变得智慧、便利。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "aboutUs",
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="scss">
.aboutUs {
  width: 100%;
  height: 100%;
  background-color: rgb(247, 247, 247);

  &>div {
    width: 800px;
    margin: 0 auto;
    padding: 100px 100px;
    background-color: #FFFFFF;
    height: calc(100% - 200px);

    &>p {
      line-height: 30px;
    }
  }
}

.red {
  color: red;
}

.font {
  font-size: 20px;
  font-weight: bold;
}
</style>
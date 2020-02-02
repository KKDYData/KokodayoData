<template>
  <div id="footer">
    <li>
      <div class="info" style>
        <div style="margin-right: 5px;">
          <svg
            height="24"
            class="octicon octicon-mark-github"
            viewBox="0 0 16 16"
            version="1.1"
            width="24"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
        </div>
        <div>
          <a style="color: white" href="https://kokodayo.fun/info" target="_blank">关于&捐款</a>
        </div>
      </div>
    </li>
    <li>
      <div>
        <a href="http://www.beian.miit.gov.cn">粤ICP备19019286号</a>
      </div>
    </li>
    <li>
      <div>网站最后更新时间: {{ webVer }}</div>
    </li>
    <li>
      <div>干员列表最后更新时间: {{ listVer }}</div>
    </li>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['listVer', 'pageVer', 'webVer'])
  }
}
</script>

<style lang="stylus" >
a {
  color: #818181
  cursor: default
  text-decoration: none

  &:any-link, &:-webkit-any-link，&:-moz-any-link {
    color: #818181
    cursor: default
    text-decoration: none
  }
}

#footer {
  margin-top: auto
  font-size: 12px
  background-color: #313131
  width: 100%
  box-sizing: border-box
  color: hsla(0, 0%, 60%, 1)
  padding: 10px
  display: flex
  flex-direction: column
  flex-wrap: wrap
  flex-wrap: wrap
  height: 50px
  align-content: flex-end

  li {
    list-style: none
    padding: 2px 15px
    line-height: 24px
    font-size: 14px
  }

  .info {
    display: flex
    align-items: flex-end
    justify-content: flex-end

    a, a:any-link, a:-webkit-any-link，a:-moz-any-link {
      cursor: pointer
    }
  }
}

.octicon {
  vertical-align: middle
}

@media screen and (max-width: 700px) {
  #footer {
    height: auto
    display: block

    li {
      text-align: right
    }
  }
}
</style>


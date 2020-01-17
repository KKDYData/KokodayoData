import { MessageBox } from 'element-ui'

const swPath = '/sw.js'
export default () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      const { Workbox } = await import('workbox-window')
      const wb = new Workbox(swPath)

      wb.addEventListener('installed', (event) => {
        console.log('弹框确认_installed')
        if (!event.isUpdate) return
        MessageBox.confirm('修了不知道哪里的bug，请刷新页面', '有更新', {
          confirmButtonText: '刷新',
          iconClass: 'el-icon-position',
          customClass: 'alert-update-msg'
        })
          .then(res => {
            console.log('确认')
            window.location.reload()

          })
          .catch(res => {
            console.log('取消')
          })
      })

      wb.addEventListener('controlling', (event) => {
        console.log('controlling')

      })
      console.log('注册sw')
      wb.register()
    })
  }
}

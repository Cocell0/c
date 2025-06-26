export default function inlineVue() {
  return {
    name: 'inline-vue',
    async transformIndexHtml(html) {
      const res = await fetch('https://unpkg.com/vue@3/dist/vue.global.prod.js')
      const vueScript = await res.text()
      return html.replace(/<script src="https:\/\/unpkg\.com\/vue@3(?:\.5\.17)?\/dist\/vue\.global\.js"><\/script>/, `<script>${vueScript}</script>`)
    }
  }
}

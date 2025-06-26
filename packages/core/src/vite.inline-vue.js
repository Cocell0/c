let isBuilding = false;

export default function inlineVue() {
  return {
    name: 'inline-vue',
    configResolved(config) {
      isBuilding = config.command === 'build'
    },
    async transformIndexHtml(html) {
      const { readFile } = await import('fs/promises')
      const { fileURLToPath } = await import('url')
      const { dirname, join } = await import('path')

      const __filename = fileURLToPath(import.meta.url)
      const __dirname = dirname(__filename)

      const vuePath = join(__dirname, isBuilding ? '../../core/lib/vue.global.prod.js' : '../../core/lib/vue.global.js')
      const vue = await readFile(vuePath, 'utf-8')

      return html.replace(/<!-- Vue UMD -->/, `<script>\n/* ${isBuilding ? 'Vue UMD production build' : 'Vue UMD development build'} */\n\n${vue}</script>`)
    }
  }
}

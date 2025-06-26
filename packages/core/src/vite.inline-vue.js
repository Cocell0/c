export default function inlineVue() {
  return {
    name: 'inline-vue',
    async transformIndexHtml(html) {
      // import Node modules only when running in build (Node) context
      const { readFile } = await import('fs/promises')
      const { fileURLToPath } = await import('url')
      const { dirname, join } = await import('path')

      // Resolve path relative to this plugin file
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = dirname(__filename)
      const vuePath = join(__dirname, '../../core/lib/vue.global.prod.js')

      const vueScript = await readFile(vuePath, 'utf-8')

      return html.replace(
        /<script src="https:\/\/unpkg\.com\/vue@3(?:\.5\.17)?\/dist\/vue\.global\.js"><\/script>/,
        `<script>${vueScript}</script>`
      )
    }
  }
}

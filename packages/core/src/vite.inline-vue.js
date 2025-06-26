export default function inlineVue() {
  return {
    name: 'inline-vue',
    async transformIndexHtml(html) {
      const { readFile } = await import('fs/promises')
      const { fileURLToPath } = await import('url')
      const { dirname, join } = await import('path')

      const __filename = fileURLToPath(import.meta.url)
      const __dirname = dirname(__filename)
      const vuePath = join(__dirname, '../../core/lib/vue.global.prod.js')

      const vueScript = await readFile(vuePath, 'utf-8')

      return html.replace(
        /<!-- Vue UMD -->/,
        `<script>${vueScript}</script>`
      )
    }
  }
}

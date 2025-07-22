let isBuilding = false

/**
 * Vite plugin
 * - Injects a script to map implicitly declared Perchance plugins to `window.plugin`
 * - Cleans URL params in Perchance after initialization
 *
 * @returns {import('vite').Plugin}
 */
export default function perchanceSpecifics() {
  return {
    name: 'perchance-specifics',
    async transformIndexHtml(html) {
      const fs = await import('node:fs/promises')
      const path = await import('node:path')
      const { fileURLToPath } = await import('url')
      const __dirname = path.dirname(fileURLToPath(import.meta.url))

      const filePath = path.resolve(__dirname, 'perchance-specifics.js')
      const scriptContent = await fs.readFile(filePath, 'utf-8')

      return html.replace(/<\/head>/i, `<script>${scriptContent}</script></head>`)
    }
  }
}

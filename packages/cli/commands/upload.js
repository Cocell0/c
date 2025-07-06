import { Command } from 'commander';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url'
import fs from 'fs';
import path from 'path';

const commandUpload = new Command('upload')
  .option('-h, --headfull', 'upload in heafull mode to get a live view')
  .description('upload one or more apps into Perchance')
  .action((opts) => upload(opts));

const config = {
  headless: true,
  slowMo: 100,
  args: [
    "--start-maximized",
    "--force-dark-mode",
    "--enable-features=WebContentsForceDark",
    "--user-agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.138 Safari/537.36'",
    "--lang=en-US"
  ]
};

const appAddresses = [];

(() => {
  const __filename = fileURLToPath(import.meta.url)
  const packagesDirectory = path.resolve(path.dirname(__filename), '..', '..')

  const packageDirectories = fs.readdirSync(packagesDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(packagesDirectory, dirent.name))

  for (const directory of packageDirectories) {
    const pkgPath = path.join(directory, 'package.json')
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
        if (pkg.homepage && pkg.name) {
          appAddresses.push(pkg.name)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
})();


async function upload(opts) {
  if (opts.headfull) config.headless = false;

  const browser = await chromium.launch(config);
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  for (const address of appAddresses) {
    await page.goto(`https://perchance.org/${address}`);

    await page.waitForSelector('#outputIframeEl', { state: 'attached' });
    const frame = await (await page.$('#outputIframeEl')).contentFrame();
    await frame.waitForLoadState('load');

    await page.screenshot({ path: `${address}.png` });
  }

  await browser.close();
}

export default commandUpload;

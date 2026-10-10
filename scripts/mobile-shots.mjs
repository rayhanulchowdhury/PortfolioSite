/**
 * Mobile close-ups for visual review. Dev utility only.
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = process.env.VERIFY_URL ?? 'http://localhost:5178/'
const CHROME =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

mkdirSync('scripts/screens', { recursive: true })

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true })
await page.goto(URL, { waitUntil: 'networkidle2' })
await page.waitForSelector('#main')

await page.screenshot({ path: 'scripts/screens/m-hero.png' })

// Open the dropdown menu.
await page.click('button[aria-controls="mobile-menu"]')
await new Promise((r) => setTimeout(r, 500))
await page.screenshot({ path: 'scripts/screens/m-menu.png' })
await page.keyboard.press('Escape')
await new Promise((r) => setTimeout(r, 400))

for (const [name, sel] of [
  ['m-services', '#services'],
  ['m-portfolio', '#video-editing'],
  ['m-contact', '#contact'],
]) {
  const el = await page.$(sel)
  await el.scrollIntoView()
  await new Promise((r) => setTimeout(r, 450))
  await page.screenshot({ path: `scripts/screens/${name}.png` })
}

await browser.close()
console.log('mobile shots done')

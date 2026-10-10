/**
 * Captures close-up viewport screenshots for visual review.
 * Dev utility only. Usage: node scripts/shots.mjs
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const URL = process.env.VERIFY_URL ?? 'http://localhost:5178/'
const CHROME =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

mkdirSync('scripts/screens', { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(URL, { waitUntil: 'networkidle2' })
await page.waitForSelector('#main')

const height = await page.evaluate(() => document.body.scrollHeight)
console.log('page height:', height)

const shots = [
  ['hero', '#home'],
  ['about', '#about'],
  ['services', '#services'],
  ['video-editing', '#video-editing'],
  ['photography-sec', '#photography'],
  ['clients', '#clients'],
  ['contact', '#contact'],
  ['footer', 'footer'],
]

for (const [name, selector] of shots) {
  const el = await page.$(selector)
  if (!el) {
    console.log('missing', selector)
    continue
  }
  await el.scrollIntoView()
  await new Promise((r) => setTimeout(r, 400))
  await el.screenshot({ path: `scripts/screens/x-${name}.png` })
}

await browser.close()
console.log('done')

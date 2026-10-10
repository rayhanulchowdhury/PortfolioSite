/**
 * Confirms the site honours the OS "reduce motion" setting.
 * Dev utility only.
 */
import puppeteer from 'puppeteer-core'

const CHROME =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.VERIFY_URL ?? 'http://localhost:5178/'

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const page = await browser.newPage()
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle2' })
await page.waitForSelector('#main')

const scrollBehavior = await page.evaluate(
  () => getComputedStyle(document.documentElement).scrollBehavior,
)
const animationDuration = await page.evaluate(
  () => getComputedStyle(document.querySelector('h1')).animationDuration,
)
const transitionDuration = await page.evaluate(() => {
  const btn = document.querySelector('.btn-primary, a.btn-primary, #home a')
  return btn ? getComputedStyle(btn).transitionDuration : 'n/a'
})

console.log('scroll-behavior      :', scrollBehavior)
console.log('h1 animation-duration:', animationDuration)
console.log('button transition    :', transitionDuration)

const ok =
  scrollBehavior === 'auto' &&
  parseFloat(animationDuration) < 0.01 &&
  parseFloat(transitionDuration) < 0.01

console.log(ok ? 'PASS  reduced-motion honoured' : 'FAIL  reduced-motion not honoured')
await browser.close()
process.exit(ok ? 0 : 1)

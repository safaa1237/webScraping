const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const CronJob = require('cron').CronJob
const amqp = require('amqplib/callback_api')

async function getBrowser() {
  const width = 4019
  const height = 1900
  const browser = await puppeteer.launch({
    args: [
      `--window-size=${width},${height}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--disable-dev-shm-usage',
      '--disable-features=VizDisplayCompositor',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/81.0.4044.113 Chrome/81.0.4044.113 Safari/537.36"',
    ],
  })
  return browser
}

async function getPage(asin) {
  const browser = await getBrowser()
  const page = await browser.newPage()
  await page.goto(
    `https://www.amazon.de/Apple-EarPods-mit-Kopfh%C3%B6rerstecker/dp/${asin}`
  )
  await page.waitFor(1000)
  const result = await page.evaluate(() => {
    let title = document.querySelector('#productTitle').innerText
    return { title }
  })
  browser.close()
  return result
}

function sendTitleToQueue(title) {
  amqp.connect(
    'amqps://qsshxlae:2qF4etyjQ6IYFWWLQ5QoRH_TISf2Wji8@sparrow.rmq.cloudamqp.com/qsshxlae',
    (err, conn) => {
      conn.createChannel((err, ch) => {
        var queue = 'title'

        ch.assertQueue(queue, { durable: false })
        ch.sendToQueue(queue, Buffer.from(JSON.stringify(title)))
        console.log('Message was sent')
      })
      setTimeout(() => {
        conn.close()
        process.exit(0)
      }, 500)
    }
  )
}

function recieveIson() {
  amqp.connect(
    'amqps://qsshxlae:2qF4etyjQ6IYFWWLQ5QoRH_TISf2Wji8@sparrow.rmq.cloudamqp.com/qsshxlae',
    (err, conn) => {
      conn.createChannel((err, ch) => {
        var queue = 'title'

        ch.assertQueue(queue, { durable: false })
        console.log('waiting for ison')
        ch.consume(
          queue,
          (asin) => {
            console.log(asin)
            getTitle(asin)
          },
          { noAck: true }
        )
      })
    }
  )
}

async function getTitle(asin) {
  let title = await getPage(asin)
  sendTitleToQueue(title)
}

async function scheduled(asin, crontab) {
  const page = await getPage(asin)
  let job = new CronJob(crontab, function () {
    getTitle()
  })
}

const puppeteer = require('puppeteer');
class Skeleton {
    constructor(options) {
        this.options = options
    }
    async init() {
        // 启动一个无头浏览器（headless: true）
        this.browser = await puppeteer.launch({ headless: false })
    }
    async newPage() {
        const { device } = this.options
        // 新建标签页
        const page = await this.browser.newPage()
        // 模拟给定设备
        await page.emulate(puppeteer.KnownDevices[device])
        return page
    }
    async genHtml(url) {
        // 1. 新建一个标签页运行，模拟给定设备
        const page = await this.newPage()
        // 2. 在标签页运行指定的 url
        const response = await page.goto(url, { waitUntil: 'networkidle2' })
        if (response && !response.ok()) {
            throw new Error(`${response.status} on ${url}`)
        }
        // 3. 返回 html
        return 'html'
    }
    async destory() {
        if (this.browser) {
            await this.browser.close()
            this.browser = null
        }
    }
}

module.exports = Skeleton
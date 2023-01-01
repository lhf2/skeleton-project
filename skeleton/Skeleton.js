const puppeteer = require('puppeteer');
const { readFile } = require('fs-extra')
const { resolve } = require('path')
const { sleep } = require('./util')
class Skeleton {
    constructor(options) {
        this.options = options
    }
    async init() {
        // 启动一个无头浏览器（headless: true）
        this.browser = await puppeteer.launch({ headless: true })
    }
    async newPage() {
        const { device } = this.options
        // 新建标签页
        const page = await this.browser.newPage()
        // 模拟给定设备
        await page.emulate(puppeteer.KnownDevices[device])
        return page
    }
    // 生成骨架屏结构
    async makeSkeleton(page) {
        const { defer = 5000 } = this.options
        const scriptContent = await readFile(resolve(__dirname, 'skeletonScript.js'), 'utf8')
        // 执行 skeletonScript 内部代码（自执行函数）
        await page.addScriptTag({ content: scriptContent })
        // 等待自执行函数执行完毕
        await sleep(defer)
        // 生成骨架结构
        await page.evaluate((options) => {
            // 自执行函数执行完毕会给 window 挂载 Skeleton，返回一个对象，里面有两个方法（genSkeleton、getHtmlAndStyle）
            Skeleton.genSkeleton(options)
        }, this.options)
    }
    async genHtml(url) {
        // 1. 新建一个标签页运行，模拟给定设备
        const page = await this.newPage()
        // 2. 在标签页运行指定的 url
        const response = await page.goto(url, { waitUntil: 'networkidle2' })
        if (response && !response.ok()) {
            throw new Error(`${response.status} on ${url}`)
        }
        // 3. 生成骨架屏结构 返回骨架屏代码
        await this.makeSkeleton(page)
        const { styles, html } = await page.evaluate(() => Skeleton.getHtmlAndStyle())
        let result = `
            <style>${styles.join('\n')}</style>
            ${html}
        `
        console.log('result', result);
        return Promise.resolve(result)
    }
    async destory() {
        if (this.browser) {
            await this.browser.close()
            this.browser = null
        }
    }
}

module.exports = Skeleton
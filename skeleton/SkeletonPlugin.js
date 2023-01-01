// 插件的本质是一个类，有 apply 方法
const Server = require('./Server')
const Skeleton = require('./Skeleton')
const { resolve } = require('path')
const { readFile, writeFile } = require('fs-extra')
const PLUGIN_NAME = 'SkeletonPlugin';
class SkeletonPlugin {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        // 编译完成 生成 dist 目录后触发此钩子函数
        compiler.hooks.done.tap(PLUGIN_NAME, async () => {
            // 1. 创建一个静态资源服务器
            await this.startServer()

            // 2. 启动 puppeteer 生成骨架屏代码
            this.skeleton = new Skeleton(this.options)
            // 2.1 启动一个无头浏览器
            await this.skeleton.init()
            // 2.2 重要的一步 运行一个新的标签页 生成骨架屏结构
            const skeletonHtml = await this.skeleton.genHtml(this.options.origin)
            console.log('skeletonHtml', skeletonHtml);
            // 3. 替换 index.html 的占位符
            const originPath = resolve(this.options.staticDir, 'index.html')
            const originHtml = await readFile(originPath, 'utf-8')
            const finalHtml = originHtml.replace('<!-- sheel -->', skeletonHtml)
            await writeFile(originPath, finalHtml, 'utf-8')

            // 4. 断开一切链接（浏览器、静态资源服务器、进程推出）
            await this.skeleton.destory()
            await this.server.close()
            process.exit(0)
        })
    }
    async startServer() {
        this.server = new Server(this.options)
        // 监听服务端口
        await this.server.listen()
    }
}
module.exports = SkeletonPlugin
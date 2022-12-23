// 插件的本质是一个类，有 apply 方法
const Server = require('./Server')
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
            // await this.server.close()
        })
    }
    async startServer(){
        this.server = new Server(this.options)
        // 监听服务端口
        await this.server.listen()
    }
}
module.exports = SkeletonPlugin
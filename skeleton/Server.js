const http = require('http')
const express = require('express')
const { resolve } = require('path')
class Server {
    constructor(options) {
        this.options = options
    }
    async listen() {
        const app = this.app = express()
        // 静态资源服务器 默认 use 的路径是 / 会找 dist 下面的 index.html
        app.use(express.static(this.options.staticDir))
        // 因为 app 没有提供 close 方法，所以只能用 http 包裹一层
        this.server = http.createServer(app)
        return new Promise(resolve => {
            this.server.listen(this.options.port, () => {
                console.log(`server listen at : ${this.options.origin}`);
                resolve();
            })
        })
    }
    async close() {
        return new Promise((resolve) => {
            this.server.close(()=>{
                console.log('server closed!');
                resolve();
            })
        })
    }
}

module.exports = Server
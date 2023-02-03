# 骨架屏的实现原理
1. 使用 react 创建入口文件
```
import React from 'react';
import ReactDOM from 'react-dom/client';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <img src="http://img.zhufengpeixun.cn/zhufengjg.jpg" width="100%"></img>
        <button>点我点我</button>
    </>
);
```
2. 使用 webpack 进行配置打包
3. 创建一个骨架屏插件 SkeletonPlugin
```
        使用方法如下：
        new SkeletonPlugin({
            staticDir: resolve(__dirname, 'dist'),
            // 启动的服务器
            port: 8000,
            origin: 'http://localhost:8000',
            device: 'iPhone 6',
            button: {
                color: '#9e9e9e'
            },
            image: {
                color: '#9e9e9e'
            }
        })
```
   - 在编译完成，生成 dist 目录的时候触发钩子 ```compiler.hooks.done.tap```
     -  使用 ```express()```创建一个静态资源服务器，用 staticDir 作为静态资源根目录，运行在 port 端口上；
     -  使用 ```puppeteer``` 启动一个无头浏览器，运行一个新的标签页，模拟给定的 device 设备，在标签页运行指定的 url —— origin，生成骨架屏结构（遍历 body 里面的每一个标签，根据配置项递归的处理元素，添加特定样式，创建 style 标签 —— 骨架屏的样式加入到页面中）
     -  替换 index.html 的占位符 ```<div id="root"><!-- sheel --></div>```
     -  断开一切链接（浏览器、静态资源服务器、进程推出）
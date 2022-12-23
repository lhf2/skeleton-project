// 插件的本质是一个类，有 apply 方法
const PLUGIN_NAME = 'SkeletonPlugin';
class SkeletonPlugin {
    constructor() {

    }
    apply(compiler) {
        // 编译完成 生成 dist 目录后触发此钩子函数
        compiler.hooks.done.tap(PLUGIN_NAME, async () => {
            console.log('SkeletonPlugin')
        })
    }
}
module.exports = SkeletonPlugin
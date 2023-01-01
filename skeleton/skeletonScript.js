window.Skeleton = (function () {
    const $$ = document.querySelectorAll.bind(document)
    // 样式相关
    const CLASS_NAME_PREFEX = 'sk-';
    const styleCache = new Map();
    // 图片相关
    // 1像素的一个透明点
    const SMALLEST_BASE64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    const setAttributes = (ele, attrs)=>{
        Object.keys(attrs).forEach(k => ele.setAttribute(k, attrs[k]))
    }

    const addStyle = (selector, rule)=>{
        // 缓存
        if(!styleCache.has(selector)){
            styleCache.set(selector, rule)
        }
    }

    // 处理按钮
    function buttonHandler(ele, options = {}){
        const className = `${CLASS_NAME_PREFEX}-button`
        const rule = `{
            color: ${options.color}!important;
            background: ${options.color} !important;
            border: none !important;
            box-shadow: none !important;
        }`
        addStyle(`.${className}`, rule)
        ele.classList.add(className)
    }

    // 处理图片
    function imgHandler(ele, options = {}){
        const {width, height} = ele.getBoundingClientRect()
        const attrs = {
            width,
            height,
            src: SMALLEST_BASE64
        }
        setAttributes(ele, attrs)
        const className = CLASS_NAME_PREFEX + 'image';
        const rule = `{ background: ${options.color} !important;}`;
        addStyle(`.${className}`, rule);
        ele.classList.add(className)
    }

    function genSkeleton(options = {}) {
        const rootElement = document.documentElement
        ;(function traverse(options){
            let { button, image} = options
            // 存储所有的按钮跟图片
            const buttons = []
            const imgs = []

            // 遍历 body 里面的每一个标签
            ;(function preTraverse(ele){
                // 递归
                if(ele.children && ele.children.length > 0){
                    Array.from(ele.children).forEach(child => preTraverse(child))
                }
                if(ele.tagName === 'BUTTON'){
                    return buttons.push(ele)
                }
                if(ele.tagName === 'IMG'){
                    return imgs.push(ele)
                }
            })(rootElement)

            // 循环处理所有的按钮跟图片
            buttons.forEach(e => buttonHandler(e, button))
            imgs.forEach(e => imgHandler(e, image));
        })(options)

        // 把样式加入到页面
        let rules = ''
        for(const [selector, rule] of styleCache){
            rules += `${selector} ${rule}\n`;
        }
        const styleEle = document.createElement('style')
        styleEle.innerHTML = rules
        document.body.appendChild(styleEle)
    }
    function getHtmlAndStyle() {
        const styles = Array.from($$('style')).map(style => style.innerHTML || style.innerText)
        const html = document.body.innerHTML
        return { styles, html }
    }
    return {
        genSkeleton,
        getHtmlAndStyle
    }
})()
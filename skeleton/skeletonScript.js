window.Skeleton = (function () {
    const $$ = document.querySelectorAll.bind(document)
    function genSkeleton(options = {}) {

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
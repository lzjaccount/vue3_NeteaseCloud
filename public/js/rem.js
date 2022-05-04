function remResize() {
    let deviceWidth = document.documentElement.clientWidth || window.innerWidth;
    if (deviceWidth > 750) {
        deviceWidth = 750
    }
    if (deviceWidth < 320) {
        deviceWidth = 320
    }
    //设置稿是750px  这样的话1rem等于100px
    document.documentElement.style.fontSize = (deviceWidth / 7.5) + 'px'
    //设置默认字体大小
    document.body.style.fontSize = 0.3 + 'rem'
}
//初次调用
remResize()
//窗口大小发送改变也要调用
window.onresize = function () {
    remResize()
}
export default function fullScreen(event) {
    event.preventDefault();
    event.stopPropagation();
    // Trigger fullscreen 

    if (document.body.requestFullscreen) { //解决兼容性问题
        document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullScreen) { //兼容谷歌 /Edge
        document.body.webkitRequestFullScreen();
    } else if (document.body.mozRequestFullScreen) { //Firefox
        document.body.mozRequestFullScreen();
    } else if (document.body.msRequestFullscreen) {//ie
        document.body.msRequestFullscreen();
    }
    else {
        alert("浏览器不兼容");
    }
}
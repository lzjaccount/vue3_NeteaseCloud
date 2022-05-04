import request from './request'

/**获取轮播图数据 */
export function getBanner() {
    return request({
        url: '/banner'
    })
}

/**推荐歌单 */
export function getPersonalized(config) {
    return request({
        url: '/personalized',
        params: {
            limit: config
        }
    })
}

/**独家放送 */
export function getPrivateContent() {
    return request({
        url: "/personalized/privatecontent"
    })
}

/**获取每日新歌 */
export function getNewSong() {
    return request({
        url: '/personalized/newsong',
    })
}

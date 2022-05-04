import request from "./request.js";

/**最新歌曲 */
export function getTopSongs(type) {
    return request({
        url: '/top/song',
        params: {
            type: type
        }
    })
}

/**获取歌单歌曲信息 */
export function getSongsDetail(arr) {
    return request({
        url: '/song/detail',
        params: {
            ids: arr
        }
    })
}
import request from './request'

/**获取歌曲url */
export function getMusicUrl(id) {
    return request({
        url: '/song/url',
        params: {
            id: id
        }
    })
}

/**歌曲评论 */
export function musicRecommend(id, limit, offset) {
    return request({
        url: '/comment/music',
        params: {
            id: id,
            limit: limit,
            offset
        }
    })
}

/**获取歌词 */
export function getLyric(id) {
    return request({
        url: '/lyric',
        params: {
            id: id
        }
    })
}
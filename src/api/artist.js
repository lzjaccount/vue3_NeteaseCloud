import request from './request'

/**歌手 */
export function getArtist(area, type, name = -1, limit, offset = 1) {
    return request({
        url: '/artist/list',
        params: {
            area: area,
            type: type,
            limit: limit,
            initial: name,
            offset: offset
        }
    })
}
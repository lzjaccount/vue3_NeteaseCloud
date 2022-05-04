import request from './request'
import { formatDate, padLeftZero } from '../utils/tool'

export const getAlbumDetail = (id) => request({ url: '/album/detail/dynamic', params: { id } })
/**获取歌单收藏者 */
export function getSub(id, limit) {
    return request({
        url: '/playlist/subscribers',
        params: {
            id: id,
            limit
        }
    })
}

/**歌单评论信息 */
export function getRecommends(id, limit, offset) {
    return request({
        url: '/comment/playlist',
        params: {
            id: id,
            limit: limit,
            offset
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
//获取歌单基本信息
export function getMusicListDetail(id) {
    return request({
        url: '/playlist/detail',
        params: {
            id: id
        }
    })
}


/**对歌曲数据进行封装 */
export class songDetail {
    constructor(songs) {
        this.id = songs[0].id;
        this.name = songs[0].name;
        this.album = songs[0].al.name;
        this.artist = songs[0].ar[0].name;
        this.pic = songs[0].al.picUrl;
        this.time = formatDate(new Date(songs[0].dt), 'mm:ss')
    }
}


/**获取歌单分类 */
export function getCatList() {
    return request({
        url: '/playlist/catlist'
    })
}

/**获取热门歌单 */
export function getMusicListHot() {
    return request({
        url: '/playlist/hot',
    })
}

/**获取不同tag的精品歌单 */
export function getHighquality(cat, limit) {
    return request({
        url: '/top/playlist/highquality',
        params: {
            cat: cat,
            limit: limit,
            time: new Date().getTime()
        }
    })
}

/**获取歌单--网友精选碟，全部歌单 */
export function getPlayList(cat, limit, offset) {
    return request({
        url: '/top/playlist',
        params: {
            cat: cat,
            limit: limit,
            offset
        }
    })
}
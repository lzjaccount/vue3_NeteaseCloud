import axios from 'axios'
//引入进度条
import nprogress from 'nprogress'
//引入进度条样式
import '../../node_modules/nprogress/nprogress.css'
const axiosIntance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000
})

axiosIntance.interceptors.request.use(config => {
    //进度条开始
    nprogress.start()
    return config
})
axiosIntance.interceptors.response.use(res => {
    //进度条结束
    nprogress.done()
    return res.data
})
export default axiosIntance

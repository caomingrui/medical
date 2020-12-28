/* eslint-disable */
import axios from 'axios'
import { Message } from 'element-ui'
import router from "@/router";
import store from '@/store'

// create an axios instance
const service:any = axios.create({
    // baseURL: this.$path, // url = base url + request url
    timeout: 5000 // request timeout
})
// request interceptor
service.interceptors.request.use(
    (config: any) => {
        // before request is sent
        if (store.state.token) {
            config.headers['Token'] = store.state.token;
        }
        return config
    },
    (error: any) => {
        // with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    (response: any) => {

        if (response.data.code == "900171") {
            console.log('用户信息失效');
            localStorage.clear();
            router.replace({path: '/',});
            window.history.go(0);
        }

        const res = response.data
        return res
    },
    (error: any) => {
        console.log('err' + error) // for debug
        // Message({
        //     message: error.message,
        //     type: 'error',
        //     duration: 5 * 1000
        // })
        return Promise.reject(error)
    }
)

export default service

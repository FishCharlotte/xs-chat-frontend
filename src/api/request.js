import axios from "axios";
import * as Errors from './errors'


const errorHandler = (err) => {
    if (!err.response) {
        throw new Errors.TimeoutError();
    }

    const resp = err.response.data;

    switch (err.response.status) {
        case 401:
            throw new Errors.UnauthorizedError(resp.error);
        case 403:
            throw new Errors.ForbiddenError(resp.error);
        case 404:
            throw new Errors.NotFoundError(resp.error);
        case 400:
            throw new Errors.BadRequestError(resp.error);
        case 500:
            throw new Errors.InternalServerError(resp.error);
        default:
            throw new Error(resp.error);
    }
}


const client = axios.create({
    baseURL: "/api/",
    withCredentials: true,
    timeout: 10 * 1000,
    headers: {
        post: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
        }
    },
});

// 请求拦截器
client.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    return errorHandler(error);
});

// 响应拦截器
client.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response;
    },
    function (error) {
        if (error.status === 401) {
            window.location.href = '/login'
        }
        return errorHandler(error);
    }
);


export const get = async (url) => {
    const resp = await client.get(url);
    return resp.data;
};

export const post = async (url, params) => {
    const resp = await client.post(url, params);
    return resp.data;
};

export const put = async (url, params) => {
    const resp = await client.put(url, params);
    return resp.data;
};

export const del = async (url) => {
    const resp = await client.delete(url);
    return resp.data;
};


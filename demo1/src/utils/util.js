export function getPostTokenFn(){//用于后端获取表单提交时需要的唯一标识符
    return new Promise((resolve,reject) => {
        https.fetchGet("/api/abc/token").then(res=>{
            setCookieDomain("csrfToken",res.data.data.csrfToken)
            resolve()
        }).catch((res)=>{
            reject()
        })
    })

}
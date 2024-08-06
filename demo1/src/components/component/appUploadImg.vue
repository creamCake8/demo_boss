<template>
    <div>
        <el-button type="primary" plain @click="openQrCode" style='width: 82px'>手机上传</el-button>
        <div class="upload-img-ercode_box" v-show="qrCodeFlag">
            <div class="upload-img-ercode_cont">
                <div class="upload-img-ercode_cont_head">
                    手机扫码上传图片
                    <div class="upload-img-ercode_cont_head_close el-icon-close" @click="closeQrCode('cancel')"></div>
                </div>
                <div class="ercode-border">
                    <div class="upload-img-ercode_cont_code_tip">
                        <img src="" >
                    </div>
                    <div class="upload-img-ercode_cont_url2 code_title" >
                        <img src="" >
                        扫码上传图片
                    </div>
                    <div class="upload-img-ercode_cont_url">
                        <div :id="imgName"></div>
                    </div>
                    <div class="upload-img-ercode_cont_url2" >
                        有效时间：
                        <span :style = "this.time > 100 ? 'color:rgb(255, 153, 0)' : 'color:red'" style="font-size: 17px;font-weight: bold"  >{{this.time}}</span>
                        <span style="margin-left: 4px">
                             s
                        </span>
                    </div>
                    <div class="upload-img-ercode_cont_url2" style="color: black">
                        使用微信或浏览器扫码上传图片
                    </div>
                    <div class="upload-img-ercode_cont_url2" style="padding: 50px 0 20px 0 ">
                        <img
                                style="width:40px;height: 40px"
                                src=""
                                alt="">
                    </div>
                    <div class="upload-img-ercode_cont_url2">
                        物业提供
                    </div>
                </div>
                <div style="float: right;padding: 30px 48px 48px 0 ">
                    <el-button  @click="closeQrCode('cancel')">关闭</el-button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import QRCode from 'qrcodejs2';
    import { addLog } from '@/utils/addLog';
    import { showMessage } from '@/utils/showMessage';

    export default {
        props: [
            'imgName',//标识，用于判断每个页面的手机上传的哪些图片
            'uploadCount',//本次操作可上传的最大图片长度
            'alreadyImgList',//本次操作对象的已存在值
        ],
        data() {
            return {
                img_name : null,//标识，自己定义，用于判断每个页面的手机上传的哪些图片
                upload_count : null,
                already_img_list : [],
                key: null,//操作标识
                qrCodeFlag: false,
                imgUrlStr: null,
                time: null
            };
        },
        mounted() {
        },
        methods: {
            //打开二维码
            openQrCode() {
                if(!this.imgName){
                    showMessage('图片名称不可为空！',"error");
                    return;
                }
                if(!this.uploadCount){
                    showMessage('图片上传最大数量不可为空！',"error");
                    return;
                }
                if(this.uploadCount == 0){
                    showMessage('图片上传最大数量不可为0！',"warning");
                    return;
                }
                this.img_name = this.imgName;
                this.upload_count = this.uploadCount;
                this.already_img_list = this.alreadyImgList;
                if(this.already_img_list.length == this.uploadCount){
                    showMessage("该图片只能上传"+ this.upload_count + "张熬","warning");
                    return;
                }


                this.qrCode();
                this.qrCodeFlag = true;
            },
            qrCode() {
                //生成本次操作标识参数
                this.key = this.getKeyCode() + Math.floor(Math.random() * 10000);
                new QRCode(this.imgName, {
                    width: 230,
                    height: 230,
                    text: '' + this.key + '&limit=' + (this.uploadCount -this.already_img_list.length) , //二维码地址
                    url: '' + this.key + '&limit=' + (this.uploadCount -this.already_img_list.length)
                });
                //定时查询，有无图片上传完毕
                this.time = 300;
                this.timeGo();
                let _self = this;
                window.clearInterval(this.interval);
                this.interval = window.setInterval(() => {
                    _self.getImgUtlStr();
                }, 5000);
            },
            //倒计时
            timeGo(){
                if(this.time>=0){
                    setTimeout(() => {
                        this.time=this.time-1;
                        this.timeGo()
                    }, 1000);
                }else{
                    this.closeQrCode('warning');
                }
            },
            getImgUtlStr(){
                this.$https.a('', {
                    key: this.key
                }).then(res => {
                    if (res.code == 0) {
                        if (res.data.imgUrlStr) {
                            //有值，关闭二维码，向父级页面传值--上传成功
                            this.imgUrlStr = res.data.imgUrlStr;
                            this.closeQrCode('success');
                        }
                    } else {
                        //一旦报错，停止访问接口，关闭二维码
                        this.closeQrCode('error');
                    }
                });
            },
            //关闭二维码
            closeQrCode(closeType) {
               //把数据传给父组件

            },
            // 获取当前日期的方法
            getKeyCode() {
                const projectTime = new Date(); // 当前中国标准时间
                const Year = projectTime.getFullYear(); // 获取当前年份 支持IE和火狐浏览器.
                const Month = projectTime.getMonth() + 1; // 获取中国区月份
                const Day = projectTime.getDate(); // 获取几号
                var CurrentDate = Year;
                if (Month >= 10) { // 判断月份和几号是否大于10或者小于10
                    CurrentDate += Month;
                } else {
                    CurrentDate += '0' + Month;
                }
                if (Day >= 10) {
                    CurrentDate += Day;
                } else {
                    CurrentDate += '0' + Day;
                }
                return CurrentDate;
            }
        }
    };
</script>

<style>
    .ercode-border{
        width: 80%;
        height: 74%;
        border:1px solid #bcbec2;
        margin-top: 7%;
        margin-left: 10%;
        position:relative;
    }
    .upload-img-ercode_box {
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.3);
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .upload-img-ercode_cont {
        width: 550px;
        height: 700px;
        background: #fff;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
    }

    .upload-img-ercode_cont_head {
        width: 100%;
        height: 45px;
        border-bottom: 2px solid #eee;
        line-height: 45px;
        text-indent: 20px;
        position: relative;
        color: black;
        font-size: 18px;
        font-weight: bolder;
        /*color: #fff;*/
        /*background: #f98a32;*/
    }

    .upload-img-ercode_cont_head_close {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 20px;
        cursor: pointer;
    }
    .upload-img-ercode_cont_url2{
        width: 100%;
        height: 20px;
        box-sizing: border-box;
        padding: 0 10px;
        position: relative;
        overflow: hidden;
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .upload-img-ercode_cont_url {
        width: 100%;
        height: 250px;
        box-sizing: border-box;
        padding: 0 10px;
        position: relative;
        overflow: hidden;
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .code_title {
        font-size: 18px;
        font-weight: bolder;
        padding:30px 0 20px 0px;
        color: black;
        vertical-align: middle;
    }
    .code_title img {
        width: 25px;
            height: 25px;
            margin-right: 5px;
            vertical-align: middle;
    }
    .upload-img-ercode_cont_code_tip {
        position: absolute;
        top: 185px;
        right: 8px;
    }
</style>

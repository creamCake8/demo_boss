<template>
    <div class="financial_wrap">
        <div class="page-addlncident" >
            <img src=""/>
            <div >{{ bjFlag ? '编辑' : '增加'}}事件报告</div>
        </div>
        <div class="examin_cont_search">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="121px" class="demo-ruleForm"
                label-position="right">
                <el-form-item label="事件发生单位：" required>
                    <div style='display: flex;margin-bottom: -20px'>
                        <el-form-item prop="org_id">
                            <el-select @change="getObject()" style="margin-right: 20px" v-model="ruleForm.org_id"
                                placeholder="请选择公司">
                                <el-option v-for="(item, index) in companyList" :label="item.orgName"
                                    :value="item.orgId" :key="index">{{ item.orgName }}
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="pro_id">
                            <el-select v-model="ruleForm.pro_id" placeholder="请选择项目">
                                <el-option v-for="(item, index) in objectList" :label="item.projectName"
                                    :value="item.projectId" :key="index">{{ item.projectName }}
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <span class="tipSpan">
                            说明：不选择项目代表这次事件发生在总公司或分公司
                        </span>
                    </div>
                </el-form-item>

                <el-form-item label="报告类型：" prop="report_type">
                    <el-select v-model="ruleForm.report_type" placeholder="请选择状态">
                        <el-option label="事件报告" value="1"></el-option>
                        <el-option label="事故报告" value="2"></el-option>
                    </el-select>
                    <div>
                        <div style="color: #999;display: flex">
                            <div style="color: orange">温馨提示：</div>
                            <div>
                                <div>1、事件是一个汉语词汇,意思是比较重大、对一定的人群会产生一定影响的事情。</div>
                                <div style='margin-top: -10px'>2、事故（Accident），一般是指造成死亡、疾病、伤害、损坏或者其他损失的意外情况。</div>
                            </div>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="事件名称：" prop="report_name">
                    <el-input style="width: 400px" placeholder="请输入报告名称" v-model="ruleForm.report_name"></el-input>
                </el-form-item>

                <el-form-item label="发生时间：" prop="report_time">
                    <el-date-picker v-model="ruleForm.report_time" align="right" type="datetime"
                        value-format="yyyy-MM-dd HH:mm" :picker-options="pickerOptions" placeholder="选择日期"
                        popper-class="date-input-small"></el-date-picker>
                </el-form-item>

                <el-form-item label="事情经过：" prop="report_reason">
                    <el-input v-model="ruleForm.report_reason" placeholder="请写明事件发生的经过" style="width: 47.5%"
                        type="textarea" maxlength="400" show-word-limit
                        :autosize="{ minRows: 3, maxRows: 3 }"></el-input>
                </el-form-item>

                <el-form-item label="事情经过图片：">
                    <div>
                        <span style="color: #d9d9d9">提示：请您上传JPG格式的图片 请上传不大于2兆的图片 最多可上传3张图片</span>
                    </div>
                    <div style="display: flex">
                        <el-upload :class="{ hidden: imgArr.length >= 3 }" action="#" :http-request="uploadImage"
                            :on-success="upload" :file-list="imgesList" :limit="3" list-type="picture-card"
                            :auto-upload="true" :before-upload="beforeAvatarUpload" :before-remove="handleRemove"
                            ref="my-upload">
                            <i class="el-icon-plus" ></i>
                        </el-upload>
                        <div style="margin-left: 14px; margin-top: 55px" v-show="imgArr.length < 3">
                            <app-upload-img @appUploadImgInfo="getNodeImageInfo" img-name="imgArr" upload-count="3"
                                :already-img-list="imgArr.length" />
                        </div>
                    </div>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="" />
                    </el-dialog>
                </el-form-item>

                <el-form-item label="上传视频：">
                    <el-upload accept=".MP4" :class="{ hidden: imgArr.length === 3 }" class="avatar-uploader" action="#"
                        :on-success="onSuccessVideo" :file-list="videoArr" :limit="3" :auto-upload="false"
                        :show-file-list="false" :before-remove="videoRemove" :on-change="bookPicUpload">
                        <div class="up_shang" v-if="videoArr.length < 3">
                            <img style="width: 23px; height: 23px; margin-top: 5px; margin-right: 5px"
                                src="../../../assets/img/raoshexiangjixuanzhuan.png" />
                            <span style="font-weight: bold; color: blue">点击上传视频</span>
                            <span>（限MP4、FLV格式文件大小不超过50MB）</span>
                        </div>
                    </el-upload>
                    <div v-if="videoArr.length != 0">
                        <div v-for="(item, index) in videoArr" class='video' :key="index">
                            <video v-bind:src="item" class="avatar video-avatar" controls="controls"></video>
                            <div>
                                <span @click='videoRemove(item)'>
                                    删除
                                </span>
                            </div>
                        </div>

                    </div>
                </el-form-item>

                <el-form-item label="处理人姓名：">
                    <el-input style="width: 210px" placeholder="请输入处理此事件当事人姓名" v-model="ruleForm.dispose_people"
                        v-number="8"></el-input>
                </el-form-item>

                <el-form-item class="mt-20 outsourcing-remark" label="处理过程：" prop="dispose_reason">
                    <el-input v-model="ruleForm.dispose_reason" placeholder="请写明处理此事件的经过" style="width: 47.5%"
                        type="textarea" maxlength="400" show-word-limit
                        :autosize="{ minRows: 3, maxRows: 3 }"></el-input>
                </el-form-item>

                <el-form-item label="责任人姓名：">
                    <el-input style="width: 270px" placeholder="请输入此次事件需要承担的责任人姓名"
                        v-model="ruleForm.responsibility_people" v-number="8"></el-input>
                </el-form-item>

                <el-form-item class="mt-20 outsourcing-remark" label="反思经验：" prop="reflection_on_experience">
                    <el-input v-model="ruleForm.reflection_on_experience" placeholder="请填写经此事发生后,总结,反思工作当中的不足及改进方案"
                        style="width: 47.5%" type="textarea" maxlength="400" show-word-limit
                        :autosize="{ minRows: 3, maxRows: 3 }"></el-input>
                </el-form-item>

                <el-form-item style="margin-left: 400px">
                    <el-button type="primary" :loading='butloading' @click="submitForm()"
                        style="transform: translateX(-215px)">{{ bjFlag ? '修改' : '提交'}}报告</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { getCookie } from '@/utils/cookie';
import { showMessage } from '@/utils/message';
import AppUploadImg from '../component/appUploadImg';
import { getPostTokenFn } from '@/utils/util';

export default {
    name: 'addIncident',
    components: {
        AppUploadImg
    },
    data() {
        return {
            bjFlag:false,
            loading:null,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 3600 * 1000 * 24 * 183 || time.getTime() > Date.now(); //选择时间范围   x < time < x
                }
            },
            dialogVisible: false,
            dialogImageUrl: '',
            ruleForm: {
                org_id: null, //公司id
                pro_id: null, //项目id
                user_id: null, //发布人
                report_type: null, //报告类型
                report_name: null, //报告名称
                report_time: null, //发生时间
                report_reason: null, //事件经过
                dispose_people: null, //处理人
                dispose_reason: null, //处理经过
                responsibility_people: null, //责任人
                reflection_on_experience: null, //反思经验
                report_image: null, //事情经过图片
                report_video: null //事件经过视频
            },
            rules: {
                org_id: [{ required: true, message: '请选择公司', trigger: 'change' }],
                pro_id: [{ required: true, message: '请选择公司', trigger: 'change' }],
                project_id: [{ required: true, message: '请选择项目', trigger: 'change' }],
                report_type: [{ required: true, message: '请选择报告类型', trigger: 'change' }],
                report_name: [{ required: true, message: '请输入报告名称', trigger: 'change' }],
                report_time: [{ required: true, message: '请选择发生时间', trigger: 'change' }],
                report_reason: [{ required: true, message: '请输入事情经过', trigger: 'change' }],
                dispose_reason: [{ required: true, message: '请输入处理过程', trigger: 'change' }],
                reflection_on_experience: [{ required: true, message: '请输入反思经验', trigger: 'change' }]
            },
            companyList: [], //公司
            objectList: [], //项目
            nameUser: null,
            imgesList: [],
            phoneUpload: false,
            imgArr: [],
            videoArr: [],
            butloading: false,
        };
    },
    created() {
        
    },
    mounted() {
        let {type, cont} = this.$route.params;
        if (type == 'edit') {
            this.bjFlag = true;
            this.echoData(cont) 
        }
        this.getCompany();
        this.nameUser = JSON.parse(getCookie('userdata')).userId;
    },
    methods: {
        echoData(data) {
            this.ruleForm = data;
            this.ruleForm.report_type += "";
            this.getObject();
        },
        async getPostTokenFn() {
            return getPostTokenFn()
        },
        //获取子页面图片的值
        getNodeImageInfo(nodeImgInfo) {
            if (nodeImgInfo) {
                let imgName = nodeImgInfo.imgName; 
                let nowFileList = nodeImgInfo.nowFileList; 
                let nowImgList = nodeImgInfo.nowImgList; 
                if (imgName == 'imgArr') {
                    this.imgArr = nowImgList;
                    this.imgesList = nowFileList;
                }
            }
        },
        //获取公司ID和公司名称
        getCompany() {
            //查询公司接口
            this.$https.a('', {}).then((res) => {
                if (res.status === 200) {
                    this.companyList = res.data.allList;
                    for (let i = 0; i < this.companyList.length; i++) {
                        if (this.companyList[i].orgId === JSON.parse(getCookie('setOrgId'))) {
                            this.companyList[i].orgName = '总公司';
                        }
                    }
                } else {
                    this.$message.info('网络错误');
                }
            });
        },
        // 获取项目
        getObject() {
            this.$https
                .b('', {
                    org_id: this.ruleForm.org_id,
                    user_id: JSON.parse(getCookie('userdata')).userId
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.objectList = res.data.datalist;
                    } else {
                        this.$message.info('网络错误');
                    }
                });
            
        },
        //保存按钮
        async submitForm() {
            let flag = true;
            await getPostTokenFn()
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    flag = true;
                } else {
                    flag = false;
                    return false;
                }
            });
            if (flag) {
                this.$FreeUse({
                    dialogVisible: true,
                    title: this.bjFlag ? '编辑报告' : '提交报告',
                    content: this.bjFlag ? '是否确认编辑事件/事故报告？' : '是否确认提交事件/事故报告？',
                    type: 'confirm', // 确认按钮confirm 成功success 失败error 警告warning
                    okText: this.bjFlag ? '确认提交' :'是', // 确认按钮字
                    cancelText: this.bjFlag ? '返回编辑' : '否' // 取消按钮字
                }).then((instance) => {
                    this.ruleForm.user_id = this.nameUser;
                    this.ruleForm.report_image = this.imgArr.toString(',');
                    this.ruleForm.report_video = this.videoArr.toString(',');
                    this.butloading = true
                    //编辑
                    if(this.bjFlag){
                        this.$https
                        .c('', this.ruleForm)
                        .then((res) => {
                            //防重提重置()
                            getPostTokenFn()
                            this.butloading = false
                            
                        }).catch(err => {
                            showMessage(err.msg, 'error')
                        })
                    }else {   //新增
                        this.$https
                        .d('', this.ruleForm)
                        .then((res) => {
                            //防重提重置()
                            getPostTokenFn()
                            this.butloading = false
                            if (res.code == 0) {
                                showMessage("新增成功", 'success')
                                this.clearData();
                                this.$router.push({ path: '/abc' });
                            } else {
                                this.bulletFrames(res.msg, 'error');
                            }
                        }).catch(err => {
                            showMessage(err.msg, 'error')
                        })
                    }
                    
                }).catch(() => {
                    //防重提重置()
                    getPostTokenFn()
                    this.butloading = false
                });
            } else {

            }
        },
        bulletFrame(content, type) {
            this.$FreeUse({
                dialogVisible: true,
                title: '提交报告成功',
                content: content,
                type: type, // 确认按钮confirm  成功success  失败error  警告warning
                okText: '前往列表', // 确认按钮字
                cancelText: '继续添加' // 取消按钮字
            })
                .then((instance) => {
                    //点击确定之后的处理
                    this.clearData();
                    this.$router.push({ path: '/abc' });
                })
                .catch((data) => {
                    //点击取消之后的处理
                    dialogVisible: false;
                });
        },
        bulletFrames(content, type) {
            this.$FreeUse({
                dialogVisible: true,
                title: '提交报告失败',
                content: content,
                type: type, // 确认按钮confirm  成功success  失败error  警告warning
                okText: '继续编辑', // 确认按钮字
                cancelText: '重新添加' // 取消按钮字
            })
                .then((instance) => {
                    //点击确定之后的处理
                    dialogVisible: false;
                })
                .catch((data) => {
                    //点击取消之后的处理
                    dialogVisible: false;
                    
                });
        },

        //清除数据
        clearData() {
            this.ruleForm = {
                org_id: null, //公司id
                pro_id: null, //项目id
                report_type: null, //报告类型
                report_name: null, //报告名称
                report_time: null, //发生时间
                report_reason: null, //事件经过
                dispose_people: null, //处理人
                dispose_reason: null, //处理经过
                responsibility_people: null, //责任人
                reflection_on_experience: null, //反思经验
                report_image: null,
                report_video: null
            };
            this.$refs.ruleForm.resetFields();
            this.imgArr = [];  //phone上传图片数组
            this.imgesList = [];  //pc上传图片数组
            this.videoArr = [];     //视频
        },
        // 上传图片
        uploadImage(data) {
            let self = this;
            this.$UpPic.uploadPic('2', data.file, self, (url) => {
                if (url != '') {
                    data.onSuccess(url);
                } else {
                    data.onError('上传失败');
                }
            });
        },

        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                showMessage("上传头像图片只能是 JPG、jpeg、 png格式!", "error");
            }
            if (!isLt2M) {
                showMessage("传头像图片大小不能超过 2MB!", "error");
            }
            return isJPG && isLt2M;
        },
        handleRemove(file, fileList) {
            const index = this.imgArr.indexOf(file.response);
            this.imgArr.splice(index, 1);
            this.imgesList.splice(index, 1);
        },
        upload(response, file, fileList) {
            this.imgArr.push(response);
            this.imgesList.push(response);
        },
        //图片上传成功
        onSuccess(url) {
            this.imgArr.push(url);
            this.ruleForm.report_image = url;
        },
        //上传自定义
        bookPicUpload(data) {
            this.loading = this.$loading({
                lock: true,
                text: '视频上传中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.imgError = null;
            let self = this;
            var reader = new FileReader();
            reader.readAsDataURL(data.raw);
            reader.onload = () => {
                self.$https
                    .e('', {
                        file: reader.result
                    })
                    .then((res) => {
                        if (res != '') {
                            this.loading.close();
                            this.$message.success(res.msg);
                            this.onSuccessVideo(res.data);
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
            };
        },
        onSuccessVideo(url) {
            this.ruleForm.report_video = url;
            this.videoArr.push(url);
        },
        videoRemove(file, fileList) {
            const index = this.videoArr.indexOf(file)
            this.videoArr.splice(index, 1);
        },
        videoImage(data) {
            let self = this;
            this.$UpPic.uploadPic('2', data.file, self, (url) => {
                if (url != '') {
                    data.videoSuccess(url);
                } else {
                    data.onError('上传失败');
                }
            });
        },
        //视频上传成功
        videoSuccess(url) {
            this.videoArr.push(url);
            this.ruleForm.report_video = url;
        }
    },
};
</script>
<style lang="less" scoped>
.video {
    display: flex;

    >div {
        margin-left: 20px;
        line-height: 130px;

        span {
            cursor: pointer;

        }

        span:hover {
            color: red;
            border-bottom: 1px dashed red;
        }
    }
}

.avatar {
    width: 200px;
    height: 130px;
    display: block;
}

.hidden /deep/.el-upload--picture-card {
    visibility: hidden;
}

.ercode_box {
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

.ercode_cont {
    width: 500px;
    height: 500px;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 4px;
}

.ercode_cont_head {
    width: 100%;
    height: 45px;
    border-bottom: 2px solid #eee;
    line-height: 45px;
    text-indent: 20px;
    position: relative;
    color: #fff;
    background: #f98a32;
}

.ercode_cont_head_close {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 20px;
    cursor: pointer;
}

.ercode_cont_url {
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

.costpay {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
}

.el-input {
    width: 186px;
}

.financial_wrap {
    padding: 20px 40px;
}

.el-upload__tip {
    float: right;
    margin-right: 900px;
    margin-top: -5px;
}

.addBtn {
    margin-left: 10px;
}

.company {
    float: left;
}

.project {
    float: left;
    margin-left: -110px;
}

.areacode {
    float: left;
}

.buildingnumber {
    float: left;
    margin-left: -110px;
}

.unit {
    float: left;
    margin-left: -110px;
}

.housenumber {
    float: left;
    margin-left: -110px;
}

.outsourcing {
    float: left;
}

.unit select {
    width: 100px !important;
}

.el-select>.el-input {
    width: 168px;
}

.el-cascader .el-input {
    width: 186px;
}

.ercode_cont_url {
    width: 95%;
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

.page-addlncident {
    margin-bottom: 15px;
    display: flex;
    &::before {
        content: '';
    position: absolute;
    width: 95px;
    height: 4px;
    background: linear-gradient(270deg, #ccddfa 0%, #7fabf8 100%);
    border-radius: 3px;
    top: 51px;
    left: 95px;
    }
    img {
        width: 31px;
        height: 34px;
        margin-top: -3px;
        margin-left: -4px;
    }
    div {
        margin-left: 8px;
        font-weight: bold;
    }
}

.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
    margin-bottom: 16px;
}

.tipSpan {
    margin-left: 20px;
}
</style>

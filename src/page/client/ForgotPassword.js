import React,{useEffect,useState} from 'react';
import { useSelector} from 'react-redux';
import Spinner from '../../elements/spinner';
import * as FetchAPI from '../../util/fetchApi';
import {Form,Input,Button,message} from 'antd';


export default function ForgotPassword(){
    const [showContent, setshowContent] = useState(false);
    const [dataUser, setdataUser] = useState();
    const [loadingBtn, setloadingBtn] = useState(false);
    const [formInfor] = Form.useForm();

    
    const handleForgotPassword = async()=>{
        setloadingBtn(true)
        if (dataUser.email !== null){

            const res = await FetchAPI.postDataAPI("/user/forgot-password",{email:dataUser.email});
            if(res.msg){
                if(res.msg==="Email không tồn tại"){
                    setTimeout(()=>{
                        message.error("Email không tồn tại !")
                        setloadingBtn(false)
                    },500)
                  
                }else if(res.msg === "Success"){
                    setTimeout(()=>{
                            message.success("Mật khẩu mới đã được gửi tới email của bạn !")
                            setloadingBtn(false)
                        },500)   
                }
            }
        }
        else {
            alert("Xảy ra lỗi!")
            setloadingBtn(false)
        }   
    }
    const FormForgot = ()=>(
        <Form
            form={formInfor}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            style={{paddingTop:20}}
            onFinish={handleForgotPassword}
          
        >
            <Form.Item
                label="Your Email"
                name="email"
                rules={[{ required: true, message: 'Nhập địa chỉ email'}]}
            >
                <Input 
                    placeholder="Nhập Email"
                    value={dataUser?.email}
                    onChange= {(e)=>setdataUser({...dataUser,email:e.target.value})}
                />
            </Form.Item>
           
            <Form.Item style={{ paddingTop:20 }}  wrapperCol={{ span: 12, offset: 10 }}>
                <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
                    OK
                </Button>
            </Form.Item>
        </Form>
    )
    return(
        <div style={{ minHeight:450}}>
                <div>
                    <div style={{ padding:"20px 20px" }}>
                       Quên mật khẩu....
                        {FormForgot()}
                    </div>
                </div>
        </div>
    )
}
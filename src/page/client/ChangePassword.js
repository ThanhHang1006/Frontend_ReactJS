import React,{useEffect,useState} from 'react';
import { useSelector} from 'react-redux';
import Spinner from '../../elements/spinner';
import * as FetchAPI from '../../util/fetchApi';
import {Form,Input,Button,message} from 'antd';

export default function ChangePassword(){
    const [showContent, setshowContent] = useState(false);
    const currentUser = useSelector(state=>state.userReducer.currentUser);
    const [dataUser, setdataUser] = useState();
    const [loadingBtn, setloadingBtn] = useState(false);
    const [formInfor] = Form.useForm();
    useEffect(()=>{

        if(!currentUser.id){
            setshowContent(true)
        }else{
            setdataUser({...dataUser,id:currentUser.id})
        }
    },[currentUser])
    
    const handleChangePassword = async()=>{
        setloadingBtn(true)
        if (dataUser.newPassword === dataUser.newPasswordAccept){

            const res = await FetchAPI.postDataAPI("/user/change-password",{data:dataUser});
            if(res.msg){
                if(res.msg==="Success"){
                    setTimeout(()=>{
                        message.success("Cập nhật thành công!")
                        setloadingBtn(false)
                    },500)
                  
                }else if(res.msg === "Incorrect"){
                    setTimeout(()=>{
                            message.error("Mật khẩu hiện tại không chính xác !")
                            setloadingBtn(false)
                        },500)   
                }
            }
        }
        else {
            alert("Mật khẩu xác nhận không khớp!")
            setloadingBtn(false)
        }   
    }
    const InforAccount = ()=>(
        <Form
            form={formInfor}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            style={{paddingTop:20}}
            onFinish={handleChangePassword}
          
        >
            <Form.Item
                label="Mật khẩu hiện tại"
                name="password"
                rules={[{ required: true, message: 'Nhập mật khẩu hiện tại'}]}
            >
                <Input 
                    placeholder="Nhập mật khẩu hiện tại"
                    value={dataUser?.password}
                    onChange= {(e)=>setdataUser({...dataUser,password:e.target.value})}
                />
            </Form.Item>
            <Form.Item
                label="Mật khẩu mới"
                name="new-password"
                rules={[{ required: true, message: 'Nhập mật khẩu mới'}]}

            >
                <Input 
                    placeholder="Nhập mật khẩu mới"
                    value={dataUser?.newPassword}
                    onChange= {(e)=>setdataUser({...dataUser,newPassword:e.target.value})}
                />
            </Form.Item>
            <Form.Item
                label="Nhập lại mật khẩu mới"
                name = "phone"
                rules={[{ required: true, message: 'Nhập lại mật khẩu mới'}]}
            >
                <Input
                    placeholder="Nhập lại mật khẩu mới"
                    value={dataUser?.newPasswordAccept}
                    onChange= {(e)=>setdataUser({...dataUser,newPasswordAccept:e.target.value})}
                />
            </Form.Item>
            <Form.Item style={{ paddingTop:20 }}  wrapperCol={{ span: 12, offset: 10 }}>
                <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
                   Thay đổi mật khẩu
                </Button>
            </Form.Item>
        </Form>
    )
    return(
        <div style={{ minHeight:450 }}>
                <div>
                    {currentUser.id==undefined ?
                    <span style={{ margin:"20px 10px" }}>
                       Vui lòng đăng nhập để xem thông tin...
                    </span>
                    :
                    <div style={{ padding:"20px 20px" }}>
                        Cập nhật mật khẩu của bạn
                        {InforAccount()}
                    </div>
                
                    }
                </div>
        </div>
    )
}
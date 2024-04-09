import React,{useEffect,useRef,useState} from 'react';
import {Card,Form,Input,Button,Col,message} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import * as FetchAPI from '../../util/fetchApi';
import { useHistory } from 'react-router-dom';
export default function Admin(){
    const [username, setusername] = useState();
    const [password, setpassword] = useState();
    const [processLoading, setprocessLoading] = useState(false);
    const [formLogin] = Form.useForm();
    const history = useHistory();
    const elementFooter = useRef() ;
    useEffect(()=>{
        document.getElementsByClassName("header-nav")[0].style.display = 'none';
        document.getElementsByClassName("footer")[0].style.display = 'none';
       
    },[])
    const handleLogin = async() =>{
        setprocessLoading(true);
        const data = {"username":username,"password":password};
        const res = await FetchAPI.postDataAPI("/user/login",data);
        console.log(res);
      
        if(res.msg==="Invalid account"){
            message.error("Account name does not exist");
            setprocessLoading(false);
        }else if(res.msg ==="Incorrect password"){
            message.error("Incorrect password");
            setprocessLoading(false);
        }else if(res.msg==="Success"){
            finish(res.token);
        }
       
    }
    const finish = async(token)=>{
        const data = {"token":token};
        const res = await FetchAPI.postDataAPI("/user/getUser",data);
        if(res[0].ruler===1){
            message.success("Đăng nhập thành công !");
            formLogin.setFieldsValue({username:"",password:""})
            setusername("");
            setpassword("");
            localStorage.setItem("token_admin",token);
            history.push('/admin');
            setprocessLoading(false);
        }else{
            message.error("Vui lòng đăng nhập bằng tài khoản admin !!!");
            setprocessLoading(false);
        }
       
    }
    const Login = ()=>(
        <Form form={formLogin} onFinish={handleLogin} >
        <p style={{ fontSize:16,fontWeight:'bold' }}>TÊN ĐĂNG NHẬP *</p>
        <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please enter your account name!' }]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Vui lòng nhập tên tài khoản"
                    value={username}
                    defaultValue={username}
                    onChange= {(e)=>setusername(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <p style={{ fontSize:16,fontWeight:'bold' }}>MẬT KHẨU *</p>
            <Form.Item
                name="password"
                rules={[
                    { required: true, message: 'Please enter a password!' },
                    {min:3,message:'Mật khẩu tối thiểu 3 kí tự'}
                ]}
                style={{width:'80%'}}
            >
                <Input.Password
                    placeholder="Nhập mật khẩu"
                    value={password}
                    defaultValue={password}
                    onChange= {(e)=>setpassword(e.target.value)}
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item style={{ padding:"10px 0px" }} >
                <Button htmlType="submit" type="primary" danger style={{ height:45,borderRadius:8 }} loading={processLoading}>
                    ĐĂNG NHẬP
                </Button>
            </Form.Item>
            </Form>
    )
    return(
        <div 
            style={{ minHeight:window.innerHeight,justifyContent:'center',alignItems:'center',display:'flex' }}
        >
        <Col xl={12} xs={24} style={{ justifyContent:'center',display:'flex' }}>
        <Card style={{ width:'80%',borderRadius:10 }} title="ĐĂNG NHẬP BẰNG TÀI KHOẢN NGƯỜI QUẢN LÝ" bordered>
            {Login()}
        </Card>
        </Col>    
        </div>
    )
}
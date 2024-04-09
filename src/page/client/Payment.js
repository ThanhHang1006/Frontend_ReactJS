import React ,{useEffect,useState}from 'react';
import {Row,Col,Form,Input,Button,Table,Radio,Space,Result } from "antd";
import { useSelector,useDispatch } from 'react-redux';
import {getPriceVND} from '../../contain/getPriceVND';
import {Link,useLocation} from 'react-router-dom';
import * as FetchAPI from '../../util/fetchApi';
import {updateCartCurrent} from '../../contain/updateQuanityCart';
import Paypal from '../../elements/Paypal';

export default function Payment (props){
    const [name, setName] = useState("");
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [address, setAddress] = useState();
    const [message, setMessage] = useState();
    const [totalTmp, setTotalTmp] = useState(0);
    const [idUser, setIdUser] = useState("");
    const [promoprice, setPromoprice] = useState(0);
    const dataCart = useSelector(state=>state.productReducer.cart);
    const datauser = useSelector(state=>state.userReducer.currentUser);
    const [isSuccess,setIsSuccess] = useState(false)
    const [dataPayment, setDataPayment] = useState();

    const [showUser, setshowUser] = useState(false);
    const [methodPayment, setMethodPayment] = useState(2);
    const [form] = Form.useForm();
    const [paymentSucess, setPaymentSucess] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const receivedDataSale = location.state?.data;
    const typeBuyNow = location.state?.type;
    const dataBuyNow = location.state?.data_buynow;

    
 


    useEffect(()=>{
        setPaymentSucess(false)
        setshowUser(false)
        if(receivedDataSale  !=undefined){
            setPromoprice(receivedDataSale.cost_sale)
        }
        if(dataCart.length!==undefined){
            let total = 0;
            dataCart.map((e,index)=>{
                if(e[0].promotional===null){
                    total+=e[0].price*e.quanity
                }else{
                    total+=e[0].promotional*e.quanity
                }
                if(index===dataCart.length-1){
                    setTotalTmp(total)
                }
                return false
            })
        }  
        
       
        getUser(); 
    
    },[datauser])
    const getUser = async()=>{
        if(datauser.name!==undefined){
            const res = await FetchAPI.postDataAPI("/user/getInforUser",{"idUser":datauser.id})
            const user = res[0];
            form.setFieldsValue({name:user?.name,email:user?.email,address:user?.address,phone:user?.phone})
            setName(user?.name);
            setEmail(user?.email);
            setIdUser(user?.id);
            setAddress(user?.address);
            setPhone(user?.phone);
            setshowUser(true)
        }else{  
            form.setFieldsValue({name:"",email:"",address:"",phone:""})
            setName("");
            setEmail("");
            setIdUser("");
            setAddress("");
            setPhone("");
            setshowUser(true);
        }
    }
    const handleValidationOrder = ()=>{
        if(methodPayment===2){
            handleOrder();
        }
        // else{
        //     console.log("Pay later")
        // }
    }
    useEffect(() => {
      
        
    
        const fetchData = async () => {
            try {
                const data = await getOrderInformation();
                setDataPayment(data);
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, [methodPayment, datauser]);
    const getPricePayment = () =>{
        let total_payment =0 
        if (typeBuyNow){
            total_payment = dataBuyNow[0].price * dataBuyNow[0].quanity
        } else {
            total_payment = totalTmp;
        }
       
        let shipfee = 10;
        if(receivedDataSale != undefined){
          
            if (receivedDataSale.type == 0) {
                shipfee = shipfee - receivedDataSale.cost_sale;
                shipfee = shipfee > 0 ? shipfee : 0;
            } 
            else {
                total_payment = total_payment- receivedDataSale.cost_sale
            }
        }
        total_payment = total_payment + shipfee;
        return total_payment;
    }
    const getOrderInformation =  ()=>{
        let saleID = null;
        // let total_payment = totalTmp;
        if(receivedDataSale != undefined){
            saleID = receivedDataSale.id;
        }
        let total_payment = getPricePayment()
        const customDatabuynow =  typeBuyNow && [
            {
              0: { ...dataBuyNow[0] },
              quanity: dataBuyNow[0].quanity,
              option: dataBuyNow[0].option,
              key: 0, status: false
            }
          ]

        const data = {
            "name": name,
            "address": address,
            "email" : email,
            "phone" : phone,
            "total_price":total_payment,
            "message":message,
            "dataProduct": typeBuyNow ? customDatabuynow  : dataCart,
            "methodPayment":methodPayment,
            "user": idUser,
            "idSale":saleID,
            "payment_status": 0
        }
        return data;
    }
    const handleOrder = async()=>{
        const data = getOrderInformation();
        console.log({data});
        const res = await FetchAPI.postDataAPI("/order/addBill",data);
        if(res.msg){
            if(res.msg==="success"){
                localStorage.removeItem("cart");
                updateCartCurrent(dispatch);
                setPaymentSucess(true)
            }else{
                console.log(res.msg)
            }
        }
    }
    const columns  = [
        {
            title:"Sản phẩm",
            key:'name',
            render: record=>{
                return (
                    <>
                    {
                        typeBuyNow ? 
                        <Row>
                            <span>{record.id+" - ( "+record.option+" )"}</span>
                            <span style={{ fontWeight:'bold',paddingLeft:20 }}>X {record.quanity}</span>
                        </Row>
                        : 
                        <Row>
                            <span>{record[0].name+" - ( "+record.option+" )"}</span>
                            <span style={{ fontWeight:'bold',paddingLeft:20 }}>X {record.quanity}</span>
                        </Row>
                    }
                    </>
                    
                    // <Row>
                    //     <span>{record[0].name+" - ( "+record.option+" )"}</span>
                    //     <span style={{ fontWeight:'bold',paddingLeft:20 }}>X {record.quanity}</span>
                    // </Row>
                )
            }
        },
        {
            title: "Tạm tính",
            dataIndex: "",
            key: 'temp',
            render: (record) => (
                <>
                    {
                        typeBuyNow ?
                            <span>{getPriceVND(record.price * record.quanity) + " VNĐ"}</span>
                            :
                            (record[0].promotional === null) ?
                                <span>{getPriceVND(record[0].price * record.quanity) + " VNĐ"}</span>
                                :
                                <span>{getPriceVND(record[0].promotional * record.quanity) + " VNĐ"}</span>
                    }
                </>
            )
        }
        
    ]
    const InformationPayment = ()=>(
       <div style={{ padding:20 }}>
           <div style={{ display:'flex',flexDirection:'column', marginBottom: 10 }}>
            {receivedDataSale  ===undefined &&
                <span >Do you have a promotional code ?<Link to="/cart"> Quay lạik</Link> giỏ hàng để nhận khuyến mãi!</span>
            }
           </div>
           <h2 style={{fontWeight: "bold"}}>THÔNG TIN THANH TOÁN</h2>
            <Form.Item
                name="name"
                label="Họ và tên"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên !' }]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Nhập họ và tên"
                    value={name}
                    defaultValue={name}
                    onChange= {(e)=>setName(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item
                name="address"
                label="Địa chỉ"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                rules={[{ required: true, message: 'Nhập địa chỉ !' }]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Nhập địa chỉ"
                    value={address}
                    defaultValue={address}
                    onChange= {(e)=>setAddress(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item
                name="phone"
                label="Số điện thoại"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                rules={[{ required: true, message: 'Nhập số điện thoại !' }]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    defaultValue={phone}
                    onChange= {(e)=>setPhone(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                rules={[
                    { type: 'email',message:"Vui lòng nhập đúng Email"},
                    {required:true,message:"Vui lòng điền Email!"},
                ]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="nhập địa chỉ email của bạn"
                    value={email}
                    defaultValue={email}
                    onChange= {(e)=>setEmail(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                    disabled={datauser.id!==undefined}
                />
            </Form.Item>
            <Form.Item
                name= 'introduction'
                label="Ghi chú"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                style={{width:'80%'}}
            >
                <Input.TextArea
                    placeholder="Các ghi chú về đơn hàng, ví dụ như thời gian hoặc hướng dẫn địa điểm giao hàng chi tiết hơn."
                    value={message}
                    defaultValue={message}
                    onChange= {(e)=>setMessage(e.target.value)}
                    maxLength={200}
                    style={{height:200}}
                />
            </Form.Item>
       </div>
    )
 
    const Payment = ()=>(
        <div style={{ border:"2px solid black",padding:20 }}>
            <h2 style={{fontWeight: "bold"}}>ĐƠN HÀNG CỦA BẠN</h2>
            <Table 
                dataSource={typeBuyNow ?  dataBuyNow : dataCart} 
                columns={columns} 
                pagination={false}
                summary={()=>(
                    <Table.Summary>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Provisional</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                                {
                                    typeBuyNow ? dataBuyNow[0].price * dataBuyNow[0].quanity  : getPriceVND(totalTmp)+" VNĐ"
                                }
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                        {receivedDataSale !== undefined &&
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Promotional code</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                                {"-"+getPriceVND(promoprice)+" VNĐ"}
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                        }
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Phí vận chuyển</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                                {getPriceVND(10)+" $"}
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Tổng</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                            {
                                getPriceVND(getPricePayment())+" VNĐ"
                            }
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
            )}/>

            <Radio.Group  
                style={{paddingTop:20}}
                value={methodPayment}
                onChange= {(e)=>setMethodPayment(e.target.value)}
                horizontal
            >
            <Space direction="vertical">
                <Radio value={2}><b>Thanh toán tiền mặt khi giao hàng</b><br/>
                    {methodPayment===2 ? <span>Thanh toán tiền mặt khi giao hàng</span>:null}
                 </Radio>
                <Radio value={1}
                ><b>chuyển khoản ngân hàng</b> <br/>
                </Radio>
            </Space> 
            </Radio.Group>
            {methodPayment===1 && 
                    <Paypal
                        style= {{ marginTop : 20 }}  
                        payload={dataPayment}
                        setIsSuccess={setIsSuccess}
                        amount={getPricePayment()}
                    />

            }
            
            <Form.Item style={{ paddingTop:20 }}>
                <Button type="primary" htmlType="submit" danger style={{ height:60,width:120,fontWeight:'bold' }} onClick={()=>console.log(email)}>
                  Order
                </Button>
            </Form.Item>
            <div >
            <span >chuyển khoản ngân hàng</span>
            </div>
        </div>
    )
    const Content = ()=>(
        <div>
        {dataCart.length!==undefined || typeBuyNow ?
            <div>
            {showUser &&
            <Form 
                style={{ padding:"10px 40px" }} 
                onFinish={handleValidationOrder}
                form={form}
                initialValues={{
                    name: name,
                    email: email
                }}
                
            >
                <Row>
                    <Col xl={14} xs={24} >
                        {InformationPayment()}
                    </Col >
                    <Col xl={10} xs={24} >
                        {Payment()}
                    </Col>
                </Row>
            </Form>
            }
            </div>
            :
            <div style={{ height:450,padding:"20px 40px" }}>
            <span style={{ fontWeight:'bold' }}> Vui lòng thêm sản phẩm vào giỏ hàng để thực hiện chức năng này...</span>
            <div style={{ display:'flex',flex:1,justifyContent:'center',paddingTop:"10%" }}>
                        <Button style={{ height:50 }} type="primary" danger>
                            <Link to="/">
                            Quay trở lại Cửa hàng
                            </Link>
                        </Button>
                    </div>
            </div>
        }   
        </div>
    )
    return(
        <div>
            {paymentSucess ? 
            <Result
                style={{ height:450,paddingTop:50 }}
                status="success"
                title="Đặt hàng thành công !"
                subTitle="Theo dõi đơn hàng của bạn?"
                extra={[
                <Button type="primary">
                    <Link to="/">
                    Tiếp tục đặt mua sản phẩm
                    </Link>
                </Button>,
                <Button >
                    <Link to="/billfollow">
                    Theo dõi đơn hàng
                    </Link>
                </Button>,
            ]}
          />
            :
            <div>
                {Content()}
            </div>
            }
        </div>
        
    )
} 
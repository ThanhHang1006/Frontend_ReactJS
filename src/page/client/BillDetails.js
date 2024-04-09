import React ,{useEffect,useState}from 'react'; 
import { PageHeader,Table,Row,Col,Space,Card ,Button,message,Modal} from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import {getPriceVND} from '../../contain/getPriceVND';
import Spinner from '../../elements/spinner';
import { useSelector } from 'react-redux';
import { useParams,useHistory } from 'react-router-dom';
import ModalReviewProduct from '../../elements/ModalReviewProduct';
import moment from 'moment';

export default function BillDetails(){
    const history = useHistory();
    const [dataProduct, setdataProduct] = useState();
    const [dataBill, setdataBill] = useState();
    const [totalTmp, settotalTmp] = useState(0);
    const [showContent, setshowContent] = useState(false);
    const [promotionprice, setpromotionprice] = useState(0);
    const [showModalReview, setshowModalReview] = useState(false);
    const [showModalCancel, setshowModalCancel] = useState(false);
    const [dataSale, setdataSale] = useState();
    const currentUser = useSelector(state=>state.userReducer.currentUser);
    const [statusUser, setstatusUser] = useState(false);
    const {idBill} = useParams();

    useEffect(()=>{
        console.log(idBill)
        setstatusUser(false);
        setshowContent(false)
        getProduct();
        getInforPayment();
    },[currentUser])
    const getProduct = async()=>{
        const data = {"idOrder":idBill}
        const product = await FetchAPI.postDataAPI('/order/getProductByIdBill',data);
        if(product!==undefined){
            let total = 0;
            product.map((e,index)=>{
                total+= e.price*e.quanity;
                if(index===product.length-1){
                    settotalTmp(total);
                }
                return false;
            })
        }
        setdataProduct(product);
    }
    const getInforPayment = async()=>{
        const data = {"idOrder":idBill}
        const bill = await FetchAPI.postDataAPI('/order/getBillById',data);
        if(currentUser.id===undefined){
            setstatusUser(false)
        }else{
            if(currentUser.id===bill[0].idUser){
                setstatusUser(true)
            }
        }
        setdataBill(bill[0])
        console.log({dataBill});
        if(bill[0].idSale!==null){
            getSale(bill[0].idSale);
        }
        setshowContent(true)
    }
    const getSale = async(idSale)=>{
        const res = await FetchAPI.postDataAPI("/order/getSaleById",{"idSale":idSale})
        if(res!==undefined){
            setdataSale(res[0])
            setpromotionprice(res[0].cost_sale)
        }
    }
    const handleCancelBill = async()=>{
        const data = {"code_order":dataBill.code_order,"status":3,"email":currentUser.email}
        const res = await FetchAPI.postDataAPI("/order/updateStatusBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    setshowModalCancel(false)
                    message.success("Đơn hàng đã được hủy thành công !");
                    history.goBack();
                },500)
            }else{
                setTimeout(()=>{
                    setshowModalCancel(false)
                    message.error("Xảy ra lỗi !");
                 
                },500)
            }
        }
    }
    const ModalCancelBill = ()=>(
        <Modal
            title={`Bạn chắc chắn muốn hủy đơn hàng của mình #${dataBill.id}`}
            visible={showModalCancel}
            onOk={handleCancelBill}
            onCancel={()=>setshowModalCancel(false)}
            cancelText="Exit"
            okText="Sure"
        >
            <p>Bạn chắc chắn về quyết định của mình! Đơn đặt hàng của bạn sẽ bị hủy.</p>
        </Modal>
    )
    const getPricePayment = () =>{
        let total_payment = totalTmp;
        let shipfee = 10;
        if(dataSale != undefined){
          
            if (dataSale.type == 0) {
                shipfee = shipfee - dataSale.cost_sale;
                shipfee = shipfee > 0 ? shipfee : 0;
            } 
            else {
                total_payment = total_payment- dataSale.cost_sale
            }
        }
        total_payment = total_payment + shipfee;
        return total_payment;
    }
    const columns  = [
        {
            title:"Sản phẩm",
            key:'product',
            render : record=>{
                return(
                    <div>
                        <span>{record.name_product+" ( "+record.size +" )"}</span>
                        <span style={{ paddingLeft:20,fontWeight:'bold' }}>{"X" +record.quanity}</span>
                    </div>
                )
            }
        },
        {
            title:"Tổng cộng",
            key:'total_price',
            render: record=>{
                return <span>{getPriceVND(record.price*record.quanity ) +" VNĐ"}</span>
            }
        }
    ]
    const ViewProduct = ()=>(
        <Table 
            columns={columns}
            dataSource={dataProduct}
            pagination={false} 
            size="small"
            summary={()=>(
                <Table.Summary>
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Tạm</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>{getPriceVND(totalTmp)+" VNĐ"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                    {dataSale !== undefined &&
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Mã khuyến mại</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{"-"+getPriceVND(promotionprice)+" VNĐ"}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    }
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Transport fee</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>{getPriceVND(10)+" VNĐ"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Tổng</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>{getPriceVND(getPricePayment())+"VNĐ"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                    {dataBill.status===2 &&
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Đánh giá sản phẩm</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                            <Button onClick={()=>setshowModalReview(true)}>
                            Bình chọn bây giờ
                            </Button>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                    }
                </Table.Summary>
        )}
        />      
    )
    const getTextStatus = (a)=>{
        if(a===0){
            return <b>Đang xử lý</b>
        }else if(a===1){
            return <b>Đang giao hàng</b>
        }else if(a===2){
            return <b>Hoàn thành</b>
        }else{
            return <b>Hủy</b>
        }
    }
    return(
        <div style={{ minHeight:450,paddingBottom:20 }}>
            {showContent ?
            <div>
            {statusUser ?
            <div>
                
            <PageHeader
                className="site-page-header"
                onBack={() => history.goBack()}
                title="Chi tiết đặt hàng"
                subTitle={"Mã hóa đơn: #"+dataBill.id}
            />
            <Row>
            <Col lg={14} xs={24} style={{ padding:"20px 40px" }} >
                {ViewProduct()}
                <Card title="Payment address" style={{ marginTop:30 }}>
                <div style={{ fontSize:16 }}>
                <Space direction="vertical" size={20}>
                    <span><b>Tên: </b>{dataBill.name}</span>
                    <span><b>Địa chỉ: </b>{dataBill.address}</span>
                    <span><b>Email: </b>{dataBill.email}</span>
                    <span><b>Số điện thoại: </b>{dataBill.phone} </span>
                </Space>
                </div>
                </Card>
            </Col>
            <Col lg={10} xs={24} style={{ justifyContent:'center',display:'flex' }}>
                <Card title="Cảm ơn. Đơn hàng đã được xác nhận." style={{ marginTop:20,width:'80%' }}>
                <ul>
                    <Space size={10} direction="vertical">
                        <li>Code order : <b>{"#"+dataBill.id}</b></li>
                        <li>Order date: <b>{moment(new Date(dataBill.create_at)).format("YYYY-MM-DD hh:mm:ss")}</b></li>
                        <li>Email : <b>{dataBill.email}</b></li>
                        <li>Total : <b>{getPriceVND(getPricePayment())+" $"}</b></li>
                        <li>Time to update invoices: <b> {moment(new Date(dataBill.update_at)).format("YYYY-MM-DD hh:mm:ss")}</b></li>
                        <li>Payment status: 
                            <b>{dataBill.payment_status === 1 ? " Đã thanh toán":" Chưa thanh toán"}</b>
                        </li>
                        <li>Payment method: 
                            <b>{dataBill.method_payment === 1 ? " Thẻ tín dụng":" Tiền mặt"}</b>
                        </li>
                       
                        <li>
                          Trạng thái : {getTextStatus(dataBill.status)}
                        </li>
                        <div>
                            <Button type="primary" onClick={()=>setshowModalCancel(true)} danger disabled={dataBill.status!==0} >
                              Hủy đơn hàng
                            </Button>
                        </div>
                    </Space>
                </ul>
                </Card>
            </Col>
            </Row> 
            <ModalReviewProduct 
                visible={showModalReview}
                onCancel={()=>setshowModalReview(false)}
                refresh={()=>getProduct()}
                dataProduct={dataProduct}
                user={currentUser}
            /> 
            {ModalCancelBill()}
            </div>
            :
            <div style={{ padding:"20px 40px" }}>
                <span style={{ fontWeight:'bold' }}>Bạn không có quyền truy cập vào hóa đơn này...</span>
            </div>
            }
            </div>
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}
import React ,{useEffect,useState} from'react';
import { PageHeader,Table,Row,Col,Space,Card ,Button,message,Select,Modal} from 'antd';
import { useHistory,useParams,useLocation } from 'react-router-dom';
import {getPriceVND} from '../../contain/getPriceVND';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {PrinterOutlined} from '@ant-design/icons';
import moment from 'moment';


const {Option} = Select;
export default function BillDetails(){
    const [dataProduct, setdataProduct] = useState();
    const [dataBill, setdataBill] = useState();
    const [dataSale, setdataSale] = useState();
    const [totalTmp, settotalTmp] = useState(0);
    const [promotionprice, setpromotionprice] = useState(0);
    const [showContent, setshowContent] = useState(false);
    const [showModalDeleteBill, setshowModalDeleteBill] = useState(false);
    const {idBill} = useParams();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        setshowContent(false);
        getProduct();
        getInforPayment();
    },[location])
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
        setdataBill(bill[0])
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
    const hanldeUpdateStatus = async(value,code,id)=>{
        // setloadingTable(true);
        const data = {"code_order":code,"status":value};
        const res = await FetchAPI.postDataAPI("/order/updateStatusBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    message.success("Cập nhật hóa đơn #"+id+" thành công !");
                    // setloadingTable(false);
                },500)
            }else{
                setTimeout(()=>{
                    message.error("Xảy ra lỗi !!");
                    // setloadingTable(false);
                },500)
            }
        }
    }
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
    const handlePrintInvoices = ()=>{
        let inforbill = document.getElementById('Inforbill');
        let product = document.getElementsByClassName('BillProduct');
        let price = document.getElementsByClassName('BillPrice');
        let shipping = document.getElementsByClassName('Shipping');
        let totalBill = document.getElementsByClassName('TotalBill');
        let saleBill = document.getElementsByClassName('SaleBill');
        let tableProduct = "<table style=\"width:100%;text-align:center\"><tr><td style=\"width:33%;border:2px solid black;height:40px\"><b>Product</b></td><td style=\"width:33%;border:2px solid black\"><b>Provisional</b></td></tr>";
        for(var i=0;i<product.length;i++){
            tableProduct += "<tr > <td style=\"width:33%;border:1px solid black;height:70px\">"+product[i].innerHTML+"</td><td style=\"width:33%;border:1px solid black\">"+price[i].innerHTML+"</td> </tr>"
        }
        let pri = document.getElementById('ifmcontentstoprint').contentWindow;
        pri.document.open();
        pri.document.write(inforbill.outerHTML);
        pri.document.write("<b>Phí vận chuyển:</b>   "+shipping[0].innerHTML);
        pri.document.write(tableProduct+"</table>");
        if(saleBill.length!==0){
            pri.document.write("<div style=\" padding-top:18px;font-size:24px\"><b> Promotion code :  </b>"+saleBill[0].innerHTML+"</div>");
        }
        pri.document.write("<div style=\" padding-top:18px;font-size:24px\"><b> Tổng :  </b>"+totalBill[0].innerHTML+"</div>");
        pri.document.close();
        pri.focus();
        pri.print();
    }
    const handleDeleteItem = async()=>{
        setshowContent(false);
        setshowModalDeleteBill(false);
        const data = {"code_order":dataBill.code_order};
        const res = await FetchAPI.postDataAPI("/order/deleteBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success(`Bạn đã xóa thành công hóa đơn #${dataBill.id} !`);
                history.push('/admin/invoices')
            }else{
                message.error("Xảy ra lỗi !!");
                setshowContent(true)
            }
        }
    }
    const columns  = [
        {
            title:"Sản phẩm",
            key:'product',
            render : record=>{
                return(
                    <div className="BillProduct">
                        <span>{record.name_product+" ( "+record.size +" )"}</span>
                        <span style={{ paddingLeft:20,fontWeight:'bold' }}>{"X" +record.quanity}</span>
                    </div>
                )
            }
        },
        {
            title:"Tổng",
            key:'total_price',
            render: record=>{
                return <span className="BillPrice">{getPriceVND(record.price*record.quanity) +" VNĐ"}</span>
            }
        }
    ]
    const ViewProduct = ()=>(
        <Table 
            columns={columns}
            dataSource={dataProduct}
            pagination={false} 
            size="small"
            style={{boxShadow:'2px 0px 30px #00000026',padding:10}}
            summary={()=>(
                <Table.Summary>
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Tạm tính</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>{getPriceVND(totalTmp)+" VNĐ"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                    {dataSale !== undefined &&
                        <Table.Summary.Row >
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Mã khuyến mãi</span></Table.Summary.Cell>
                            <Table.Summary.Cell className="SaleBill" index={1}>{"-"+getPriceVND(promotionprice)+" VNĐ"}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    }
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Phí vận chuyển</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}  className="Shipping" >{getPriceVND(10)+" $"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row >
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Tổng</span></Table.Summary.Cell>
                        <Table.Summary.Cell className="TotalBill" index={1}>{getPriceVND(getPricePayment())+" VNĐ"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                </Table.Summary>
        )}
        />      
    )
    const getStatus = (status)=>{
       return(
        <Select 
            defaultValue={status}  
            style={{ width: 120 }} 
            onChange={(value)=>hanldeUpdateStatus(value,dataBill.code_order,dataBill.id)}
            disabled={status===3}
        >
            <Option value={0}>
                <span style={{ color:'gray' }}>Đang xử lý</span>
            </Option>
            <Option value={1}>
                <span style={{color:'blue' }}>Đang giao hàng</span>
            </Option>
            <Option value={2}>
                <span style={{ color:'green' }}>Hoàn thành</span>
            </Option>
            <Option value={3} disabled>
                <span style={{ color:'red' }}>Đã hủy</span>
            </Option>
        </Select>
       )
    }
    return(
        <div>
            {showContent ?
            <div>
            <PageHeader
                className="site-page-header"
                onBack={() => history.goBack()}
                title="Chi tiết đơn hàng"
                subTitle={"Mã đơn hàng #"+dataBill.id}
            />
            <Row>
                <Col lg={14} xs={24} style={{ padding:"20px 40px" }} >
                    {ViewProduct()}
                    <Card title="Địa chỉ thanh toán" style={{ marginTop:30,boxShadow:'2px 0px 30px #00000026' }}>
                    <div style={{ fontSize:16 }}>
                    <Space direction="vertical" size={20}>
                        <span><b>Tên khách hàng: </b>{dataBill.name}</span>
                        <span><b>Địa chỉ giao hàng: </b>{dataBill.address}</span>
                        <span><b>Email: </b>{dataBill.email}</span>
                        <span><b>Số điện thoại: </b>{dataBill.phone} </span>
                    </Space>
                    </div>
                    </Card>
                </Col>
                <Col lg={10} xs={24} style={{ justifyContent:'center',display:'flex' }}>
                    <Card title="Thông tin đơn hàng." style={{ marginTop:20,width:'80%',boxShadow:'2px 0px 30px #00000026' }}>
                    <ul>
                        <Space size={10} direction="vertical">
                            <div id="Inforbill">
                            <Space size={10} direction="vertical">
                                <li>Mã hóa đơn :  <b>{"#"+dataBill.id}</b></li>
                                <li>Ngày đặt hàng:  <b>{moment(new Date(dataBill.create_at)).format("YYYY-MM-DD hh:mm:ss")}</b></li>
                                <li>Tên khách hàng :  <b>{dataBill.name}</b></li>
                                <li>Email :  <b>{dataBill.email}</b></li>
                                <li>Tổng :  <b>{getPriceVND(getPricePayment())+" $"}</b></li>
                                <li>Thời gian đặt hàng: <b> {moment(new Date(dataBill.update_at)).format("YYYY-MM-DD hh:mm:ss")}</b></li>
                                <li>Trạng thái thanh toán: 
                                    <b>{dataBill.payment_status ===1 ? " Đã thanh toán":"Chưa thanh toán"}</b>
                                </li>
                                <li>Phương thức thanh toán: 
                                    <b>{dataBill.payment_status ===1 ? " Thẻ tín dụng":" Trả tiền mặt"}</b>
                                </li>
                            </Space>
                            </div>
                            <li>
                                Trạng thái : {getStatus(dataBill.status)}
                            </li>
                            <div style={{ marginTop: 20}}>
                                <Button style={{ borderRadius : 10}} type="primary" danger onClick={()=>setshowModalDeleteBill(true)}>
                                    Xóa hóa đơn
                                </Button>
                                <Button  type="primary" success style={{ marginLeft:30, borderRadius : 10 }} onClick={handlePrintInvoices}>
                                    In hóa đơn <PrinterOutlined />
                                </Button>
                            </div>
                        </Space>
                    </ul>
                    </Card>
                </Col>
            </Row> 
            {showModalDeleteBill &&
                <Modal
                    title={`bạn chắc chắn muốn xóa hóa đơn #${dataBill.id}`}
                    visible={showModalDeleteBill}
                    onOk={handleDeleteItem}
                    onCancel={()=>setshowModalDeleteBill(false)}
                    cancelText="Thoát"
                    okText="OK"
                >
                    <p>Bạn chắc chắn về quyết định của mình! Tất cả dữ liệu về hóa đơn này sẽ bị xóa.</p>
                    <p>Và những sản phẩm trong hóa đơn này sẽ được trả về kho!</p>
                </Modal>
            }
            <iframe 
                id="ifmcontentstoprint" 
                style={{
                        height: '0px',
                        width: '0px',
                        position: 'absolute'
                }}
            ></iframe>  
            </div>
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}
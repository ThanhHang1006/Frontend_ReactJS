import React,{useEffect,useState,useLayoutEffect,useRef} from 'react';
import {Table,Select,Button,message,Modal} from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import {getPriceVND} from '../../contain/getPriceVND';
import {DeleteOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import {getColumnSearchProps} from '../../elements/SearchFilter';
import { useSelector } from 'react-redux';
export default function Invoices(){
    const { Option } = Select;
    const [fulldataBill, setfulldataBill] = useState();
    const [loadingTable, setloadingTable] = useState(false);
    const [showModalDeleteBill, setshowModalDeleteBill] = useState(false);
    const [dataItemTmp, setdataItemTmp] = useState();
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);
    const searchInput = useRef();
 
    useEffect(()=>{
        setloadingTable(true);
        getFullBill()
    },[]) 
    const getFullBill = async()=>{
        const res = await FetchAPI.getAPI('/order/getFullBill');
        res.sort(function(a,b){
            return new Date(b.create_at) - new Date(a.create_at);
        });
        if(res!==undefined){
            setfulldataBill(res);
            setloadingTable(false);
        }
    }
    const hanldeUpdateStatus = async(value,code,id,email)=>{
        setloadingTable(true);
        const data = {"code_order":code,"status":value,"email": email};
        const res = await FetchAPI.postDataAPI("/order/updateStatusBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    getFullBill();
                    message.success("Cập nhật hóa đơn #"+id+" thành công !");
                },500)
            }else{
                setTimeout(()=>{
                    message.error("Xảy ra lỗi !!");
                    setloadingTable(false);
                },500)
            }
        }
    }
    const handleDeleteItem = async()=>{
        setloadingTable(true);
        setshowModalDeleteBill(false);
        const data = {"code_order":dataItemTmp.code_order};
        const res = await FetchAPI.postDataAPI("/order/deleteBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success(`Xóa đơn hàng #${dataItemTmp.id} thành công !`);
                getFullBill();
                setTimeout(()=>{
                    setloadingTable(false);
                },200)
            }else{
                message.error("Xảy ra lỗi !!");
                setTimeout(()=>{
                    setloadingTable(false);
                },200)
            }
        }
    }
    const columns = [
        {
            title:"Mã hóa đơn",
            key:'code',
            filters: [
                { text: 'Đặt hàng với tài khoản', value: "string" },
                { text: 'Đặt hàng không cần tài khoản', value: "object" },
            ],
            onFilter: (value, record) => typeof(record.idUser)===value,
            render: record=>(
                <span style={record.idUser===null?{color:'red',fontWeight:'bold' }:{ fontWeight:'bold' }}>
                    {"#"+record.id}
                </span>         
            )
        },
        {
            title:"Tên khách hàng",
            key:'name',
            ...getColumnSearchProps('name',searchInput)
        },
        {
            title:"Địa chỉ",
            key:'address',
            render:record=><span>{record.address}</span>
        },
        {
            title:"Email",
            key:'email',
            ...getColumnSearchProps('email',searchInput),
        },
        {
            title:"Số điện thoại",
            key:'phone',
            render: record=><span>{record.phone}</span>
        },
        {
            title:"Tổng",
            key:'total',
            sorter: (a, b) => a.total_price - b.total_price,
            render: record=><span style={{ fontWeight:'bold' }}>{getPriceVND(record.total_price)+" VNĐ"}</span>
        },
        {
            title:"Trạng thái",
            key:'status',
            filters: [
                { text: 'Đang xử lý', value: 0 },
                { text: 'Đang giao hàng', value: 1 },
                { text: 'Hoàn thành', value: 2 },
                { text: 'Hủy', value: 3 },
            ],
            onFilter: (value, record) => record.status===value,
            render: record=>{
                return(
                    <Select 
                        value={record.status}  
                        style={{ width: 120 }} 
                        onChange={(value)=>hanldeUpdateStatus(value,record.code_order,record.id,record.email)}
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
                            <span style={{ color:'red' }}>Hủy</span>
                        </Option>
                    </Select>
                )
            }
        },
        {
            title:"Thanh toán",
            key:'payment_status',
            render: record=><span>{record.payment_status === 1 ? "Đã thanh toán" : "Chưa thanh toán"}</span>
        },
        {
            title:"Tùy chỉnh",
            key:'option',
            render:record=>(
                <div style={{ display:'flex',flexDirection:'row',alignItems:'center' }}>
                    <Button>
                        <Link to={`/admin/billdetails/${record.code_order}`}>
                            Chỉnh sửa
                        </Link>
                    </Button>
                    <DeleteOutlined 
                        style={{marginLeft:15,fontSize:20,cursor:"pointer" }} 
                        onClick={()=>{
                            setshowModalDeleteBill(true);
                            setdataItemTmp(record);
                        }}/>
                </div>
            )
        }

    ]
    const styles = {
        overflowX: overflowX ? { overflowX: 'scroll' } : null,
        textAlign: 'center'
      };
      
    return(
    <div>
        <p>Bạn cần xóa các đơn hàng đã hủy khác để đưa sản phẩm về kho.</p>

        <Table 
            showSorterTooltip={{ title: 'Nhấn để lọc' }}
            columns={columns} 
            dataSource={fulldataBill} 
            size="small" 
            style={  overflowX?{overflowX:'scroll'}:null } 
            loading={loadingTable} />
         {showModalDeleteBill &&
            <Modal
                title={`Bạn chắc chắn muốn xóa hóa đơn #${dataItemTmp.id}`}
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
    </div>
    )
}
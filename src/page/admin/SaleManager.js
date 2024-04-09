import React,{useEffect,useState} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {getPriceVND} from '../../contain/getPriceVND';
import {InputNumber,Table,DatePicker,Button,message,Drawer,Form,Input,Modal,Select} from 'antd';
import moment from 'moment';
import {PlusCircleOutlined} from '@ant-design/icons';
import { useSelector } from 'react-redux';
const { RangePicker } = DatePicker;
const {Option} = Select;

export default function SaleManager(){
    const [showContent, setshowContent] = useState();
    const [dataFullPromotion, setdataFullPromotion] = useState();
    const [loadingTable, setloadingTable] = useState(false);
    const [loadingBtn, setloadingBtn] = useState(false);
    const [showDrawer, setshowDrawer] = useState(false);
    const [showModalDelete, setshowModalDelete] = useState(false);
    const [itemTmp, setitemTmp] = useState();
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);
    const [dataAddSale, setdataAddSale] = useState({});
    const [formAddSale] = Form.useForm();
    useEffect(()=>{
        getFullPromotion();
    },[])
    const getFullPromotion = async()=>{
        const res = await FetchAPI.getAPI('/promotion/getFullPromotion');
        setdataFullPromotion(res)
        setshowContent(true)
    }
    const handleEditDate = async(e,id)=>{
        setloadingTable(true);
        if(e===null){

        }else{
            const date_start = moment(e[0]._d).format('YYYY-MM-DD HH:mm:ss')
            const expired = moment(e[1]._d).format('YYYY-MM-DD HH:mm:ss')
            const data = {"date_start":date_start,"expired":expired,"id":id};
            const res = await FetchAPI.postDataAPI("/promotion/updateTimeSale",data);
            if(res.msg){
                if(res.msg==="Success"){
                    setTimeout(()=>{
                        message.success("Cập nhật mã khuyến mại #"+id+" thành công !");
                        setloadingTable(false);
                    },500)
                }else{
                    setTimeout(()=>{
                        message.error("xảy ra lỗi !!");
                        setloadingTable(false);
                    },500)
                }
            }
        }
    }
    const handleEditQuanity = async(e,id)=>{
        setloadingTable(true);
        const data={"quanity":e,"id":id};
        const res = await FetchAPI.postDataAPI("/promotion/updateQuanitySale",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    message.success("Cập nhật mã khuyến mại #"+id+" thành công !")
                    getFullPromotion();
                    setloadingTable(false);
                },500)
            }else{
                setTimeout(()=>{
                    message.error("Xảy ra lỗi !!");
                    setloadingTable(false);
                })
            }
        }
    }
    const handleAddSale = async()=>{
        setloadingBtn(true);
        const data = {"data":dataAddSale};
        console.log({data});
        const res = await FetchAPI.postDataAPI("/promotion/addPromotion",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    message.success("Đã thêm mã khuyến mãi thành công !")
                    getFullPromotion();
                    setdataAddSale({});
                    formAddSale.setFieldsValue({name_event_sale:"",cost_sale:"",code_sale:"",quanity:"",time:""});
                    setshowDrawer(false);
                    setloadingBtn(false);
                },500)
            }else{
                setTimeout(()=>{
                    message.error("Xảy ra lỗi !!");
                    setloadingBtn(false);
                })
            }
        }
    }
    const handleDeleteSale = async()=>{
        const data = {"id":itemTmp.id}
        const res = await FetchAPI.postDataAPI("/promotion/deleteSale",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Xóa mã code thành công")
                setshowModalDelete(false)
                getFullPromotion()
            }else{
                message.error("Xảy ra lỗi !!")
                setshowModalDelete(false)
            }
        }
    }
    const columns  = [
        {
            title:"Sự kiện",
            key:'name_event_sale',
            render: record=><span>{record.name_event_sale}</span>
        },
        {
            title:"Mã code",
            render: record=><span>{record.code_sale}</span>
        },
        {
            title:"Số tiền giảm",
            key:'cost_sale',
            render: record=><span>{getPriceVND(record.cost_sale)+" $"}</span>
        },
        {
            title:"Số lượng",
            key:'quanity',
            render: record=>(
                <InputNumber 
                    value={record.quanity}
                    min= {0}
                    onChange= {e=>handleEditQuanity(e,record.id)}
                />
            )
        },
        {
            title:"Đã sử dụng",
            key:'used',
            render:record=><span>{record.used}</span>
        },
        {
            title:"Còn lại",
            key:'rest',
            render: record=><span style={{fontWeight:'bold'}}>{record.quanity-record.used}</span>
        },
        {
            title:<div style={{textAlign: 'center'}}><span>Thời gian giảm giá</span></div>,
            key:'date_start',
            sorter: (a, b) =>new Date(a.date_start)- new Date(b.date_start),
            render: record=>(
                <RangePicker 
                    value={[moment(record.date_start),moment(record.expired)]}
                    renderExtraFooter={() => 'extra footer'}
                    showTime 
                    onChange= {(e)=>handleEditDate(e,record.id)}
                />
            )
        },
        {
            title:"Trạng thái",
            key:'edit',
            render: record=>(
                <Button onClick={()=>{
                    setshowModalDelete(true);
                    setitemTmp(record)
                }}>
                    Xóa
                </Button>
            )
        }
    ]
    const DrawerAddSale = ()=>(
        <Drawer
            title="Thêm sự kiện khuyến mãi" 
            placement="right" 
            width={overflowX ?"100%":520}
            getContainer={false}
            onClose={()=>setshowDrawer(false)} 
            open={showDrawer}
           
        >
            <Form
                form={formAddSale}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                onFinish={handleAddSale}
            >
                <Form.Item
                    label="Sự kiện"
                    name="name_event_sale"
                    rules={[{required: true, message:''}]}
                >
                    <Input 
                        placeholder="Nhập tên sự kiện"
                        value={dataAddSale.name_event_sale}
                        onChange= {(e)=>setdataAddSale({...dataAddSale,name_event_sale:e.target.value})}
                    />
                </Form.Item>
                <Form.Item
                    label="Code"
                    name="code_sale"
                    rules={[{required: true, message:'Vui lòng nhập mã!'}]}
                >
                    <Input 
                        placeholder="Nhập code"
                        value={dataAddSale.code_sale}
                        onChange= {(e)=>setdataAddSale({...dataAddSale,code_sale:e.target.value})}
                    />
                </Form.Item>
                <Form.Item
                    label="Loại"
                    name="type"
                    rules={[{ required: true, message: 'Vui lòng nhập mã loại!' }]}
                >
                    {/* <InputNumber
                        placeholder="Type"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                        value={dataAddSale.quanity}
                        onChange={(e)=>setdataAddSale({...dataAddSale,quanity:e})}
                    /> */}
                    <Select 
                    value={dataAddSale.type}
                    placeholder="Type"
                    onChange= {(e)=>setdataAddSale({...dataAddSale,type:e})}
                >
                    <Option value={0}>
                        Miễn phí ship
                    </Option>
                    <Option value={1}>
                        Giảm giá
                    </Option>
                </Select>
                </Form.Item>
                <Form.Item
                    label="Mã giảm giá"
                    name="cost_sale"
                    rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
                >
                    <InputNumber
                        placeholder="Giá giảm"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                        value={dataAddSale.cost_sale}
                        onChange={(e)=>setdataAddSale({...dataAddSale,cost_sale:e})}
                    />
                </Form.Item>
                <Form.Item
                    label="Số lượng"
                    name="quanity"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                    <InputNumber
                        placeholder="Số lượng"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                        value={dataAddSale.quanity}
                        onChange={(e)=>setdataAddSale({...dataAddSale,quanity:e})}
                    />
                </Form.Item>
                <Form.Item
                    label="Thời gian"
                    name="time"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                    <RangePicker 
                        renderExtraFooter={() => 'extra footer'}
                        showTime 
                        onChange= {e=>
                            setdataAddSale({
                                ...dataAddSale,
                                date_start:moment(e[0]._d).format('YYYY-MM-DD HH:mm:ss'),
                                expired:moment(e[1]._d).format('YYYY-MM-DD HH:mm:ss')
                            }
                            )
                        }
                    />
                </Form.Item>
                <Form.Item style={{ paddingTop:20 }}  wrapperCol={{ span: 12, offset: 10 }}>
                    <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
                        Thêm mã
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
    const ModalDeleteSale = ()=>(
        <div>
        {showModalDelete &&
        <Modal
            title={`Xóa mã code  ${itemTmp.code_sale}`}
            visible={showModalDelete}
            onCancel={()=>{setshowModalDelete(false)}}
            onOk={handleDeleteSale}
            cancelText="Thoát"
            okText="OK"
        >
            <p>Bạn có chắc chắn muốn xóa mã khuyến mãi này.</p>
        </Modal>
        }
        </div>
    )
    return(
    <div>
        {showContent ?
        <div>
            <Button type="primary" style={{ marginBottom:20 }} danger onClick={()=>setshowDrawer(true)}>
            Thêm mã khuyến mãi <PlusCircleOutlined />
            </Button>
            <Table 
                showSorterTooltip={{ title: 'Nhấn để lọc' }}
                columns={columns}
                dataSource={dataFullPromotion}
                loading={loadingTable}
                style={overflowX?{overflowX:'scroll'}:null} 
            />
     
            {DrawerAddSale()}
            {ModalDeleteSale()}
        </div>
        :
        <Spinner spinning={!showContent}/> 
        }
    </div>
    )
}
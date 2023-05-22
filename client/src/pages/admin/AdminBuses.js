import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import BusForm from "../../components/BusForm";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { axiosInstance } from "../../helpers/axiosInstance";
import { Table, message } from "antd";
import moment from 'moment'

function AdminBuses() {
  const dispatch = useDispatch();
  const [showBusForm, setShowBusForm] = useState(false);
  const [buses , setBuses] = useState([]);
  const getBuses = async()=>{
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/buses/get-all-buses',{});
      dispatch(HideLoading());
      if(response.data.success){
        setBuses(response.data.data);
      }else{
        message.error(response.data.message)
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.data.message)
    }
  }
  const columns =[
    {
      title:'Name',
      dataIndex:'name'
    },
    {
      title:'Number',
      dataIndex:'number'
    },
    {
      title:'From',
      dataIndex:'from'
    },
    {
      title:'To',
      dataIndex:'to'
    },
    {
      title:'Journey Date',
      dataIndex:'journeyDate',
      render:(journeyDate)=>moment(journeyDate).format('DD-MM-YYYY')
    },
    {
      title:'Status',
      dataIndex:'status'
    },
    {
      title:'Action',
      dataIndex:'action'
    },
  ]
  useEffect(()=>{
    getBuses();
  },[])
  return (
    <div>
      <div className="d-flex justify-content-between">
        <PageTitle title="Buses" />
        <button
          className="secondary-btn"
          onClick={() => {
            setShowBusForm(true);
          }}
        >
          Add Bus
        </button>
      </div>

      <Table columns={columns} dataSource={buses}/>
      {showBusForm && (
        <BusForm showBusForm={showBusForm} setShowBusForm={setShowBusForm} type='add' />
      )}
    </div>
  );
}

export default AdminBuses;

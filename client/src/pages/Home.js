import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { axiosInstance } from "../helpers/axiosInstance";
import { Col, Row, message } from "antd";
import Bus from "../components/Bus";
function Home() {
  const[filters,setFilters]=useState({})
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const getBuses = async () => {
    const tempFilter = {};
    Object.keys(filters).forEach((key)=>{
      if(filters[key]){
        tempFilter[key]=filters[key]
      }
    });
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/get-all-buses",tempFilter);
      dispatch(HideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.data.message);
    }
  };
  useEffect(() => {
    getBuses();
  }, []);
  return (
    <div>
      <div className="my-3 py-3">
        <Row gutter={10} align='center'>
          <Col lg={6} sm={24} className="mt-md-1" >
            <input type="text"
            placeholder="From"
            value={filters.from}
            onChange={(e)=>{
              setFilters({...filters,from:e.target.value})
            }}
            />
            </Col>
            <Col lg={6} sm={24} className="mt-md-1">
            <input type="text"
            placeholder="To"
            value={filters.to}
            onChange={(e)=>{
              setFilters({...filters,to:e.target.value})
            }}
            />
          </Col>
          <Col lg={6} sm={24} className="mt-md-1">
            <input type="date"
            placeholder="Journey DAte"
            value={filters.journeyDate}
            onChange={(e)=>{
              setFilters({...filters,journeyDate:e.target.value})
            }}
            />
          </Col>
          <Col lg={6} sm={24} className="mt-md-1">
            <div className="d-flex gap-2">
            <button className="btn btn-primary outlined" onClick={()=>getBuses()}>Filter</button>
            <button className="btn btn-danger outlined" onClick={()=>{setFilters({
              from:"",
              to:"",
              journeyDate:""
            })}}>Clear</button>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={[15, 15]}>
          {buses.filter(bus=>bus.status === 'Yet To Start').map((bus)=>(
            <Col lg={12} xs={24} sm={24}>
              <Bus bus={bus}/>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;

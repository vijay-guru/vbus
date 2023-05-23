import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { axiosInstance } from "../helpers/axiosInstance";
import { Col, Row, message } from "antd";
import { useParams } from "react-router-dom";

function BookNow() {
    const params = useParams();
    const dispatch = useDispatch();
    const[bus,setBus]=useState(null);
    const getBus = async () => {
        try {
          dispatch(ShowLoading());
          const response = await axiosInstance.post("/api/buses/get-bus-by-id", {
            _id:params.id
          });
          dispatch(HideLoading());
          if (response.data.success) {
            setBus(response.data.data);
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          dispatch(HideLoading());
          message.error(error.data.message);
        }
      };
      useEffect(() => {
        getBus();
      }, []);
  return (
    <div>
      {bus && (
        <Row className="mt-3">
            <Col lg={12} xs={24} sm={24}>
                <h3 className="text-xl text-secondary">
                    {bus.name}
                </h3>
                <h3 className="text-md mt-2">
                    {bus.from} - {bus.to}
                </h3>
                <hr/>
                <div >
                    <h3 className="text-lg">Journey Date : {bus.journeyDate}</h3>
                    <h3 className="text-lg">Fare : &#x20a8; {bus.fare} /-</h3>
                    <h3 className="text-lg">Departure Time : {bus.departure}</h3>
                    <h3 className="text-lg">Arrival Time : {bus.arrival}</h3>
                </div>
            </Col>
            <Col lg={12} xs={24} sm={24}></Col>
        </Row>
      )}
    </div>
  )
}

export default BookNow

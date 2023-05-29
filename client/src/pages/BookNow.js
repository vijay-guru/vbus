import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { axiosInstance } from "../helpers/axiosInstance";
import { Col, Row, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import StripeCheckout from "react-stripe-checkout";

function BookNow() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bus, setBus] = useState(null);
  const getBus = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/get-bus-by-id", {
        _id: params.id,
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

  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/make-payment", {
        token,
        amount: selectedSeats.length * bus.fare * 100,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.data.message);
    }
  };

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/book-seat", {
        bus: bus._id,
        seats: selectedSeats,
        transactionId,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate('/booking')
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
        <Row className="mt-3" gutter={20}>
          <Col lg={12} xs={24} sm={24}>
            <h3 className="text-xl  primary-text">{bus.name}</h3>
            <h3 className="text-md mt-2">
              {bus.from} - {bus.to}
            </h3>
            <hr />
            <div className="flex flex-col gap-1">
              <h3 className="text-lg">Journey Date : {bus.journeyDate}</h3>
              <h3 className="text-lg">Fare : &#x20a8; {bus.fare} /-</h3>
              <h3 className="text-lg">Departure Time : {bus.departure}</h3>
              <h3 className="text-lg">Arrival Time : {bus.arrival}</h3>
              <h3 className="text-lg">Bus Capacity : {bus.capacity}</h3>
              <h3 className="text-lg">
                Seats Left : {bus.capacity - bus.seatsBooked.length}
              </h3>
            </div>
            <hr />
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl">
                Selected Seats : {selectedSeats.join(",")}
              </h3>
              <h3 className="text-2xl mt-3">
                Fare : &#x20a8; {bus.fare * selectedSeats.length}
              </h3>
              <StripeCheckout
                billingAddress
                token={onToken}
                amount={bus.fare * selectedSeats.length * 100}
                currency="INR"
                stripeKey="pk_test_51NCfX1SFPTFhj4Dq4LunLJlKP4hZHrAfZn8yhKZHsnMne9J7fr8CCYYYhhYOEJORBjowXoo2SHe2OSFtjyAURDbn00YEI1wHNZ"
                
              >
                <div className="mb-3">
                {selectedSeats.length === 0 ? (
                  <>
                  <hr/>
                    <div>
                      <h3 className=" primary-text">Select seats to book !!!</h3>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      className={
                        selectedSeats.length === 0
                          ? "disabled-btn mt-3"
                          : "primary-btn mt-3"
                      }
                      // onClick={bookNow}
                    >
                      Book Now
                    </button>
                  </>
                )}
                </div>
              </StripeCheckout>
            </div>
          </Col>
          <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default BookNow;

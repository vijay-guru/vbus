import React, { useEffect, useRef, useState } from "react";
import PageTitle from "../components/PageTitle";
import BusForm from "../components/BusForm";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { axiosInstance } from "../helpers/axiosInstance";
import { Modal, Table, message } from "antd";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
function Bookings() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();
  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/bookings/get-bookings-by-userid",
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
          };
        });
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.data.message);
    }
  };

  const columns = [
    {
      title: "Bus Name",
      dataIndex: "name",
      key: "bus",
    },
    {
      title: "Bus Number",
      dataIndex: "number",
      key: "bus",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
    },
    {
      title: "Journey Time",
      dataIndex: "departure",
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (record) => <>{record.join(",")}</>,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          <p
            className="text-md underline"
            onClick={() => {
              setSelectedBooking(record);
              setShowBookingModal(true);
            }}
          >
            Print Ticket
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <PageTitle title="Bookings" />
      <div className="mt-2">
        <Table dataSource={bookings} columns={columns} />
      </div>
      <Modal
        title="Print Ticket"
        onCancel={() => {
          setShowBookingModal(false);
          setSelectedBooking(null);
        }}
        open={showBookingModal}
        okText="Print Ticket"
        onOk={handlePrint}
      >
        <div className="d-flex flex-column p-5" ref={componentRef}>
          <p className="text-lg">Bus: {selectedBooking?.name}</p>
          <p className="text-md text-secondary">
            {selectedBooking?.from} - {selectedBooking?.to}
          </p>
          <hr />
          <p>
            <span className="text-secondary">Journey Date:</span>{" "}
            {moment(selectedBooking?.journeyDate).format("DD-MM-YYYY")}
          </p>
          <p>
            <span className="text-secondary">Journey Time:</span>{" "}
            {selectedBooking?.departure}
          </p>
          <p>
            <span className="text-secondary">Ticket Count:</span>{" "}
            {selectedBooking?.seats.length}
          </p>
          <hr />
          <p>
            <span className="text-secondary text-lg">Seat Numbers:</span> <br />
            {selectedBooking?.seats.join(",")}
          </p>
          <hr />
          <p>
            <span className="text-secondary">Total Amount:</span>{" "}
            {selectedBooking?.fare * selectedBooking?.seats.length}
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Bookings;

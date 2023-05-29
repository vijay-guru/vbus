import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { axiosInstance } from "../../helpers/axiosInstance";
import { Table, message } from "antd";
import moment from "moment";

function AdminUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const getUsers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/users/get-all-users", {});
      dispatch(HideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "",
      render: (data) => {
        if (data?.isAdmin) {
          return "Admin";
        } else {
          return "Client";
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex gap-3">
          {record.isBlocked && (
            <p
              className="underline"
              onClick={() => {
                updateUserPermission(record, "unblock");
              }}
            >
              UnBlock
            </p>
          )}
          {!record.isBlocked && (
            <p
              className="underline"
              onClick={() => {
                updateUserPermission(record, "block");
              }}
            >
              Block
            </p>
          )}
          {record.isAdmin && (
            <p
              className="underline"
              onClick={() => {
                updateUserPermission(record, "remove-admin");
              }}
            >
              Remove Admin
            </p>
          )}
          {!record.isAdmin && (
            <p
              className="underline"
              onClick={() => {
                updateUserPermission(record, "make-admin");
              }}
            >
              Make Admin
            </p>
          )}
        </div>
      ),
    },
  ];
  const updateUserPermission = async (user, action) => {
    try {
      let payload = null;
      if(action === 'make-admin'){
        payload={
          ...user,
          isAdmin:true
        };
      }
      else if(action === 'remove-admin'){
        payload={
          ...user,
          isAdmin:false
        };
      }
      else if(action === 'unblock'){
        payload={
          ...user,
          isBlocked:false
        };
      }
      else if(action === 'block'){
        payload={
          ...user,
          isBlocked:true
        };
      }
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/users/update-user-permissions",
        payload
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message)
        getUsers();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={users} />
    </div>
  );
}

export default AdminUsers;

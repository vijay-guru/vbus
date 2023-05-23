import React from 'react'
import {Form , message} from 'antd'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { useDispatch } from 'react-redux';
function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish=async (values)=>{
    try{
      dispatch(ShowLoading());
      const response = await axios.post('/api/users/register',values);
      dispatch(HideLoading())
      if(response.data.success){
        message.success(response.data.message);
        navigate("/login");
      }
      else{
        message.error(response.data.message);
      }
    }
    catch(err){
      dispatch(HideLoading())
      message.error(err.message);
    }
  }

  return (
    <div className="h-screen d-flex justify-content-center align-items-center">
      <div className="w-400 card p-3">
        <h1 className='text-lg'>VBus Register</h1><hr/>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name='name'>
            <input type="text" />
          </Form.Item>
          <Form.Item label="Email" name='email'>
            <input type="text" />
          </Form.Item>
          <Form.Item label="Password" name='password'>
            <input type="password" />
          </Form.Item>
          <div className='d-flex justify-content-between align-items-center'>
            <Link to='/login'>Already have an account ?</Link>
            <button className='secondary-btn' type='submit'>Register</button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register

import './dashboard.css';
import { Button, Typography, styled, ButtonProps } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import '@progress/kendo-theme-material/dist/all.css';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import MyCommandCell from '../components/MyCommandCell';
import DateCell from '../components/DateCell';
import GenderCell from '../components/GenderCell';
import { useNavigate } from "react-router-dom";
import { UserDataType,StudentDataType, Gender, Role } from '../interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { logOutUser, getStudents, createStudent, deleteStudent, updateStudent, checkUser } from '../state/slices';
import type { RootState } from '../state/store';
import { io } from 'socket.io-client';


const editField = 'inEdit';

const LogoutButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: '#ffffff',
  backgroundColor: grey[800],
  fontWeight:'bold',
  '&:hover': {
    backgroundColor: grey[900],
  },
}));

const AddNew = styled(Button)<ButtonProps>(({ theme }) => ({
  color: '#ffffff',
  backgroundColor: '#ef4444',
  margin:'2px',
  fontWeight:'bold',
  '&:hover': {
      backgroundColor: '#d32f2f',
  },
}));
const socket = io('http://localhost:8000');

export default function Dashboard(){
  const user:UserDataType|null = useSelector((state: RootState)=>state.user);
  const students:StudentDataType[] = useSelector((state: RootState)=>state.student);
  const dispatch = useDispatch()
  const [studentData, setStudentData] = useState<StudentDataType[]>([]);
  const [userData,setUserData] = useState<UserDataType>({sessionId:'',name:'',email:'',role:Role.guest});
  const navigate = useNavigate();
  
  useEffect(()=>{
    socket.on('students updated', () => {
      dispatch(getStudents());
    });
  },[socket])
  
  useEffect(()=>{
    if(!user){
        navigate("/");
        return;
    }
    setUserData(user);
  },[user]);

  useEffect(()=>{
    if(students){
      setStudentData(students);
    }
  },[students]);

  useEffect(()=>{
    dispatch(checkUser());
    dispatch(getStudents());
    return;
  },[]);

  const handleLogOut = () => {
    dispatch(logOutUser({sessionId:userData.sessionId}));
  }

  const addNewStudent = () => {
    const newDataItem: StudentDataType= {
      name:'',
      address:'',
      age:0,
      mobileNo:0,
      gender:Gender.Male,
      dob:new Date(0),
      inEdit: true,
    };
    setStudentData([...studentData, newDataItem]);
  };

  const add = (dataItem: any) => {
    const valid_number_string = /^[0-9]{9}\d*$/;
    if(dataItem.mobileNo.match(valid_number_string)){
      const newStudent:StudentDataType = {...dataItem,mobileNo:parseInt(dataItem.mobileNo)}
      dispatch(createStudent({...newStudent}));
    }else{
      alert("Please enter a valid mobile number")
      return;
    }
    };
    
  const discard = () => {
      const newData = [...studentData];
      newData.pop();
      setStudentData(newData);
  };

  const enterEdit = (dataItem: StudentDataType) => {
    const dob = new Date(dataItem.dob);
    setStudentData(studentData.map((item) => (item.id === dataItem.id ? { ...item,dob,inEdit: true } : item)));
  };
  
  const cancel = () => {
      setStudentData(students);
  };

  
  const update = (dataItem: any) => {
    if(!isNaN(dataItem.mobileNo)){
      dispatch(updateStudent({...dataItem}));
      return;
    }
    const valid_number_string = /^[0-9]{9}\d*$/;
    if(dataItem.mobileNo.match(valid_number_string)){
      const updatedStudent:StudentDataType = {...dataItem,mobileNo:parseInt(dataItem.mobileNo)}
      dispatch(updateStudent({...updatedStudent}));
    }else{
      alert("Please enter a valid mobile number")
      return;
    }
  };

  const remove = (dataItem: StudentDataType) => {
    // eslint-disable-next-line no-restricted-globals
    if(confirm("Are you sure you want to delete this student")){
      dispatch(deleteStudent({id:dataItem.id}))
    }
  };

  const itemChange = (e: any) => {
    const newData = studentData.map((item) => (item.id === e.dataItem.id ? { ...item, [e.field]: e.value } : item));
    setStudentData(newData);
  };


  const commandCell = (props: any) => (
    <MyCommandCell  {...props} editField={editField} role={userData.role} edit={enterEdit} add={add} discard={discard} cancel={cancel} update={update} remove={remove} />
  );
  const genderCell = (props:any)=>(<GenderCell {...props} data={["Male","Female","Other"]} />)
  return (
    <div className='dashboard'>
      <div className="content">
        <div className="user_header">
          <div className="user_title">
            <Typography variant="h4" style={{color:'#ef4444',fontWeight:'bold'}}>Welcome : {userData.name}</Typography>
            <Typography variant="subtitle2" style={{color:'#a9a9a9'}}>Email : {userData.email}</Typography>
            <Typography variant="subtitle2" style={{color:'#a9a9a9'}}>Role : {userData.role}</Typography>
          </div>
          <div>
            <LogoutButton onClick={handleLogOut} className='logout_button'>Log Out</LogoutButton>
          </div>
        </div>
        <div className="data_grid">
          <Grid data={studentData} editField={editField} onItemChange={itemChange}>
            <GridToolbar>
              <div>
                <AddNew
                  title="Add new"
                  className="k-button k-button-md k-rounded-md "
                  onClick={addNewStudent}
                  disabled = {userData.role==="ADMIN"?false:true}
                >
                  Add new
                </AddNew>
              </div>
            </GridToolbar>
            <GridColumn field="id" title="ID" editable={false} />
            <GridColumn field="name" title="Name" editor="text" />
            <GridColumn cell={genderCell} field="gender" title="Gender" editor="text"/>
            <GridColumn field="address" title="Address" editor="text" />
            <GridColumn field="mobileNo" title="Mobile-No" editor="text" />
            <GridColumn field="dob" title="Date of Birth" editor="date" format="{0:d}" cell={DateCell} />
            <GridColumn field="age" title="Age" editor="numeric" editable={false} />
            <GridColumn cell={commandCell} title="command" />
          </Grid>
        </div>
      </div>
    </div>
  );
}
import { Box , Meter} from "grommet";
import { useUser } from '@auth0/nextjs-auth0/client';
import {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import axios from "axios";
import SuprSendInbox from '@suprsend/react-inbox';

const GET_TASK = gql`
  query GetTask($id: String!) {
    getTask(id: $id) {
      id
      title
      status
      tomatoes
    }
  }
`;

export default function Pomo(props){

    const router = useRouter();
    const {id, taskName, pomo} = router.query;

    // console.log("id", id);

    const { user, error: userError, isLoading: userLoading } = useUser();

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [time,setTime] = useState(25);

    const [currStat, setCurrStat] = useState({min: time-1, sec: 59, tomo: 0});
    const [intrval,setIntrval] = useState(null);
    const [play,setPlay] = useState(true);

    const [taskId, setTaskId] = useState(null);

    const [toma,setToma] = useState(0);

    useEffect(() => {
        if(!id) router.push('/');
        else{
            axios.post('/api/update-status', {id: id});
            if(pomo === "play") setIntrval(setInterval(updateTime, 1000));
            else setPlay(false);
        }
    },[]);

    useEffect(() => {
        if(id) setTaskId(id);
    },[id]);

    const updateTime = () => {

        setCurrStat((prev) => {

            if(prev.min === 0 && prev.sec === 0){
                if(time == 25 && (currStat.tomo+1)%3 == 0){
                    setTime(15); // long break
                    axios.post('/api/incr-tomo', {id: id});
                    return {min: 14, sec: 59, tomo: prev.tomo+1};
                }else if(time == 25 && (currStat.tomo+1)%3 != 0){
                    setTime(5); // short break
                    axios.post('/api/incr-tomo', {id: id});
                    return {min: 4, sec: 59, tomo: prev.tomo+1};
                }else{
                    setTime(25);
                    return {min: 24, sec: 59, tomo: prev.tomo};
                }
            }

            return {
                min: (prev.sec === 0) ? (prev.min - 1) : (prev.min),
                sec: (prev.sec === 0) ? 59 : (prev.sec - 1),
                tomo: prev.tomo
            }
        });
    }

    const { loading: taskLoading, error: taskError, data: taskData } = useQuery(GET_TASK, {
        variables: { id: id },
    });

    useEffect(() => {
        if(!taskData) return;
        setCurrStat(prev => ({...prev, tomo: taskData.getTask.tomatoes}));
    },[taskData]);

    const continueTimer = (evt) => {
        evt.stopPropagation();
        setIntrval(setInterval(updateTime, 1000));
        setPlay(true);
    }

    useEffect(() => {
        if(!user) return;
        axios.post('/api/get-user', {mail: user.email})
        .then(res => setToma(res.data.todayStats))
    },[user]);

    if (userLoading || taskLoading) return <p>Loading...</p>;
    if (userError || taskError) return <p>Error: {userError?.message || taskError?.message}</p>;

    return (
        <div className="mainDiv">
            <SuprSendInbox
                workspaceKey= {process.env.NEXT_PUBLIC_WORKSPACE_KEY}
                subscriberId= {user.email}
                distinctId= {user.email}
            />
            <Box background="active" width="375px" height="100px" pad="30px" direction='row' align='center' justify="between">
                <Box direction="column">
                    <h4 style={{color: "white"}}>{new Date().getDate() + "/" + (new Date().getMonth()+1)}</h4>
                    <span style={{color: "white"}}>{days[new Date().getDay()]}</span>
                </Box>
                <div className='stat'>
                    <i className="fi fi-ss-tomato"></i>
                    <div>
                        <div className='total'>
                            <span>Today</span>
                            <span> {toma}</span>
                        </div>
                        <div className='done'>
                            <span>This task</span>
                            <span> {currStat.tomo}</span>
                        </div>
                    </div>
                </div>
            </Box>
            <div className="timerDiv">
                 <div className="timerNav">
                      <span style={time == 25? {color: "orange"}:{}}>Pomodoro</span>
                      <span style={time == 5? {color: "orange"}:{}}>Short Break</span>
                      <span style={time == 15? {color: "orange"}:{}}>Long Break</span>
                 </div>
                 <Meter values={[{value: (time-currStat.min)/time*100, color: "active"}, {value: currStat.min/time*100, color: 'rgb(213, 208, 208)'}]} type="circle" width="250px" height="250px" margin="20px 0" />
                 <span className="timer">{currStat.min + ":" + currStat.sec}</span>
                 <Box direction="row" width="275px" pad="0 50px" align="center" justify="between">
                    <i className="fi fi-ss-circle-xmark" onClick={() => {
                        axios.post('/api/delete-task', {id: taskId});
                        router.push('/');
                    }}></i>
                    {play && <i className="fi fi-ss-pause-circle" onClick={() => {
                        clearInterval(intrval);
                        setPlay(false);
                    }}></i>}
                    {!play && <i className="fi fi-ss-play" onClick={(evt) => continueTimer(evt)}></i>}
                    <i className="fi fi-rr-rotate-right" onClick={() => {
                        setCurrStat((prev) => ({min: time-1, sec: 59, tomo: prev.tomo}));
                    }}></i>
                 </Box>
                 <Box direction="column" margin="10px 10px" align="flex-start" width="355px" elevation="xlarge" pad="5px 10px" border="true">
                    <span style={{color: "#F86F03", fontSize: "0.8rem", fontFamily: "sans-serif"}}>Task</span>
                    <span>{taskName}</span>
                    <span style={{color: "#F86F03", fontSize: "0.8rem", fontFamily: "sans-serif", letterSpacing: "1px"}}>running ...</span>
                 </Box>
            </div>
        </div>
    )
}
import { LineChart } from "grommet-icons";
import { Box, Meter, Chart } from "grommet";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import axios from "axios";

export default function Analytics() {

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const { user, error: userError, isLoading: userLoading } = useUser();
    const [stats, setStats] = useState(null);
    const [userObj,setUserObj] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!user && !userLoading && !userError) router.push("/api/auth/login");
    }, [user, userLoading, userError, router]);

    useEffect(() => {
        if(!user) return;
        
        axios.post('/api/get-stats', {mail: user.email})
        .then(res => {
            setStats(res.data);
            console.log(res.data,"stats");
        });
        
        axios.post('/api/get-user', {mail: user.email})
        .then(res => setUserObj(res.data));

    },[user]);

    if (userLoading || !user) return <p>Loading...</p>;
    if (userError) return <p>Error: {userError.message}</p>;

    return (
        <div className="mainDiv" style={{justifyContent: "space-between", padding: "10px 0"}}>
            <Box background="active" width="375px" height="100px" pad="30px" direction='row' align='center' justify="between">
                <h2 style={{color: "white"}}>Analytics</h2>
                <LineChart size="large" color="white"/>
            </Box>
            {stats && 
                <>
                <Box direction="row" width="350px" height="250px" pad="30px" justify="between" align="center" className="pie">
                    <Meter 
                        values={[{value: (stats.done*100/(stats.done+stats.missed)),label: 'done', color: "active"},{value: (stats.missed*100/(stats.done+stats.missed)),label: 'missed', color: "red"} ]} 
                        type="pie" width="150px" margin="0" height="150px" />
                    <Box direction="column" gap="10px" className="label">
                        <span><div className="circle" style={{background: "#F86F03"}}></div> Done</span>
                        <span><div className="circle" style={{background: "red"}}></div> Missed</span>
                    </Box>
                    <span className="taskLabel">Tasks</span>
                </Box>
                </>
            }
            {userObj &&
                <div className="bar">
                    {userObj.weekStats.some(x => (x != 0)) && 
                        <>
                            <Chart color="active" className="barChart" thickness="20px"
                                bounds={[[0, 7], [0, 100]]}
                                values={ userObj.weekStats.map((val,ind) => ({value: [ind,val*10], label: val}))
                                }
                                aria-label="chart" size="small" gap="20px"                 
                                />
                            <p style={{fontSize: "0.8rem"}}>Tomatoes earned this week</p>
                        </>
                    }
                    {
                        userObj.weekStats.every(x => (x == 0)) && <h1>Earn tomatoes to see the analysis</h1>
                    }
                </div>
            }
        </div>
    )
}
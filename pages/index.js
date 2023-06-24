import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import axios from 'axios';
import gql from 'graphql-tag';

import Task from '@/components/Task';
import { Box, TextInput, DateInput } from 'grommet';

const GET_TASKS_BY_USER = gql`
  query GetTasksByUser($userMail: String!) {
    getTasks(userMail: $userMail) {
      id
      title
      description
      deadline
      status
    }
  }
`;

export default function Home() {
  const { user, error: userError, isLoading: userLoading } = useUser();
  const [addTaskDiv, setAddTaskDiv] = useState(false);
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [stats,setStats] = useState(null);

  useEffect(() => {
    if (!user && !userLoading && !userError) router.push("/api/auth/login");
  }, [user, userLoading, userError, router]);
  
  let { loading: taskLoading, error: taskError, data: taskData } = useQuery(GET_TASKS_BY_USER, {
    variables: { userMail: user?.email },
  });

  useEffect(() => {
    if(taskData && taskData.getTasks) setTasks(taskData.getTasks);
    // if(taskData) console.log(taskData.getTasks);
  },[taskData]);

  useEffect(() => {
    if(!user) return;
    axios.post('/api/get-stats', {mail: user.email})
    .then(res => setStats(res.data))
  },[user]);
  
  if (userLoading || taskLoading) return <p>Loading...</p>;
  if (userError || taskError) return <p>Error: {userError?.message || taskError?.message}</p>;

  // const tasks = data.getTasks;

  function createTask(evt){
    evt.preventDefault();
    const {title, description, date, time} = evt.target;
    const dateObj = new Date(`${date.value}T${time.value}`);

    axios.post('/api/add-task',{
      title: title.value,
      description: description.value,
      userMail: user.email,
      deadline: dateObj
    })
    .then(res => {
      setTasks(prev => [...prev, res.data])
     })
    .catch(err => console.log(err));

    evt.target.reset();
    setAddTaskDiv(false);
  }

  function removeTask(id){
    console.log(id);
    axios.post('/api/delete-task', {taskId: id})
    .then( _ => {
      setTasks(prev => prev.filter(task => task.id !== id));
    })
    .catch(err => console.log(err));
  }

  function startTask(id, taskName){
    router.push(`/pomo?id=${id}&taskName=${taskName}&pomo=play`);
  }

  function pauseTask(id, taskName){
    router.push(`/pomo?id=${id}&taskName=${taskName}&pomo=pause`);
  }

  return (
    <div className='mainDiv'>
      <Box background="active" width="375px" height="100px" justify='between' pad="50px" direction='row' align='center' gap="30px">
        <h1 style={{color: "white"}}>Tasks</h1>
        <div className='stat'>
             <div className='total'>
                  <span>Pending</span>
                  <span>{tasks? tasks.length:0}</span>
             </div>
             <div className='done'>
                  <span>Done</span>
                  <span>{stats? stats.doneToday:0}</span>
             </div>
             <i className="fi fi-ss-add" title="Add task" onClick={() => setAddTaskDiv(prev => !prev)}></i>
        </div>
      </Box>
      <div className='taskDiv'>
          {tasks && tasks.map((task) => (
             <Task title={task.title} deadline = {task.deadline} description={task.description} status={task.status} key={task.id} id={task.id} pauseTask = {pauseTask} deleteTask = {removeTask} startTask={startTask}/>
          ))}
          {addTaskDiv && <form className='newTask' onSubmit={(evt) => createTask(evt)}>
              <input placeholder="Title" name="title" required/>
              <textarea placeholder="Description" name="description" required/>
              <input type="date" placeholder='deadline' format="dd/mm/yyyy" name="date" required/>
              <input type="time" name="time" required/>
              <input type="submit" value="Add task" />
          </form>}
      </div>
    </div>
  )
}

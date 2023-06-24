import {CirclePlay, FormTrash, Italic, PauseFill} from 'grommet-icons';
import {Box} from 'grommet';
import {useState} from 'react';

export default function Task(props){

    const [display, setDisplay] = useState(false);

    function handleDelete(evt){
        evt.stopPropagation();
        props.deleteTask(props.id);
    }

    function handlePlay(evt){
        evt.stopPropagation();
        props.startTask(props.id, props.title);
    }

    function handlePause(evt){
        evt.stopPropagation();
        props.pauseTask(props.id, props.title);
    }

    const date = new Date(props.deadline);

    return (
        <>
            <div className='task' onClick={() => setDisplay(prev => !prev)}>
                <Box>
                    <span style={{fontSize: "1.2rem", marginBottom: "5px"}}>{props.title}</span>
                    <div className='deadline'>
                        <span>{date.getDate() + "-" + date.getMonth()}</span>
                        <span style={{fontSize: "1rem"}}> | {date.getHours() + ":" + date.getMinutes()}</span>
                    </div>
                </Box>
                <Box direction='column'>
                    {props.status === 0 && <CirclePlay color="active" width="30px" onClick={(evt) => handlePlay(evt)} />}
                    {props.status === 0 && <FormTrash color="active" onClick={(evt) => handleDelete(evt)} />}
                    {props.status === 1 && <PauseFill color="active" onClick={(evt) => handlePause(evt)} />}
                </Box>
            </div>
            {display && 
                <div className='descrp'>{props.description}
                </div>
            }
        </>
    )
}
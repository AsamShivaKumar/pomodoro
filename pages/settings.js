import { Box } from "grommet"
import { SettingsOption,FormNext } from "grommet-icons"

export default function Settings(){
    return (
        <div className="mainDiv" style={{background: "#EEEEEE"}}>
            <Box background="active" width="375px" height="100px" pad="30px" direction='row' align="center" justify="between">
                 <h2 style={{color: "white"}}>Settings</h2>
                 <SettingsOption color="white" size="large" />
            </Box>
            <Box width="375px" elevation="small" margin="20px 0" direction="column">
                 <p style={{color: "grey", margin: "10px 20px"}}>Duration Settings</p>
                 <span className="setComp">Pomodoro duration <span>25 min<FormNext /></span></span>
                 <span className="setComp">Short Break <span>5 min<FormNext /></span></span>
                 <span className="setComp">Long Break <span>15 min<FormNext /></span></span>
            </Box>
            <Box width="375px" elevation="small" margin="20px 0" direction="column">
                 <p style={{color: "grey", margin: "10px 20px"}}>Alert and Sound</p>
                 <span className="setComp">Alert <i className="fi fi-ss-toggle-off"></i></span>
                 <span className="setComp">Pomodoro Sound <span style={{color: "grey"}}>Select<FormNext /></span></span>
                 <span className="setComp">Break Sound <span style={{color: "grey"}}>Select<FormNext /></span></span>
            </Box>
        </div>
    ) 
}
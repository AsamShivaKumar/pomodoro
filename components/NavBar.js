import { Nav } from 'grommet';
import {History, List, LineChart, SettingsOption} from 'grommet-icons';
import { useState } from 'react';

export default function NavBar(props){
    const active = props.active;

    return (
        <Nav direction='row' justify='around' background="white" width={{max: "50vw", min: "375px", default: "50vw"}} elevation='large' borderRadius="0" pad="5px 20px">
            <a href="/pomo"><History color={active === "/pomo" ? "active":"inactive"} /></a>
            <a href="/"><List color={active === "/" ? "active":"inactive"} /></a>
            <a href="/analyt"><LineChart color={active === "/analyt" ? "active":"inactive"} /></a>
            <a href="/settings"><SettingsOption color={active === "/settings" ? "active":"inactive"} /></a>
        </Nav>
    )
} 
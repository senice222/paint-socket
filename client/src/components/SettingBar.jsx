import React from 'react';
import style from '../styles/toolbar.module.scss'
import toolState from "../store/toolState";


const SettingBar = () => {
    return (
        <div className={style.settingBar}>
            <label htmlFor="line-width">Толщина линии</label>
            <input
                onChange={(e) => toolState.setLineWidth(e.target.value)}
                style={{margin: '0 10px'}}
                id="line-width"
                type="number" defaultValue={1} min={1} max={50}/>
            <label htmlFor="stroke-color">Цвет обводки</label>
            <input id="stroke-color" onChange={e => toolState.setStrokeColor(e.target.value)} type="color"/>
        </div>
    );
};

export default SettingBar;

import React from 'react';
import style from '../styles/toolbar.module.scss'

const Toolbar = () => {
    return (
        <div className={style.toolbar}>
            <button className={`${style.toolbar__btn} ${style.brush}`} />
            <button className={`${style.toolbar__btn} ${style.circle}`} />
            <button className={`${style.toolbar__btn} ${style.eraser}`} />
            <button className={`${style.toolbar__btn} ${style.line}`} />
            <input style={{ marginLeft: 10 }} type="color" />
            <button className={`${style.toolbar__btn} ${style.undo}`}/>
            <button className={`${style.toolbar__btn} ${style.redo}`}/>
            <button className={`${style.toolbar__btn} ${style.save}`}/>
        </div>
    );
};

export default Toolbar;

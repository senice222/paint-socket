import style from './styles/app.module.scss';
import {BrowserRouter, Routes, Route, Navigate, useParams, redirect} from 'react-router-dom';
import Home from './pages/Home';
import React from "react";

function App() {

    return (
        <BrowserRouter>
            <div className={style.app}>
                <Routes>
                    <Route path={'/:id'} element={<Home />} />
                    <Route
                        path="*"
                        element={<Navigate to={`f${(+new Date()).toString(16)}`} replace />}
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;

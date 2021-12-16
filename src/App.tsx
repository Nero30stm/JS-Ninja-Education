import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import NavBar from './components/NavBar';
import AddingTask from './components/AddingTask';
import './assets/styles/app.scss';
import {inject, observer} from "mobx-react";



export const App = () => (

    <>
        <Router>
            <Routes>
                <Route path="/"  element={<NavBar/>} />
                <Route path="/page-2"  element={<AddingTask />} />
            </Routes>
        </Router>
    </>
);



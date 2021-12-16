import React from 'react';
import ReactDOM from 'react-dom';
import { App } from "./App";
import { UserEnrollmentData } from './store/validations';
import { Provider } from 'mobx-react';

export class MainApp extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider>
                <App />
            </Provider>
        );
    }
}

ReactDOM.render(<MainApp />, document.getElementById("root"));
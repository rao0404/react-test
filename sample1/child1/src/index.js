import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.jsx'
import './css/style.css'  //style.css の読み込み

const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

const init = () => {
    console.log('init')

}
init()
import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';
import "modern-normalize/modern-normalize.css";
import '../../../common/scss/index.scss';  //style.css の読み込み
import './scss/index.scss';  //style.css の読み込み

// const root = document.createElement('div');
// root.setAttribute('id', 'root');
// document.body.appendChild(root);
//
// ReactDOM.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>,
//     document.getElementById('root')
// );

window.addEventListener('load', (event) => {
    const container = document.getElementById('root');
    console.log(container)
    const root = createRoot(container); // createRoot(container!) if you use TypeScript
    root.render(<App />);
});

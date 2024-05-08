import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {register} from "./service-worker/register.ts";

ReactDOM.createRoot(document.getElementById('root1') as HTMLElement).render(
    <React.StrictMode>
        <App name={"290"}/>
    </React.StrictMode>,
)

register();

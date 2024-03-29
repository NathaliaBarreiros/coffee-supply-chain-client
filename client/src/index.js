import { createRoot } from "react-dom/client";
import { SnackbarProvider } from 'notistack';
import "./index.css";
import 'simplebar/src/simplebar.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from "./reportWebVitals";
import { store } from './redux/store';
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <HelmetProvider>
        <Provider store={store}>
            <BrowserRouter>
            <SnackbarProvider maxSnack={3}>
                <App />
            </SnackbarProvider>
            </BrowserRouter>
        </Provider>
    </HelmetProvider>);


// If you want to enable client cache, register instead.
serviceWorker.unregister();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

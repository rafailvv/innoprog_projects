import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import Store from './store/store.ts';

interface State {
  store: Store
}

const store = new Store();
export const Context = createContext<State>({ store });


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Context.Provider value={{ store }}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Context.Provider>
  </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AllProjects from './routes/AllProjects.tsx';
import Project from './routes/Project.tsx';
import CheckPoint from './routes/CheckPoint.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "projects/",
    element: <AllProjects />,
  },
  {
    path: "projects/:projectId",
    element: <Project />,
  },
  {
    path: "projects/:projectId/:checkPointId",
    element: <CheckPoint />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

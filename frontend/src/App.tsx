import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import { useContext, useEffect } from 'react'
import { Context } from './main'
import AllProjects from './pages/AllProjects'
import Project from './pages/Project'
import CheckPoint from './pages/CheckPoint'
import { observer } from 'mobx-react-lite'


function App() {
  const unauthRoutes = [
    {
      path: "/",
      element: <Navigate to="/login" />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    }
  ]
  const authRoutes = [
    {
      path: "/",
      element: <Navigate to="/projects" />
    },
    {
      path: "/projects",
      element: <AllProjects />
    },
    {
      path: "/projects/:projectId",
      element: <Project />
    },
    {
      path: "/projects/:projectId/:checkPointId",
      element: <CheckPoint />
    }
  ]
  const router = createBrowserRouter(localStorage.getItem('token') ? authRoutes : unauthRoutes)
  const { store } = useContext(Context)
  useEffect(() => {
    // console.log("useEffect")
    if (localStorage.getItem('token'))
      store.checkAuth();
  }, [])
  return (
    <>
      <RouterProvider router={router} />
      {/* <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="projects" element={<AllProjects />} />
          <Route path="projects/:projectId" element={<Project />} />
          <Route path="projects/:projectId/:checkPointId" element={<CheckPoint />} />
        </Route>
      </Routes> */}
    </>
  )
}

export default observer(App);

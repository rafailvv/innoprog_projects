import { Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './routes/Register'
import Login from './routes/Login'
import PrivateRoute from './components/PrivateRoute'
import AllProjects from './routes/AllProjects'
import Project from './routes/Project'
import CheckPoint from './routes/CheckPoint'
import ProtectedRoute from './components/ProtectedRoute'
import { useContext, useEffect } from 'react'
import { Context } from './main'

function App() {
  const { store } = useContext(Context)
  useEffect(() => {
    if(localStorage.getItem('token'))
      store.checkAuth();
  }, [])
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="projects" element={<AllProjects />} />
          <Route path="projects/:projectId" element={<Project />} />
          <Route path="projects/:projectId/:checkPointId" element={<CheckPoint />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

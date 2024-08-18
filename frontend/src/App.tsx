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
import { createTheme, ThemeProvider } from '@mui/material'
import Submission from './pages/Submission'
// import Header from './components/Header'


const theme = createTheme({
    palette: {
        primary: {
            main: '#9C78FF',
            light: '#EDE1FF'
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                contained: {
                    borderRadius: 8
                },
                outlined: {
                    borderRadius: 8
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 10
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: '#EDE1FF',
                    marginBottom: '4px',
                    [`& fieldset`]: {
                        borderRadius: 8,
                    },
                }
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontWeight: 'bold',
                }
            }
        }
    }
});

function App() {
    const routers = [
        // {
        //     element:
        //     <>
        //         <Header/>
        //         <Outlet />
        //     </>,
        //     path:"/",

        //     children: [
        //         {
        //             path: "/login",
        //             element: <Login />,
        //             index: true,
        //         },
        //         {
        //             path: "/register",
        //             element: <Register />,
        //             index: true,
        //         },
        //         {
        //             path: "/projects",
        //             element: <AllProjects />,
        //             index: true,
        //         },
        //         {
        //             path: "/projects/:projectId",
        //             element: <Project />,
        //             index: true,
        //         },
        //         {
        //             path: "/projects/:projectId/:checkPointId",
        //             element: <CheckPoint />,
        //             index: true,
        //         },
        //         {
        //             path: "*",
        //             element: <Navigate to="/projects" />,
        //             index: true,
        //         }
        //     ]
        // },
        {
            path: "/",
            element: <Navigate to="/projects" />
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/register",
            element: <Register />
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
        },
        {
            path: "/projects/:projectId/:checkPointId/:submissionId",
            element: <Submission />
        },
        {
            path: "*",
            element: <Navigate to="/projects" />
        }
    ]
    const { store } = useContext(Context)
    const router = createBrowserRouter(routers)
    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])
    return (
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    )
}

export default observer(App);

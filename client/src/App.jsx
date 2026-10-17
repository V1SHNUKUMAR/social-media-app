import { useState } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom"
import './App.css'
import { useContext } from 'react';
import { AuthContext } from './context/authContext';
import { DarkModeContext } from "./context/darkModeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import LeftBar from './components/leftBar/LeftBar';
import Navbar from './components/navbar/Navbar';
import RightBar from './components/rightBar/RightBar';

function App() {
  
  const { currentUser } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext);

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div className="mx-auto flex w-full max-w-7xl">
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <RightBar userId={currentUser?.id} />
          </div>
        </div>
      </QueryClientProvider>
    )
  }

  const ProtectedRoute = ({children})=>{
    if(!currentUser) {
      return <Navigate to="/login"/>
    } else {
      return children
    }
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/profile/:id',
          element: <Profile />
        },
      ]
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
      path: "*",
      element: <div>Internal Server Error</div>
    },
  ])

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App

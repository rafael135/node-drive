import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from './routes/Index';
import ErrorPage from './routes/ErrorPage';
import { UserAuthProvider } from './contexts/UserContext';
import Login from './routes/Auth/Login';
import Register from './routes/Auth/Register';
import User from './routes/User/User';
import ProtectedRoute from './routes/ProtectedRoute';
import Logout from './routes/Auth/logout';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Index />,
		errorElement: <ErrorPage />
	},
	{
		path: "/login",
		element: <Login />,
		errorElement: <ErrorPage />
	},
	{
		path: "/register",
		element: <Register />,
		errorElement: <ErrorPage />
	},
	{
		path: "/logout",
		element: <Logout />,
		errorElement: <ErrorPage />
	},
	{
		path: "/user",
		element: <ProtectedRoute />,
		errorElement: <ErrorPage />,
		children: [
			{ 
				path: "/user",
				element: <User />,
				errorElement: <ErrorPage />
			}
		]
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<UserAuthProvider>
			<RouterProvider router={router} />
		</UserAuthProvider>
  	</React.StrictMode>,
);

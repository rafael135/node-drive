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
import Logout from './routes/Auth/Logout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserConfig from './routes/User/UserConfig';
import SharedFiles from './routes/Files/SharedFiles';
import DownloadFile from './routes/Files/DownloadFile';
import { UsedSpaceContextProvider } from './contexts/UsedSpaceContext';
import SearchFiles from './components/SearchFiles/SearchFiles';
import { MouseLocationContextProvider } from './contexts/MouseLocationContext';

const client = new QueryClient();

const router = createBrowserRouter([
	{
		path: "/",
		element: <ProtectedRoute />,
		children: [
			{
				path: "/",
				element: <Index />,
				errorElement: <ErrorPage />
			}
		],
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
		children: [
			{ 
				path: "/user",
				element: <User />,
				errorElement: <ErrorPage />
			}
		],
		errorElement: <ErrorPage />,
	},
	{
		path: "/user/config",
		element: <ProtectedRoute />,
		children: [
			{
				path: "/user/config",
				element: <UserConfig />,
				errorElement: <ErrorPage />
			}
		],
		errorElement: <ErrorPage />
	},
	{
		path: "/files/shared",
		element: <ProtectedRoute />,
		children: [
			{
				path: "/files/shared",
				element: <SharedFiles />,
				errorElement: <ErrorPage />
			}
		],
		errorElement: <ErrorPage />
	},
	{
		path: "/file/:userId/:fileUrl",
		element: <DownloadFile />,
		errorElement: <ErrorPage />
	},
	{
		path: "/files/search",
		element: <SearchFiles />,
		errorElement: <ErrorPage />
	}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={client}>
			<UserAuthProvider>
				<MouseLocationContextProvider>
					<UsedSpaceContextProvider>
						<RouterProvider router={router} />
					</UsedSpaceContextProvider>
				</MouseLocationContextProvider>
			</UserAuthProvider>
		</QueryClientProvider>
  	</React.StrictMode>
);

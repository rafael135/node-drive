import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from './routes/Index';
import ErrorPage from './routes/ErrorPage';
import { UserAuthProvider } from './contexts/UserContext';
import Login from './routes/Auth/LoginPage';
import Register from './routes/Auth/RegisterPage';
import User from './routes/User/User';
import ProtectedRoute from './routes/ProtectedRoute';
import Logout from './routes/Auth/Logout';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UserConfig from './routes/User/UserConfig';
import DownloadFile from './routes/Files/DownloadFile';
import { UsedSpaceContextProvider } from './contexts/UsedSpaceContext';

import { MouseLocationContextProvider } from './contexts/MouseLocationContext';
import SearchFilesRoute from './routes/Files/SearchFiles';
import { queryClient } from './utils/QueryClient';
import UserPublicFilesPage from './routes/Files/UserPublicFilesPage';

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
		path: "/shared",
		element: <ProtectedRoute />,
		children: [
			{
				path: "/shared",
				element: <UserPublicFilesPage />,
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
		element: <SearchFilesRoute />,
		errorElement: <ErrorPage />
	}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<UserAuthProvider>
				<MouseLocationContextProvider>
					<UsedSpaceContextProvider>
						<RouterProvider router={router} />

						<ReactQueryDevtools initialIsOpen={false} position="bottom" buttonPosition="bottom-right" />
					</UsedSpaceContextProvider>
				</MouseLocationContextProvider>
			</UserAuthProvider>
		</QueryClientProvider>
  	</React.StrictMode>
);

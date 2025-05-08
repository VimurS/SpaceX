import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute';

import App from './App';
import Landing from './pages/landing/Landing';
import Login from './pages/landing/Login';
import ResourceList from './pages/landing/ResourceList';
import ResourceDetail from './pages/landing/ResourceDetail';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
			cacheTime: 1000 * 60 * 15,
		},
	},
});

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/', element: <Landing /> },
			{ path: '/login', element: <Login /> },
			{
				element: <ProtectedRoute />, // Protect below routes
				children: [
					{ path: '/resources', element: <ResourceList /> },
					{ path: '/resources/:id', element: <ResourceDetail /> },
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>
);


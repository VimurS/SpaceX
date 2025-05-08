import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
	MantineProvider,
	AppShell,
	Navbar,
	Header,
	Button,
	Group,
	Text,
	Burger,
	MediaQuery
} from '@mantine/core';
import { theme } from './theme';
import { useAuthStore } from './store/authStore';
import './App.scss';

export default function App() {
	const { pathname } = useLocation();
	const { isAuthenticated, logout } = useAuthStore();
	const navigate = useNavigate();
	const [navbarOpened, setNavbarOpened] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const isLanding = pathname === '/';
	const isLogin = pathname === '/login';

	return (
		<MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
			{isLanding || isLogin ? (
				<Outlet />
			) : (
				<AppShell
					padding="md"
					navbarOffsetBreakpoint="sm"
					navbar={
						isAuthenticated ? (
							<Navbar
								hiddenBreakpoint="sm"
								hidden={!navbarOpened}
								width={{ sm: 200, lg: 250 }}
								// p="xs"
								sx={{
									background: 'linear-gradient(90deg, #3a0ca3 0%, #7209b7 100%)',
									color: 'white',
									padding: '1.25rem',
								}}
							>
								<Navbar.Section>
									<Button
										fullWidth
										variant={pathname === '/' ? 'filled' : 'light'}
										component={Link}
										to="/"
										mb="sm"
									>
										Home
									</Button>
									<Button
										fullWidth
										variant={pathname.startsWith('/resources') ? 'filled' : 'light'}
										component={Link}
										to="/resources"
									>
										Resources
									</Button>
								</Navbar.Section>
							</Navbar>
						) : undefined
					}
					header={
						isAuthenticated ? (
							<Header
								height={60}
								p="xs"
								sx={{
									background: 'linear-gradient(90deg, #3a0ca3 0%, #7209b7 100%)',
									color: 'white',
									border: 'none',
								}}
							>
								<Group position="apart" align="center" sx={{ height: '100%' }}>
									<Group align="center">
										<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
											<Burger
												opened={navbarOpened}
												onClick={() => setNavbarOpened((o) => !o)}
												size="sm"
												color="white"
												mr="xl"
											/>
										</MediaQuery>
										<Text fw={600}>🚀 SpaceX Dashboard</Text>
									</Group>
									<Button
										variant="outline"
										size="xs"
										onClick={handleLogout}
										styles={{
											root: {
												color: 'white',
												borderColor: 'white',
											},
										}}
									>
										Logout
									</Button>
								</Group>
							</Header>
						) : undefined
					}
				>
					<Outlet />
				</AppShell>
			)}
		</MantineProvider>
	);
}

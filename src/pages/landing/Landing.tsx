import { FC } from 'react';
import { Title, Button, Container, Stack, Text, Center } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const Landing: FC = () => {
	const navigate = useNavigate();

	return (
		<div
			style={{
				minHeight: '100vh',
				overflow: 'hidden',
				background: 'linear-gradient(135deg, #1e003f 0%, #3a0ca3 50%, #4361ee 100%)',
				color: 'white',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Container style={{
				padding: '0px'
			}} size="sm">
				<Stack align="center" spacing="xl">
					<Title order={1} ta="center">
						Welcome to SpaceX Launches
					</Title>
					<Text ta="center" size="lg">
						Explore detailed information about every SpaceX launch. Discover history, success, and the technology behind it.
					</Text>

					<Center>
						<Button size="lg" color="violet" onClick={() => navigate('/resources')}>
							View Launches 🚀
						</Button>
					</Center>
				</Stack>
			</Container>
		</div>
	);
};

export default Landing;

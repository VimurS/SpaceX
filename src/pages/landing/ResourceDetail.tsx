import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Card,
    Text,
    Title,
    Loader,
    Group,
    Badge,
    Container,
    Button,
    Flex,
} from '@mantine/core';

interface Launch {
    name: string;
    date_utc: string;
    success: boolean;
    details: string;
    rocket: string;
}

interface Rocket {
    name: string;
    type: string;
    description: string;
}

export default function ResourceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: launch,
        isLoading: isLaunchLoading,
        isError: isLaunchError,
    } = useQuery<Launch>({
        queryKey: ['launch', id],
        queryFn: async () =>
            fetch(`https://api.spacexdata.com/v4/launches/${id}`).then((res) => res.json()),
        enabled: !!id,
    });

    const {
        data: rocket,
        isLoading: isRocketLoading,
    } = useQuery<Rocket>({
        queryKey: ['rocket', launch?.rocket],
        queryFn: async () =>
            launch?.rocket
                ? fetch(`https://api.spacexdata.com/v4/rockets/${launch?.rocket}`).then((res) => res.json())
                : Promise.resolve(null),
        enabled: !!launch?.rocket,
    });

    if (isLaunchLoading || !launch)
        return
    <Flex justify="center" align="center" style={{ height: 200 }}>
        <Loader size="xl" />
    </Flex>

    if (isLaunchError) return <Text>Error loading launch data.</Text>;

    return (
        <Container size="sm">
            <Button variant="light" onClick={() => navigate(-1)} mb="md">
                ← Back
            </Button>

            <Title order={2} mb="md">{launch.name}</Title>

            <Card withBorder shadow="md" radius="md" p="lg">
                <Group position="apart" mb="sm">
                    <Text size="sm" color="dimmed">
                        Date: {new Date(launch.date_utc).toLocaleString()}
                    </Text>
                    <Badge color={launch.success ? 'green' : 'red'}>
                        {launch.success ? 'Success' : 'Failed'}
                    </Badge>
                </Group>

                <Text mb="md">{launch.details || 'No details available.'}</Text>

                {isRocketLoading ? (
                    <Flex justify="center" align="center" style={{ height: 200 }}>
                        <Loader size="sm" />
                    </Flex>
                ) : (
                    rocket ? (
                        <>
                            <Title order={4} mt="md">Rocket Info</Title>
                            <Text><strong>Name:</strong> {rocket.name}</Text>
                            <Text><strong>Type:</strong> {rocket.type}</Text>
                            <Text mt="xs">{rocket.description}</Text>
                        </>
                    ) : (
                        <Text mt="md" color="dimmed">Rocket details not available.</Text>
                    )
                )}
            </Card>
        </Container>
    );
}

import {
    TextInput,
    Select,
    Table,
    Loader,
    Title,
    Container,
    Group,
    Button,
    Text,
} from '@mantine/core';
import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface Launch {
    id: string;
    name: string;
    date_utc: string;
    success: boolean;
}

export default function ResourceList() {
    const location = useLocation();
    const navigate = useNavigate();

    // Read query params from the URL
    const urlParams = new URLSearchParams(location.search);
    const initialSearch = urlParams.get('search') || '';
    const initialStatus = urlParams.get('status') || 'All';
    const initialSort = urlParams.get('sort') || 'Newest';
    const initialPage = parseInt(urlParams.get('page') || '1', 10);

    const [search, setSearch] = useState(initialSearch);
    const [statusFilter, setStatusFilter] = useState<string | null>(initialStatus);
    const [sortOrder, setSortOrder] = useState<string | null>(initialSort);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const itemsPerPage = 10;

    const { data, isLoading, isError, error } = useQuery<Launch[]>({
        queryKey: ['launches'],
        queryFn: () =>
            fetch('https://api.spacexdata.com/v4/launches').then((res) => res.json()),
    });

    const filtered = useMemo(() => {
        if (!data) return [];

        return data
            .filter((launch) => {
                const matchSearch = launch.name.toLowerCase().includes(search.toLowerCase());
                const matchStatus =
                    statusFilter === 'All' ||
                    (statusFilter === 'Success' && launch.success) ||
                    (statusFilter === 'Failed' && launch.success === false);
                return matchSearch && matchStatus;
            })
            .sort((a, b) => {
                const aDate = new Date(a.date_utc).getTime();
                const bDate = new Date(b.date_utc).getTime();
                return sortOrder === 'Oldest' ? aDate - bDate : bDate - aDate;
            });
    }, [data, search, statusFilter, sortOrder]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedData = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Sync URL with state
    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);
        if (sortOrder) params.set('sort', sortOrder);
        params.set('page', currentPage.toString());

        navigate({ search: params.toString() }, { replace: true });
    }, [search, statusFilter, sortOrder, currentPage, navigate]);

    if (isLoading)
        return (
            <div
                style={{
                    height: '60vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Loader size="xl" />
            </div>
        );

    if (isError) return <Text>Error loading launches: {error instanceof Error ? error.message : 'Unknown error'}</Text>;

    if (filtered.length === 0) return <Text>No results found.</Text>;

    return (
        <Container>
            <Title order={2} mb="md">
                Launches
            </Title>

            <Group grow mb="md">
                <TextInput
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                />

                <Select
                    data={['All', 'Success', 'Failed']}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="Filter by status"
                />

                <Select
                    data={['Newest', 'Oldest']}
                    value={sortOrder}
                    onChange={setSortOrder}
                    placeholder="Sort by date"
                />
            </Group>

            <Table
                striped
                highlightOnHover
                withColumnBorders
                sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    color: '#333',

                    'thead': {
                        backgroundColor: '#f9f9f9',
                    },
                    'thead tr th': {
                        color: '#555',
                        fontWeight: 600,
                        borderBottom: '1px solid #e0e0e0',
                    },
                    'tbody tr:hover': {
                        backgroundColor: '#f1f1f1',
                    },
                    'tbody td': {
                        borderBottom: '1px solid #e0e0e0',
                    },
                }}
            >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((launch) => (
                        <tr key={launch.id}>
                            <td>{launch.name}</td>
                            <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
                            <td
                                style={{
                                    color: launch.success ? 'green' : 'red',
                                    fontWeight: 500,
                                }}
                            >
                                {launch.success ? 'Success' : 'Failed'}
                            </td>
                            <td>
                                <Button
                                    component={Link}
                                    to={`/resources/${launch.id}`}
                                    variant="light"
                                    size="xs"
                                >
                                    View
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination Controls */}
            <Group position="center" mt="md">
                <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>

                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <Button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </Group>
        </Container>
    );
}



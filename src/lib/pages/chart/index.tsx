import { Spinner, Text, Box, Heading, Button, Card, CardBody } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { usePioneer } from 'lib/context/Pioneer';
import prettyjson from 'prettyjson';

const Header = () => (
    <Box textAlign="center">
        <Heading>Chart</Heading>
        <br />
    </Box>
);

const Chart = () => {
    const { state } = usePioneer();
    const { api } = state;
    const [chartType, setChartType] = useState("");
    const [completeness, setCompleteness] = useState("");
    const [dataObject, setDataObject] = useState(null);
    const [actions, setActions] = useState("");

    let onChart = async function() {
        try {
            // Get work to be done
            let task = await api.RandomCharting();
            task = task.data;
            console.log("task: ", task.entryType);
            setChartType(task.data);
            setCompleteness(task.completeness);
            setDataObject(task.data);
            setActions(task.actions);
            // Select the kind of work you want to do

            // Get the next piece of work
        } catch (e) {
            console.error(e);
        }
    };

    let onStart = async function() {
        try {
            onChart();

            // Get work to be done

            // Select the kind of work you want to do

            // Get the next piece of work
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        onStart();
    }, [api]);

    const handleSave = () => {
        // Handle save functionality here
    };

    if (!api) {
        return <Spinner size="xl" />;
    }

    return (
        <Box display="flex" justifyContent="center" height="100vh">
            <Box>
                <Header />
                <Card w="800px" justifyContent="left">
                    <CardBody>
                        <Box>
                            <Heading size="md">Chart</Heading>
                            <Text>
                                Review Discoveries and earn rewards
                                <Button onClick={onChart}>Generate Task</Button>
                            </Text>
                        </Box>
                        {dataObject && (
                            <Box mt={4}>
                <textarea
                    style={{
                        width: '100%',
                        height: '300px',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        padding: '8px',
                    }}
                    value={JSON.stringify(dataObject, null, 2)}
                    onChange={(e) => setDataObject(JSON.parse(e.target.value))}
                />
                                <Button colorScheme="green" mt={4} onClick={handleSave}>
                                    Save
                                </Button>
                            </Box>
                        )}
                        <Box mt={4}>
                            Actions: {actions}
                            <Button colorScheme="green" size="lg" mt={4}>
                                Done, Submit Entry to Pioneers
                            </Button>
                        </Box>
                    </CardBody>
                </Card>
            </Box>
        </Box>
    );
};

export default Chart;

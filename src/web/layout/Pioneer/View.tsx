import React from 'react';
import { List, ListItem, Text } from '@chakra-ui/react';

const View = () => {
    // Mocked transaction history data
    const transactions = [
        { id: 1, date: '2023-07-01', amount: '0.5 BTC', sender: 'Sender A', receiver: 'Receiver B' },
        { id: 2, date: '2023-07-02', amount: '1 ETH', sender: 'Sender C', receiver: 'Receiver D' },
        { id: 3, date: '2023-07-03', amount: '0.2 LTC', sender: 'Sender E', receiver: 'Receiver F' },
    ];

    return (
        <List spacing={4}>
            {transactions.map((transaction) => (
                <ListItem key={transaction.id}>
                    <Text>Date: {transaction.date}</Text>
                    <Text>Amount: {transaction.amount}</Text>
                    <Text>Sender: {transaction.sender}</Text>
                    <Text>Receiver: {transaction.receiver}</Text>
                </ListItem>
            ))}
        </List>
    );
};

export default View;

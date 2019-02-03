interface Message {
    id: number;
    username: string;
    body: string;
    time: Date;
}

export default function useShoutbox(): [Message[]] {
    return [
        [
            {
                id: 5,
                username: 'Koen',
                body: 'Bericht',
                time: new Date(),
            },
        ],
    ];
}

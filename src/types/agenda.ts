export interface TAgenda {
    title: string;
}

export interface TFAgenda {
    timeStamp: string;
    session: TAgenda[];
}
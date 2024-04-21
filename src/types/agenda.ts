export interface TAgenda {
  sessionTitle: string;
  id?: number;
  created_at?: string;
  activity?: string;
  startDateTime?: string;
  endDateTime?: string;
  Track?: string;
  sessionType?: string;
  sessionVenue?: string;
  sessionUrl?: string;
  sessionSpeakers?: JSON;
  sessionModerators?: JSON;
  sessionFiles?: string;
  sessionViews?: number;
  sessionViewsDetails?: JSON;
  sessionCheckin?: string;
  sessionCheckinDetails?: JSON;
}

export interface TFAgenda {
  timeStamp: string;
  session: TAgenda[];
}

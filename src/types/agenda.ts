import { TAttendee, TPartner } from ".";



type TSessionFile<T> = {
  size: string;
  file: T;
  name: string;
  id: string;
};
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
  sessionSpeakers?: TAttendee[];
  sessionModerators?: TAttendee[];
  sessionSponsors?: TPartner[];
  sessionFiles?: TSessionFile<string>[];
  sessionViews?: number;
  sessionViewsDetails?: JSON;
  sessionCheckin?: string;
  sessionCheckinDetails?: JSON;
  eventId?:string;
}

export interface TFAgenda {
  timeStamp: string;
  session: TAgenda[];
}

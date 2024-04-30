import { TAttendee, TPartner, TUser } from ".";



type TSessionFile<T> = {
  size: string;
  file: T;
  name: string;
  id: string;
};
export interface TAgenda {
  sessionTitle: string;
  id: number;
  eventAlias: string;
  description:string;
  created_at: string;
  activity: string;
  startDateTime: string;
  endDateTime: string;
  Track: string;
  sessionType: string;
  sessionVenue: string;
  sessionUrl: string;
  sessionSpeakers: TAttendee[];
  sessionModerators: TAttendee[];
  sessionSponsors: TPartner[];
  sessionFiles: TSessionFile<string>[];
  sessionViews: number;
  sessionViewsDetails: TUser[];
  sessionCheckin: string;
  sessionCheckinDetails: JSON;
  eventId:string;
  sessionAlias:string;
}

export interface TSessionAgenda {
  timeStamp: {start: string; end: string;};
  sessions: TAgenda[];
}


export interface TReview {
    rating: number;
    comments: string;
    sessionId?:number;
    attendeeId?:number;
}

export interface TMyAgenda {
  sessionId: number;
  attendeeId: number;
  sessionAlias: string;

}
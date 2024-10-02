import { TAttendee } from "./attendee";
import { TOrganization } from "./organization";

export interface TBadge {
  id?: number;
  created_at?: string;
  eventAlias: string;
  title: string;
  settings: TBadgeSettings;
  previewUrl: string;
  lastEdited: Date;
  badgeAlias?: string;
  badgeHash: Record<string, any>;
}


export interface TBadgeSettings {
  canReceive: {
    eventAttendees: boolean;
    quizParticipants: boolean;
    sessionAttendees: boolean;
    trackAttendees: boolean;
    exceptions: number[];
  };
  
}

export interface TBadgeTemplate {
  id: number;
  created_at: string;
  BadgeFigmaName: string;
  BadgeUrl: string;
  BadgeTemplate: string;
}

export interface TAttendeeBadge {
  id: bigint;
  created_at: Date;
  eventId: bigint;
  attendeeEmail: string;
  badgeId: string;
  badgeURL: string;
  attendeeId: bigint;
  badgeGroupId: bigint;
  badgeName: string;
  eventAlias: string;
}

export type TFullBadge = TAttendeeBadge & {
  originalBadge: TBadge & {
    event: Event & { organization: TOrganization };
  };
  attendee: TAttendee;
};

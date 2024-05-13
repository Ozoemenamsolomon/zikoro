import { TAttendee } from "./attendee";
import { TOrganization } from "./organization";

export interface TBadge {
  id?: number;
  created_at?: string;
  eventId: number;
  eventAlias: string;
  badgeName: string;
  badgeDetails: any;
  badgeSettings: any;
  badgeBackground: string;
  badgeUrl: string;
  lastEdited: Date;
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

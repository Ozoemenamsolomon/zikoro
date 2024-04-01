export interface TBadge {
  id?: number;
  created_at?: string;
  eventId: number;
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

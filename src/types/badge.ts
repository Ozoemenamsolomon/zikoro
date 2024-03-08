export interface TBadge {
  id?: number;
  created_at?: string;
  eventId: number;
  badgeName: string;
  BadgeDetails: any;
  badgeSettings: any;
  badgeBackground: string;
  badgeUrl: string;
}

export interface TBadgeTemplate {
  id: number;
  created_at: string;
  BadgeFigmaName?: string;
  BadgeUrl?: string;
  BadgeTemplate?: string;
}

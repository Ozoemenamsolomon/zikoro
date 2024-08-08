export interface EngagementsSettings {
  id: number;
  created_at: string;
  eventAlias: string;
  pointsAllocation: TPointsAllocation;
}

export type TPointsAllocation = {
  [key: string]: {
    maxOccurrence: number;
    points: number;
    maxPoints: number;
    status: boolean;
  };
};

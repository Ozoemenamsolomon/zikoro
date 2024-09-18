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

export interface TEngagementFormQuestion {
  id: number;
  created_at: string;
  title: string;
  description: string;
  coverImage: string | any;
  createdBy: number;
  updatedAt: string;
  isActive: boolean;
  expirationDate: string;
  questions: {
question: string;
questionImage?: string | any;
selectedType: string;
isRequired: boolean;
questionId: string;
optionFields?: any;
  }[];
  formAlias: string;
  eventAlias: string;
}

export interface TEngagementFormAnswer {
  id: number;
  created_at: string;
  formAlias: string;
  userId: number | null;
  submittedAt: string;
  responses: any;
  formResponseAlias: string;
  eventAlias: string;
  attendeeAlias: string;
}

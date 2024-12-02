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
  formSettings: {
    isConnectedToEngagement: boolean;
    showForm: string;
    redirectUrl?: string;
    isCollectUserEmail: boolean;
    isCoverScreen: boolean;
    displayType: string;
    questionPerSlides?: string;
    titleFontSize: string;
    headingFontSize: string;
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    textFontSize: string;
    isCoverImage: boolean;
    buttonText:string;
  };
}

export interface TEngagementFormAnswer {
  id: number;
  created_at: string;
  formAlias: string;
  userId: string | null;
  submittedAt: string;
  responses: {
    type: string;
    questionId: string;
    response?: any;
  }[];
  formResponseAlias: string;
  eventAlias: string;
  attendeeAlias: string;
  attendeeEmail?: string;
  attendeeId: number | null;
  formEngagementPoints: number | null;
}

export interface TFormattedEngagementFormAnswer {
  id: number;
  created_at: string;
  formAlias: string;
  userId: string | null;
  submittedAt: string;
  type: string;
  questionId: string;
  response?: any;
  formResponseAlias: string;
  eventAlias: string;
  attendeeAlias: string;
  attendeeEmail?: string;
  attendeeId: number | null;
  question: string;
  questionImage?: string | any;
  optionFields: any;
}

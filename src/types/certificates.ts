import { TAttendee } from "@/types/attendee";

export type TAttendeeCertificate = {
  id?: number;
  created_at: string;
  eventId: number;
  attendeeEmail: string;
  certificateId: string;
  CertificateGroupId: number;
  certificateURL: string;
  CertificateName: string;
  attendeeId: number;
};

export interface TCertificateSettings {
  size: string;
  orientation: string;
  canReceive: {
    eventAttendees: boolean;
    trackAttendees: boolean;
    sessionAttendees: boolean;
    quizParticipants: boolean;
  };
  criteria: number;
  canExpire: boolean;
  expiryDate: Date;
  skills: string[];
}

export interface TCertificateDetails {
  verification: { showId: boolean; showQRCode: boolean; showURL: boolean };
  background: string | null;
  craftHash: string;
}
export interface TCertificate {
  id?: number;
  created_at?: Date;
  eventId: number;
  certificateName: string;
  certficateDetails: TCertificateDetails;
  certificateSettings?: TCertificateSettings;
  cerificateUrl?: string;
}

export type TFullCertificate = TAttendeeCertificate & {
  certificate: TCertificate;
  attendee: TAttendee;
};

export interface CertificateTemplate {
  id: number;
  created_at: Date;
  templateName: string;
  templateUrl: string;
  category: string;
  figmaName: string;
}

export interface certificateAsset {
  id: string;
  position: { x: number; y: number };
}

export interface certificateElement extends certificateAsset {
  size: { x: number; y: number };
  url: string;
}

export interface certificateText extends certificateAsset {
  style: {
    fontSize: number;
    isBold: boolean;
    color: string;
    isItalic: boolean;
  };
  text: string;
}

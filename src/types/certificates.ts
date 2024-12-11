import { TAttendee } from "@/types/attendee";
import { SerializedNodes } from "@craftjs/core";
import { Event } from "./events";
import { TOrganization } from "./organization";

export type TAttendeeCertificate = {
  id?: number;
  created_at: string;
  eventId: number;
  eventAlias: string;
  attendeeEmail: string;
  certificateId: string;
  CertificateGroupId: number;
  certificateURL: string;
  CertificateName: string;
  attendeeId: number;
};

export type TIssuedCertificate = TAttendeeCertificate & {
  certificate: TCertificate;
};

type ValuePiece = Date | null;

export interface TCertificateDetails {
  verification: { showId: boolean; showQRCode: boolean; showURL: boolean };
  background: string | null;
  craftHash: string;
}
export interface TCertificate {
  id?: number;
  created_at?: Date;
  eventAlias: string;
  title: string;
  settings: TCertificateSettings;
  event?: Event;
  lastEdited: Date;
  previewUrl: string;
  certificateHash: Record<string, any>;
  certificateAlias?: string;
}

export interface TCertificateSettings {
  canReceive: {
    eventAttendees: boolean;
    trackAttendees: boolean;
    sessionAttendees: boolean;
    quizParticipants: boolean;
    exceptions?: number[];
  };
  criteria: number;
  canExpire: boolean;
  expiryDate: Date;
  skills: { color: string; value: string }[];
  publishOn: Date;
}

export type TFullCertificate = TAttendeeCertificate & {
  originalCertificate: TCertificate & {
    event: Event & { organization: TOrganization };
  };
  attendee: TAttendee;
};

export interface CertificateTemplate {
  id: number;
  created_at: Date;
  templateName: string;
  templateUrl: string;
  certificateTemplate: string;
  category: string;
  figmaName: string;
  colour: string;
}

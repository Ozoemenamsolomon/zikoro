import { TAttendee } from "@/types/attendee";
import { SerializedNodes } from "@craftjs/core";
import { TEvent } from "./events";
import { TOrganization } from "./organization";

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
    exceptions?: number[];
  };
  criteria: number;
  canExpire: boolean;
  expiryDate: Date;
  skills: { color: string; value: string }[];
  publishOn: Date;
}

export interface TCertificateDetails {
  verification: { showId: boolean; showQRCode: boolean; showURL: boolean };
  background: string | null;
  craftHash: string | SerializedNodes;
}
export interface TCertificate {
  id?: number;
  created_at?: Date;
  eventId: number;
  certificateName: string;
  certficateDetails: TCertificateDetails;
  certificateSettings: TCertificateSettings;
  cerificateUrl?: string;
  event?: TEvent;
  lastEdited: Date;
}

export type TFullCertificate = TAttendeeCertificate & {
  certificate: TCertificate;
  attendee: TAttendee;
  event: TEvent & { organization: TOrganization };
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

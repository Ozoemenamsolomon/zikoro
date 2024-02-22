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

export type TCertificate = {
  id: number;
  created_at?: string;
  eventId: string;
  certificateName: string;
  certificateHeading: string;
  TrainingDuration: number;
  cpdRequired: boolean;
  logoPosition: string;
  trainingScope: string[];
  zikoroLogo: boolean;
  certficateTemplate: string;
  attendance: number[];
  attendanceRate: number;
  criteria: string[];
  organisationLogo: string;
  cpdPoints: number;
};

export type TFullCertificate = TAttendeeCertificate & {
  certificate: TCertificate;
  attendee: TAttendee;
};

export interface CertificateTemplate {
  id: number;
  created_at: Date;
  templateName?: string | null;
  templateUrl?: string | null;
  category?: string | null;
  figmaName?: string | null;
}

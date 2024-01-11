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
};

export type TFullCertificate = TAttendeeCertificate & {
  certificate: TCertificate;
  attendee: TAttendee;
};

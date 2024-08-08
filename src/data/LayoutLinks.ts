import { TLink } from "@/components/Sidebar";

export const PeopleLinks: (TLink & { hideFromAttendee?: boolean })[] = [
  { name: "All", href: "all" },
  {
    name: "released certificates",
    href: "released_certificates",
    hideFromAttendee: true,
  },
  { name: "favorites", href: "favorites" },
  { name: "tags", href: "tags" },
  { name: "notes", href: "notes" },
  { name: "invites", href: "invites", hideFromAttendee: true },
];

export const ContentLinks: TLink[] = [
  {
    name: "Event",
    href: "event",
  },
  {
    name: "Contact",
    href: "contact",
  },
  {
    name: "Certificate",
    href: "certificate",
  },
  {
    name: "Badge",
    href: "badge",
  },
  {
    name: "Discount",
    href: "discount",
  },
];

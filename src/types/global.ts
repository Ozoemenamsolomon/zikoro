export interface NavLinkType {
    name: string;
    href: string;
    icon: ({ color }: { color: string }) => React.JSX.Element;
  }
  
  export interface AdminNavLinkType {
    name: string;
    href: string;
    image:string
  }
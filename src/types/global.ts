export interface NavLinkType {
    name: string;
    href: string;
    icon: ({ color }: { color: string }) => React.JSX.Element;
  }
  
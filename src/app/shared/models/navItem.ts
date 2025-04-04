export interface NavItem {
    displayName: string;
    disabled?: boolean;
    iconName: string;
    route?: string;
    params?: object;
    children?: NavItem[];
    extraInfo?: string;
  }
  
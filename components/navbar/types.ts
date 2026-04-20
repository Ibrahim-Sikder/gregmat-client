export interface NavItem {
  subCategoryname: string;
  subTitle: string;
  iconName: string;
  href: string;
  target?: string;
}

export interface NavCategory {
  categoryname: string;
  children?: NavItem[];
  href?: string;
}

export type TNavLinks = NavCategory[];

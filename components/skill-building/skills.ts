export interface Activity {
  id: string | number;
  title: string;
  slug: string;
  details?: string;
  date?: string;
  done?: boolean;
}
export interface Paragraph {
  id: number;
  title: string;
  text: string;
}


export interface FlashCourse {
  _id: string;
  title: string;
  order: number;
  ongoing: boolean;
  thumbnail_size: number;
  slug: string;
  description: string;
  img: string | null;
  banner: string | null;
  classgroups: ClassGroup[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ClassGroup {
  _id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  img: string | null;
  classes: ClassItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ClassItem {
  _id: string;
  title: string;
  slug: string;
  remarks_for_upcoming_page: string | null;
  description: string;
  img: string | null;
  class_type: string;
  plus_only: boolean;
  thumbnail_size: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

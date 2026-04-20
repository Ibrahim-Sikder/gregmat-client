export interface Video {
  url: string | null;
  embed_code: string;
  duration: number;
}

export interface Content {
  _id: string;
  title: string;
  slug: string;
  description: string;
  plus_only: boolean;
  finalized: boolean;
  unlisted: boolean;
  video: Video;
  associated_mountain_content: null | any;
  categoryId?: string;
  courseId?: string;
  createdAt: string;
  updatedAt: string;
  saved: boolean;
  watched: boolean;
  watchProgress?: number;
  lastWatchedPosition?: number;
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  description: string;
  contents: Content[];
  saved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  is_prepswift: boolean;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ContentItem {
  _id: string;
  courseId: string;
  categoryId: string;
  contentId: string;
  contentTitle: string;
  videoUrl?: string;
  saved: boolean;
  watched: boolean;
  courseTitle: string;
  categoriesTitle: string;
}

export interface BookmarkedContent {
  categoryId: string;
  categoryTitle: string;
  contents: ContentItem[];
}

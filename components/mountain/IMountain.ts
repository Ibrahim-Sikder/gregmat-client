export interface MountainCategory {
  _id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  totalContents: number;
  mountain_contents: Array<{
    _id: string;
    title: string;
    slug: string;
    pronunciation: string;
    tooltip: string;
    description: string;
    plus_only: boolean;
    finalized: boolean;
    unlisted: boolean;
    colors: Record<string, string>;
    order: number;
  }>;
}

export interface MountainContent {
  _id: string;
  title: string;
  slug: string;
  pronunciation: string;
  tooltip: string;
  description: string;
  plus_only: boolean;
  finalized: boolean;
  unlisted: boolean;
  colors: Record<string, string>;
  order: number;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  loadedItems: number;
}

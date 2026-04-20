export interface Group {
  _id: string;
  title: string;
  slug: string;
}

export interface IClass {
  _id: string;
  title: string;
  slug: string;
  description: string;
  groupId: Group;
  order: number;
  classType: string;
  img: string;
  thumbnailSize: number;
  plusOnly: boolean;
  video: string;
  homeworks: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

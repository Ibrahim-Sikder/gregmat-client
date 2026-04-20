export type TBlog = {
  id: number;
  slug: string;
  title: string;
  subTitle: string;
  description: string;
  image: string;
  author: {
    name: string;
    image: string;
    date: string;
  };
};

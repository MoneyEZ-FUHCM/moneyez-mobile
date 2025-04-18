export interface Post {
  title: string;
  content: string;
  shortContent: string;
  thumbnail: string;
  id: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  isDeleted: boolean;
}

export type PostList = Post[];

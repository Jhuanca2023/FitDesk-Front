export interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  category?: string; 
  categories?: string[]; 
  author: string;
}

export type Project = {
  id: string;
  title: string;
  description: string;
  link: string | null;
  imageUrl: string | null;
  tags: string[];
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
  employmentType: string | null;
  skills: string[];
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

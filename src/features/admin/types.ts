export type Project = {
  id: string;
  title: string;
  description: string;
  link: string | null;
  imageUrl: string | null;
  /** Appwrite file id when the cover was uploaded; null for external URLs. */
  imageFileId: string | null;
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

/** An uploaded image documenting an accomplishment within an experience. */
export type Accomplishment = {
  id: string;
  experienceId: string;
  fileId: string;
  imageUrl: string;
  caption: string | null;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

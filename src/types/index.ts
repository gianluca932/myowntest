export interface TMessages {
  id: string;
  text: string;
  userId: string;
  displayName: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string;
}

export interface TThreads {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string;
  createdBy?: UserState;
  messages?: TMessages[];
}

export interface UserState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string;
}

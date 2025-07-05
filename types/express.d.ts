import { User } from './user';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
    
    interface User {
      id: string;
      userId: string;
      name: string;
      email: string;
      phoneNumber?: string;
      image?: string;
      campusId: string;
      campus?: {
        id: string;
        name: string;
      };
      userOrganizations: any[];
      isSuspended: boolean;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

export {};
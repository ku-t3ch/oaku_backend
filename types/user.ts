export interface User {
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
  userOrganizations: UserOrganization[];
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserOrganization {
  id: string;
  userId: string;
  organizationId: string;
  role: Role;
  position: Position;
  joinedAt: Date;
  organization: {
    id: string;
    nameEn: string;
    nameTh: string;
    email: string;
  };
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  CAMPUS_ADMIN = 'CAMPUS_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum Position {
  HEAD = 'HEAD',
  MEMBER = 'MEMBER',
  NON_POSITION = 'NON_POSITION'
}

export interface JWTUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
  campusId?: string;
  userOrganizations: UserOrganization[];
  isSuspended: boolean;
}
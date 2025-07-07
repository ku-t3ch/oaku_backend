export interface UserRole {
  id: string;
  userId: string;
  role: Role;
  campusId?: string;
  createdAt: Date;
  campus?: {
    id: string;
    name: string;
  };
}

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
  userRoles?: UserRole[]; // ✅ เพิ่ม userRoles
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserOrganization {
  id: string;
  userId: string;
  organizationId: string;
  userIdCode: string;
  organizationIdCode: string;
  role: Role; // ✅ จะเป็น USER เสมอ
  position: Position;
  joinedAt: Date;
  organization: {
    id: string;
    publicOrganizationId: string;
    nameEn: string;
    nameTh: string;
    image: string;
    details: string;
    email: string;
    phoneNumber?: string;
    campus: {
      id: string;
      name: string;
    };
    organizationType: {
      id: string;
      name: string;
    };
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
  roles: Role[]; // ✅ เปลี่ยนเป็น array
  campusId?: string;
  userOrganizations: UserOrganization[];
  userRoles?: UserRole[]; // ✅ เพิ่ม userRoles
  isSuspended: boolean;
}
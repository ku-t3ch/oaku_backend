import { Role, Position } from "@prisma/client"; // เพิ่มบรรทัดนี้

export interface UserRole {
  id: string;
  userId: string;
  role: Role;
  campusId?: string | null;
  createdAt: Date;
  campus?: {
    id: string;
    name: string;
  }|null;
}

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  image?: string | null;
  campusId: string;
  campus?: {
    id: string;
    name: string;
  };
  userOrganizations: UserOrganization[];
  userRoles?: UserRole[];
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
  role: Role; // จะเป็น USER เสมอ
  position: Position;
  joinedAt: Date;
  organization: {
    id: string;
    publicOrganizationId: string;
    nameEn: string;
    nameTh: string;
    image: string | null;
    details: string;
    email: string;
    phoneNumber?: string | null;
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


export interface JWTUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  roles: Role[];
  campusId?: string;
  userOrganizations: UserOrganization[];
  userRoles?: UserRole[];
  isSuspended: boolean;
}

import { User} from '../types/user';

export function transformUser(user: User) {
  return {
    id: user.id,
    userId: user.userId,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    image: user.image,
    isSuspended: user.isSuspended,
    campus: user.campus ? { id: user.campus.id, name: user.campus.name } : null,
    userRoles: user.userRoles?.map((ur: any) => ({
      id: ur.id,
      role: ur.role,
      campus: ur.campus ? { id: ur.campus.id, name: ur.campus.name } : null,
    })),
    userOrganizations: user.userOrganizations?.map((uo: any) => ({
      id: uo.id,
      publicOrganizationId: uo.publicOrganizationId,
      role: uo.role,
      position: uo.position,
      isSuspended: uo.isSuspended,
      organization: uo.organization
      
        ? {
            id: uo.organization.id,
            nameEn: uo.organization.nameEn,
            nameTh: uo.organization.nameTh,
            campus: uo.organization.campus

              ? {
                  id: uo.organization.campus.id,
                  name: uo.organization.campus.name,
                }
              : null,
            organizationType: uo.organization.organizationType
              ? {
                  id: uo.organization.organizationType.id,
                  name: uo.organization.organizationType.name,
                }
              : null,
          }
        : null,
    })),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

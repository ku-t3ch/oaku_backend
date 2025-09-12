import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import axios from "axios";
import { prisma } from "./db";

// ---------- GOOGLE STRATEGY ----------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { email: profile.emails?.[0]?.value },
          include: {
            campus: true,
            userOrganizations: {
              include: {
                organization: {
                  include: {
                    campus: true,
                    organizationType: true,
                  },
                },
              },
            },
          },
        });

        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              name: profile.displayName || user.name,
              image: profile.photos?.[0]?.value || user.image,
            },
            include: {
              campus: true,
              userOrganizations: {
                include: {
                  organization: {
                    include: {
                      campus: true,
                      organizationType: true,
                    },
                  },
                },
              },
            },
          });
        } else {
          // สร้างผู้ใช้ใหม่ (ต้องมี campus default)
          const defaultCampus = await prisma.campus.findFirst();
          if (!defaultCampus) {
            return done(new Error("No default campus found"));
          }

          user = await prisma.user.create({
            data: {
              userId: `GOOGLE_${profile.id}`,
              name: profile.displayName || "Unknown User",
              email: profile.emails?.[0]?.value || "",
              image: profile.photos?.[0]?.value,
              campusId: defaultCampus.id,
            },
            include: {
              campus: true,
              userOrganizations: {
                include: {
                  organization: {
                    include: {
                      campus: true,
                      organizationType: true,
                    },
                  },
                },
              },
            },
          });
        }

        return done(null, user as any);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, null as any);
      }
    }
  )
);

// ---------- KU ALL LOGIN STRATEGY ----------
passport.use(
  "kualllogin",
  new OAuth2Strategy(
    {
      authorizationURL: process.env.KUALL_AUTHORIZATION_ENDPOINT!,
      tokenURL: process.env.KUALL_TOKEN_ENDPOINT!,
      clientID: process.env.KUALL_CLIENT_ID!,
      clientSecret: process.env.KUALL_CLIENT_SECRET!,
      callbackURL: process.env.KUALL_REDIRECT_URI!,
      scope: ["openid", "profile", "email"],
    },
    async (accessToken, refreshToken, params, profile, done) => {
      try {
        const kuProfile = await axios.get(
          process.env.KUALL_USER_INFO_ENDPOINT!,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        console.log("KU ALL Profile:", kuProfile.data);
        const kuUser = kuProfile.data;

        // Filter เฉพาะ type-person ที่อนุญาต (1,2,3,7,8)
        const allowedTypes = ["1", "2", "3", "7", "8"];
        if (!allowedTypes.includes(String(kuUser["type-person"]))) {
          return done(
            new Error("คุณไม่มีสิทธิ์เข้าใช้งานระบบ (type-person not allowed)")
          );
        }

        // Transform ข้อมูล KU ALL เป็นข้อมูลสำหรับ database
        const transformedData = {
          userId: kuUser.uid || kuUser.userprincipalname || kuUser.sub,
          name:
            kuUser.thainame ||
            kuUser.name ||
            `${kuUser["first-name"] || ""} ${
              kuUser["last-name"] || ""
            }`.trim() ||
            "Unknown User",
          email:
            kuUser.email ||
            kuUser["google-mail"] ||
            kuUser["office365-mail"] ||
            "",

          facultyId: kuUser["faculty-id"],
          facultyName: kuUser.faculty,
          departmentId: kuUser["department-id"],
          departmentName: kuUser.department,
          typePerson: kuUser["type-person"],
          position: kuUser.position,
          image: null,
        };

        // หา campus จากข้อมูล KU ALL
        let campusId: string;
        const campusMapping: { [key: string]: string } = {
          B: "วิทยาเขตบางเขน",
          K: "วิทยาเขตกำแพงแสน",
          C: "วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร",
          S: "วิทยาเขตศรีราชา",
        };

        const campusName = campusMapping[kuUser.campus];
        if (campusName) {
          const campus = await prisma.campus.findFirst({
            where: { name: campusName },
          });
          campusId = campus?.id || "";
        } else {
          // ถ้าไม่เจอ campus ให้ใช้ default
          const defaultCampus = await prisma.campus.findFirst();
          if (!defaultCampus) {
            return done(new Error("No default campus found"));
          }
          campusId = defaultCampus.id;
        }

        // หา user ในระบบ
        let user = await prisma.user.findUnique({
          where: { email: transformedData.email },
          include: {
            campus: true,
            userOrganizations: {
              include: {
                organization: {
                  include: {
                    campus: true,
                    organizationType: true,
                  },
                },
              },
            },
          },
        });

        if (user) {
          // อัพเดทข้อมูลผู้ใช้ที่มีอยู่
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              name: transformedData.name,
              campusId: campusId || user.campusId,
            },
            include: {
              campus: true,
              userOrganizations: {
                include: {
                  organization: {
                    include: {
                      campus: true,
                      organizationType: true,
                    },
                  },
                },
              },
            },
          });
        } else {
          // สร้างผู้ใช้ใหม่
          user = await prisma.user.create({
            data: {
              userId: `KUALL_${transformedData.userId}`,
              name: transformedData.name,
              email: transformedData.email,
              campusId: campusId,
            },
            include: {
              campus: true,
              userOrganizations: {
                include: {
                  organization: {
                    include: {
                      campus: true,
                      organizationType: true,
                    },
                  },
                },
              },
            },
          });

          // สร้าง UserOrganization ถ้าสามารถหาองค์กรที่ตรงกันได้
          if (transformedData.facultyId || transformedData.facultyName) {
            try {
              // ลองหาองค์กรจาก faculty-id หรือชื่อ faculty
              let organization = await prisma.organization.findFirst({
                where: {
                  AND: [
                    { campusId: campusId },
                    {
                      OR: [
                        transformedData.facultyId
                          ? {
                              publicOrganizationId: {
                                contains: transformedData.facultyId,
                              },
                            }
                          : undefined,
                        transformedData.facultyName
                          ? {
                              nameTh: { contains: transformedData.facultyName },
                            }
                          : undefined,
                        transformedData.facultyName
                          ? {
                              nameEn: { contains: transformedData.facultyName },
                            }
                          : undefined,
                      ].filter(
                        (item): item is Exclude<typeof item, undefined> =>
                          item !== undefined
                      ) as any, // <-- add as any to satisfy TS
                    },
                  ],
                },
              });

              // ถ้าไม่เจอจาก faculty ให้ลองหาจาก department
              if (
                !organization &&
                (transformedData.departmentId || transformedData.departmentName)
              ) {
                organization = await prisma.organization.findFirst({
                  where: {
                    AND: [
                      { campusId: campusId },
                      {
                        OR: [
                          transformedData.departmentId
                            ? {
                                publicOrganizationId: {
                                  contains: transformedData.departmentId,
                                },
                              }
                            : undefined,
                          transformedData.departmentName
                            ? {
                                nameTh: {
                                  contains: transformedData.departmentName,
                                },
                              }
                            : undefined,
                          transformedData.departmentName
                            ? {
                                nameEn: {
                                  contains: transformedData.departmentName,
                                },
                              }
                            : undefined,
                        ].filter(
                          (item): item is Exclude<typeof item, undefined> =>
                            item !== undefined
                        ) as any, // <-- add as any to satisfy TS
                      },
                    ],
                  },
                });
              }

              if (organization) {
                let userPosition: "HEAD" | "MEMBER" = "MEMBER";

                // Teachers (type-person = 1) หรือตำแหน่งบริหาร
                if (transformedData.typePerson === "1") {
                  userPosition = "HEAD";
                } else if (
                  transformedData.position &&
                  (transformedData.position.includes("หัวหน้า") ||
                    transformedData.position.includes("ผู้อำนวยการ") ||
                    transformedData.position.includes("คณบดี") ||
                    transformedData.position.includes("รองคณบดี") ||
                    transformedData.position.includes("ผู้ช่วยคณบดี"))
                ) {
                  userPosition = "HEAD";
                }

                await prisma.userOrganization.create({
                  data: {
                    userId: user.id,
                    organizationId: organization.id,
                    userIdCode: transformedData.userId,
                    publicOrganizationId: organization.publicOrganizationId,
                    role: "USER",
                    position: userPosition,
                  },
                });

                console.log(
                  `Created UserOrganization: ${transformedData.name} -> ${organization.nameTh} (${userPosition})`
                );
              } else {
                console.warn(
                  `Warning: Could not find matching organization for faculty: ${transformedData.facultyName} (${transformedData.facultyId}) or department: ${transformedData.departmentName} (${transformedData.departmentId})`
                );
              }
            } catch (orgError) {
              console.warn(
                "Warning: Could not create user organization:",
                orgError
              );
            }
          }
        }

        return done(null, user as any);
      } catch (error) {
        console.error("KU ALL OAuth error:", error);
        return done(error, null as any);
      }
    }
  )
);

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          include: {
            campus: true,
            userOrganizations: {
              include: {
                organization: {
                  include: {
                    campus: true,
                    organizationType: true,
                  },
                },
              },
            },
          },
        });

        if (user && !user.isSuspended) {
          return done(null, user);
        }

        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize/Deserialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        campus: true,
        userOrganizations: {
          include: {
            organization: {
              include: {
                campus: true,
                organizationType: true,
              },
            },
          },
        },
      },
    });
    done(null, user as any);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

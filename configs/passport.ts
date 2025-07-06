import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { prisma } from "./db";

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

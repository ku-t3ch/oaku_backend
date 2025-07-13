import { PrismaClient } from "@prisma/client";
import {ComplianceStandard,KasetsartStudentIdentity,SDG} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clear existing data first (ลำดับสำคัญ!)
  await prisma.activityHour.deleteMany();
  await prisma.log.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userOrganization.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.organizationType.deleteMany();
  await prisma.campus.deleteMany();

  console.log("Cleared existing data");

  // --- Create Campuses ---
  const bangkokCampus = await prisma.campus.create({
    data: { name: "วิทยาเขตบางเขน" },
  });

  const kamphaengSaenCampus = await prisma.campus.create({
    data: { name: "วิทยาเขตกำแพงแสน" },
  });

  const sakonNakhonCampus = await prisma.campus.create({
    data: { name: "วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร" },
  });

  const srirachaCampus = await prisma.campus.create({
    data: { name: "วิทยาเขตศรีราชา" },
  });

  console.log("Created campuses");

  // --- Create Organization Types ---
  const facultyTypeBKK = await prisma.organizationType.create({
    data: { name: "คณะ", campusId: bangkokCampus.id },
  });
  const instituteTypeBKK = await prisma.organizationType.create({
    data: { name: "สถาบัน", campusId: bangkokCampus.id },
  });
  const officeTypeBKK = await prisma.organizationType.create({
    data: { name: "สำนักงาน", campusId: bangkokCampus.id },
  });
  const centerTypeBKK = await prisma.organizationType.create({
    data: { name: "ศูนย์", campusId: bangkokCampus.id },
  });
  const graduateSchoolTypeBKK = await prisma.organizationType.create({
    data: { name: "บัณฑิตวิทยาลัย", campusId: bangkokCampus.id },
  });

  // Kamphaeng Saen Campus Types
  const facultyTypeKPS = await prisma.organizationType.create({
    data: { name: "คณะ", campusId: kamphaengSaenCampus.id },
  });
  const officeTypeKPS = await prisma.organizationType.create({
    data: { name: "สำนักงานวิทยาเขต", campusId: kamphaengSaenCampus.id },
  });

  // Sakon Nakhon Campus Types
  const facultyTypeSNK = await prisma.organizationType.create({
    data: { name: "คณะ", campusId: sakonNakhonCampus.id },
  });
  const officeTypeSNK = await prisma.organizationType.create({
    data: { name: "สำนักงานวิทยาเขต", campusId: sakonNakhonCampus.id },
  });

  // Sri Racha Campus Types
  const facultyTypeSR = await prisma.organizationType.create({
    data: { name: "คณะ", campusId: srirachaCampus.id },
  });

  console.log("Created organization types");

  // --- Create Organizations ---
  const organizations = await Promise.all([
    // organizations[0] = Faculty of Agriculture (BKK)
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-AGRI-001",
        nameEn: "Faculty of Agriculture",
        nameTh: "คณะเกษตร",
        image: "https://example.com/agri-logo.jpg",
        details: "คณะเกษตรศาสตร์ เป็นคณะแรกของมหาวิทยาลัยเกษตรศาสตร์",
        socialMedia: [
          { platform: "Facebook", url: "https://facebook.com/ku.agri" },
        ],
        email: "agri@ku.ac.th",
        phoneNumber: "02-579-0100",
        campusId: bangkokCampus.id,
        organizationTypeId: facultyTypeBKK.id,
      },
    }),
    // organizations[1] = Faculty of Engineering (BKK)
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-ENG-002",
        nameEn: "Faculty of Engineering",
        nameTh: "คณะวิศวกรรมศาสตร์",
        image: "https://example.com/eng-logo.jpg",
        details: "คณะวิศวกรรมศาสตร์ มุ่งเน้นการพัฒนาเทคโนโลยีเพื่อเกษตรกรรม",
        socialMedia: [
          { platform: "Facebook", url: "https://facebook.com/ku.eng" },
        ],
        email: "eng@ku.ac.th",
        phoneNumber: "02-579-0200",
        campusId: bangkokCampus.id,
        organizationTypeId: facultyTypeBKK.id,
      },
    }),
    // organizations[2] = Faculty of Science (BKK)
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-SCI-003",
        nameEn: "Faculty of Science",
        nameTh: "คณะวิทยาศาสตร์",
        image: "https://example.com/sci-logo.jpg",
        details: "คณะวิทยาศาสตร์ ผลิตบัณฑิตด้านวิทยาศาสตร์และเทคโนโลยี",
        socialMedia: [
          { platform: "Facebook", url: "https://facebook.com/ku.sci" },
        ],
        email: "sci@ku.ac.th",
        phoneNumber: "02-579-0300",
        campusId: bangkokCampus.id,
        organizationTypeId: facultyTypeBKK.id,
      },
    }),
    // organizations[3] = Graduate School (BKK)
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-GRAD-004",
        nameEn: "Graduate School",
        nameTh: "บัณฑิตวิทยาลัย",
        image: "https://example.com/grad-logo.jpg",
        details: "บัณฑิตวิทยาลัย บริหารจัดการหลักสูตรระดับบัณฑิตศึกษา",
        email: "grad@ku.ac.th",
        phoneNumber: "02-579-2000",
        campusId: bangkokCampus.id,
        organizationTypeId: graduateSchoolTypeBKK.id,
      },
    }),
    // organizations[4] = Office of the President (BKK)
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-OFFICE-PRES-005",
        nameEn: "Office of the President",
        nameTh: "สำนักงานอธิการบดี",
        image: "https://example.com/office-pres-logo.jpg",
        details: "บริหารจัดการและสนับสนุนการดำเนินงานของมหาวิทยาลัย",
        email: "president.office@ku.ac.th",
        phoneNumber: "02-579-0100",
        campusId: bangkokCampus.id,
        organizationTypeId: officeTypeBKK.id,
      },
    }),

    // organizations[5] = Faculty of Agriculture at Kamphaeng Saen (KPS)
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-KPS-AGRI-006",
        nameEn: "Faculty of Agriculture at Kamphaeng Saen",
        nameTh: "คณะเกษตร กำแพงแสน",
        image: "https://example.com/kps-agri-logo.jpg",
        details: "มุ่งเน้นการวิจัยและพัฒนาการเกษตรในพื้นที่",
        email: "kps.agri@ku.ac.th",
        phoneNumber: "034-351-800",
        campusId: kamphaengSaenCampus.id,
        organizationTypeId: facultyTypeKPS.id,
      },
    }),
    // organizations[6] = Kamphaeng Saen Campus Office (KPS)
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-KPS-OFFICE-007",
        nameEn: "Kamphaeng Saen Campus Office",
        nameTh: "สำนักงานวิทยาเขตกำแพงแสน",
        image: "https://example.com/kps-office-logo.jpg",
        details: "บริหารจัดการงานทั่วไปของวิทยาเขตกำแพงแสน",
        email: "kps.office@ku.ac.th",
        phoneNumber: "034-351-700",
        campusId: kamphaengSaenCampus.id,
        organizationTypeId: officeTypeKPS.id,
      },
    }),

    // organizations[7] = Faculty of Natural Resources and Agro-Industry (SNK)
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-SNK-AGRI-008",
        nameEn: "Faculty of Natural Resources and Agro-Industry",
        nameTh: "คณะทรัพยากรธรรมชาติและอุตสาหกรรมเกษตร",
        image: "https://example.com/snk-agri-logo.jpg",
        details: "พัฒนาทรัพยากรธรรมชาติและอุตสาหกรรมเกษตรในภาคอีสาน",
        email: "snk.agri@ku.ac.th",
        phoneNumber: "042-725-000",
        campusId: sakonNakhonCampus.id,
        organizationTypeId: facultyTypeSNK.id,
      },
    }),
    // organizations[8] = Chalermphrakiat Sakon Nakhon Campus Office (SNK)
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-SNK-OFFICE-009",
        nameEn: "Chalermphrakiat Sakon Nakhon Campus Office",
        nameTh: "สำนักงานวิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร",
        image: "https://example.com/snk-office-logo.jpg",
        details: "บริหารจัดการงานทั่วไปของวิทยาเขตสกลนคร",
        email: "snk.office@ku.ac.th",
        phoneNumber: "042-725-200",
        campusId: sakonNakhonCampus.id,
        organizationTypeId: officeTypeSNK.id,
      },
    }),

    // organizations[9] = Faculty of Science at Sriracha (SR)
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-SR-SCI-010",
        nameEn: "Faculty of Science at Sriracha",
        nameTh: "คณะวิทยาศาสตร์ ศรีราชา",
        image: "https://example.com/sr-sci-logo.jpg",
        details: "เน้นวิทยาศาสตร์และเทคโนโลยีสำหรับอุตสาหกรรม",
        email: "sr.sci@ku.ac.th",
        phoneNumber: "038-354-580",
        campusId: srirachaCampus.id,
        organizationTypeId: facultyTypeSR.id,
      },
    }),
  ]);

  console.log("Created organizations");

  // --- Create Users ---
  const users = await Promise.all([
    // users[0] = SUPER001 (Rawipon: SUPER_ADMIN only, as requested)
    prisma.user.create({
      data: {
        userId: "b6610450366", // Rawipon's actual ID
        name: "รวิพล พลศรุตวานิช",
        email: "rawipon.po@ku.th",
        phoneNumber: "0933244055",
        campusId: bangkokCampus.id, // Primary campus
      },
    }),

    // users[1] = CAMP_BKK001 (CAMPUS_ADMIN for Bangkok only)
    prisma.user.create({
      data: {
        userId: "CAMP_BKK001",
        name: "ผศ.วิชัย บางเขน",
        email: "wichai.bkk@ku.ac.th",
        phoneNumber: "081-333-3333",
        campusId: bangkokCampus.id,
      },
    }),

    // users[2] = CAMP_KPS001 (CAMPUS_ADMIN for Kamphaeng Saen only)
    prisma.user.create({
      data: {
        userId: "CAMP_KPS001",
        name: "รศ.สุดาพร กำแพงแสน",
        email: "sudaporn.kps@ku.ac.th",
        phoneNumber: "081-444-4444",
        campusId: kamphaengSaenCampus.id,
      },
    }),

    // users[3] = CAMP_SNK001 (CAMPUS_ADMIN for Sakon Nakhon only)
    prisma.user.create({
      data: {
        userId: "CAMP_SNK001",
        name: "ดร.นารีรัตน์ สกลนคร",
        email: "nareerat.snk@ku.ac.th",
        phoneNumber: "081-555-5555",
        campusId: sakonNakhonCampus.id,
      },
    }),

    // users[4] = USER_BKK_HEAD_ONLY (Standard user, HEAD of a BKK org)
    prisma.user.create({
      data: {
        userId: "USER_BKK_HEAD_ONLY",
        name: "อ.สมชาย หัวหน้าอย่างเดียว",
        email: "somchai.head@ku.ac.th",
        phoneNumber: "081-666-6666",
        campusId: bangkokCampus.id,
      },
    }),

    // users[5] = USER_BKK_MEMBER_ONLY (Standard user, MEMBER of a BKK org)
    prisma.user.create({
      data: {
        userId: "USER_BKK_MEMBER_ONLY",
        name: "อ.สมหมาย สมาชิกอย่างเดียว",
        email: "sommai.member@ku.ac.th",
        phoneNumber: "081-777-7777",
        campusId: bangkokCampus.id,
      },
    }),

    // users[6] = USER_MULTI_ORG (USER role, multiple organizations with one HEAD)
    prisma.user.create({
      data: {
        userId: "USER_MULTI_ORG",
        name: "อ.สมใจ หลายที่",
        email: "somjai.multi@ku.ac.th",
        phoneNumber: "081-888-8888",
        campusId: bangkokCampus.id,
      },
    }),

    // users[7] = HYBRID_KPS (CAMPUS_ADMIN for KPS + USER in KPS org as HEAD)
    prisma.user.create({
      data: {
        userId: "HYBRID_KPS",
        name: "รศ.ผสม วิทยาเขต",
        email: "mix.campus@ku.ac.th",
        phoneNumber: "082-222-2222",
        campusId: kamphaengSaenCampus.id,
      },
    }),

    // users[8] = USER_SR_HEAD (Standard user, HEAD of a SR org)
    prisma.user.create({
      data: {
        userId: "USER_SR_HEAD",
        name: "ดร.ชลบุรี หัวหน้า",
        email: "chonburi.head@ku.ac.th",
        phoneNumber: "082-555-5555",
        campusId: srirachaCampus.id,
      },
    }),
  ]);

  console.log("Created comprehensive test users");

  // --- Create User Roles ---
  const userRoles = await Promise.all([
    // Rawipon is the ONLY SUPER_ADMIN
    prisma.userRole.create({
      data: {
        userId: users[0].id, // Rawipon (b6610450366)
        role: "SUPER_ADMIN",
      },
    }),

    // CAMPUS_ADMIN roles (single campus each)
    prisma.userRole.create({
      data: {
        userId: users[1].id, // CAMP_BKK001
        role: "CAMPUS_ADMIN",
        campusId: bangkokCampus.id,
      },
    }),
    prisma.userRole.create({
      data: {
        userId: users[2].id, // CAMP_KPS001
        role: "CAMPUS_ADMIN",
        campusId: kamphaengSaenCampus.id,
      },
    }),
    prisma.userRole.create({
      data: {
        userId: users[3].id, // CAMP_SNK001
        role: "CAMPUS_ADMIN",
        campusId: sakonNakhonCampus.id,
      },
    }),

    // HYBRID_KPS (CAMPUS_ADMIN + USER)
    prisma.userRole.create({
      data: {
        userId: users[7].id, // HYBRID_KPS
        role: "CAMPUS_ADMIN",
        campusId: kamphaengSaenCampus.id,
      },
    }),
  ]);

  console.log("Created comprehensive user roles");

  // --- Create User Organization relationships ---
  const userOrganizations = await Promise.all([
    // Rawipon - Default USER role for a SUPER_ADMIN
    prisma.userOrganization.create({
      data: {
        userId: users[0].id, // Rawipon (b6610450366)
        organizationId: organizations[4].id, // Office of the President (BKK)
        userIdCode: users[0].userId,
        organizationIdCode: organizations[4].publicOrganizationId,
        role: "USER",
        position: "HEAD", // Given HEAD as default for all users
      },
    }),

    // CAMP_BKK001 - ADMIN + USER in an org on their campus
    prisma.userOrganization.create({
      data: {
        userId: users[1].id, // CAMP_BKK001
        organizationId: organizations[0].id, // Faculty of Agriculture (BKK)
        userIdCode: users[1].userId,
        organizationIdCode: organizations[0].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),

    // CAMP_KPS001 - ADMIN (also a USER in an org on their campus)
    prisma.userOrganization.create({
      data: {
        userId: users[2].id, // CAMP_KPS001
        organizationId: organizations[5].id, // Faculty of Agriculture at Kamphaeng Saen
        userIdCode: users[2].userId,
        organizationIdCode: organizations[5].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),

    // CAMP_SNK001 - ADMIN (also a USER in an org on their campus)
    prisma.userOrganization.create({
      data: {
        userId: users[3].id, // CAMP_SNK001
        organizationId: organizations[7].id, // Faculty of Natural Resources and Agro-Industry (SNK)
        userIdCode: users[3].userId,
        organizationIdCode: organizations[7].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),

    // USER_BKK_HEAD_ONLY - HEAD of Faculty of Science (BKK)
    prisma.userOrganization.create({
      data: {
        userId: users[4].id, // USER_BKK_HEAD_ONLY
        organizationId: organizations[2].id, // Faculty of Science (BKK)
        userIdCode: users[4].userId,
        organizationIdCode: organizations[2].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),

    // USER_BKK_MEMBER_ONLY - MEMBER of Faculty of Engineering (BKK)
    // NOTE: Per requirement, all users have at least one HEAD position, so this user will also get a HEAD.
    prisma.userOrganization.create({
      data: {
        userId: users[5].id, // USER_BKK_MEMBER_ONLY
        organizationId: organizations[1].id, // Faculty of Engineering (BKK)
        userIdCode: users[5].userId,
        organizationIdCode: organizations[1].publicOrganizationId,
        role: "USER",
        position: "MEMBER", // Keeping MEMBER here for specific test case
      },
    }),
    prisma.userOrganization.create({ // Adding a HEAD role for this user too
      data: {
        userId: users[5].id, // USER_BKK_MEMBER_ONLY
        organizationId: organizations[3].id, // Graduate School (BKK)
        userIdCode: users[5].userId,
        organizationIdCode: organizations[3].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),


    // USER_MULTI_ORG - Multiple organizations with one HEAD
    prisma.userOrganization.create({
      data: {
        userId: users[6].id, // USER_MULTI_ORG
        organizationId: organizations[0].id, // Faculty of Agriculture (BKK)
        userIdCode: users[6].userId,
        organizationIdCode: organizations[0].publicOrganizationId,
        role: "USER",
        position: "MEMBER",
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[6].id, // USER_MULTI_ORG
        organizationId: organizations[1].id, // Faculty of Engineering (BKK)
        userIdCode: users[6].userId,
        organizationIdCode: organizations[1].publicOrganizationId,
        role: "USER",
        position: "HEAD", // This user has one HEAD position
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[6].id, // USER_MULTI_ORG
        organizationId: organizations[2].id, // Faculty of Science (BKK)
        userIdCode: users[6].userId,
        organizationIdCode: organizations[2].publicOrganizationId,
        role: "USER",
        position: "MEMBER",
      },
    }),

    // HYBRID_KPS - CAMPUS_ADMIN + USER in an org on their campus as HEAD
    prisma.userOrganization.create({
      data: {
        userId: users[7].id, // HYBRID_KPS
        organizationId: organizations[5].id, // Faculty of Agriculture at Kamphaeng Saen
        userIdCode: users[7].userId,
        organizationIdCode: organizations[5].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[7].id, // HYBRID_KPS
        organizationId: organizations[6].id, // Kamphaeng Saen Campus Office
        userIdCode: users[7].userId,
        organizationIdCode: organizations[6].publicOrganizationId,
        role: "USER",
        position: "MEMBER",
      },
    }),

    // USER_SR_HEAD - HEAD of Faculty of Science at Sriracha
    prisma.userOrganization.create({
      data: {
        userId: users[8].id, // USER_SR_HEAD
        organizationId: organizations[9].id, // Faculty of Science at Sriracha
        userIdCode: users[8].userId,
        organizationIdCode: organizations[9].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),
  ]);

  console.log("Created comprehensive user-organization relationships");

  // --- Create Sample Projects ---
  const projects = await Promise.all([
    // projects[0]
    prisma.project.create({
      data: {
        publicProjectId: "PROJ-2024-001",
        activityCode: "AGR-2024-001",
        nameEn: "Sustainable Agriculture Development Project",
        nameTh: "โครงการพัฒนาการเกษตรแบบยั่งยืน",
        dateStart: new Date("2024-01-01"),
        dateEnd: new Date("2024-12-31"),
        targetUser: [{ staff: 20 }, { student: 100 }, { farmer: 50 }],
        participants: [{ staff: 15 }, { student: 80 }, { farmer: 40 }],
        schedule: [
          {
            location: "ห้องประชุม 101 คณะเกษตร",
            eachDay: [
              {
                date: "2024-01-15",
                description: "เปิดโครงการและการปฐมนิเทศ",
                timeline: [
                  {
                    timeStart: "08:00",
                    timeEnd: "10:00",
                    description: "พิธีเปิดและการแนะนำโครงการ",
                  },
                ],
              },
              {
                date: "2024-03-10",
                description: "เวิร์คช็อปการปลูกพืชไร้ดิน",
                timeline: [
                  {
                    timeStart: "09:00",
                    timeEnd: "12:00",
                    description: "ภาคทฤษฎี",
                  },
                  {
                    timeStart: "13:00",
                    timeEnd: "16:00",
                    description: "ภาคปฏิบัติ",
                  },
                ],
              },
            ],
          },
        ],
        principlesAndReasoning: "ส่งเสริมการเกษตรยั่งยืนในชุมชน",
        budgetUsed: 500000,
        objectives: "เพื่อพัฒนาความรู้ด้านเกษตรยั่งยืน",
        activityFormat: ["บรรยาย", "ปฏิบัติการ"], // Assuming this is string[] or JSON
        expectedProjectOutcome: ["เกษตรกรมีความรู้ด้านเกษตรยั่งยืน"],
        location: {
          location: "มหาวิทยาลัยเกษตรศาสตร์",
          outside: [
            {
              postcode: "10900",
              address: "50 ถนนงามวงศ์วาน แขวงลาดยาว",
              city: "กรุงเทพมหานคร",
              province: "กรุงเทพมหานคร",
            },
          ],
        },
        organizationId: organizations[0].id, // Faculty of Agriculture (BKK)
        campusId: bangkokCampus.id,
        // Correctly reference Enum values here:
        complianceStandards: [ComplianceStandard.KNOWLEDGE, ComplianceStandard.SKILLS],
        kasetsartStudentIdentities: [KasetsartStudentIdentity.KNOWLEDGE_CREATION],
        sustainableDevelopmentGoals: [SDG.SDG2, SDG.SDG4],
        activityHours: {
          totalHours: 40,
          categories: [{ category: "บรรยาย", hours: 20 }, { category: "ปฏิบัติการ", hours: 20 }],
        },
      },
    }),
    // projects[1]
    prisma.project.create({
      data: {
        publicProjectId: "PROJ-2024-002",
        activityCode: "ENG-2024-001",
        nameEn: "AI for Smart Farming Innovation",
        nameTh: "นวัตกรรม AI เพื่อการเกษตรอัจฉริยะ",
        dateStart: new Date("2024-03-01"),
        dateEnd: new Date("2024-09-30"),
        targetUser: [{ student: 50 }, { researcher: 10 }],
        participants: [{ student: 45 }, { researcher: 8 }],
        schedule: [
          {
            location: "ห้องปฏิบัติการคอมพิวเตอร์ คณะวิศวกรรมศาสตร์",
            eachDay: [
              {
                date: "2024-04-05",
                description: "แนะนำ AI และ Machine Learning",
                timeline: [
                  {
                    timeStart: "09:00",
                    timeEnd: "12:00",
                    description: "บรรยายทฤษฎี",
                  },
                ],
              },
            ],
          },
        ],
        principlesAndReasoning: "ส่งเสริมการประยุกต์ใช้ AI ในภาคเกษตร",
        budgetUsed: 300000,
        objectives: "พัฒนานักศึกษาให้มีความรู้ด้าน AI สำหรับเกษตร",
        activityFormat: ["บรรยาย", "เวิร์คช็อป", "โครงงาน"], // Assuming this is string[] or JSON
        expectedProjectOutcome: ["ต้นแบบระบบ AI เพื่อเกษตรอัจฉริยะ"],
        location: {
          location: "มหาวิทยาลัยเกษตรศาสตร์",
          outside: [],
        },
        organizationId: organizations[1].id, // Faculty of Engineering (BKK)
        campusId: bangkokCampus.id,
        // Correctly reference Enum values here:
        complianceStandards: [ComplianceStandard.ETHICS, ComplianceStandard.PERSONAL_CHARACTERISTICS],
        kasetsartStudentIdentities: [KasetsartStudentIdentity.UNITY],
        sustainableDevelopmentGoals: [SDG.SDG9],
        activityHours: {
          totalHours: 60,
          categories: [{ category: "บรรยาย", hours: 30 }, { category: "เวิร์คช็อป", hours: 30 }],
        },
      },
    }),
  ]);

  console.log("Created sample projects");

  // --- Create Activity Hours ---
  const activityHours = await Promise.all([
    prisma.activityHour.create({
      data: {
        isCompleted: true,
        fileNamePrinciple: "activity-report-PROJ-2024-001-USER_BKK_HEAD_ONLY.pdf",
        projectId: projects[0].id,
        userId: users[4].id, // USER_BKK_HEAD_ONLY
      },
    }),
    prisma.activityHour.create({
      data: {
        isCompleted: false,
        fileNamePrinciple: "activity-report-PROJ-2024-002-USER_BKK_MEMBER_ONLY.pdf",
        projectId: projects[1].id,
        userId: users[5].id, // USER_BKK_MEMBER_ONLY
      },
    }),
    prisma.activityHour.create({
      data: {
        isCompleted: true,
        fileNamePrinciple: "activity-report-PROJ-2024-001-USER_MULTI_ORG.pdf",
        projectId: projects[0].id,
        userId: users[6].id, // USER_MULTI_ORG
      },
    }),
  ]);

  console.log("Created activity hours");

  // --- Create Logs ---
  const logs = await Promise.all([
    prisma.log.create({
      data: {
        action: "USER_LOGIN",
        message: "ผู้ใช้งาน Rawipon (b6610450366) เข้าสู่ระบบ",
        userId: users[0].id,
      },
    }),
    prisma.log.create({
      data: {
        action: "PROJECT_CREATED",
        message: "โครงการ PROJ-2024-001 ถูกสร้างโดย USER_BKK_HEAD_ONLY",
        userId: users[4].id,
      },
    }),
  ]);

  console.log("Created logs");

  // --- Summary ---
  const totalCampuses = await prisma.campus.count();
  const totalOrganizationTypes = await prisma.organizationType.count();
  const totalOrganizations = await prisma.organization.count();
  const totalUsers = await prisma.user.count();
  const totalUserRoles = await prisma.userRole.count();
  const totalUserOrganizations = await prisma.userOrganization.count();
  const totalProjects = await prisma.project.count();
  const totalActivityHours = await prisma.activityHour.count();
  const totalLogs = await prisma.log.count();

  console.log("🎉 Comprehensive Seed completed successfully!");
  console.log(`
=== SUMMARY ===
📍 Created:
  - ${totalCampuses} campuses
  - ${totalOrganizationTypes} organization types
  - ${totalOrganizations} organizations
  - ${totalUsers} users
  - ${totalUserRoles} user admin roles
  - ${totalUserOrganizations} user-organization relationships
  - ${totalProjects} projects
  - ${totalActivityHours} activity hours
  - ${totalLogs} logs

---
### User Index and Role Mapping:

Here's a clearer breakdown of each user and their assigned roles and affiliations, designed for distinct test scenarios:

* **users[0] = Rawipon (b6610450366)**:
    * **Roles**: \`SUPER_ADMIN\` (ONLY Super Admin in the system)
    * **Affiliation**: \`USER\` in Office of the President (BKK) as HEAD
    * **Description**: The sole global administrator, also holds a HEAD position in a Bangkok organization.

* **users[1] = CAMP_BKK001 (\`wichai.bkk@ku.ac.th\`)**:
    * **Roles**: \`CAMPUS_ADMIN\` (Bangkok Campus ONLY)
    * **Affiliation**: \`USER\` in Faculty of Agriculture (BKK) as HEAD
    * **Description**: Manages data specific to the Bangkok campus and is a regular user (HEAD) within an organization on that campus.

* **users[2] = CAMP_KPS001 (\`sudaporn.kps@ku.ac.th\`)**:
    * **Roles**: \`CAMPUS_ADMIN\` (Kamphaeng Saen Campus ONLY)
    * **Affiliation**: \`USER\` in Faculty of Agriculture at Kamphaeng Saen (KPS) as HEAD
    * **Description**: Manages data specific to the Kamphaeng Saen campus and is a regular user (HEAD) within an organization on that campus.

* **users[3] = CAMP_SNK001 (\`nareerat.snk@ku.ac.th\`)**:
    * **Roles**: \`CAMPUS_ADMIN\` (Sakon Nakhon Campus ONLY)
    * **Affiliation**: \`USER\` in Faculty of Natural Resources and Agro-Industry (SNK) as HEAD
    * **Description**: Manages data specific to the Sakon Nakhon campus and is a regular user (HEAD) within an organization on that campus.

* **users[4] = USER_BKK_HEAD_ONLY (\`somchai.head@ku.ac.th\`)**:
    * **Roles**: None (regular user)
    * **Affiliation**: \`USER\` in Faculty of Science (BKK) as HEAD
    * **Description**: A standard user with "HEAD" position in one Bangkok organization.

* **users[5] = USER_BKK_MEMBER_ONLY (\`sommai.member@ku.ac.th\`)**:
    * **Roles**: None (regular user)
    * **Affiliation**: \`USER\` in Faculty of Engineering (BKK) as MEMBER, and Graduate School (BKK) as HEAD
    * **Description**: A standard user, primarily a MEMBER, but also holds a HEAD position in another organization to meet the requirement.

* **users[6] = USER_MULTI_ORG (\`somjai.multi@ku.ac.th\`)**:
    * **Roles**: None (regular user)
    * **Affiliation**: \`USER\` in Faculty of Agriculture (BKK) as MEMBER, Faculty of Engineering (BKK) as HEAD, and Faculty of Science (BKK) as MEMBER.
    * **Description**: A user associated with multiple organizations, with one "HEAD" position.

* **users[7] = HYBRID_KPS (\`mix.campus@ku.ac.th\`)**:
    * **Roles**: \`CAMPUS_ADMIN\` (Kamphaeng Saen Campus ONLY)
    * **Affiliation**: \`USER\` in Faculty of Agriculture (KPS) as HEAD and Kamphaeng Saen Campus Office (KPS) as MEMBER
    * **Description**: A user with both administrative (campus-level) and regular user responsibilities within the same campus.

* **users[8] = USER_SR_HEAD (\`chonburi.head@ku.ac.th\`)**:
    * **Roles**: None (regular user)
    * **Affiliation**: \`USER\` in Faculty of Science at Sriracha (SR) as HEAD
    * **Description**: A standard user with "HEAD" position in one Sriracha organization.

---
### Login Test Scenarios:

Use these email addresses to test different role and permission combinations:

* **rawipon.po@ku.th**: Test for **SUPER_ADMIN** access (sole global admin).
* **wichai.bkk@ku.ac.th**: Test for **Bangkok Campus Admin** access and regular user functions within a Bangkok organization.
* **sudaporn.kps@ku.ac.th**: Test for **Kamphaeng Saen Campus Admin** access and regular user functions within a KPS organization.
* **nareerat.snk@ku.ac.th**: Test for **Sakon Nakhon Campus Admin** access and regular user functions within a SNK organization.
* **somchai.head@ku.ac.th**: Test for a standard **USER** with "HEAD" permission in one organization.
* **sommai.member@ku.ac.th**: Test for a standard **USER** with "MEMBER" permission in one organization, and HEAD in another.
* **somjai.multi@ku.ac.th**: Test for a **USER** involved in multiple organizations with one HEAD position.
* **mix.campus@ku.ac.th**: Test a **Campus Admin who is also a regular user** within their campus's organizations.
* **chonburi.head@ku.ac.th**: Test a standard **USER** with "HEAD" permission in an organization on the Sriracha campus.
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
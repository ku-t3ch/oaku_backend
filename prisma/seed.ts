import { PrismaClient } from "@prisma/client";

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
    // Bangkok Campus Organizations
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

    // Kamphaeng Saen Campus Organizations
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

    // Sakon Nakhon Campus Organizations
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

    // Sri Racha Campus Organizations
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
    // users[0] = SUPER001
    prisma.user.create({
      data: {
        userId: "SUPER001",
        name: "ดร.สมศักดิ์ ระบบใหญ่",
        email: "somsak.super@ku.ac.th",
        phoneNumber: "081-111-1111",
        campusId: bangkokCampus.id,
      },
    }),

    // users[1] = CAMP_BKK001
    prisma.user.create({
      data: {
        userId: "CAMP_BKK001",
        name: "ผศ.วิชัย บางเขน",
        email: "wichai.bkk@ku.ac.th",
        phoneNumber: "081-333-3333",
        campusId: bangkokCampus.id,
      },
    }),

    // users[2] = CAMP_KPS001
    prisma.user.create({
      data: {
        userId: "CAMP_KPS001",
        name: "รศ.สุดาพร กำแพงแสน",
        email: "sudaporn.kps@ku.ac.th",
        phoneNumber: "081-444-4444",
        campusId: kamphaengSaenCampus.id,
      },
    }),

    // users[3] = CAMP_SNK001
    prisma.user.create({
      data: {
        userId: "CAMP_SNK001",
        name: "ดร.นารีรัตน์ สกลนคร",
        email: "nareerat.snk@ku.ac.th",
        phoneNumber: "081-555-5555",
        campusId: sakonNakhonCampus.id,
      },
    }),

    // users[4] = USER001
    prisma.user.create({
      data: {
        userId: "USER001",
        name: "อ.สมชาย หัวหน้า",
        email: "somchai.head@ku.ac.th",
        phoneNumber: "081-666-6666",
        campusId: bangkokCampus.id,
      },
    }),

    // users[5] = USER002
    prisma.user.create({
      data: {
        userId: "USER002",
        name: "อ.สมหมาย สมาชิก",
        email: "sommai.member@ku.ac.th",
        phoneNumber: "081-777-7777",
        campusId: bangkokCampus.id,
      },
    }),

    // users[6] = USER003
    prisma.user.create({
      data: {
        userId: "USER003",
        name: "อ.สมใจ หลายที่",
        email: "somjai.multi@ku.ac.th",
        phoneNumber: "081-888-8888",
        campusId: bangkokCampus.id,
      },
    }),

    // users[7] = NOROLE001
    prisma.user.create({
      data: {
        userId: "NOROLE001",
        name: "นาย.ไม่มีสิทธิ์ รอการอนุมัติ",
        email: "norole.waiting@ku.ac.th",
        phoneNumber: "081-999-9999",
        campusId: bangkokCampus.id,
      },
    }),

    // users[8] = b6610450366
    prisma.user.create({
      data: {
        userId: "b6610450366",
        name: "รวิพล พลศรุตวานิช",
        email: "rawipon.po@ku.th",
        phoneNumber: "0933244055",
        campusId: bangkokCampus.id,
      },
    }),

    // users[9] = HYBRID002
    prisma.user.create({
      data: {
        userId: "HYBRID002",
        name: "รศ.ผสม วิทยาเขต",
        email: "mix.campus@ku.ac.th",
        phoneNumber: "082-222-2222",
        campusId: kamphaengSaenCampus.id,
      },
    }),

    // users[10] = ULTIMATE001
    prisma.user.create({
      data: {
        userId: "ULTIMATE001",
        name: "ศ.ครบเครื่อง ทุกสิทธิ์",
        email: "ultimate.all@ku.ac.th",
        phoneNumber: "082-333-3333",
        campusId: bangkokCampus.id,
      },
    }),

    // users[11] = CROSS001
    prisma.user.create({
      data: {
        userId: "CROSS001",
        name: "อ.ข้ามแคว้น หลายเขต",
        email: "cross.campus@ku.ac.th",
        phoneNumber: "082-444-4444",
        campusId: srirachaCampus.id,
      },
    }),
  ]);

  console.log("Created comprehensive test users");

  // --- Create User Roles ---
  const userRoles = await Promise.all([
    // SUPER_ADMIN roles
    prisma.userRole.create({
      data: {
        userId: users[0].id, // SUPER001
        role: "SUPER_ADMIN",
      },
    }),

    // CAMPUS_ADMIN roles
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

    // Multiple ADMIN roles (b6610450366)
    prisma.userRole.create({
      data: {
        userId: users[8].id, // b6610450366
        role: "SUPER_ADMIN",
      },
    }),
    prisma.userRole.create({
      data: {
        userId: users[8].id, // b6610450366
        role: "CAMPUS_ADMIN",
        campusId: bangkokCampus.id,
      },
    }),

    // HYBRID roles (HYBRID002)
    prisma.userRole.create({
      data: {
        userId: users[9].id, // HYBRID002
        role: "CAMPUS_ADMIN",
        campusId: kamphaengSaenCampus.id,
      },
    }),

    // ULTIMATE roles (ULTIMATE001)
    prisma.userRole.create({
      data: {
        userId: users[10].id, // ULTIMATE001
        role: "SUPER_ADMIN",
      },
    }),
    prisma.userRole.create({
      data: {
        userId: users[10].id, // ULTIMATE001
        role: "CAMPUS_ADMIN",
        campusId: bangkokCampus.id,
      },
    }),

    // Cross-campus ADMIN (CROSS001)
    prisma.userRole.create({
      data: {
        userId: users[11].id, // CROSS001
        role: "CAMPUS_ADMIN",
        campusId: bangkokCampus.id,
      },
    }),
    prisma.userRole.create({
      data: {
        userId: users[11].id, // CROSS001
        role: "CAMPUS_ADMIN",
        campusId: srirachaCampus.id,
      },
    }),
  ]);

  console.log("Created comprehensive user roles");

  // --- Create User Organization relationships ---
  const userOrganizations = await Promise.all([
    // USER001 - HEAD
    prisma.userOrganization.create({
      data: {
        userId: users[4].id, // USER001
        organizationId: organizations[0].id, // Faculty of Agriculture
        userIdCode: users[4].userId,
        organizationIdCode: organizations[0].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),

    // USER002 - MEMBER
    prisma.userOrganization.create({
      data: {
        userId: users[5].id, // USER002
        organizationId: organizations[1].id, // Faculty of Engineering
        userIdCode: users[5].userId,
        organizationIdCode: organizations[1].publicOrganizationId,
        role: "USER",
        position: "MEMBER",
      },
    }),

    // USER003 - Multiple organizations
    prisma.userOrganization.create({
      data: {
        userId: users[6].id, // USER003
        organizationId: organizations[0].id, // Faculty of Agriculture
        userIdCode: users[6].userId,
        organizationIdCode: organizations[0].publicOrganizationId,
        role: "USER",
        position: "MEMBER",
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[6].id, // USER003
        organizationId: organizations[1].id, // Faculty of Engineering
        userIdCode: users[6].userId,
        organizationIdCode: organizations[1].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[6].id, // USER003
        organizationId: organizations[2].id, // Faculty of Science
        userIdCode: users[6].userId,
        organizationIdCode: organizations[2].publicOrganizationId,
        role: "USER",
        position: "MEMBER",
      },
    }),

    // b6610450366 - Multiple ADMIN + USER
    prisma.userOrganization.create({
      data: {
        userId: users[8].id, // b6610450366
        organizationId: organizations[3].id, // Graduate School
        userIdCode: users[8].userId,
        organizationIdCode: organizations[3].publicOrganizationId,
        role: "USER",
        position: "MEMBER",
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[8].id, // b6610450366
        organizationId: organizations[4].id, // Office of the President
        userIdCode: users[8].userId,
        organizationIdCode: organizations[4].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),

    // CAMP_BKK001 - ADMIN + USER
    prisma.userOrganization.create({
      data: {
        userId: users[1].id, // CAMP_BKK001
        organizationId: organizations[0].id, // Faculty of Agriculture
        userIdCode: users[1].userId,
        organizationIdCode: organizations[0].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),

    // HYBRID002 - CAMPUS_ADMIN + USER
    prisma.userOrganization.create({
      data: {
        userId: users[9].id, // HYBRID002
        organizationId: organizations[5].id, // Faculty of Agriculture at Kamphaeng Saen
        userIdCode: users[9].userId,
        organizationIdCode: organizations[5].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[9].id, // HYBRID002
        organizationId: organizations[6].id, // Kamphaeng Saen Campus Office
        userIdCode: users[9].userId,
        organizationIdCode: organizations[6].publicOrganizationId,
        role: "USER",
        position: "MEMBER",
      },
    }),

    // ULTIMATE001 - ALL roles + USER
    prisma.userOrganization.create({
      data: {
        userId: users[10].id, // ULTIMATE001
        organizationId: organizations[0].id, // Faculty of Agriculture
        userIdCode: users[10].userId,
        organizationIdCode: organizations[0].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[10].id, // ULTIMATE001
        organizationId: organizations[1].id, // Faculty of Engineering
        userIdCode: users[10].userId,
        organizationIdCode: organizations[1].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[10].id, // ULTIMATE001
        organizationId: organizations[2].id, // Faculty of Science
        userIdCode: users[10].userId,
        organizationIdCode: organizations[2].publicOrganizationId,
        role: "USER",
        position: "MEMBER",
      },
    }),

    // CROSS001 - Cross-campus
    prisma.userOrganization.create({
      data: {
        userId: users[11].id, // CROSS001
        organizationId: organizations[9].id, // Faculty of Science at Sriracha
        userIdCode: users[11].userId,
        organizationIdCode: organizations[9].publicOrganizationId,
        role: "USER",
        position: "HEAD",
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[11].id, // CROSS001
        organizationId: organizations[0].id, // Faculty of Agriculture (BKK)
        userIdCode: users[11].userId,
        organizationIdCode: organizations[0].publicOrganizationId,
        role: "USER",
        position: "MEMBER",
      },
    }),
  ]);

  console.log("Created comprehensive user-organization relationships");

  // --- Create Sample Projects ---
  const projects = await Promise.all([
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
            ],
          },
        ],
        principlesAndReasoning: "ส่งเสริมการเกษตรยั่งยืนในชุมชน",
        budgetUsed: 500000,
        objectives: "เพื่อพัฒนาความรู้ด้านเกษตรยั่งยืน",
        activityFormat: ["บรรยาย", "ปฏิบัติการ"],
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
        organizationId: organizations[0].id,
        campusId: bangkokCampus.id,
        complianceStandards: ["KNOWLEDGE", "SKILLS"],
        kasetsartStudentIdentities: ["KNOWLEDGE_CREATION"],
        sustainableDevelopmentGoals: ["SDG2"],
        activityHours: {
          totalHours: 40,
          categories: [{ category: "บรรยาย", hours: 40 }],
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
        fileNamePrinciple: "activity-report-001.pdf",
        projectId: projects[0].id,
        userId: users[4].id, // USER001
      },
    }),
  ]);

  console.log("Created activity hours");

  // --- Create Logs ---
  const logs = await Promise.all([
    prisma.log.create({
      data: {
        action: "USER_LOGIN",
        message: "ผู้ใช้งาน SUPER001 เข้าสู่ระบบ",
        userId: users[0].id,
      },
    }),
    prisma.log.create({
      data: {
        action: "USER_LOGIN", 
        message: "ผู้ใช้งาน b6610450366 เข้าสู่ระบบ",
        userId: users[8].id,
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

=== USER INDEX MAPPING ===
users[0]  = SUPER001     → SUPER_ADMIN
users[1]  = CAMP_BKK001  → CAMPUS_ADMIN (Bangkok)
users[2]  = CAMP_KPS001  → CAMPUS_ADMIN (Kamphaeng Saen)
users[3]  = CAMP_SNK001  → CAMPUS_ADMIN (Sakon Nakhon)
users[4]  = USER001      → USER (1 org, HEAD)
users[5]  = USER002      → USER (1 org, MEMBER)
users[6]  = USER003      → USER (3 orgs)
users[7]  = NOROLE001    → No roles
users[8]  = b6610450366  → SUPER_ADMIN + CAMPUS_ADMIN + USER
users[9]  = HYBRID002    → CAMPUS_ADMIN + USER
users[10] = ULTIMATE001  → ALL roles + USER
users[11] = CROSS001     → Cross-campus ADMIN + USER

=== LOGIN TEST SCENARIOS ===
🔐 Use these emails to test different role combinations:
   • somsak.super@ku.ac.th     → SUPER_ADMIN only
   • wichai.bkk@ku.ac.th       → CAMPUS_ADMIN (BKK) only
   • somchai.head@ku.ac.th     → USER only (1 org, HEAD)
   • sommai.member@ku.ac.th    → USER only (1 org, MEMBER)
   • somjai.multi@ku.ac.th     → USER only (3 orgs)
   • norole.waiting@ku.ac.th   → No roles (edge case)
   • rawipon.po@ku.th          → ALL ADMIN roles + USER
   • mix.campus@ku.ac.th       → CAMPUS_ADMIN + USER
   • ultimate.all@ku.ac.th     → ALL roles + USER
   • cross.campus@ku.ac.th     → Cross-campus ADMIN + USER
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
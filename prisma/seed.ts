import { PrismaClient, ComplianceStandard, KasetsartStudentIdentity, SDG } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  await prisma.activityHourFile.deleteMany();
  await prisma.log.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userOrganization.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.organizationType.deleteMany();
  await prisma.campus.deleteMany();

  // Create Campuses
  const bangkokCampus = await prisma.campus.create({ data: { name: "วิทยาเขตบางเขน" } });
  const kamphaengSaenCampus = await prisma.campus.create({ data: { name: "วิทยาเขตกำแพงแสน" } });
  const sakonNakhonCampus = await prisma.campus.create({ data: { name: "วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร" } });
  const srirachaCampus = await prisma.campus.create({ data: { name: "วิทยาเขตศรีราชา" } });

  // Create Organization Types
  const facultyTypeBKK = await prisma.organizationType.create({ data: { name: "คณะ", campusId: bangkokCampus.id } });
  const instituteTypeBKK = await prisma.organizationType.create({ data: { name: "สถาบัน", campusId: bangkokCampus.id } });
  const officeTypeBKK = await prisma.organizationType.create({ data: { name: "สำนักงาน", campusId: bangkokCampus.id } });
  const centerTypeBKK = await prisma.organizationType.create({ data: { name: "ศูนย์", campusId: bangkokCampus.id } });
  const graduateSchoolTypeBKK = await prisma.organizationType.create({ data: { name: "บัณฑิตวิทยาลัย", campusId: bangkokCampus.id } });
  const facultyTypeKPS = await prisma.organizationType.create({ data: { name: "คณะ", campusId: kamphaengSaenCampus.id } });
  const officeTypeKPS = await prisma.organizationType.create({ data: { name: "สำนักงานวิทยาเขต", campusId: kamphaengSaenCampus.id } });
  const facultyTypeSNK = await prisma.organizationType.create({ data: { name: "คณะ", campusId: sakonNakhonCampus.id } });
  const officeTypeSNK = await prisma.organizationType.create({ data: { name: "สำนักงานวิทยาเขต", campusId: sakonNakhonCampus.id } });
  const facultyTypeSR = await prisma.organizationType.create({ data: { name: "คณะ", campusId: srirachaCampus.id } });

  // Create Organizations
  const organizations = await Promise.all([
    prisma.organization.create({
      data: {
        publicOrganizationId: "1xx0200100xx",
        nameEn: "Faculty of Agriculture",
        nameTh: "คณะเกษตร",
        image: null,
        details: "คณะเกษตรศาสตร์ เป็นคณะแรกของมหาวิทยาลัยเกษตรศาสตร์",
        socialMedia: [{ platform: "Facebook", url: "https://facebook.com/ku.agri" }],
        email: "agri@ku.ac.th",
        phoneNumber: "02-579-0100",
        campusId: bangkokCampus.id,
        organizationTypeId: facultyTypeBKK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "1xx0100000xx",
        nameEn: "Faculty of Engineering",
        nameTh: "คณะวิศวกรรมศาสตร์",
        image: null,
        details: "คณะวิศวกรรมศาสตร์ มุ่งเน้นการพัฒนาเทคโนโลยีเพื่อเกษตรกรรม",
        socialMedia: [{ platform: "Facebook", url: "https://facebook.com/ku.eng" }],
        email: "eng@ku.ac.th",
        phoneNumber: "02-579-0200",
        campusId: bangkokCampus.id,
        organizationTypeId: facultyTypeBKK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "1xx0100100xx",
        nameEn: "Faculty of Science",
        nameTh: "คณะวิทยาศาสตร์",
        image: null,
        details: "คณะวิทยาศาสตร์ ผลิตบัณฑิตด้านวิทยาศาสตร์และเทคโนโลยี",
        socialMedia: [{ platform: "Facebook", url: "https://facebook.com/ku.sci" }],
        email: "sci@ku.ac.th",
        phoneNumber: "02-579-0300",
        campusId: bangkokCampus.id,
        organizationTypeId: facultyTypeBKK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "1xx0100101xx",
        nameEn: "Graduate School",
        nameTh: "บัณฑิตวิทยาลัย",
        image: null,
        details: "บัณฑิตวิทยาลัย บริหารจัดการหลักสูตรระดับบัณฑิตศึกษา",
        email: "grad@ku.ac.th",
        phoneNumber: "02-579-2000",
        campusId: bangkokCampus.id,
        organizationTypeId: graduateSchoolTypeBKK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "1xx0100200xx",
        nameEn: "Office of the President",
        nameTh: "สำนักงานอธิการบดี",
        image: null,
        details: "บริหารจัดการและสนับสนุนการดำเนินงานของมหาวิทยาลัย",
        email: "president.office@ku.ac.th",
        phoneNumber: "02-579-0100",
        campusId: bangkokCampus.id,
        organizationTypeId: officeTypeBKK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "1xx0100300xx",
        nameEn: "Faculty of Agriculture at Kamphaeng Saen",
        nameTh: "คณะเกษตร กำแพงแสน",
        image: null,
        details: "มุ่งเน้นการวิจัยและพัฒนาการเกษตรในพื้นที่",
        email: "kps.agri@ku.ac.th",
        phoneNumber: "034-351-800",
        campusId: kamphaengSaenCampus.id,
        organizationTypeId: facultyTypeKPS.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "1xx0100400xx",
        nameEn: "Kamphaeng Saen Campus Office",
        nameTh: "สำนักงานวิทยาเขตกำแพงแสน",
        image: null,
        details: "บริหารจัดการงานทั่วไปของวิทยาเขตกำแพงแสน",
        email: "kps.office@ku.ac.th",
        phoneNumber: "034-351-700",
        campusId: kamphaengSaenCampus.id,
        organizationTypeId: officeTypeKPS.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "1xx0100500xx",
        nameEn: "Faculty of Natural Resources and Agro-Industry",
        nameTh: "คณะทรัพยากรธรรมชาติและอุตสาหกรรมเกษตร",
        image: null,
        details: "พัฒนาทรัพยากรธรรมชาติและอุตสาหกรรมเกษตรในภาคอีสาน",
        email: "snk.agri@ku.ac.th",
        phoneNumber: "042-725-000",
        campusId: sakonNakhonCampus.id,
        organizationTypeId: facultyTypeSNK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "1xx0100600xx",
        nameEn: "Chalermphrakiat Sakon Nakhon Campus Office",
        nameTh: "สำนักงานวิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร",
        image: null,
        details: "บริหารจัดการงานทั่วไปของวิทยาเขตสกลนคร",
        email: "snk.office@ku.ac.th",
        phoneNumber: "042-725-200",
        campusId: sakonNakhonCampus.id,
        organizationTypeId: officeTypeSNK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-SR-SCI-010",
        nameEn: "Faculty of Science at Sriracha",
        nameTh: "คณะวิทยาศาสตร์ ศรีราชา",
        image: null,
        details: "เน้นวิทยาศาสตร์และเทคโนโลยีสำหรับอุตสาหกรรม",
        email: "sr.sci@ku.ac.th",
        phoneNumber: "038-354-580",
        campusId: srirachaCampus.id,
        organizationTypeId: facultyTypeSR.id,
      },
    }),
  ]);

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        userId: "b6610450366",
        name: "รวิพล พลศรุตวานิช",
        email: "rawipon.po@ku.th",
        phoneNumber: "0933244055",
        campusId: bangkokCampus.id,
      },
    }),
    prisma.user.create({
      data: {
        userId: "CAMP_BKK001",
        name: "ผศ.วิชัย บางเขน",
        email: "wichai.bkk@ku.ac.th",
        phoneNumber: "081-333-3333",
        campusId: bangkokCampus.id,
      },
    }),
    prisma.user.create({
      data: {
        userId: "CAMP_KPS001",
        name: "รศ.สุดาพร กำแพงแสน",
        email: "sudaporn.kps@ku.ac.th",
        phoneNumber: "081-444-4444",
        campusId: kamphaengSaenCampus.id,
      },
    }),
    prisma.user.create({
      data: {
        userId: "CAMP_SNK001",
        name: "ดร.นารีรัตน์ สกลนคร",
        email: "nareerat.snk@ku.ac.th",
        phoneNumber: "081-555-5555",
        campusId: sakonNakhonCampus.id,
      },
    }),
    prisma.user.create({
      data: {
        userId: "USER_BKK_HEAD_ONLY",
        name: "อ.สมชาย หัวหน้าอย่างเดียว",
        email: "somchai.head@ku.ac.th",
        phoneNumber: "081-666-6666",
        campusId: bangkokCampus.id,
      },
    }),
    prisma.user.create({
      data: {
        userId: "USER_BKK_MEMBER_ONLY",
        name: "อ.สมหมาย สมาชิกอย่างเดียว",
        email: "sommai.member@ku.ac.th",
        phoneNumber: "081-777-7777",
        campusId: bangkokCampus.id,
      },
    }),
    prisma.user.create({
      data: {
        userId: "USER_MULTI_ORG",
        name: "อ.สมใจ หลายที่",
        email: "somjai.multi@ku.ac.th",
        phoneNumber: "081-888-8888",
        campusId: bangkokCampus.id,
      },
    }),
    prisma.user.create({
      data: {
        userId: "HYBRID_KPS",
        name: "รศ.ผสม วิทยาเขต",
        email: "mix.campus@ku.ac.th",
        phoneNumber: "082-222-2222",
        campusId: kamphaengSaenCampus.id,
      },
    }),
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

  // Create User Roles
  await prisma.userRole.create({
    data: {
      userId: users[0].id,
      role: "SUPER_ADMIN",
    },
  });
  await prisma.userRole.create({
    data: {
      userId: users[1].id,
      role: "CAMPUS_ADMIN",
      campusId: bangkokCampus.id,
    },
  });
  await prisma.userRole.create({
    data: {
      userId: users[2].id,
      role: "CAMPUS_ADMIN",
      campusId: kamphaengSaenCampus.id,
    },
  });
  await prisma.userRole.create({
    data: {
      userId: users[3].id,
      role: "CAMPUS_ADMIN",
      campusId: sakonNakhonCampus.id,
    },
  });
  await prisma.userRole.create({
    data: {
      userId: users[7].id,
      role: "CAMPUS_ADMIN",
      campusId: kamphaengSaenCampus.id,
    },
  });

  // Create User Organizations
  await prisma.userOrganization.create({
    data: {
      userId: users[0].id,
      organizationId: organizations[4].id,
      userIdCode: users[0].userId,
      publicOrganizationId: organizations[4].publicOrganizationId,
      role: "USER",
      position: "HEAD",
    },
  });
  await prisma.userOrganization.create({
    data: {
      userId: users[1].id,
      organizationId: organizations[0].id,
      userIdCode: users[1].userId,
      publicOrganizationId: organizations[0].publicOrganizationId,
      role: "USER",
      position: "HEAD",
    },
  });
  await prisma.userOrganization.create({
    data: {
      userId: users[2].id,
      organizationId: organizations[5].id,
      userIdCode: users[2].userId,
      publicOrganizationId: organizations[5].publicOrganizationId,
      role: "USER",
      position: "HEAD",
    },
  });
  await prisma.userOrganization.create({
    data: {
      userId: users[3].id,
      organizationId: organizations[7].id,
      userIdCode: users[3].userId,
      publicOrganizationId: organizations[7].publicOrganizationId,
      role: "USER",
      position: "HEAD",
    },
  });
  await prisma.userOrganization.create({
    data: {
      userId: users[4].id,
      organizationId: organizations[2].id,
      userIdCode: users[4].userId,
      publicOrganizationId: organizations[2].publicOrganizationId,
      role: "USER",
      position: "HEAD",
    },
  });
  await prisma.userOrganization.create({
    data: {
      userId: users[5].id,
      organizationId: organizations[1].id,
      userIdCode: users[5].userId,
      publicOrganizationId: organizations[1].publicOrganizationId,
      role: "USER",
      position: "MEMBER",
    },
  });
  await prisma.userOrganization.create({
    data: {
      userId: users[5].id,
      organizationId: organizations[3].id,
      userIdCode: users[5].userId,
      publicOrganizationId: organizations[3].publicOrganizationId,
      role: "USER",
      position: "HEAD",
    },
  });
  await prisma.userOrganization.create({
    data: {
      userId: users[6].id,
      organizationId: organizations[0].id,
      userIdCode: users[6].userId,
      publicOrganizationId: organizations[0].publicOrganizationId,
      role: "USER",
      position: "MEMBER",
    },
  });
  await prisma.userOrganization.create({
    data: {
      userId: users[6].id,
      organizationId: organizations[1].id,
      userIdCode: users[6].userId,
      publicOrganizationId: organizations[1].publicOrganizationId,
      role: "USER",
      position: "HEAD",
    },
  });
  await prisma.userOrganization.create({
    data: {
      userId: users[6].id,
      organizationId: organizations[2].id,
      userIdCode: users[6].userId,
      publicOrganizationId: organizations[2].publicOrganizationId,
      role: "USER",
      position: "MEMBER",
    },
  });
  await prisma.userOrganization.create({
    data: {
      userId: users[7].id,
      organizationId: organizations[5].id,
      userIdCode: users[7].userId,
      publicOrganizationId: organizations[5].publicOrganizationId,
      role: "USER",
      position: "HEAD",
    },
  });
  await prisma.userOrganization.create({
    data: {
      userId: users[7].id,
      organizationId: organizations[6].id,
      userIdCode: users[7].userId,
      publicOrganizationId: organizations[6].publicOrganizationId,
      role: "USER",
      position: "MEMBER",
    },
  });
  await prisma.userOrganization.create({
    data: {
      userId: users[8].id,
      organizationId: organizations[9].id,
      userIdCode: users[8].userId,
      publicOrganizationId: organizations[9].publicOrganizationId,
      role: "USER",
      position: "HEAD",
    },
  });

  // Create Projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        publicProjectId: "PROJ-2024-001",
        activityCode: "AGR-2024-001",
        nameEn: "Sustainable Agriculture Development Project",
        nameTh: "โครงการพัฒนาการเกษตรแบบยั่งยืน",
        dateStart: new Date("2024-01-01"),
        dateEnd: new Date("2024-12-31"),
        targetUser: 120,
        participants: 100,
        schedule: JSON.stringify([
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
        ]),
        principlesAndReasoning: "ส่งเสริมการเกษตรยั่งยืนในชุมชน",
        budgetUsed: 500000,
        objectives: "เพื่อพัฒนาความรู้ด้านเกษตรยั่งยืน",
        activityFormat: ["บรรยาย", "ปฏิบัติการ"],
        expectedProjectOutcome: ["เกษตรกรมีความรู้ด้านเกษตรยั่งยืน"],
        location: JSON.stringify({
          location: "มหาวิทยาลัยเกษตรศาสตร์",
          outside: [
            {
              postcode: "10900",
              address: "50 ถนนงามวงศ์วาน แขวงลาดยาว",
              city: "กรุงเทพมหานคร",
              province: "กรุงเทพมหานคร",
            },
          ],
        }),
        organizationId: organizations[0].id,
        campusId: bangkokCampus.id,
        complianceStandards: [ComplianceStandard.KNOWLEDGE, ComplianceStandard.SKILLS],
        kasetsartStudentIdentities: [KasetsartStudentIdentity.KNOWLEDGE_CREATION],
        sustainableDevelopmentGoals: [SDG.SDG2, SDG.SDG4],
        activityHours: JSON.stringify({
          university_activities: 12,
          social_activities: 8,
          competency_development_activities: {
            virtue: 4,
            thinking_and_learning: 3,
            interpersonal_relationships_and_communication: 2,
            health: 5,
          },
        }),
      },
    }),
    prisma.project.create({
      data: {
        publicProjectId: "PROJ-2024-002",
        activityCode: "ENG-2024-001",
        nameEn: "AI for Smart Farming Innovation",
        nameTh: "นวัตกรรม AI เพื่อการเกษตรอัจฉริยะ",
        dateStart: new Date("2024-03-01"),
        dateEnd: new Date("2024-09-30"),
        targetUser: 60,
        participants: 53,
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
        activityFormat: ["บรรยาย", "เวิร์คช็อป", "โครงงาน"],
        expectedProjectOutcome: ["ต้นแบบระบบ AI เพื่อเกษตรอัจฉริยะ"],
        location: {
          location: "มหาวิทยาลัยเกษตรศาสตร์",
          outside: [],
        },
        organizationId: organizations[1].id,
        campusId: bangkokCampus.id,
        complianceStandards: [ComplianceStandard.ETHICS, ComplianceStandard.PERSONAL_CHARACTERISTICS],
        kasetsartStudentIdentities: [KasetsartStudentIdentity.UNITY],
        sustainableDevelopmentGoals: [SDG.SDG9],
        activityHours: {
          university_activities: 10,
          social_activities: 6,
          competency_development_activities: {
            virtue: 2,
            thinking_and_learning: 4,
            interpersonal_relationships_and_communication: 3,
            health: 3,
          },
        },
      },
    }),
  ]);

  // Create Activity Hours
  await prisma.activityHourFile.create({
    data: {
      isCompleted: true,
      fileNamePrinciple: "activity-report-PROJ-2024-001-USER_BKK_HEAD_ONLY.pdf",
      projectId: projects[0].id,
      userId: users[4].id,
      fileUrl: "",
    },
  });
  await prisma.activityHourFile.create({
    data: {
      isCompleted: false,
      fileNamePrinciple: "activity-report-PROJ-2024-002-USER_BKK_MEMBER_ONLY.pdf",
      projectId: projects[1].id,
      userId: users[5].id,
    },
  });
  await prisma.activityHourFile.create({
    data: {
      isCompleted: true,
      fileNamePrinciple: "activity-report-PROJ-2024-001-USER_MULTI_ORG.pdf",
      projectId: projects[0].id,
      userId: users[6].id,
    },
  });

  // Create Logs
  await prisma.log.create({
    data: {
      action: "USER_LOGIN",
      message: "ผู้ใช้งาน Rawipon (b6610450366) เข้าสู่ระบบ",
      userId: users[0].id,
    },
  });
  await prisma.log.create({
    data: {
      action: "PROJECT_CREATED",
      message: "โครงการ PROJ-2024-001 ถูกสร้างโดย USER_BKK_HEAD_ONLY",
      userId: users[4].id,
    },
  });

  console.log("🎉 Comprehensive Seed completed successfully!");
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
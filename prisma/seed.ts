import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");
  
  // Clear existing data first (ลำดับสำคัญ!)
  await prisma.activityHour.deleteMany();
  await prisma.log.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userOrganization.deleteMany(); // เพิ่มบรรทัดนี้
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.organizationType.deleteMany();
  await prisma.campus.deleteMany();
  
  console.log("Cleared existing data");

  // --- Create Campuses ---
  const bangkokCampus = await prisma.campus.create({
    data: {
      name: "วิทยาเขตบางเขน",
    },
  });

  const kamphaengSaenCampus = await prisma.campus.create({
    data: {
      name: "วิทยาเขตกำแพงแสน",
    },
  });

  const sakonNakhonCampus = await prisma.campus.create({
    data: {
      name: "วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร",
    },
  });

  const srirachaCampus = await prisma.campus.create({
    data: {
      name: "วิทยาเขตศรีราชา",
    },
  });

  console.log("Created campuses");

  // --- Create Organization Types for all campuses ---
  // Bangkok Campus Types
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
  const hospitalTypeBKK = await prisma.organizationType.create({
    data: { name: "โรงพยาบาล", campusId: bangkokCampus.id },
  });

  // Kamphaeng Saen Campus Types
  const facultyTypeKPS = await prisma.organizationType.create({
    data: { name: "คณะ", campusId: kamphaengSaenCampus.id },
  });
  const officeTypeKPS = await prisma.organizationType.create({
    data: { name: "สำนักงานวิทยาเขต", campusId: kamphaengSaenCampus.id },
  });
  const centerTypeKPS = await prisma.organizationType.create({
    data: { name: "ศูนย์วิจัย", campusId: kamphaengSaenCampus.id },
  });
  const hospitalTypeKPS = await prisma.organizationType.create({
    data: { name: "โรงพยาบาล", campusId: kamphaengSaenCampus.id },
  });

  // Sakon Nakhon Campus Types
  const facultyTypeSNK = await prisma.organizationType.create({
    data: { name: "คณะ", campusId: sakonNakhonCampus.id },
  });
  const officeTypeSNK = await prisma.organizationType.create({
    data: { name: "สำนักงานวิทยาเขต", campusId: sakonNakhonCampus.id },
  });
  const acadResTypeSNK = await prisma.organizationType.create({
    data: { name: "สำนักวิทยบริการ", campusId: sakonNakhonCampus.id },
  });
  const researchInstTypeSNK = await prisma.organizationType.create({
    data: { name: "สถาบันวิจัยและพัฒนา", campusId: sakonNakhonCampus.id },
  });

  // Sri Racha Campus Types
  const facultyTypeSR = await prisma.organizationType.create({
    data: { name: "คณะ", campusId: srirachaCampus.id },
  });
  const officeTypeSR = await prisma.organizationType.create({
    data: { name: "สำนักงานวิทยาเขต", campusId: srirachaCampus.id },
  });
  const centerTypeSR = await prisma.organizationType.create({
    data: { name: "ศูนย์วิจัย", campusId: srirachaCampus.id },
  });

  console.log("Created organization types");

  // --- Create Organizations (same as before) ---
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
          { platform: "Instagram", url: "https://instagram.com/ku.agri" },
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
          { platform: "Instagram", url: "https://instagram.com/ku.eng" },
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
        publicOrganizationId: "KU-ECON-004",
        nameEn: "Faculty of Economics",
        nameTh: "คณะเศรษฐศาสตร์",
        image: "https://example.com/econ-logo.jpg",
        details: "คณะเศรษฐศาสตร์ เน้นการพัฒนาเศรษฐกิจเกษตรและชนบท",
        socialMedia: [
          { platform: "Facebook", url: "https://facebook.com/ku.econ" },
          { platform: "Instagram", url: "https://instagram.com/ku.econ" },
        ],
        email: "econ@ku.ac.th",
        phoneNumber: "02-579-0400",
        campusId: bangkokCampus.id,
        organizationTypeId: facultyTypeBKK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-FORESTRY-005",
        nameEn: "Faculty of Forestry",
        nameTh: "คณะวนศาสตร์",
        image: "https://example.com/forestry-logo.jpg",
        details: "คณะวนศาสตร์ อนุรักษ์และพัฒนาทรัพยากรป่าไม้",
        socialMedia: [
          { platform: "Facebook", url: "https://facebook.com/ku.forestry" },
        ],
        email: "forestry@ku.ac.th",
        phoneNumber: "02-579-0500",
        campusId: bangkokCampus.id,
        organizationTypeId: facultyTypeBKK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-FISHERIES-006",
        nameEn: "Faculty of Fisheries",
        nameTh: "คณะประมง",
        image: "https://example.com/fisheries-logo.jpg",
        details: "คณะประมง พัฒนาเทคโนโลยีการประมงและทรัพยากรทางน้ำ",
        socialMedia: [
          { platform: "Facebook", url: "https://facebook.com/ku.fisheries" },
        ],
        email: "fisheries@ku.ac.th",
        phoneNumber: "02-579-0600",
        campusId: bangkokCampus.id,
        organizationTypeId: facultyTypeBKK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-SOC-007",
        nameEn: "Faculty of Social Sciences",
        nameTh: "คณะสังคมศาสตร์",
        image: "https://example.com/social-logo.jpg",
        details: "คณะสังคมศาสตร์ พัฒนาสังคมและชุมชน",
        socialMedia: [
          { platform: "Facebook", url: "https://facebook.com/ku.social" },
        ],
        email: "social@ku.ac.th",
        phoneNumber: "02-579-0700",
        campusId: bangkokCampus.id,
        organizationTypeId: facultyTypeBKK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-VET-008",
        nameEn: "Faculty of Veterinary Medicine",
        nameTh: "คณะสัตวแพทยศาสตร์",
        image: "https://example.com/veterinary-logo.jpg",
        details: "คณะสัตวแพทยศาสตร์ ดูแลสุขภาพสัตว์และสาธารณสุข",
        socialMedia: [
          { platform: "Facebook", url: "https://facebook.com/ku.veterinary" },
        ],
        email: "veterinary@ku.ac.th",
        phoneNumber: "02-579-1000",
        campusId: bangkokCampus.id,
        organizationTypeId: facultyTypeBKK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-EDU-009",
        nameEn: "Faculty of Education",
        nameTh: "คณะศึกษาศาสตร์",
        image: "https://example.com/education-logo.jpg",
        details: "คณะศึกษาศาสตร์ ผลิตครูและบุคลากรทางการศึกษา",
        socialMedia: [
          { platform: "Facebook", url: "https://facebook.com/ku.education" },
        ],
        email: "education@ku.ac.th",
        phoneNumber: "02-579-1100",
        campusId: bangkokCampus.id,
        organizationTypeId: facultyTypeBKK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-GRAD-010",
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
        publicOrganizationId: "KU-HOSP-011",
        nameEn: "Kasetsart University Veterinary Teaching Hospital",
        nameTh: "โรงพยาบาลสัตว์ มหาวิทยาลัยเกษตรศาสตร์ บางเขน",
        image: "https://example.com/kuhosp-logo.jpg",
        details:
          "ให้บริการรักษาสัตว์และเป็นแหล่งฝึกปฏิบัติสำหรับนิสิตสัตวแพทย์",
        email: "kuhosp@ku.ac.th",
        phoneNumber: "02-579-8800",
        campusId: bangkokCampus.id,
        organizationTypeId: hospitalTypeBKK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-OFFICE-PRES-012",
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
        publicOrganizationId: "KU-KPS-AGRI-001",
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
        publicOrganizationId: "KU-KPS-ENG-002",
        nameEn: "Faculty of Engineering at Kamphaeng Saen",
        nameTh: "คณะวิศวกรรมศาสตร์ กำแพงแสน",
        image: "https://example.com/kps-eng-logo.jpg",
        details: "พัฒนาเทคโนโลยีวิศวกรรมเพื่อการเกษตรและอุตสาหกรรม",
        email: "kps.eng@ku.ac.th",
        phoneNumber: "034-351-900",
        campusId: kamphaengSaenCampus.id,
        organizationTypeId: facultyTypeKPS.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-KPS-VET-003",
        nameEn: "Faculty of Veterinary Medicine at Kamphaeng Saen",
        nameTh: "คณะสัตวแพทยศาสตร์ (วิทยาเขตกำแพงแสน)",
        image: "https://example.com/kps-vet-logo.jpg",
        details: "จัดการเรียนการสอนและบริการทางสัตวแพทย์",
        email: "kps.vet@ku.ac.th",
        phoneNumber: "034-351-950",
        campusId: kamphaengSaenCampus.id,
        organizationTypeId: facultyTypeKPS.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-KPS-OFFICE-004",
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
        publicOrganizationId: "KU-SNK-AGRI-001",
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
        publicOrganizationId: "KU-SNK-SCIENG-002",
        nameEn: "Faculty of Science and Engineering",
        nameTh: "คณะวิทยาศาสตร์และวิศวกรรมศาสตร์",
        image: "https://example.com/snk-scieng-logo.jpg",
        details: "จัดการศึกษาด้านวิทยาศาสตร์และวิศวกรรมศาสตร์ในพื้นที่",
        email: "snk.scieng@ku.ac.th",
        phoneNumber: "042-725-100",
        campusId: sakonNakhonCampus.id,
        organizationTypeId: facultyTypeSNK.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-SNK-OFFICE-003",
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
        publicOrganizationId: "KU-SR-SCI-001",
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
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-SR-MARI-002",
        nameEn: "Faculty of International Maritime Studies",
        nameTh: "คณะพาณิชยนาวีนานาชาติ",
        image: "https://example.com/sr-mari-logo.jpg",
        details: "ผลิตบุคลากรด้านพาณิชยนาวีและการขนส่งทางทะเล",
        email: "sr.mari@ku.ac.th",
        phoneNumber: "038-354-680",
        campusId: srirachaCampus.id,
        organizationTypeId: facultyTypeSR.id,
      },
    }),
    prisma.organization.create({
      data: {
        publicOrganizationId: "KU-SR-OFFICE-003",
        nameEn: "Sriracha Campus Office",
        nameTh: "สำนักงานวิทยาเขตศรีราชา",
        image: "https://example.com/sr-office-logo.jpg",
        details: "บริหารจัดการงานทั่วไปของวิทยาเขตศรีราชา",
        email: "sr.office@ku.ac.th",
        phoneNumber: "038-354-700",
        campusId: srirachaCampus.id,
        organizationTypeId: officeTypeSR.id,
      },
    }),
  ]);

  console.log("Created organizations");

  // --- Create Sample Users (ลบ role และ position ออก) ---
  const users = await Promise.all([
    prisma.user.create({
      data: {
        userId: "KU001",
        name: "ผศ.ดร.สมชาย ใจดี",
        email: "somchai.j@ku.ac.th",
        phoneNumber: "081-234-5678",
        campusId: bangkokCampus.id,
        // ลบ position และ role ออก
        // ลบ organizations connect ออก
      },
    }),
    prisma.user.create({
      data: {
        userId: "KU002",
        name: "อ.ดร.สมหญิง รักเรียน",
        email: "somying.r@ku.ac.th",
        phoneNumber: "081-234-5679",
        campusId: bangkokCampus.id,
      },
    }),
    prisma.user.create({
      data: {
        userId: "KU003",
        name: "ผศ.ดร.วิชัย พัฒนา",
        email: "wichai.p@ku.ac.th",
        phoneNumber: "081-234-5680",
        campusId: bangkokCampus.id,
      },
    }),
    prisma.user.create({
      data: {
        userId: "KU004",
        name: "รศ.ดร.สุดาพร พืชผล",
        email: "sudaporn.p@ku.ac.th",
        phoneNumber: "081-999-1111",
        campusId: kamphaengSaenCampus.id,
      },
    }),
    prisma.user.create({
      data: {
        userId: "KU005",
        name: "อ.วรพล สมุทร",
        email: "worapol.s@ku.ac.th",
        phoneNumber: "089-888-2222",
        campusId: srirachaCampus.id,
      },
    }),
    prisma.user.create({
      data: {
        userId: "KU006",
        name: "ดร.นารีรัตน์ ภูธร",
        email: "nareerat.p@ku.ac.th",
        phoneNumber: "087-777-3333",
        campusId: sakonNakhonCampus.id,
      },
    }),
  ]);

  console.log("Created users");

  // --- Create UserOrganization relationships ---
  const userOrganizations = await Promise.all([
    // KU001: HEAD ของ Faculty of Agriculture + MEMBER ของ Graduate School
    prisma.userOrganization.create({
      data: {
        userId: users[0].id,
        organizationId: organizations[0].id, // Faculty of Agriculture
        role: "ADMIN",
        position: "NON_POSITION", 
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[0].id,
        organizationId: organizations[9].id, // Graduate School (ถ้ามี)
        role: "USER",
        position: "MEMBER",
      },
    }),
    
    // KU002: MEMBER ของ Faculty of Engineering
    prisma.userOrganization.create({
      data: {
        userId: users[1].id,
        organizationId: organizations[1].id, // Faculty of Engineering
        role: "USER",
        position: "MEMBER",
      },
    }),
    
    // KU003: CAMPUS_ADMIN ของ Faculty of Science
    prisma.userOrganization.create({
      data: {
        userId: users[2].id,
        organizationId: organizations[2].id, // Faculty of Science (ถ้ามี)
        role: "CAMPUS_ADMIN",
        position: "NON_POSITION", // ไม่มีตำแหน่งเฉพาะ
      },
    }),
    
    // KU004: HEAD ของ Faculty of Agriculture KPS
    prisma.userOrganization.create({
      data: {
        userId: users[3].id,
        organizationId: organizations[0].id, // หรือ KPS Agriculture org
        role: "ADMIN",
        position: "NON_POSITION", // ไม่มีตำแหน่งเฉพาะ
      },
    }),
    
    // KU005: USER ใน 2 organizations (test case ที่ต้องการ)
    prisma.userOrganization.create({
      data: {
        userId: users[4].id,
        organizationId: organizations[0].id, // org1
        role: "USER",
        position: "MEMBER",
      },
    }),
    prisma.userOrganization.create({
      data: {
        userId: users[4].id,
        organizationId: organizations[1].id, // org2
        role: "USER", 
        position: "HEAD", // test case: same user, different positions
      },
    }),
    
    // KU006: CAMPUS_ADMIN
    prisma.userOrganization.create({
      data: {
        userId: users[5].id,
        organizationId: organizations[0].id,
        role: "CAMPUS_ADMIN",
        position: "NON_POSITION", // ไม่มีตำแหน่งเฉพาะ
      },
    }),
  ]);

  console.log("Created user-organization relationships");

  // --- Create Sample Projects (ต้องใช้ organizationId จาก organizations array) ---
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
                  {
                    timeStart: "10:30",
                    timeEnd: "12:00",
                    description: "การบรรยายเรื่องเกษตรยั่งยืน",
                  },
                ],
              },
            ],
          },
        ],
        principlesAndReasoning:
          "ส่งเสริมการเกษตรยั่งยืนในชุมชน เพื่อเพิ่มผลผลิตและลดผลกระทบต่อสิ่งแวดล้อม",
        budgetUsed: 500000,
        objectives:
          "เพื่อพัฒนาความรู้ด้านเกษตรยั่งยืน และถ่ายทอดเทคโนโลยีสู่ชุมชน",
        activityFormat: ["บรรยาย", "ปฏิบัติการ", "ศึกษาดูงาน"],
        expectedProjectOutcome: [
          "เกษตรกรมีความรู้ด้านเกษตรยั่งยืน",
          "ผลผลิตทางการเกษตรเพิ่มขึ้น",
          "ลดการใช้สารเคมีในการเกษตร",
        ],
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
        organizationId: organizations[0].id, // Faculty of Agriculture
        campusId: bangkokCampus.id,
        complianceStandards: ["KNOWLEDGE", "SKILLS"],
        kasetsartStudentIdentities: ["KNOWLEDGE_CREATION", "UNITY"],
        sustainableDevelopmentGoals: ["SDG2", "SDG15"],
        activityHours: {
          totalHours: 40,
          categories: [
            { category: "บรรยาย", hours: 20 },
            { category: "ปฏิบัติการ", hours: 15 },
            { category: "ศึกษาดูงาน", hours: 5 },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        publicProjectId: "PROJ-2024-002",
        activityCode: "ENG-2024-001",
        nameEn: "Smart Farm Technology Innovation",
        nameTh: "โครงการนวัตกรรมเทคโนโลยีเกษตรอัจฉริยะ",
        dateStart: new Date("2024-02-01"),
        dateEnd: new Date("2024-11-30"),
        targetUser: [{ staff: 15 }, { student: 60 }, { farmer: 30 }],
        participants: [{ staff: 12 }, { student: 55 }, { farmer: 25 }],
        principlesAndReasoning:
          "พัฒนาเทคโนโลยีเพื่อเพิ่มประสิทธิภาพการเกษตรและลดต้นทุนการผลิต",
        budgetUsed: 750000,
        objectives: "เพื่อพัฒนาและทดสอบเทคโนโลยีเกษตรอัจฉริยะ",
        activityFormat: ["วิจัย", "พัฒนาต้นแบบ", "ทดสอบภาคสนาม"],
        expectedProjectOutcome: [
          "ได้เทคโนโลยีเกษตรอัจฉริยะ",
          "ลดต้นทุนการผลิต",
          "เพิ่มประสิทธิภาพการเกษตร",
        ],
        location: {
          location: "ห้องปฏิบัติการวิศวกรรม",
          outside: [],
        },
        organizationId: organizations[1].id, // Faculty of Engineering (BKK)
        campusId: bangkokCampus.id,
        complianceStandards: ["KNOWLEDGE", "SKILLS"],
        kasetsartStudentIdentities: ["KNOWLEDGE_CREATION", "DETERMINATION"],
        sustainableDevelopmentGoals: ["SDG9", "SDG12"],
        activityHours: {
          totalHours: 60,
          categories: [
            { category: "วิจัย", hours: 30 },
            { category: "พัฒนาต้นแบบ", hours: 20 },
            { category: "ทดสอบภาคสนาม", hours: 10 },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        publicProjectId: "PROJ-2024-003",
        activityCode: "KPS-AGRI-2024-001",
        nameEn: "Community Agricultural Product Development",
        nameTh: "โครงการพัฒนาผลิตภัณฑ์เกษตรชุมชน",
        dateStart: new Date("2024-03-15"),
        dateEnd: new Date("2024-09-30"),
        targetUser: [{ farmer: 80 }, { community_leader: 10 }],
        participants: [{ farmer: 70 }, { community_leader: 8 }],
        principlesAndReasoning:
          "ส่งเสริมการแปรรูปผลผลิตทางการเกษตรเพื่อเพิ่มมูลค่า",
        budgetUsed: 300000,
        objectives: "เพื่อพัฒนาผลิตภัณฑ์ใหม่จากผลผลิตเกษตรในชุมชน",
        activityFormat: ["ฝึกอบรม", "สาธิต", "ให้คำปรึกษา"],
        expectedProjectOutcome: [
          "มีผลิตภัณฑ์เกษตรแปรรูปใหม่",
          "เกษตรกรมีรายได้เพิ่มขึ้น",
        ],
        location: {
          location: "ศูนย์ฝึกอบรมกำแพงแสน",
          outside: [
            {
              postcode: "73140",
              address: "มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน",
              city: "กำแพงแสน",
              province: "นครปฐม",
            },
          ],
        },
        organizationId: organizations[12].id, // Faculty of Agriculture (KPS)
        campusId: kamphaengSaenCampus.id,
        complianceStandards: ["KNOWLEDGE", "SKILLS"],
        kasetsartStudentIdentities: ["UNITY"],
        sustainableDevelopmentGoals: ["SDG8", "SDG11"],
        activityHours: {
          totalHours: 25,
          categories: [
            { category: "ฝึกอบรม", hours: 15 },
            { category: "สาธิต", hours: 5 },
            { category: "ให้คำปรึกษา", hours: 5 },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        publicProjectId: "PROJ-2024-004",
        activityCode: "SR-MARI-2024-001",
        nameEn: "Coastal Tourism Development and Conservation",
        nameTh: "โครงการพัฒนาการท่องเที่ยวชายฝั่งและการอนุรักษ์",
        dateStart: new Date("2024-04-01"),
        dateEnd: new Date("2024-10-31"),
        targetUser: [{ student: 40 }, { local_community: 20 }],
        participants: [{ student: 35 }, { local_community: 18 }],
        principlesAndReasoning:
          "ส่งเสริมการท่องเที่ยวอย่างยั่งยืนและการอนุรักษ์ทรัพยากรทางทะเล",
        budgetUsed: 400000,
        objectives: "เพื่อสร้างความตระหนักและส่งเสริมการท่องเที่ยวเชิงนิเวศ",
        activityFormat: ["สำรวจ", "รณรงค์", "จัดกิจกรรม"],
        expectedProjectOutcome: [
          "ชุมชนมีความรู้ด้านการท่องเที่ยวเชิงอนุรักษ์",
          "สภาพแวดล้อมชายฝั่งดีขึ้น",
        ],
        location: {
          location: "วิทยาเขตศรีราชาและพื้นที่ชายฝั่ง",
          outside: [
            {
              postcode: "20210",
              address: "199 หมู่ 6 ต.ทุ่งสุขลา",
              city: "ศรีราชา",
              province: "ชลบุรี",
            },
          ],
        },
        organizationId: organizations[19].id, // Faculty of International Maritime Studies (SR)
        campusId: srirachaCampus.id,
        complianceStandards: ["KNOWLEDGE", "SKILLS"],
        kasetsartStudentIdentities: ["UNITY"],
        sustainableDevelopmentGoals: ["SDG14", "SDG17"],
        activityHours: {
          totalHours: 30,
          categories: [
            { category: "สำรวจ", hours: 10 },
            { category: "รณรงค์", hours: 10 },
            { category: "จัดกิจกรรม", hours: 10 },
          ],
        },
      },
    }),
  ]);

  console.log("Created projects");

  // --- Create Activity Hours ---
  const activityHours = await Promise.all([
    prisma.activityHour.create({
      data: {
        isCompleted: true,
        fileNamePrinciple: "activity-report-001.pdf",
        projectId: projects[0].id,
        userId: users[0].id,
      },
    }),
    prisma.activityHour.create({
      data: {
        isCompleted: false,
        projectId: projects[1].id,
        userId: users[1].id,
      },
    }),
    prisma.activityHour.create({
      data: {
        isCompleted: true,
        fileNamePrinciple: "activity-report-003-kps.pdf",
        projectId: projects[2].id,
        userId: users[3].id, // User from KPS campus
      },
    }),
    prisma.activityHour.create({
      data: {
        isCompleted: false,
        projectId: projects[3].id,
        userId: users[4].id, // User from SR campus
      },
    }),
  ]);

  console.log("Created activity hours");

  // --- Create Logs ---
  const logs = await Promise.all([
    prisma.log.create({
      data: {
        action: "CREATE_PROJECT",
        message: "สร้างโครงการพัฒนาการเกษตรแบบยั่งยืน",
        userId: users[0].id,
      },
    }),
    prisma.log.create({
      data: {
        action: "UPDATE_PROJECT",
        message: "อัพเดทข้อมูลโครงการนวัตกรรมเทคโนโลยีเกษตรอัจฉริยะ",
        userId: users[1].id,
      },
    }),
    prisma.log.create({
      data: {
        action: "COMPLETE_ACTIVITY",
        message:
          "เสร็จสิ้นกิจกรรมการเรียนรู้ของโครงการพัฒนาผลิตภัณฑ์เกษตรชุมชน",
        userId: users[3].id,
      },
    }),
    prisma.log.create({
      data: {
        action: "CREATE_ORGANIZATION",
        message: "สร้างหน่วยงานคณะวิศวกรรมศาสตร์ กำแพงแสน",
        userId: users[2].id, // Campus admin
      },
    }),
    prisma.log.create({
      data: {
        action: "USER_LOGIN",
        message: "ผู้ใช้งาน KU005 เข้าสู่ระบบ",
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
  const totalUserOrganizations = await prisma.userOrganization.count();
  const totalProjects = await prisma.project.count();
  const totalActivityHours = await prisma.activityHour.count();
  const totalLogs = await prisma.log.count();

  console.log("Seed completed successfully!");
  console.log(`Created:
  - ${totalCampuses} campuses
  - ${totalOrganizationTypes} organization types
  - ${totalOrganizations} organizations
  - ${totalUsers} users
  - ${totalUserOrganizations} user-organization relationships
  - ${totalProjects} projects
  - ${totalActivityHours} activity hours
  - ${totalLogs} logs`);
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

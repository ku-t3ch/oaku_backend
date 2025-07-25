import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export const campusValidate = ["BK", "KPS", "SRC", "CSC", "SLA"];
export const positionValidate = ["S", "P", "G"];
export const yearValidate = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const requiredCsvHeader = [
  "วิทยาเขต",
  "รหัสนิสิต (ไม่ซ้ำ)",
  "คำนำหน้า",
  'ชื่อ-นามสกุล (ไม่มีคำนำหน้า) (กรอก "-" ได้)',
  'คณะ  (ไม่มี "คณะ" นำหน้า)',
  'สาขา (กรอก "-" ได้)',
  "ชั้นปี",
  "ตำแหน่ง",
  "หมายเหตุ (ไม่บังคับ)",
  "จำนวนรหัสนิสิต (สำหรับตรวจสอบ)",
];

export const nameValidator = (name: string) => {
  if (
    name.startsWith("นาย") ||
    name.startsWith("นางสาว") ||
    name.startsWith("นาง") ||
    name.startsWith("เด็กชาย") ||
    name.startsWith("เด็กหญิง")
  ) {
    throw new Error(
      `ชื่อต้องไม่มีคำนำหน้า นาย, นางสาว, นาง, เด็กชาย, เด็กหญิง ${name}`
    );
  }
};

export const prefixValidator = (prefix: string) => {
  if (
    !(
      prefix.startsWith("นาย") ||
      prefix.startsWith("นางสาว") ||
      prefix.startsWith("นาง") ||
      prefix.startsWith("เด็กชาย") ||
      prefix.startsWith("เด็กหญิง") ||
      prefix.startsWith("ไม่ระบุ")
    )
  ) {
    throw new Error(
      `คำนำหน้าต้องเป็น นาย, นางสาว, นาง, เด็กชาย, เด็กหญิง, ไม่ระบุ เท่านั้น`
    );
  }
};

export const campusValidator = (campus: string) => {
  if (!campus || campusValidate.includes(campus)) {
    // อนุญาตให้ค่าว่างผ่าน หรือเป็น BK, KPS, SRC, CSC, SLA
    return;
  }
  throw new Error(`วิทยาเขตต้องเป็น ${campusValidate.join(", ")} หรือเว้นว่าง`);
};

export const studentCodeValidator = (
  studentCode: string,
  position?: string
) => {
  // อนุญาตให้ค่าว่าง ถ้าตำแหน่งเป็น G
  if (position === "G" && (!studentCode || studentCode.trim() === "")) {
    return;
  }
  if (studentCode.length !== 10) {
    throw new Error(`รหัสนิสิตต้องมี 10 หลัก`);
  }
  if (!/^[0-9]+$/.test(studentCode)) {
    throw new Error(`รหัสนิสิตต้องเป็นตัวเลขเท่านั้น`);
  }
};

export const studentCodeDuplicateValidator = (
  studentCode: string,
  studentCodeAll: (string | undefined)[],
  position?: string
) => {
  if (position === "G") return; // ไม่ตรวจสอบซ้ำสำหรับ G
  if (
    studentCode &&
    studentCodeAll.filter((code) => code === studentCode).length > 1
  ) {
    throw new Error(`รหัสนิสิตซ้ำ: ${studentCode}`);
  }
};

export const facultyValidator = (faculty: string) => {
  if (faculty.startsWith("คณะ")) {
    throw new Error(`ต้องไม่มีคำนำหน้า (คณะ)`);
  }
};

export const majorValidator = (major: string) => {
  if (major.startsWith("สาขา")) {
    throw new Error(`ต้องไม่มีคำนำหน้า (สาขา)`);
  }
};

export const yearValidator = (year: string, position?: string) => {
  // อนุญาตให้ค่าว่าง ถ้าตำแหน่งเป็น G
  if (position === "G" && (!year || year.trim() === "")) {
    return;
  }
  if (!yearValidate.includes(year)) {
    throw new Error(`ต้องเป็นชั้นปี ${yearValidate.join(", ")} เท่านั้น`);
  }
};

export const positionValidator = (position: string) => {
  if (!positionValidate.includes(position)) {
    throw new Error(`ต้องเป็นตำแหน่ง ${positionValidate.join(", ")} เท่านั้น`);
  }
};

export const csvExecute = async (fileData: any) => {
  const records: string[][] = parse(fileData, { skip_empty_lines: true });

  // ตรวจสอบ header format
  const header = records[0];
  if (
    header.length !== requiredCsvHeader.length ||
    !requiredCsvHeader.every((col, idx) => col === header[idx])
  ) {
    throw new Error(
      `ไฟล์ต้องมี header ตามนี้: ${requiredCsvHeader.join(", ")}`
    );
  }

  // validate
  for (let i = 1; i < records.length; i++) {
    const row = records[i];

    if (row) {
      const campus = row[0];
      const studentCode = row[1];
      const prefix = row[2];
      const name = row[3];
      const faculty = row[4];
      const major = row[5];
      const year = row[6];
      const position = row[7];

      if (positionValidate.includes(position ?? "")) {
        campusValidator(campus!);
        studentCodeValidator(studentCode!, position!); 
        const allStudentCode = records.slice(1).map((row) => row[1]);
        studentCodeDuplicateValidator(studentCode!, allStudentCode, position!);
        prefixValidator(prefix!);
        nameValidator(name!);
        facultyValidator(faculty!);
        majorValidator(major!);
        yearValidator(year!, position!);
        positionValidator(position!);
      } else {
        throw new Error(`Invalid position: ${position}`);
      }
    }
  }

  // records add
  const newColumn = [
    "วิทยาเขต",
    "รหัสโครงการ",
    "ชื่อโครงการ",
    "ชื่อองค์กร",
    "รหัสนิสิต",
    "คำนำหน้า",
    "ชื่อ-นามสกุล",
    "คณะ",
    "สาขา",
    "ชั้นปี",
    "ตำแหน่ง",
    "หมายเหตุ",
  ];

  const newRecords = [
    newColumn,
    ...records.slice(1).map((record1) => {
      return [
        record1[0], // วิทยาเขต
        "", // รหัสโครงการ
        "", // ชื่อโครงการ
        "", // ชื่อองค์กร
        record1[1], // รหัสนิสิต (ไม่ซ้ำ)
        record1[2], // คำนำหน้า
        record1[3], // ชื่อ-นามสกุล
        record1[4], // คณะ
        record1[5], // สาขา
        record1[6], // ชั้นปี
        record1[7], // ตำแหน่ง
        record1[8], // หมายเหตุ
      ];
    }),
  ];
  const newCsv = stringify(newRecords);
  return newCsv;
};

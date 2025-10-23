import { getDb } from "../server/db";
import { subjects, grades, standards } from "../drizzle/schema";

async function seed() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }

  console.log("🌱 Seeding database...");

  // Insert Subjects
  const subjectsData = [
    { nameAr: "الرياضيات", nameEn: "Mathematics", code: "MATH" },
    { nameAr: "العلوم", nameEn: "Science", code: "SCI" },
    { nameAr: "اللغة العربية", nameEn: "Arabic Language", code: "AR" },
    { nameAr: "اللغة الإنجليزية", nameEn: "English Language", code: "EN" },
  ];

  await db.insert(subjects).values(subjectsData);
  console.log("✓ Subjects inserted");

  // Insert Grades
  const gradesData = [
    { nameAr: "الصف الأول", nameEn: "Grade 1", level: 1 },
    { nameAr: "الصف الثاني", nameEn: "Grade 2", level: 2 },
    { nameAr: "الصف الثالث", nameEn: "Grade 3", level: 3 },
    { nameAr: "الصف الرابع", nameEn: "Grade 4", level: 4 },
    { nameAr: "الصف الخامس", nameEn: "Grade 5", level: 5 },
    { nameAr: "الصف السادس", nameEn: "Grade 6", level: 6 },
  ];

  await db.insert(grades).values(gradesData);
  console.log("✓ Grades inserted");

  // Insert Standards (Qatar MoE aligned)
  const standardsData = [
    // Grade 1 Science Standards (from uploaded document)
    {
      code: "SCI.G1.1",
      textAr: "يميز بين الكائنات الحية وغير الحية",
      textEn: "Distinguish between living and non-living things",
      subjectId: 2,
      gradeId: 1,
      bloomLevel: "understand" as const,
    },
    {
      code: "SCI.G1.2",
      textAr: "يصف خصائص الكائنات الحية الأساسية",
      textEn: "Describe basic characteristics of living organisms",
      subjectId: 2,
      gradeId: 1,
      bloomLevel: "understand" as const,
    },
    {
      code: "SCI.G1.3",
      textAr: "يلاحظ التغيرات في الكائنات الحية عبر الزمن",
      textEn: "Observe changes in living organisms over time",
      subjectId: 2,
      gradeId: 1,
      bloomLevel: "apply" as const,
    },
    {
      code: "SCI.G1.4",
      textAr: "يفهم احتياجات الكائنات الحية الأساسية",
      textEn: "Understand basic needs of living organisms",
      subjectId: 2,
      gradeId: 1,
      bloomLevel: "understand" as const,
    },
    {
      code: "SCI.G1.5",
      textAr: "يصنف المواد حسب خصائصها الفيزيائية",
      textEn: "Classify materials according to their physical properties",
      subjectId: 2,
      gradeId: 1,
      bloomLevel: "analyze" as const,
    },
    {
      code: "SCI.G1.6",
      textAr: "يستكشف الحركة والقوى في الحياة اليومية",
      textEn: "Explore motion and forces in daily life",
      subjectId: 2,
      gradeId: 1,
      bloomLevel: "apply" as const,
    },
    // Grade 1 Mathematics Standards
    {
      code: "MATH.G1.1",
      textAr: "يعد ويحسب الأعداد من 1 إلى 10",
      textEn: "Count and calculate numbers from 1 to 10",
      subjectId: 1,
      gradeId: 1,
      bloomLevel: "remember" as const,
    },
    {
      code: "MATH.G1.2",
      textAr: "يقارن الأعداد باستخدام الرموز",
      textEn: "Compare numbers using symbols",
      subjectId: 1,
      gradeId: 1,
      bloomLevel: "understand" as const,
    },
    {
      code: "MATH.G1.3",
      textAr: "يجمع وينقص الأعداد الصغيرة",
      textEn: "Add and subtract small numbers",
      subjectId: 1,
      gradeId: 1,
      bloomLevel: "apply" as const,
    },
    {
      code: "MATH.G1.4",
      textAr: "يتعرف على الأشكال الهندسية الأساسية",
      textEn: "Recognize basic geometric shapes",
      subjectId: 1,
      gradeId: 1,
      bloomLevel: "remember" as const,
    },
    {
      code: "MATH.G1.5",
      textAr: "يقيس الأطوال والأوزان البسيطة",
      textEn: "Measure simple lengths and weights",
      subjectId: 1,
      gradeId: 1,
      bloomLevel: "apply" as const,
    },
    {
      code: "MATH.G1.6",
      textAr: "يقرأ ويفسر البيانات البسيطة",
      textEn: "Read and interpret simple data",
      subjectId: 1,
      gradeId: 1,
      bloomLevel: "understand" as const,
    },
  ];

  await db.insert(standards).values(standardsData);
  console.log("✓ Standards inserted");

  console.log("✅ Database seeding completed!");
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});


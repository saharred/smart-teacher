import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
  decimal,
  longtext,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with Smart Teacher specific fields for roles and preferences.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["teacher", "hod", "admin"]).default("teacher").notNull(),
  
  // Smart Teacher specific fields
  preferredLanguage: mysqlEnum("preferredLanguage", ["ar", "en"]).default("ar"),
  schoolName: text("schoolName"),
  subjectIds: json("subjectIds"), // Array of subject IDs
  gradeIds: json("gradeIds"), // Array of grade IDs
  profileComplete: boolean("profileComplete").default(false),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subjects taxonomy (e.g., Mathematics, Science, Arabic, English)
 */
export const subjects = mysqlTable("subjects", {
  id: int("id").autoincrement().primaryKey(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Subject = typeof subjects.$inferSelect;

/**
 * Grades taxonomy (e.g., Grade 1, Grade 2, etc.)
 */
export const grades = mysqlTable("grades", {
  id: int("id").autoincrement().primaryKey(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  level: int("level").notNull(), // 1-12
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Grade = typeof grades.$inferSelect;

/**
 * Learning Standards/Learning Outcomes aligned to Qatar MoE
 */
export const standards = mysqlTable("standards", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 100 }).notNull(),
  textAr: text("textAr").notNull(),
  textEn: text("textEn").notNull(),
  subjectId: int("subjectId").notNull(),
  gradeId: int("gradeId").notNull(),
  bloomLevel: mysqlEnum("bloomLevel", ["remember", "understand", "apply", "analyze", "evaluate", "create"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Standard = typeof standards.$inferSelect;

/**
 * Lesson Plans - Qatar MoE Structured
 */
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  
  // Basic Info
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  subjectId: int("subjectId").notNull(),
  gradeId: int("gradeId").notNull(),
  
  // Lesson Structure (JSON for flexibility)
  unitAr: varchar("unitAr", { length: 255 }),
  unitEn: varchar("unitEn", { length: 255 }),
  topicAr: varchar("topicAr", { length: 255 }),
  topicEn: varchar("topicEn", { length: 255 }),
  
  // Learning Outcomes & Objectives
  standardIds: json("standardIds"), // Array of standard IDs
  objectivesAr: json("objectivesAr"), // SMART objectives in Arabic
  objectivesEn: json("objectivesEn"), // SMART objectives in English
  
  // Lesson Content
  priorKnowledgeAr: text("priorKnowledgeAr"),
  priorKnowledgeEn: text("priorKnowledgeEn"),
  materialsResourcesAr: json("materialsResourcesAr"),
  materialsResourcesEn: json("materialsResourcesEn"),
  vocabularyAr: json("vocabularyAr"),
  vocabularyEn: json("vocabularyEn"),
  
  // Lesson Procedure (5E Model: Engage, Explore, Explain, Elaborate, Evaluate)
  procedureJson: longtext("procedureJson"), // Complex nested structure
  
  // Differentiation
  supportStrategiesAr: json("supportStrategiesAr"),
  supportStrategiesEn: json("supportStrategiesEn"),
  challengeActivitiesAr: json("challengeActivitiesAr"),
  challengeActivitiesEn: json("challengeActivitiesEn"),
  
  // Assessment
  formativeAssessmentAr: text("formativeAssessmentAr"),
  formativeAssessmentEn: text("formativeAssessmentEn"),
  summativeAssessmentAr: text("summativeAssessmentAr"),
  summativeAssessmentEn: text("summativeAssessmentEn"),
  
  // Extensions
  homeworkAr: text("homeworkAr"),
  homeworkEn: text("homeworkEn"),
  extensionAr: text("extensionAr"),
  extensionEn: text("extensionEn"),
  reflectionAr: text("reflectionAr"),
  reflectionEn: text("reflectionEn"),
  
  // Time Allocation (in minutes)
  totalDuration: int("totalDuration").default(45),
  timeAllocationJson: json("timeAllocationJson"), // {engage: 5, explore: 10, ...}
  
  // Metadata
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  version: int("version").default(1).notNull(),
  aiGenerated: boolean("aiGenerated").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

/**
 * Slide Decks generated from lessons
 */
export const slides = mysqlTable("slides", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lessonId").notNull(),
  ownerId: int("ownerId").notNull(),
  
  titleAr: varchar("titleAr", { length: 255 }),
  titleEn: varchar("titleEn", { length: 255 }),
  
  // Export URLs (S3)
  pptxUrl: text("pptxUrl"),
  pdfUrl: text("pdfUrl"),
  
  // Slide structure
  slidesJson: longtext("slidesJson"), // Array of slide objects
  
  version: int("version").default(1).notNull(),
  status: mysqlEnum("status", ["draft", "generated", "exported"]).default("draft").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Slide = typeof slides.$inferSelect;

/**
 * Question Bank Items
 */
export const questions = mysqlTable("questions", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  
  // Item Type
  type: mysqlEnum("type", ["mcq", "multiselect", "truefalse", "shortanswer", "matching", "ordering", "cloze"]).notNull(),
  
  // Question Content
  stemAr: text("stemAr").notNull(),
  stemEn: text("stemEn").notNull(),
  
  // Choices (for MCQ, TF, Matching, etc.)
  choicesJson: json("choicesJson"), // [{id, textAr, textEn, isCorrect}]
  
  // Answer Key
  answerKeyJson: json("answerKeyJson"), // Flexible structure for different types
  
  // Metadata
  standardId: int("standardId"),
  subjectId: int("subjectId"),
  gradeId: int("gradeId"),
  difficulty: int("difficulty").default(3), // 1-5 scale
  bloomLevel: mysqlEnum("bloomLevel", ["remember", "understand", "apply", "analyze", "evaluate", "create"]),
  tags: json("tags"), // Array of tags
  
  // AI Generation
  aiGenerated: boolean("aiGenerated").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

/**
 * Assessments - Collections of questions
 */
export const assessments = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  
  // Questions in this assessment
  questionIds: json("questionIds"), // Array of question I  // Settings
  settingsJson: json("settingsJson"), // {randomizeQuestions, showAnswers, timeLimit, etc.}// Export URLs
  pdfUrl: text("pdfUrl"),
  answerKeyUrl: text("answerKeyUrl"),
  excelUrl: text("excelUrl"),
  qtiUrl: text("qtiUrl"), // QTI 2.2 export
  
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;

/**
 * Interactive Games
 */
export const games = mysqlTable("games", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  
  // Game Template
  template: mysqlEnum("template", ["timedquiz", "dragdrop", "memorycards", "sort", "hotspot"]).notNull(),
  
  // Configuration
  configJson: longtext("configJson"), // Template-specific configuration
  
  // Associated content
  questionIds: json("questionIds"),
  lessonId: int("lessonId"),
  
  // Export URLs
  htmlZipUrl: text("htmlZipUrl"),
  scormZipUrl: text("scormZipUrl"),
  shareLink: varchar("shareLink", { length: 255 }).unique(),
  
  // Metadata
  isPublic: boolean("isPublic").default(false).notNull(),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Game = typeof games.$inferSelect;

/**
 * Analytics - Track user activity
 */
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  
  // What happened
  objectType: mysqlEnum("objectType", ["lesson", "slide", "question", "assessment", "game"]).notNull(),
  objectId: int("objectId").notNull(),
  event: mysqlEnum("event", ["created", "viewed", "edited", "exported", "shared", "deleted"]).notNull(),
  
  // Additional context
  payloadJson: json("payloadJson"),
  
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;

/**
 * Approvals - For HOD workflow
 */
export const approvals = mysqlTable("approvals", {
  id: int("id").autoincrement().primaryKey(),
  
  // What's being approved
  lessonId: int("lessonId").notNull(),
  
  // Who's approving
  hodId: int("hodId").notNull(),
  teacherId: int("teacherId").notNull(),
  
  // Status
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  comments: text("comments"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Approval = typeof approvals.$inferSelect;

/**
 * System Settings
 */
export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: longtext("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Setting = typeof settings.$inferSelect;


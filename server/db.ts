import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  lessons,
  questions,
  assessments,
  games,
  slides,
  subjects,
  grades,
  standards,
  analytics,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
      email: user.email || user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    // Handle email separately
    if (user.email) {
      values.email = user.email;
      updateSet.email = user.email;
    }

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Lesson Queries ============

export async function getUserLessons(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(lessons)
    .where(eq(lessons.ownerId, userId))
    .orderBy(lessons.createdAt);
}

export async function getLessonById(lessonId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// ============ Question Queries ============

export async function getUserQuestions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(questions)
    .where(eq(questions.ownerId, userId))
    .orderBy(questions.createdAt);
}

export async function getQuestionsByStandard(standardId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(questions)
    .where(eq(questions.standardId, standardId));
}

// ============ Assessment Queries ============

export async function getUserAssessments(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(assessments)
    .where(eq(assessments.ownerId, userId))
    .orderBy(assessments.createdAt);
}

// ============ Game Queries ============

export async function getUserGames(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(games)
    .where(eq(games.ownerId, userId))
    .orderBy(games.createdAt);
}

// ============ Taxonomy Queries ============

export async function getAllSubjects() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(subjects).orderBy(subjects.nameAr);
}

export async function getAllGrades() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(grades).orderBy(grades.level);
}

export async function getStandardsBySubjectAndGrade(
  subjectId: number,
  gradeId: number
) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(standards)
    .where(
      and(
        eq(standards.subjectId, subjectId),
        eq(standards.gradeId, gradeId)
      )
    )
    .orderBy(standards.code);
}

// ============ Analytics Queries ============

export async function logAnalyticsEvent(
  userId: number,
  objectType: string,
  objectId: number,
  event: string,
  payload?: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(analytics).values({
      ownerId: userId,
      objectType: objectType as any,
      objectId,
      event: event as any,
      payloadJson: payload,
    });
  } catch (error) {
    console.error("[Analytics] Failed to log event:", error);
  }
}

export async function getUserAnalytics(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(analytics)
    .where(eq(analytics.ownerId, userId))
    .orderBy(analytics.timestamp);
}


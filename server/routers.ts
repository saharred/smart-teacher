import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import {
  getUserLessons,
  getLessonById,
  getUserQuestions,
  getQuestionsByStandard,
  getUserAssessments,
  getUserGames,
  getAllSubjects,
  getAllGrades,
  getStandardsBySubjectAndGrade,
  getUserAnalytics,
  logAnalyticsEvent,
  getDb,
} from "./db";
import { lessons, questions, assessments, games } from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ Taxonomy Routes ============
  taxonomy: router({
    getSubjects: publicProcedure.query(async () => {
      return await getAllSubjects();
    }),

    getGrades: publicProcedure.query(async () => {
      return await getAllGrades();
    }),

    getStandardsBySubjectAndGrade: publicProcedure
      .input(
        z.object({
          subjectId: z.number(),
          gradeId: z.number(),
        })
      )
      .query(async ({ input }) => {
        return await getStandardsBySubjectAndGrade(
          input.subjectId,
          input.gradeId
        );
      }),
  }),

  // ============ Lesson Routes ============
  lessons: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserLessons(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const lesson = await getLessonById(input.id);
        // Allow access if owner or admin
        if (lesson && (lesson.ownerId === ctx.user.id || ctx.user.role === "admin")) {
          return lesson;
        }
        return null;
      }),

    create: protectedProcedure
      .input(
        z.object({
          titleAr: z.string(),
          titleEn: z.string(),
          subjectId: z.number(),
          gradeId: z.number(),
          unitAr: z.string().optional(),
          unitEn: z.string().optional(),
          topicAr: z.string().optional(),
          topicEn: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(lessons).values({
          ownerId: ctx.user.id,
          titleAr: input.titleAr,
          titleEn: input.titleEn,
          subjectId: input.subjectId,
          gradeId: input.gradeId,
          unitAr: input.unitAr,
          unitEn: input.unitEn,
          topicAr: input.topicAr,
          topicEn: input.topicEn,
          status: "draft",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await logAnalyticsEvent(
          ctx.user.id,
          "lesson",
          result[0].insertId,
          "created"
        );

        return { id: result[0].insertId };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Verify ownership
        const lesson = await getLessonById(input.id);
        if (!lesson || lesson.ownerId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        await db.update(lessons).set({...input.data, updatedAt: new Date()}).where(eq(lessons.id, input.id));

        await logAnalyticsEvent(ctx.user.id, "lesson", input.id, "edited");

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Verify ownership
        const lesson = await getLessonById(input.id);
        if (!lesson || lesson.ownerId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        await db.delete(lessons).where(eq(lessons.id, input.id));

        await logAnalyticsEvent(ctx.user.id, "lesson", input.id, "deleted");

        return { success: true };
      }),
  }),

  // ============ Question Routes ============
  questions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserQuestions(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          type: z.enum([
            "mcq",
            "multiselect",
            "truefalse",
            "shortanswer",
            "matching",
            "ordering",
            "cloze",
          ]),
          stemAr: z.string(),
          stemEn: z.string(),
          choicesJson: z.any().optional(),
          answerKeyJson: z.any(),
          standardId: z.number().optional(),
          subjectId: z.number().optional(),
          gradeId: z.number().optional(),
          difficulty: z.number().optional(),
          bloomLevel: z
            .enum([
              "remember",
              "understand",
              "apply",
              "analyze",
              "evaluate",
              "create",
            ])
            .optional(),
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(questions).values({
          ownerId: ctx.user.id,
          type: input.type,
          stemAr: input.stemAr,
          stemEn: input.stemEn,
          choicesJson: input.choicesJson,
          answerKeyJson: input.answerKeyJson,
          standardId: input.standardId,
          subjectId: input.subjectId,
          gradeId: input.gradeId,
          difficulty: input.difficulty || 3,
          bloomLevel: input.bloomLevel,
          tags: input.tags,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await logAnalyticsEvent(
          ctx.user.id,
          "question",
          result[0].insertId,
          "created"
        );

        return { id: result[0].insertId };
      }),
  }),

  // ============ Assessment Routes ============
  assessments: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserAssessments(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          titleAr: z.string(),
          titleEn: z.string(),
          descriptionAr: z.string().optional(),
          descriptionEn: z.string().optional(),
          questionIds: z.array(z.number()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(assessments).values({
          ownerId: ctx.user.id,
          titleAr: input.titleAr,
          titleEn: input.titleEn,
          descriptionAr: input.descriptionAr,
          descriptionEn: input.descriptionEn,
          questionIds: input.questionIds,
          status: "draft",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await logAnalyticsEvent(
          ctx.user.id,
          "assessment",
          result[0].insertId,
          "created"
        );

        return { id: result[0].insertId };
      }),
  }),

  // ============ Game Routes ============
  games: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserGames(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          titleAr: z.string(),
          titleEn: z.string(),
          template: z.enum([
            "timedquiz",
            "dragdrop",
            "memorycards",
            "sort",
            "hotspot",
          ]),
          configJson: z.any().optional(),
          questionIds: z.array(z.number()).optional(),
          lessonId: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(games).values({
          ownerId: ctx.user.id,
          titleAr: input.titleAr,
          titleEn: input.titleEn,
          template: input.template,
          configJson: JSON.stringify(input.configJson || {}),
          questionIds: input.questionIds,
          lessonId: input.lessonId,
          status: "draft",
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await logAnalyticsEvent(
          ctx.user.id,
          "game",
          result[0].insertId,
          "created"
        );

        return { id: result[0].insertId };
      }),
  }),

  // ============ Analytics Routes ============
  analytics: router({
    getMyAnalytics: protectedProcedure.query(async ({ ctx }) => {
      return await getUserAnalytics(ctx.user.id);
    }),

    getSummary: protectedProcedure.query(async ({ ctx }) => {
      const userLessons = await getUserLessons(ctx.user.id);
      const userQuestions = await getUserQuestions(ctx.user.id);
      const userAssessments = await getUserAssessments(ctx.user.id);
      const userGames = await getUserGames(ctx.user.id);

      return {
        lessonsCount: userLessons.length,
        questionsCount: userQuestions.length,
        assessmentsCount: userAssessments.length,
        gamesCount: userGames.length,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;


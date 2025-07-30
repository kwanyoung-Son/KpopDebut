import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const analysisResults = pgTable("analysis_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  photoData: text("photo_data"),
  quizAnswers: jsonb("quiz_answers").notNull(),
  groupName: text("group_name").notNull(),
  position: text("position").notNull(),
  subPosition: text("sub_position"),
  character: text("character").notNull(),
  characterDesc: text("character_desc").notNull(),
  styleTags: jsonb("style_tags").notNull(),
  memberName: text("member_name"),
  agency: text("agency"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAnalysisResultSchema = createInsertSchema(analysisResults).omit({
  id: true,
  createdAt: true,
});

export const quizAnswersSchema = z.object({
  // 성격/성향 관련 질문
  stagePresence: z.enum(["center", "leader", "performer", "charisma"]),
  friendsDescribe: z.enum(["mood_maker", "serious", "creative", "responsible"]),
  newProject: z.enum(["execute", "plan", "discuss", "think"]),
  
  // 무대/표현 스타일 관련 질문
  stageImportant: z.enum(["expression", "accuracy", "vocal", "teamwork"]),
  practiceStyle: z.enum(["vocal", "dance", "direction", "care"]),
  danceStyle: z.enum(["hiphop", "contemporary", "powerful", "cute"]),
  
  // 스타일/패션 감각 관련 질문
  fashionStyle: z.enum(["street", "chic", "lovely", "trendy"]),
  makeupStyle: z.enum(["natural", "bold", "retro", "elegant"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;
export type QuizAnswers = z.infer<typeof quizAnswersSchema>;

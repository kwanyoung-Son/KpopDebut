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
  personality: z.enum(["leader", "entertainer", "charisma", "cute"]),
  musicGenre: z.enum(["dance", "ballad", "hiphop", "trot"]),
  fashionStyle: z.enum(["street", "lovely", "chic", "vintage"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;
export type QuizAnswers = z.infer<typeof quizAnswersSchema>;

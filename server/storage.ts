import { type User, type InsertUser, type AnalysisResult, type InsertAnalysisResult } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult>;
  getAnalysisResult(sessionId: string): Promise<AnalysisResult | undefined>;
  getAnalysisCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private analysisResults: Map<string, AnalysisResult>;

  constructor() {
    this.users = new Map();
    this.analysisResults = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createAnalysisResult(insertResult: InsertAnalysisResult): Promise<AnalysisResult> {
    const id = randomUUID();
    const result: AnalysisResult = {
      ...insertResult,
      id,
      createdAt: new Date().toISOString(),
    };
    this.analysisResults.set(insertResult.sessionId, result);
    return result;
  }

  async getAnalysisResult(sessionId: string): Promise<AnalysisResult | undefined> {
    return this.analysisResults.get(sessionId);
  }

  async getAnalysisCount(): Promise<number> {
    return this.analysisResults.size;
  }
}

export const storage = new MemStorage();

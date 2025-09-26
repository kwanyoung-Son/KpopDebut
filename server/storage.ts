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
      photoData: insertResult.photoData || null,
      subPosition: insertResult.subPosition || null,
      memberName: (insertResult as any).memberName || null,
      agency: (insertResult as any).agency || null,
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

// Storage 선택 로직
function createStorage(): IStorage {
  const isProduction = process.env.NODE_ENV === 'production';
  const isCloudflareWorkers = typeof globalThis !== 'undefined' && 'DB' in globalThis;
  const useD1InDev = process.env.USE_D1_IN_DEV === 'true';
  
  console.log(`Environment: ${process.env.NODE_ENV}, Cloudflare Workers: ${isCloudflareWorkers}, Use D1 in Dev: ${useD1InDev}`);
  
  // D1 사용 조건: Cloudflare Workers 환경 OR 개발에서 강제 D1 사용
  if (isCloudflareWorkers || useD1InDev) {
    const { D1Storage } = require('./d1-storage');
    
    let d1Database;
    if (isCloudflareWorkers) {
      // Cloudflare Workers 환경
      d1Database = (globalThis as any).DB;
    } else {
      // 개발 환경에서 Neon PostgreSQL 사용
      d1Database = null; // D1Storage에서 Neon 연결 사용
    }
    
    const d1Storage = new D1Storage(d1Database);
    // 데이터베이스 초기화
    d1Storage.initializeDatabase().catch(console.error);
    console.log('Using D1Storage for Cloudflare Workers');
    return d1Storage;
  }
  
  // Node.js 환경에서는 메모리 스토리지 사용 (로컬 개발)
  console.log('Using MemStorage for local development');
  return new MemStorage();
}

export const storage = createStorage();

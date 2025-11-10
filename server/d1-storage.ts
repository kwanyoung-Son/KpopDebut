import { type User, type InsertUser, type AnalysisResult, type InsertAnalysisResult } from "@shared/schema";
import { randomUUID } from "crypto";
import type { IStorage } from "./storage";

// D1 Database interface (Cloudflare Workers environment)
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1Result>;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Result<T = unknown> {
  success: boolean;
  meta: {
    changed_db: boolean;
    changes: number;
    duration: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
    size_after: number;
  };
  results: T[];
}

interface D1ExecResult {
  count: number;
  duration: number;
}

export class D1Storage implements IStorage {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db
      .prepare("SELECT * FROM users WHERE id = ?")
      .bind(id)
      .first<User>();
    return result || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db
      .prepare("SELECT * FROM users WHERE username = ?")
      .bind(username)
      .first<User>();
    return result || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    
    await this.db
      .prepare("INSERT INTO users (id, username, password) VALUES (?, ?, ?)")
      .bind(id, user.username, user.password)
      .run();
    
    return user;
  }

  async createAnalysisResult(insertResult: InsertAnalysisResult): Promise<AnalysisResult> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    
    const result: AnalysisResult = {
      ...insertResult,
      id,
      createdAt,
      language: (insertResult as any).language ?? null,
      photoData: insertResult.photoData || null,
      subPosition: insertResult.subPosition || null,
      age: (insertResult as any).age ?? null,
      expression: (insertResult as any).expression ?? null,
      gender: (insertResult as any).gender ?? null,
      memberName: (insertResult as any).memberName || null,
      agency: (insertResult as any).agency || null,
    };

    await this.db
      .prepare(`
        INSERT INTO analysis_results (
          id, session_id, photo_data, quiz_answers, group_name, 
          position, sub_position, character, character_desc, 
          style_tags, member_name, agency, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        insertResult.sessionId,
        insertResult.photoData,
        JSON.stringify(insertResult.quizAnswers),
        insertResult.groupName,
        insertResult.position,
        insertResult.subPosition,
        insertResult.character,
        insertResult.characterDesc,
        JSON.stringify(insertResult.styleTags),
        (insertResult as any).memberName,
        (insertResult as any).agency,
        createdAt
      )
      .run();

    return result;
  }

  async getAnalysisResult(sessionId: string): Promise<AnalysisResult | undefined> {
    const result = await this.db
      .prepare("SELECT * FROM analysis_results WHERE session_id = ?")
      .bind(sessionId)
      .first<any>();

    if (!result) return undefined;

    return {
      ...result,
      quizAnswers: JSON.parse(result.quiz_answers),
      styleTags: JSON.parse(result.style_tags),
      sessionId: result.session_id,
      photoData: result.photo_data,
      groupName: result.group_name,
      subPosition: result.sub_position,
      characterDesc: result.character_desc,
      memberName: result.member_name,
      createdAt: result.created_at,
    };
  }

  async getAnalysisCount(): Promise<number> {
    const result = await this.db
      .prepare("SELECT COUNT(*) as count FROM analysis_results")
      .first<{ count: number }>();
    
    return result?.count || 0;
  }

  // D1 데이터베이스 초기화 (테이블 생성)
  async initializeDatabase(): Promise<void> {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS analysis_results (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        photo_data TEXT,
        quiz_answers TEXT NOT NULL,
        group_name TEXT NOT NULL,
        position TEXT NOT NULL,
        sub_position TEXT,
        character TEXT NOT NULL,
        character_desc TEXT NOT NULL,
        style_tags TEXT NOT NULL,
        member_name TEXT,
        agency TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
}

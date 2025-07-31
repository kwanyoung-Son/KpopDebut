# Cloudflare D1 설정 가이드

## 환경 구성

### 환경별 구분 방식
- **NODE_ENV** 환경변수로 구분
- **Cloudflare Workers 환경** 감지로 스토리지 선택

### 현재 설정
- **로컬 개발** (`npm run dev`): MemStorage (메모리)
- **Cloudflare 개발** (`npx wrangler dev`): D1 개발 DB
- **Cloudflare 운영** (`npx wrangler deploy`): D1 운영 DB

### 환경별 데이터베이스

1. **로컬 개발**: MemStorage (메모리)
   - 빠른 개발/테스트
   - 서버 재시작 시 데이터 초기화

2. **Cloudflare Workers**: D1 데이터베이스
   - 영구 데이터 저장
   - 글로벌 분산
   - 실제 분석 수 카운트

## D1 데이터베이스 설정 단계

### 1. 개발용 데이터베이스 생성
```bash
npx wrangler d1 create kpopdebut-dev
```

### 2. wrangler.toml 업데이트
생성된 데이터베이스 ID를 wrangler.toml에 추가:
```toml
[[d1_databases]]
binding = "DB"
database_name = "kpopdebut"
database_id = "YOUR_PRODUCTION_DB_ID"

[env.development.d1_databases]
[[env.development.d1_databases]]
binding = "DB"
database_name = "kpopdebut-dev"  
database_id = "YOUR_DEV_DB_ID"
```

### 3. 테이블 생성
```bash
# 개발 DB에 테이블 생성
npx wrangler d1 execute kpopdebut-dev --file=migrations/schema.sql

# 운영 DB에 테이블 생성  
npx wrangler d1 execute kpopdebut --file=migrations/schema.sql
```

### 4. 개발/테스트 명령어
```bash
# 로컬 개발 (메모리 저장소) - 빠른 개발용
npm run dev

# Cloudflare 개발 환경 (D1 개발 DB)
npx wrangler dev --env development

# Cloudflare 로컬 테스트 (로컬 D1)
npx wrangler dev --local
```

## 배포

### 환경별 배포
```bash
# 개발 환경 배포
npx wrangler deploy --env development

# 운영 환경 배포 
npx wrangler deploy
```

## 환경 구분 로직
1. **Cloudflare Workers 환경**: `globalThis.DB` 존재 → D1Storage 사용
2. **Node.js 환경**: `globalThis.DB` 없음 → MemStorage 사용
3. **NODE_ENV**: development/production 구분

## 현재 상태
- ✅ D1Storage 클래스 구현 완료
- ✅ 운영 DB ID 설정 완료 (512310fc-a085-480c-83e2-baa483dd3929)
- ✅ 로컬 D1 테이블 생성 완료
- ✅ 환경별 스토리지 자동 선택 구현

D1 설정이 완료되었습니다! 배포 시 자동으로 운영 DB 테이블이 생성됩니다.
- ✅ 환경별 storage 자동 선택 로직 추가
- ✅ SQLite 호환 스키마 생성
- ⏳ wrangler.toml에 실제 DB ID 입력 필요
- ⏳ 테이블 생성 SQL 파일 필요

이제 실제 DB ID들을 wrangler.toml에 입력하고 테이블을 생성하면 D1 사용 준비가 완료됩니다.
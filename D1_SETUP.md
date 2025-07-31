# Cloudflare D1 설정 가이드

## 환경 구성

### 현재 설정
- **개발 환경**: 메모리 저장소 (서버 재시작 시 초기화)
- **운영 환경**: Cloudflare D1 (영구 저장)

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

### 4. 로컬 테스트
```bash
# 로컬에서 D1 모드로 실행
npx wrangler dev

# 일반 개발 모드 (메모리 저장소)
npm run dev
```

## 배포

### Cloudflare Workers 배포
```bash
npx wrangler deploy
```

## 현재 상태
- ✅ D1Storage 클래스 구현 완료
- ✅ 환경별 storage 자동 선택 로직 추가
- ✅ SQLite 호환 스키마 생성
- ⏳ wrangler.toml에 실제 DB ID 입력 필요
- ⏳ 테이블 생성 SQL 파일 필요

이제 실제 DB ID들을 wrangler.toml에 입력하고 테이블을 생성하면 D1 사용 준비가 완료됩니다.
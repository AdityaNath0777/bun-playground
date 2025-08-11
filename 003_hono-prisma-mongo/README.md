To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

- install prisma
```bash
bun add prisma
```
- initiliaze it with mongodb
```bash
bunx prism init --datasource-provider mongodb --output ./generated/prisma
```

-- add mongodb URI in env field
```
DATABASE_URL=
```

- add schemas to the prisma/schema.prisma
```prisma
model User {
  id    String  @id @default(auto()) @map("_id") @db.ObjectId
  name  String?
  email String  @unique
  address Address?
  posts Post[]
}

model Post {
  id       String    @id @default(auto()) @map("_id") @db.ObjectId
  slug     String    @unique
  title    String
  body     String
  author   User      @relation(fields: [authorId], references: [id])
  authorId String    @db.ObjectId
  comments Comment[]
}

// similarly for Comment

// custom data type
type Address {
  city String
  country String
}
```

- run the prisma db push command to create new indexes and regenerate Prisma Client
```bash
bun prisma/index.ts
```

- Querying the Database

```ts
// prisma/index.ts
import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.user.findMany({});
  console.log("all users: ", allUsers);
}
```

result: `all users: []`

## Implementing Redis
- create docker-compose.yml for redis
```yml
services:
  redis:
    image: redis:8.2.0-alpine
    container_name: my-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: always

volumes:
  redis-data:
```

```bash
docker compose up -d
docker compose ps # to confirm the conatiner has been spinned up
```

```bash
docker exec -it my-redis redis-cli
```

### Basic Redis CLI
```redis-cli
set raam siya
get raam

set yooo yoyo EX 10
get yooo
```
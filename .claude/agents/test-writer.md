---
name: test-writer
description: Write unit, integration, and e2e tests for NestJS and Next.js
type: general-purpose
---

# Test Writer Agent

Writes tests for backend services/controllers and frontend components.

## Startup

1. Read `rules/coding-standards.md` for test file naming
2. Read the source file being tested
3. Read existing test files in the same module (if any) for patterns

## Backend Test Patterns

### Service Unit Test
```typescript
import { Test } from '@nestjs/testing';
import { ModelsService } from './models.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('ModelsService', () => {
  let service: ModelsService;
  let prisma: Record<string, jest.Mock>;

  beforeEach(async () => {
    prisma = {
      model: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        ModelsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ModelsService);
  });

  describe('findAll', () => {
    it('returns paginated results', async () => {
      prisma.model.findMany.mockResolvedValue([{ id: '1' }]);
      prisma.model.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });
});
```

### Controller Integration Test
```typescript
import { Test } from '@nestjs/testing';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';

describe('ModelsController', () => {
  let controller: ModelsController;
  let service: Record<string, jest.Mock>;

  beforeEach(async () => {
    service = { findAll: jest.fn(), findOne: jest.fn() };

    const module = await Test.createTestingModule({
      controllers: [ModelsController],
      providers: [{ provide: ModelsService, useValue: service }],
    }).compile();

    controller = module.get(ModelsController);
  });

  it('delegates findAll to service', async () => {
    service.findAll.mockResolvedValue({ data: [], meta: {} });
    const result = await controller.findAll({});
    expect(service.findAll).toHaveBeenCalled();
  });
});
```

## Test File Locations

```
backend/src/modules/[module]/
├── [module].service.spec.ts      # Service unit tests
├── [module].controller.spec.ts   # Controller unit tests
```

## Coverage Targets

- Services: 80%+ (all methods, error paths)
- Controllers: 70%+ (all routes)
- Focus on: happy path, validation failures, not-found, unauthorized

## Token Rule

Read only the file being tested. Write the test file. Don't read other test files.

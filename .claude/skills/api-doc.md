---
name: api-doc
description: Generate Swagger/OpenAPI documentation
---

# API Doc Skill

Builds the backend and serves Swagger UI for API documentation.

## Usage

```bash
/api-doc           # Build and generate spec
/api-doc --serve   # Start server with Swagger UI
```

## Steps

1. Run `cd backend && npm run build`
2. Start server briefly to generate spec (or use NestJS Swagger CLI plugin)
3. Output spec to `backend/docs/api.json` if possible
4. If `--serve`: confirm Swagger UI is at `http://localhost:5001/api/docs`

## Notes

- Swagger is configured in `main.ts` with `SwaggerModule.setup('api/docs', app, document)`
- All DTOs should have `@ApiProperty()` decorators for full documentation
- All endpoints should have `@ApiOperation()` and `@ApiResponse()` decorators

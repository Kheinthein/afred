process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'file:./test.db';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret-key';
process.env.AI_PROVIDER = process.env.AI_PROVIDER ?? 'openai';
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? 'test-openai-key';
process.env.OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4-turbo';

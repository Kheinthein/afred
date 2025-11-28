import '@testing-library/jest-dom';
import 'reflect-metadata';

// Mock environment variables for tests
process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';
process.env.AI_PROVIDER = 'claude';
process.env.ANTHROPIC_API_KEY = 'test-key';


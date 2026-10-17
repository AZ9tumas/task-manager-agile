// Each Jest test file gets its own module registry, so every file starts
// with a fresh in-memory database.
process.env.DB_FILE = ':memory:';
process.env.JWT_SECRET = 'test-secret';

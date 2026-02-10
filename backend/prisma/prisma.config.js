const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  datasource: {
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL,
    },
  },
});

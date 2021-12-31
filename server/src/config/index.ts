const config = () => {
  const redis = {
    socket: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: 6379
    }
  }

  return {
    PORT: parseInt(process.env.PORT) || 3001,
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',
    // DATABASE_URI: process.env.DATABASE_URI || "mongodb+srv://USA:dilbarHussain@cluster0.nyvmn.mongodb.net/SasApplication?retryWrites=true&w=majority",
    DATABASE_URI: "mongodb://localhost/practice",
    redis,
  }
};


export default config;
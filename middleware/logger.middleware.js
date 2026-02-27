const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`;
    console.log(log);
  });

  next();
};

export default loggerMiddleware;

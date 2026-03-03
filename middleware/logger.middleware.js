import https from "https";

const SOLARWINDS_TOKEN = process.env.SOLARWINDS_TOKEN;
const SOLARWINDS_URL =
  "https://logs.collector.ap-01.cloud.solarwinds.com/v1/logs";

function sendToSolarWinds(logEntry) {
  if (!SOLARWINDS_TOKEN) return;

  const body = JSON.stringify(logEntry);
  const url = new URL(SOLARWINDS_URL);

  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      Authorization: `Bearer ${SOLARWINDS_TOKEN}`,
      "Content-Length": Buffer.byteLength(body),
    },
  };

  const req = https.request(options, (res) => {
    res.resume(); // drain the response
  });

  req.on("error", (err) => {
    console.error("[SolarWinds] Failed to send log:", err.message);
  });

  req.write(body);
  req.end();
}

const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logLine = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`;
    console.log(logLine);

    sendToSolarWinds({
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
      message: logLine,
    });
  });

  next();
};

export default loggerMiddleware;

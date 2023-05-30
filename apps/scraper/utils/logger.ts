import winston from "winston";

// Create a Winston logger instance
const logger = winston.createLogger({
  level: "info", // Set the desired logging level
  format: winston.format.json(),
  defaultMeta: { service: "scraper" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to a file
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: "info",
    }), // Log to the console
  ],
});

export default logger;

import winston from "winston";

// Create a Winston logger instance
const logger = winston.createLogger({
  level: "info", // Set the desired logging level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to a file
  ],
});

export default logger;

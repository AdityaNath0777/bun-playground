// radix 10 to parse the string into int in decimal system (0 to 9)
const PORT = parseInt(String(process.env.PORT), 10) || 3030;

export const config = {
  PORT,
  APP_ENV: process.env.APP_ENV || process.env.NODE_ENV || "development"
}
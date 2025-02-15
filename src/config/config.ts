import { registerAs } from "@nestjs/config";

export enum ConfigKeys {
  App = "App",
  Db = "Db",
  Jwt = "Jwt"
}

const AppConfig = registerAs(ConfigKeys.App, () => ({ port: 3000 }))
const JwtConfig = registerAs(ConfigKeys.Jwt, () => ({
  accessTokenSecret: "8e0f5ba8e2a9d7cd7ff5c5c6fc13cb49780e4df4",
  refreshTokenSecret: "b5312dcdda7935ed58db38a0bb8468d5302f1994"
}))

const DbConfig = registerAs(ConfigKeys.Db, () => ({
  port: 5432,
  host: "localhost",
  database: "auth-otp",
  password: "81425000",
  username: "postgres",
}))

export const configurations = [AppConfig, DbConfig, JwtConfig]
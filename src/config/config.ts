import { registerAs } from "@nestjs/config";

export enum ConfigKeys {
  App = "App",
  Db = "Db",
  Jwt = "Jwt"
}

const AppConfig = registerAs(ConfigKeys.App, () => ({
  port: 3000
}))

const JwtConfig = registerAs(ConfigKeys.Jwt, () => ({
  accessTokenSecret: "16805993b2b568e1ffc9276ffe5e8b0614a34638",
  refreshTokenSecret: "12ce32d135f43035e1ccd13afba345718ef3aa39",
}))

const DbConfig = registerAs(ConfigKeys.Db, () => ({
  port: 5432,
  host: "localhost",
  username: 'postgres',
  password: "81425000",
  database: "auth-otp"
}))


export const configurations = [AppConfig, DbConfig, JwtConfig]
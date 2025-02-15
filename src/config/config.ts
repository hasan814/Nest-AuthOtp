import { registerAs } from "@nestjs/config";

export enum ConfigKeys {
  App = "App",
  Db = "Db"
}

const AppConfig = registerAs(ConfigKeys.App, () => ({ port: 3000 }))

const DbConfig = registerAs(ConfigKeys.Db, () => ({
  port: 3000,
  host: "localhost",
  database: "auth-otp",
  password: "81425000",
  username: "postgress",
}))

export const configurations = [AppConfig, DbConfig]
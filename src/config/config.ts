import { registerAs } from "@nestjs/config";

export enum ConfigKeys {
  App = "App",
  Db = "Db"
}

const AppConfig = registerAs(ConfigKeys.App, () => ({
  port: 3000
}))

const DbConfig = registerAs(ConfigKeys.Db, () => ({
  port: 3000,
  host: "localhost",
  username: 'postgres',
  password: "81425000",
  database: "auth-otp"
}))


export const configurations = [AppConfig, DbConfig]
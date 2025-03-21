import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeOrmDbConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }
  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: "postgres",
      synchronize: true,
      autoLoadEntities: true,
      port: this.configService.get("Db.port"),
      host: this.configService.get("Db.host"),
      username: this.configService.get("Db.username"),
      password: this.configService.get("Db.password"),
      database: this.configService.get("Db.database"),
      // entities: [
      //   "dist/**/**/**/*.entity{.ts, .js}",
      //   "dist/**/**/*.entity{.ts, .js}",
      // ]
    }
  }
}
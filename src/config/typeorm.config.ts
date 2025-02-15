import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/modules/user/entities/user.entity";


@Injectable()
export class TypeOrmDbConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }
  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: "postgres",
      synchronize: true,
      entities: [UserEntity],
      autoLoadEntities: true,
      port: this.configService.get("Db.port"),
      host: this.configService.get("Db.host"),
      username: this.configService.get("Db.username"),
      password: this.configService.get("Db.password"),
      database: this.configService.get("Db.database"),
    }
  }
}
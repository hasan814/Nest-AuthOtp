
import { UserEntity } from 'src/modules/user/entities/user.entity';

declare namespace Express {
  export interface Request {
    user?: UserEntity
  }
}
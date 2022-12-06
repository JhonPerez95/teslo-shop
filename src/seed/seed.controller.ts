import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ValidRoles } from '../auth/entities/valid-roles';
import { Auth, GetUser } from '../auth/decorator';
import { User } from '../auth/entities/user.entity';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRoles.SUPER_USER)
  executeSeed(@GetUser() user: User) {
    return this.seedService.runSeed(user);
  }
}

import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ValidRoles } from '../auth/entities/valid-roles';
import { Auth } from '../auth/decorator';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRoles.SUPER_USER)
  executeSeed() {
    return this.seedService.runSeed();
  }
}

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1qaz@WSX#EDC!@#',
  database: 'MyfitDB',
  autoLoadEntities: true,
  synchronize: true,
};

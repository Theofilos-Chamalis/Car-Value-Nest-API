import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
/** cookie-session middleware does not support es5 imports **/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true /** Use this only for dev, for prod make manual migrations **/,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  /** Add a global validation pipe **/
  providers: [AppService, { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    /** Globally scoped middleware **/
    consumer
      .apply(
        cookieSession({
          keys: ['randomEncryptionKey'],
        }),
      )
      .forRoutes('*');
  }
}

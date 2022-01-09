import { AfterInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  /** The 2nd argument can be used to separate different User relationships on reports, e.g. report.approver vs report.owner**/
  @OneToMany(() => Report, report => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`AfterInsert Hook -> Inserted User with id: ${this.id} in the database`);
  }
}

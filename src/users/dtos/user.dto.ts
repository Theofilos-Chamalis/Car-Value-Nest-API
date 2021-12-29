import { Expose } from 'class-transformer';

/** Expose only specific fields for the user without the password field */
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}

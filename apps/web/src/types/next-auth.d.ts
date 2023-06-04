import 'next-auth';

import { User as DatabaseUser } from 'database';

interface UserDto
  extends Omit<DatabaseUser, 'emailVerified' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

declare module 'next-auth' {
  interface Session {
    user: UserDto;
  }

  interface User extends UserDto {}
}

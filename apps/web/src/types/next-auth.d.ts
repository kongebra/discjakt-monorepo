import 'next-auth';

interface UserDto extends Omit<User, 'emailVerified' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

declare module 'next-auth' {
  interface Session {
    user: UserDto;
  }

  interface User extends UserDto {}
}

import 'next-auth';

import type { Role } from 'database';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role: Role;
    };
  }

  interface User {
    id: string;
    role: Role;
  }
}

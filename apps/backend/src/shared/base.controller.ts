import * as jwt from 'jsonwebtoken';

export abstract class BaseController {
  constructor() {
    // hello world
  }

  protected decodeToken(headers: Headers) {
    const authorization = headers.get('authorization');

    if (!authorization) {
      return null;
    }

    if (!process.env.JWT_SECRET) {
      return null;
    }

    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded;
  }
}

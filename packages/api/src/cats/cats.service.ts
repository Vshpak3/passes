import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  listCats(): string {
    return 'Hello CATS!';
  }
}

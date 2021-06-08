import { DBRow } from '@64mega/localdb';

export class Project implements DBRow {
  id?: number;
  name: string = '';
  body: string = '';
}

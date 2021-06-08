import { DBRow } from '@64mega/localdb';

export class Profile implements DBRow {
  id?: number;
  name: string = '';
}

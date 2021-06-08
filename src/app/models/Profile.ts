import { DBRow } from 'localdb';

export class Profile implements DBRow {
  id?: number;
  name: string = '';
}

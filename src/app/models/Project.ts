import { DBRow } from 'localdb';

export class Project implements DBRow {
  id?: number;
  name: string = '';
  body: string = '';
}

/**
 * An interface defining minimal DBRow implementation.
 * The `isDeleted` property is used to "soft delete" objects
 */

declare module 'localdb';
export interface DBRow {
  id?: number;
  isDeleted?: boolean;
}
export class LocalDB {
  get TableName(): string;
  constructor(tableName: string);
  Get(): DBRow[];
  GetById(id: number): DBRow;
  Insert(row: any): DBRow;
  Update(row: DBRow): DBRow;
  Undelete(id: number): DBRow;
  DeleteById(id: number, hardDelete?: boolean): boolean;
  DeleteRow(row: DBRow, hardDelete?: boolean): boolean;
  Sort(sortFunction?: (a: DBRow, b: DBRow) => number): LocalDB;
  DeleteEntireDB(): void;
}
export class DBTable<RowModel extends DBRow> {
  protected _db: LocalDB;
  constructor(tableName: string);
  GetByID(id: number): RowModel;
  GetByFilter(filter: (row: RowModel) => boolean): RowModel[];
  GetAll(): RowModel[];
  Insert(row: RowModel): RowModel;
  DeleteRow(row: RowModel): boolean;
  DeleteById(id: number): boolean;
  Update(row: RowModel): RowModel;
  protected SortData(): void;
  ReplaceData(newData: RowModel[], confirm?: boolean): boolean;
  MergeData(newData: RowModel[], confirm?: boolean): boolean;
  DeleteAll(areYouSure?: boolean): boolean;
}

//# sourceMappingURL=index.d.ts.map

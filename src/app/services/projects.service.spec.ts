import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Project } from '../models/Project';
import { TestSleep } from '../test/TestSleep';

import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projects: Project[];

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsService);

    service.projects$.subscribe((newProjects) => {
      projects = newProjects;
    });

    await service.deleteAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAll', () => {
    it('should return a Promise that resolves to an Observable', async () => {
      const res = await service.getAll();
      expect(res).toBeTruthy();
      expect(res instanceof Array).toBeTrue();
    });

    it('should return an empty array when nothing is in the database', async () => {
      const res = await service.getAll();
      expect(res.length).toEqual(0);
      return Promise.resolve();
    });

    it('should return an array of 3 items after 3 items are inserted into the database', async () => {
      for (let i = 0; i < 3; i++) {
        await service.insert(new Project());
      }
      //const res = await service.getAll();
      //expect(res.length).toEqual(3);
      await service.getAll();
      expect(projects.length).toBe(3);
      return Promise.resolve();
    });

    it('should return 2 items after 3 are inserted but one is deleted', async () => {
      let tmp;
      for (let i = 0; i < 3; i++) {
        tmp = await service.insert(new Project());
      }

      if (tmp) {
        await service.deleteRow(tmp);
      }

      await service.getAll();
      expect(projects.length).toBe(2);
      return Promise.resolve();
    });
  });

  describe('#insert', () => {
    it('should insert a project into the database', async () => {
      await service.getAll();
      expect(projects.length).toBe(0);
      await service.insert(new Project());
      await service.getAll();
      expect(projects.length).toBe(1);
      return Promise.resolve();
    });

    it('should return the instance of the project with the id set correctly', async () => {
      const p = new Project();
      const timeString = Date.now().toString();
      p.body = timeString;
      const res = await service.insert(p);
      await service.getAll();
      expect(projects.length).toBe(1);
      expect(res).toBeTruthy();
      if (res) {
        expect(res.id).toBeTruthy();
        expect(res.id).toBeGreaterThanOrEqual(0);
        expect(res.body).toEqual(timeString);
      }
      return Promise.resolve();
    });
  });

  describe('#deleteAll', () => {
    it('should clear out the database', async () => {
      for (let i = 0; i < 10; i++) {
        await service.insert(new Project());
      }
      await service.getAll();
      expect(projects.length).toBe(10);
      await service.deleteAll();
      await service.getAll();
      expect(projects.length).toBe(0);
      return Promise.resolve();
    });
  });

  describe('#update', () => {
    it("Should add a new item to the database if it doesn't exist", async () => {
      await service.update(new Project());
      await service.getAll();
      expect(projects.length).toBe(1);
      return Promise.resolve();
    });

    it('Should update an existing project with new information', async () => {
      const row = await service.insert(new Project());
      await service.getAll();
      if (row?.id) {
        const newName = 'new name';
        const newBody = 'new body';
        row.body = newBody;
        row.name = newName;
        await service.update(row);
        const res = await service.getById(row.id);
        expect(res).toBeTruthy();
        if (res) {
          expect(res.name).toEqual(newName);
          expect(res.body).toEqual(newBody);
        }
      }
    });
  });

  describe('#getById', () => {
    it('should return an item with a given id if it exists', async () => {
      let tmp = await service.insert(new Project());
      if (tmp?.id) {
        let res = await service.getById(tmp.id);
        expect(res).toBeTruthy();
      }
    });

    it('should return undefined if an item does not exist', async () => {
      let res = await service.getById(-1);
      expect(res).toBeUndefined();
    });
  });

  describe('#deleteRow', () => {
    it('should delete a specified row', async () => {
      let res = await service.insert(new Project());
      await service.getAll();
      expect(projects.length).toBe(1);
      if (res) {
        await service.deleteRow(res);
      }
      await service.getAll();
      expect(projects.length).toBe(0);
    });

    it('should fail if called with no valid row id', async () => {
      const p = new Project();
      await service.getAll();
      expect(projects.length).toBe(0);
      await expectAsync(service.deleteRow(p)).toBeRejected();
    });

    it('should only delete the specified row and no others', async () => {
      for (let i = 0; i < 10; i++) {
        await service.insert(new Project());
      }
      const tmpProject = new Project();
      tmpProject.name = 'test target';

      let res = await service.insert(tmpProject);

      let oldID: number = 0,
        oldName: string;
      if (res) {
        if (res.id) oldID = res.id;
        oldName = res.name;
      }

      await service.getAll();
      expect(projects.length).toBe(11);
      if (res) {
        await service.deleteRow(res);
        await service.getAll();
      }

      expect(
        projects.find((x) => x.id === oldID || x.name === oldName)
      ).toBeUndefined();
      expect(projects.length).toBe(10);
    });
  });
});

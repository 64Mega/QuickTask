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
    });
  });
});

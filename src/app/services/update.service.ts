import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  updateAvailable = new BehaviorSubject<boolean>(false);
  updateAvailable$ = this.updateAvailable.asObservable();

  constructor(public updates: SwUpdate) {
    if (updates.isEnabled) {
      updates.available.subscribe((event) => {
        this.updateAvailable.next(true);
      });
    }
  }
}

import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {Alert} from '../../../shared/interfaces';

@Injectable()
export class AlertService {
  public alert$: Subject<Alert> = new Subject<Alert>();

  constructor() { }

  success(text: string) {
    this.alert$.next({text, type: 'success'});
  }

  warning(text: string) {
    this.alert$.next({text, type: 'warning'});
  }

  danger(text: string) {
    this.alert$.next({text, type: 'danger'});
  }

}

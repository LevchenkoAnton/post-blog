import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {Alert, AlertType} from '../../../../shared/interfaces';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() delay = '5000';

  type: AlertType;
  text: string;

  aSub: Subscription;

  constructor(private alert: AlertService) { }

  ngOnInit() {
    this.aSub = this.alert.alert$.subscribe((alert: Alert) => {
      this.type = alert.type;
      this.text = alert.text;

      const timer = setTimeout(() => {
        clearTimeout(timer);

        this.text = '';
      }, +this.delay);
    });
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

}

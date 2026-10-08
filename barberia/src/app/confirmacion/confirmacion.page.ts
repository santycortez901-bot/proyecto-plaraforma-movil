import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.page.html',
  styleUrls: ['./confirmacion.page.scss'],
  imports: [IonContent],
})
export class ConfirmacionPage {
  barber = 'LUIS PULGUANI';
  service = 'Corte';
  day = 'LUN 11';
  time = '18:00';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    const barber = this.route.snapshot.queryParamMap.get('barber');
    const service = this.route.snapshot.queryParamMap.get('service');
    const day = this.route.snapshot.queryParamMap.get('day');
    const time = this.route.snapshot.queryParamMap.get('time');

    if (barber) this.barber = barber;
    if (service) this.service = service;
    if (day) this.day = `LUN ${day}`;
    if (time) this.time = time;
  }

  goBack(): void {
    this.router.navigate(['/reserva']);
  }
}

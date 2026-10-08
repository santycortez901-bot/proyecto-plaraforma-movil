import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  calendarOutline,
  callOutline,
  createOutline,
  personOutline,
  timeOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
  imports: [IonContent, IonIcon],
})
export class ReservaPage {
  readonly services = ['Corte', 'Barba', 'Cejas', 'Global', 'Mechas'];
  readonly days = [
    { label: 'LUN', value: '11' },
    { label: 'MAR', value: '12' },
    { label: 'MIÉ', value: '13' },
    { label: 'JUE', value: '14' },
    { label: 'VIE', value: '15' },
    { label: 'SÁB', value: '16' },
  ];
  readonly timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];
  private readonly barberNames: Record<string, string> = {
    zona: 'ZONA BARBER SHOP',
    santu: 'SANTU BARBER',
    valentino: 'VALENTINO PELUQUERÍA Y BARBERÍA',
    'luis-pulguani': 'LUIS PULGUANI BARBERÍA',
    'santiago-mayorga': 'SANTIAGO MAYORGA BARBERÍA',
  };

  selectedServices: string[] = ['Corte'];
  selectedDay = 'LUN';
  selectedTime = '18:00';
  barberTitle = 'BARBERÍA';
  private readonly bookedSlotsByDay: Record<string, string[]> = {
    LUN: ['18:00'],
  };

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    addIcons({
      arrowBackOutline,
      calendarOutline,
      callOutline,
      createOutline,
      personOutline,
      timeOutline,
    });

    const barberId = this.route.snapshot.queryParamMap.get('barber') ?? 'luis-pulguani';
    this.barberTitle = this.barberNames[barberId] ?? 'BARBERÍA';
  }

  toggleService(service: string): void {
    const isSelected = this.selectedServices.includes(service);
    const exclusiveServices = ['Global', 'Mechas'];

    if (isSelected) {
      this.selectedServices = this.selectedServices.filter((item) => item !== service);
      return;
    }

    if (exclusiveServices.includes(service)) {
      this.selectedServices = this.selectedServices.filter(
        (item) => !exclusiveServices.includes(item),
      );
    }

    this.selectedServices = [...this.selectedServices, service];
  }

  get unavailableTimesForSelectedDay(): string[] {
    return this.bookedSlotsByDay[this.selectedDay] ?? [];
  }

  isTimeUnavailable(time: string): boolean {
    return this.unavailableTimesForSelectedDay.includes(time) && this.selectedTime !== time;
  }

  isDayUnavailable(day: string): boolean {
    if (day === this.selectedDay) {
      return false;
    }

    return this.getAvailableTimeSlotsForDay(day).length === 0;
  }

  getAvailableTimeSlotsForDay(day: string): string[] {
    return this.timeSlots.filter((time) => {
      const bookedTimes = this.bookedSlotsByDay[day] ?? [];
      return !bookedTimes.includes(time) || (this.selectedDay === day && this.selectedTime === time);
    });
  }

  selectDay(day: string): void {
    if (this.isDayUnavailable(day) && day !== this.selectedDay) {
      return;
    }

    this.selectedDay = day;
    const nextAvailableTime = this.getAvailableTimeSlotsForDay(day)[0] ?? this.selectedTime;
    if (nextAvailableTime) {
      this.selectedTime = nextAvailableTime;
    }
  }

  selectTime(time: string): void {
    if (this.isTimeUnavailable(time)) {
      return;
    }

    if (!this.bookedSlotsByDay[this.selectedDay]) {
      this.bookedSlotsByDay[this.selectedDay] = [];
    }

    this.bookedSlotsByDay[this.selectedDay] = [...new Set([...this.bookedSlotsByDay[this.selectedDay], time])];
    this.selectedTime = time;
  }

  get availableTimeSlots(): string[] {
    return this.getAvailableTimeSlotsForDay(this.selectedDay);
  }

  get summaryServices(): string {
    return this.selectedServices.length ? this.selectedServices.join(', ') : 'Sin servicio';
  }

  confirmReservation(): void {
    this.router.navigate(['/confirmacion'], {
      queryParams: {
        barber: this.barberTitle,
        service: this.summaryServices,
        day: this.selectedDay,
        time: this.selectedTime,
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/mapa']);
  }
}

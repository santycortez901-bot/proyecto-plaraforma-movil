import { Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { ReservaPage } from './reserva.page';

describe('ReservaPage', () => {
  it('should start with a default selected service and time slot', () => {
    const router = { navigate: vi.fn() } as unknown as Router;
    const activatedRoute = {
      snapshot: { queryParamMap: { get: () => 'luis-pulguani' } },
    } as any;
    const page = new ReservaPage(router, activatedRoute);

    expect(page.selectedServices).toEqual(['Corte']);
    expect(page.selectedTime).toBe('18:00');
  });

  it('should keep selected time blocked for the chosen day so it cannot be reused', () => {
    const router = { navigate: vi.fn() } as unknown as Router;
    const activatedRoute = {
      snapshot: { queryParamMap: { get: () => 'luis-pulguani' } },
    } as any;
    const page = new ReservaPage(router, activatedRoute);

    page.selectDay('MAR');
    page.selectTime('09:00');

    expect(page.selectedTime).toBe('09:00');
    expect(page.unavailableTimesForSelectedDay).not.toContain('09:00');
    expect(page.isTimeUnavailable('09:00')).toBeFalsy();
    expect(page.isDayUnavailable('LUN')).toBeFalsy();
  });

  it('should keep the selected hour available until reservation is confirmed', () => {
    const router = { navigate: vi.fn() } as unknown as Router;
    const activatedRoute = {
      snapshot: { queryParamMap: { get: () => 'luis-pulguani' } },
    } as any;
    const page = new ReservaPage(router, activatedRoute);

    page.selectDay('MAR');
    page.selectTime('09:00');

    expect(page.selectedTime).toBe('09:00');
    expect(page.unavailableTimesForSelectedDay).not.toContain('09:00');

    page.confirmReservation();

    expect(page.unavailableTimesForSelectedDay).toContain('09:00');
  });

  it('should allow multiple services but avoid global and mechas together', () => {
    const router = { navigate: vi.fn() } as unknown as Router;
    const activatedRoute = {
      snapshot: { queryParamMap: { get: () => 'luis-pulguani' } },
    } as any;
    const page = new ReservaPage(router, activatedRoute);

    page.toggleService('Barba');
    page.toggleService('Global');
    page.toggleService('Mechas');

    expect(page.selectedServices).toEqual(['Corte', 'Barba', 'Mechas']);

    page.toggleService('Global');

    expect(page.selectedServices).toEqual(['Corte', 'Barba', 'Mechas', 'Global']);
    page.toggleService('Mechas');
    expect(page.selectedServices).toEqual(['Corte', 'Barba', 'Global']);
  });
});

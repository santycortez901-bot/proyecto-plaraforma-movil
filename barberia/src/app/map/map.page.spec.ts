import { MapPage } from './map.page';

describe('MapPage', () => {
  it('should start without a selected barber and without active filters', () => {
    const router = { navigate: jasmine.createSpy('navigate') };
    const page = new MapPage(router as any);

    expect(page.selectedBarber()).toBeNull();
    expect(page.filters.length).toBe(0);
  });

  it('should navigate to the booking page when reserving an appointment', () => {
    const router = { navigate: jasmine.createSpy('navigate') };
    const page = new MapPage(router as any);
    page.selectedBarber.set({
      id: 'luis-pulguani',
      name: 'Luis Pulguani Barbería',
      owner: 'Luis Pulguani',
      markerLabel: 'LP',
      specialties: [],
      prices: [],
      latitude: 0,
      longitude: 0,
    });

    page.reserveAppointment();

    expect(router.navigate).toHaveBeenCalledWith(['/reserva'], {
      queryParams: { barber: 'luis-pulguani' },
    });
  });
});

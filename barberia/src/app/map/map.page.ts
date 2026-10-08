import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, personOutline, searchOutline } from 'ionicons/icons';
import * as L from 'leaflet';

interface BarberMarker {
  id: string;
  markerLabel: string;
  name: string;
  owner: string;
  specialties: string[];
  prices: { service: string; price: string }[];
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  imports: [IonContent, IonIcon],
})
export class MapPage implements AfterViewInit, OnDestroy {
  @ViewChild('mapElement', { static: true }) private mapElement!: ElementRef<HTMLDivElement>;

  readonly filters = ['Cipolletti', 'Comprimido', '5 estrellas'];
  readonly barbers: BarberMarker[] = [
    {
      id: 'zona',
      markerLabel: 'Z',
      name: 'ZONA Barber Shop',
      owner: 'Nacho Maldonado',
      specialties: ['Degradé comprimido', 'Degradé por tonalidad', 'Colorimetría'],
      prices: [
        { service: 'Corte', price: '$10.000' },
        { service: 'Corte + barba', price: '$12.000' },
        { service: 'Mechas', price: '$30.000' },
        { service: 'Global', price: '$50.000' },
      ],
      latitude: -38.9321,
      longitude: -67.9902,
    },
    {
      id: 'santu',
      markerLabel: 'SB',
      name: 'Santu Barber',
      owner: 'Santiago Cortez',
      specialties: ['Degradé comprimido', 'Texturizado', 'Asesoramiento personal'],
      prices: [
        { service: 'Corte jubilado', price: '$15.000' },
        { service: 'Corte niño', price: '$19.000' },
        { service: 'Corte masculino y femenino', price: '$20.000' },
        { service: 'Corte y barba', price: '$22.000' },
      ],
      latitude: -38.935,
      longitude: -67.9885,
    },
    {
      id: 'valentino',
      markerLabel: 'V',
      name: 'Valentino Peluquería y Barbería',
      owner: 'Valentino Bigoni',
      specialties: ['Degradé comprimido', 'Texturizado'],
      prices: [
        { service: 'Corte jubilado', price: '$15.000' },
        { service: 'Corte niño', price: '$19.000' },
        { service: 'Corte masculino y femenino', price: '$20.000' },
        { service: 'Corte y barba', price: '$22.000' },
      ],
      latitude: -38.9314,
      longitude: -67.9923,
    },
    {
      id: 'luis-pulguani',
      markerLabel: 'LP',
      name: 'Luis Pulguani Barbería',
      owner: 'Luis Pulguani',
      specialties: ['Barbería y tradición'],
      prices: [
        { service: 'Corte', price: '$20.000' },
        { service: 'Perfilado de barba y cejas', price: '$8.000' },
        { service: 'Corte + barba', price: '$25.000' },
        { service: 'Global', price: '$90.000' },
        { service: 'Mechas / reflejos', price: '$60.000' },
      ],
      latitude: -38.9347,
      longitude: -67.9925,
    },
    {
      id: 'santiago-mayorga',
      markerLabel: 'SM',
      name: 'Santiago Mayorga Barbería',
      owner: 'Santiago Mayorga',
      specialties: ['Corte clásico', 'Degradado (fade)', 'Afeitado tradicional'],
      prices: [
        { service: 'Corte clásico', price: '$8.000' },
        { service: 'Corte degradado (fade)', price: '$10.000' },
        { service: 'Corte + lavado', price: '$11.000' },
        { service: 'Perfilado de barba', price: '$5.000' },
        { service: 'Corte + barba', price: '$13.000' },
        { service: 'Afeitado tradicional', price: '$6.000' },
        { service: 'Corte para niños', price: '$7.000' },
      ],
      latitude: -38.9308,
      longitude: -67.9879,
    },
  ];

  readonly selectedBarber = signal<BarberMarker | null>(this.barbers[0]);
  readonly cardMessage = signal('');
  readonly showDetails = signal(false);
  private map?: L.Map;

  constructor() {
    addIcons({ closeOutline, personOutline, searchOutline });
  }

  ngAfterViewInit(): void {
    const map = L.map(this.mapElement.nativeElement, {
      center: [-38.9339, -67.9901],
      zoom: 15,
      zoomControl: false,
    });
    this.map = map;
    requestAnimationFrame(() => map.invalidateSize({ pan: false }));

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    this.barbers.forEach((barber) => {
      const icon = L.divIcon({
        className: 'barber-marker-shell',
        html: `<div class="barber-marker"><span>${barber.markerLabel}</span></div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      L.marker([barber.latitude, barber.longitude], { icon, title: barber.name })
        .addTo(map)
        .on('click', () => {
          this.selectedBarber.set(barber);
          this.cardMessage.set('');
          this.showDetails.set(false);
        });
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  dismissFilter(filter: string): void {
    const index = this.filters.indexOf(filter);
    if (index !== -1) {
      this.filters.splice(index, 1);
    }
  }

  closeCard(): void {
    this.selectedBarber.set(null);
    this.cardMessage.set('');
    this.showDetails.set(false);
  }

  showDescription(): void {
    const barber = this.selectedBarber();
    if (barber) {
      this.cardMessage.set(barber.specialties.join(' · '));
    }
  }

  viewBarber(): void {
    this.showDetails.set(true);
    this.cardMessage.set('');
  }

  closeDetails(): void {
    this.showDetails.set(false);
  }

  reserveAppointment(): void {
    this.cardMessage.set('Pronto vas a poder reservar tu turno desde la app.');
  }
}

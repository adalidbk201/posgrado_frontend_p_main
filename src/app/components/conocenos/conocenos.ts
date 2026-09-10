import { Component } from '@angular/core';
interface Autoridad {
  rol: string;
  nombre: string;
  cargo: string;
  foto: string;
}
@Component({
  selector: 'app-conocenos',
  imports: [],
  templateUrl: './conocenos.html',
  styleUrl: './conocenos.scss',
})
export class Conocenos {
  readonly autoridades: Autoridad[] = [
    {
      rol: 'RECTOR',
      nombre: 'Dr. Carlos Condori Titirico',
      cargo: 'Rector',
      foto: '/img/autoridades/rector.jpg',
    },
    {
      rol: 'VICERRECTOR',
      nombre: 'Dr. Efraín Chambi Vargas Ph.D.',
      cargo: 'Vicerrector',
      foto: '/img/autoridades/vicerrector.jpg',
    },
    {
      rol: 'DIRECTOR DE POSGRADO',
      nombre: 'Dr. Richard Jorge Torrez Juaniquina Ph.D.',
      cargo: 'Director de POSGRADO',
      foto: '/img/autoridades/directorPosgrado.jpg',
    },
  ];
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { Conocenos } from '../../components/conocenos/conocenos';
import { Ubicacion } from '../../components/ubicacion/ubicacion';
import { Testimonios } from '../../components/testimonios/testimonios';
import { Hero } from '../../components/hero/hero';
import { Banner } from '../../components/banner/banner';
@Component({
  selector: 'app-inicio',
  imports: [Navbar, Footer, Conocenos, Ubicacion, Testimonios, Hero,Banner],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  
}

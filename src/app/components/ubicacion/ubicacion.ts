import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
interface LugarUbicacion {
  nombre: string;
  descripcion: string;
  mapaEmbedUrl: SafeResourceUrl;
  mapaLinkUrl: string;
}

@Component({
  selector: 'app-ubicacion',
  imports: [],
  templateUrl: './ubicacion.html',
  styleUrl: './ubicacion.scss',
})
export class Ubicacion {
  private sanitizer = inject(DomSanitizer);

  readonly ubicaciones: LugarUbicacion[] = [
    {
      nombre: 'Auditorio de Posgrado',
      descripcion:
        'Ubicado en la Zona Villa Esperanza de la ciudad de El Alto. Aquí se realizan colaciones, conferencias y eventos académicos.',
      mapaEmbedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps?q=-16.4904722,-68.19325&hl=es&z=17&output=embed'
      ),
      mapaLinkUrl:
        "https://www.google.com/maps/place/16%C2%B029'25.7%22S+68%C2%B011'35.7%22W/@-16.4904746,-68.1958321,17z/data=!4m4!3m3!8m2!3d-16.4904722!4d-68.19325?entry=ttu",
    },
    {
      nombre: 'Paraninfo UPEA',
      descripcion:
        'Auditoria de Posgrado UPEA. Lugar de actos de colación, y eventos de Posgrado.',
      mapaEmbedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps?q=-16.4934637,-68.1941446&hl=es&z=17&output=embed'
      ),
      mapaLinkUrl:
        'https://www.google.com/maps/place/GR44%2BH7H,+El+Alto/@-16.4933794,-68.1951511,18.5z/data=!4m6!3m5!1s0x915ede3461335609:0x1142278dae19d08e!8m2!3d-16.4934637!4d-68.1941446',
    },
  ];
}

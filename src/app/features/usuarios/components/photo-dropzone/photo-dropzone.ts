// import { 
//   ChangeDetectionStrategy,
//   Component,
//   OnDestroy,
//   WritableSignal,
//   input,
//   output,
//   signal } from '@angular/core';
// import { 
//   ImageCroppedEvent,
//   ImageCropperComponent,
//   LoadedImage 
// } from 'ngx-image-cropper';

// import { IconComponent } from '../icon/icon.component';

// const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// @Component({
//   selector: 'app-photo-dropzone',
//   imports: [ImageCropperComponent, IconComponent],
//   templateUrl: './photo-dropzone.html',
//   styleUrl: './photo-dropzone.css',
// })
// export class PhotoDropzone {
//   readonly disabled = input(false);
//   readonly maxInputSizeMb = input(10);
//   readonly maxOutputSizeMb = input(2);
//   readonly maxWidth = input(800);
//   readonly maxHeight = input(800);
//   readonly initialImageUrl = input<string | null>(null);
  
//   readonly autoCropEnabled = input(true);
//   readonly autoCropQuality = input(0.92);

//   readonly photoChange = output<File | null>();
//   readonly validationError =
// }

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { cppGenerator } from './generators/cpp';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrl: './translate.component.scss',
})
export class TranslateComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    const fileInputElement: HTMLInputElement = this.fileInput.nativeElement;

    // Listen for change event on the file input
    fileInputElement.addEventListener('change', (event) => {
      const fileList: FileList | null = (event.target as HTMLInputElement)
        ?.files;

      // Do something with the selected file(s)
      if (fileList && fileList.length > 0) {
        const selectedFile: File = fileList[0];

        const formData = new FormData();
        formData.append('file', selectedFile);

        console.log('Production API URL: ', environment.apiUrl);

        fetch(`${environment.apiUrl}/compiler/compile`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to download file');
            }
            return response.blob();
          })
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'compiled.exe'; // Set the filename for the downloaded file
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          })
          .catch((error) => {
            console.error('Error downloading file:', error);
          });
      }
    });
  }
}
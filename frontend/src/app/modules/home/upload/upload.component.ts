import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BlockService } from '../../../services/block.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private http: HttpClient,
    private router: Router,
    private blockService: BlockService
  ) {}

  ngAfterViewInit() {}

  uploadImage() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      this.http
        .post(`${environment.apiUrl}/scanner/upload`, formData)
        .subscribe(
          (res: any) => {
            if (res.code) {
              this.blockService.setCode(res.code);
              this.router.navigate(['/translator']);
            }
          },
          (err) => {
            console.error(err);
          }
        );
    }
  }
}

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompilationService {
  private isCompiling: Subject<boolean> = new Subject<boolean>();

  // Method to emit new data
  sendData(data: boolean) {
    this.isCompiling.next(data);
  }

  // Method to get an Observable that others can subscribe to 
  getData(): Observable<boolean> {
    return this.isCompiling.asObservable();
  }

}

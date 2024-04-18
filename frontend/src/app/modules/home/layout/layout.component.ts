import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import anime from 'animejs/lib/anime.es.js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('tiles') wrapper!: ElementRef;
  @ViewChild('instructionContainer') instructionContainer!: ElementRef;
  columns = 0;
  rows = 0;
  toggled = false;
  isSupported = false;
  isOpenCamera = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private router: Router)
  {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isSupported = 'mediaDevices' in window.navigator;
    }
  }

  ngAfterViewInit() {
    this.createGrid();
  }

  openCamera() {
    this.isOpenCamera = true;
  }

  closeCamera() {
    this.isOpenCamera = false;
  }

  handleOnClick(index: number) {
    this.toggled = !this.toggled;
    this.container.nativeElement.classList.toggle('toggled');
    this.instructionContainer.nativeElement.classList.toggle('toggled');
    anime({
      targets: '.tile',
      opacity: this.toggled ? 1 : 0,
      delay: anime.stagger(50, {
        grid: [this.columns, this.rows],
        from: index,
      }),
    });
  }

  createTile(index: number) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.style.opacity = this.toggled ? '1' : '0';
    tile.onclick = (e) => this.handleOnClick(index);
    return tile;
  }

  createTiles(quantity: number): void {
    Array.from(Array(quantity)).map((tile, index) => {
      this.wrapper.nativeElement.appendChild(this.createTile(index));
    });
  }

  createGrid(): void {
    this.wrapper.nativeElement.innerHTML = '';
    const size = document.body.clientWidth > 800 ? 100 : 50;
    this.columns = Math.floor(document.body.clientWidth / size);
    this.rows = Math.floor(document.body.clientHeight / size);
    this.wrapper.nativeElement.style.setProperty('--columns', this.columns);
    this.wrapper.nativeElement.style.setProperty('--rows', this.rows);
    this.createTiles(this.columns * this.rows);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.createGrid();
  }

  finishRecording() {
    this.router.navigate(['/translator']);
  }
}

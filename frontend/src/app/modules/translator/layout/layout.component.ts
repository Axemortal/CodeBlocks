import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.startEditBlocks();
      }
    });
  }
  isEditBlocks = false;

  startEditBlocks() {
    this.isEditBlocks = true;
  }

  startRunning() {}

  endRun() {
    this.router.navigate(['/home']);
  }
}

import { Component, OnDestroy } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'component-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  public routes: Routes;

  constructor(
      private router: Router,
  ) {
    this.routes = this.router.config.filter(
        (r) => !!r.data,
    );
  }

  public isLinkActive(path: string): boolean {
    return this.router.isActive(path, true);
  }

  public ngOnDestroy(): void {
    this.routes = undefined;
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public routes: Routes;

  constructor(
      private router: Router,
  ) {
    this.routes = this.router.config.filter(
        (r) => !!r.data,
    );
  }

  ngOnInit(): void {
  }

  public isLinkActive(path: string): boolean {
    return this.router.isActive(path, true);
  }
}

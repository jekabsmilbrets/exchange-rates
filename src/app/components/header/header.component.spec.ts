import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../../app-routing.module';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                   imports: [
                     CommonModule,
                     RouterTestingModule.withRoutes(
                         routes,
                     ),
                     MatToolbarModule,
                     MatTabsModule,
                   ],
                   declarations: [
                     HeaderComponent,
                     MatToolbar,
                   ],
                   providers: [],
                 })
                 .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return boolean from method isLinkActive', () => {
    expect(component.isLinkActive('/exchange-rates')).toBeInstanceOf(Boolean);
  });

  it('should be retrieved routes from Router ', () => {
    expect(component.routes.length).toBeGreaterThan(0);
  });

  it('should contain 2 a elements in nav tabs', () => {
    const nav = fixture.debugElement.query(By.css('nav'));

    expect(nav.queryAll(By.css('a')).length).toEqual(2);
  });

  it('should navigate on nav a link click', () => {
    const navLink = fixture.debugElement.query(By.css('a'));
    const routerLinkInstance = navLink.injector.get(RouterLinkWithHref);
    const navLinkClickSpy = spyOn(navLink.nativeElement, 'click');
    navLink.nativeElement.click();

    expect(navLinkClickSpy).toHaveBeenCalled();
    expect(routerLinkInstance['commands']).toEqual(['exchange-rates']);
    expect(routerLinkInstance['href']).toEqual('/exchange-rates');
  });
});

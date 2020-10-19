import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get('/') as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-root header .slogan')).getText() as Promise<string>;
  }

  get1stMenuText(): Promise<string> {
    return element(by.css('app-root header nav a:first-child')).getText() as Promise<string>;
  }

  get2ndMenuText(): Promise<string> {
    return element(by.css('app-root header nav a:last-child')).getText() as Promise<string>;
  }
}

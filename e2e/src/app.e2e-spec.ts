import { browser, logging } from 'protractor';
import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display slogan "Exchange rates" in header', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Exchange rates');
  });

  it('should display 1st menu item with text "Current"', () => {
    page.navigateTo();
    expect(page.get1stMenuText()).toEqual('Current');
  });

  it('should display 2nd menu item with text "Historic"', () => {
    page.navigateTo();
    expect(page.get2ndMenuText()).toEqual('Historic');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

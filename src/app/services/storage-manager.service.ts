import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageManagerService {
  private localStorage: Storage;
  private sessionStorage: Storage;

  constructor() {
    this.localStorage = window.localStorage;
    this.sessionStorage = window.sessionStorage;
  }

  public getItem(key: string, storage: 'localStorage' | 'sessionStorage' = 'localStorage'): string {
    return this.selectStorage(storage).getItem(key);
  }

  public setItem(key: string, value: string, storage: 'localStorage' | 'sessionStorage' = 'localStorage'): void {
    this.selectStorage(storage).setItem(key, value);
  }

  public removeItem(key: string, storage: 'localStorage' | 'sessionStorage' = 'localStorage'): void {
    this.selectStorage(storage).removeItem(key);
  }

  private selectStorage(storage: 'localStorage' | 'sessionStorage'): Storage {
    return storage === 'localStorage' ? this.localStorage : this.sessionStorage;
  }
}

import { TestBed } from '@angular/core/testing';

import { StorageManagerService } from './storage-manager.service';

describe('StorageManagerService', () => {
  let service: StorageManagerService;
  const testKey = 'test';
  const testValue = 'test';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should setItem, getItem and remove in LocalStorage', () => {
    expect(service.setItem(
        testKey,
        testValue,
        'localStorage',
    )).toBeUndefined();

    expect(service.getItem(
        testKey,
        'localStorage',
    )).toBe(testValue);

    expect(service.removeItem(
        testKey,
        'localStorage',
    )).toBeUndefined();

    expect(service.getItem(
        testKey,
        'localStorage',
    )).toBeNull();
  });

  it('should setItem, getItem and remove in SessionStorage', () => {
    expect(service.setItem(
        testKey,
        testValue,
        'sessionStorage',
    )).toBeUndefined();

    expect(service.getItem(
        testKey,
        'sessionStorage',
    )).toBe(testValue);

    expect(service.removeItem(
        testKey,
        'sessionStorage',
    )).toBeUndefined();

    expect(service.getItem(
        testKey,
        'sessionStorage',
    )).toBeNull();
  });
});

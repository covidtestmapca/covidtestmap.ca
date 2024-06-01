// Copyright © 2024 CovidTestMap.ca <contact@covidtestmap.ca>
// Licensed under the terms of the GPL-3 license.

/* eslint @typescript-eslint/no-namespace: 0 */

export namespace LocationType {
  export function getColor(chain: LocationType) {
    switch (chain) {
      case LocationType.Rexall:
        return '#38A69A';
      case LocationType.Shoppers:
        return '#D62025';
      case LocationType.IDA:
        return '#005e9e';
      case LocationType.Guardian:
        return '#00633d';
      case LocationType.RemedysRX:
        return '#6bb240';
      case LocationType.NoFrills:
        return '#6bb240';
      case LocationType.Pharmasave:
        return '#D41842';
      default:
        return '#000000';
    }
  }
}

export enum LocationType {
  Rexall = 'rexall',
  Shoppers = 'shoppers',
  IDA = 'ida',
  Guardian = 'guardian',
  RemedysRX = 'remedysrx',
  Pharmasave = 'pharmasave',
  Morellis = 'morellis',
  NoFrills = 'no-frills',
  Independent = 'independent'
}

export namespace TestType {
  export function getName(type: TestType): string {
    switch (type) {
      case TestType.Flowflex:
        return 'Flowflex';
      case TestType.BTNX:
        return 'BTNX';
      default:
        return 'Unknown';
    }
  }
}

export enum TestType {
  Flowflex = 'flowflex',
  BTNX = 'btnx'
}

export namespace Expiry {
  export function getColor(expiry: Expiry): string {
    switch (expiry) {
      case Expiry.Expired:
        return '#b32907';
      case Expiry.Expiring:
        return '#c97d02';
      case Expiry.Good:
        return '#319462';
    }
  }

  export function getClass(expiry: Expiry): string {
    switch (expiry) {
      case Expiry.Expired:
        return 'expired';
      case Expiry.Expiring:
        return 'expiring';
      case Expiry.Good:
        return 'good';
    }
  }
}

export enum Expiry {
  Expired,
  Expiring,
  Good
}

export interface Provider {
  name: string;
  location: string;
  type: LocationType;
  phone: string;
  longitude: number;
  latitude: number;
  appleMaps: string;
  googleMaps: string;
  lastUpdate: string;
  outOfStock?: boolean;
}

export interface TestProvider extends Provider {
  testType: TestType;
  expiry: string;
  instructions: string;
}

export interface TestLocations {
  withTests: Array<TestProvider>;
  withoutTests: Array<Provider>;
}

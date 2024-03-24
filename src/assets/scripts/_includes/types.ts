// Copyright © 2024 CovidTestMap.ca <contact@covidtestmap.ca>
// Licensed under the terms of the GPL-3 license.

/* eslint @typescript-eslint/no-namespace: 0 */

export namespace Chain {
  export function getColor(chain: Chain) {
    switch (chain) {
      case Chain.Rexall:
        return '#38A69A';
      case Chain.Shoppers:
        return '#D62025';
      default:
        return '#000000';
    }
  }
}

export enum Chain {
  Rexall = 'rexall',
  Shoppers = 'shoppers',
  IDA = 'ida',
  Morellis = 'morellis',
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
  chain: Chain;
  phone: string;
  longitude: number;
  latitude: number;
  appleMaps: string;
  googleMaps: string;
  lastUpdate: string;
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

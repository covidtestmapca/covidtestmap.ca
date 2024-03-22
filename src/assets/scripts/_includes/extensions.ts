// Copyright © 2024 CovidTestMap.ca <contact@covidtestmap.ca>
// Licensed under the terms of the GPL-3 license.

import { Expiry } from './types';

declare global {
  interface Date {
    getExpiryStatus(): Expiry;
    toExpiryDateString(): string;
    toUpdateDateString(): string;
  }
}

export function registerExtensions() {
  Date.prototype.getExpiryStatus = function (): Expiry {
    const today = new Date();
    const warningDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDay());

    if (this.getTime() < today) {
      return Expiry.Expired;
    } else if (this.getTime() < warningDate.getTime()) {
      return Expiry.Expiring;
    } else {
      return Expiry.Good;
    }
  };

  Date.prototype.toExpiryDateString = function (): string {
    return this.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });
  };

  Date.prototype.toUpdateDateString = function (): string {
    return this.toLocaleDateString('en-CA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
}

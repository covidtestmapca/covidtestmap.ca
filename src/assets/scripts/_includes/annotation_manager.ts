// Copyright © 2024 CovidTestMap.ca <contact@covidtestmap.ca>
// Licensed under the terms of the GPL-3 license.

import type { TestLocations, Provider, TestProvider } from './types';
import { TestType, Expiry } from './types';

export class AnnotationManager {
  /** PUBLIC VARIABLES ************************************************************************* **/
  public goodAnnotationCount: number = 0;
  public expiringAnnotationCount: number = 0;
  public expiredAnnotationCount: number = 0;
  public noTestAnnotationCount: number = 0;

  /** PRIVATE VARIABLES ************************************************************************ **/
  private covidTestLocations: TestLocations;
  private map: mapkit.Map;

  private annotationsToLocationsWithTest = new Map<mapkit.Annotation, TestProvider>();
  private annotationsToLocationsWithoutTest = new Map<mapkit.Annotation, Provider>();

  /** CONSTRUCTOR ****************************************************************************** **/

  constructor(covidTestLocations: TestLocations, map: mapkit.Map) {
    this.covidTestLocations = covidTestLocations;
    this.map = map;
  }

  /** PUBLIC METHODS *************************************************************************** **/

  public prepareAnnotations(): void {
    const callout = this.makeAnnotationCalloutDelegate();

    this.createLocationWithTestsAnnotations(this.covidTestLocations.withTests, callout);
    this.createLocationWithoutTestsAnnotations(this.covidTestLocations.withoutTests, callout);
  }

  public showAnnotationsWithTests() {
    this.map.addAnnotations(Array.from(this.annotationsToLocationsWithTest.keys()));
  }

  public hideAnnotationsWithTests() {
    this.map.removeAnnotations(Array.from(this.annotationsToLocationsWithTest.keys()));
  }

  public showAnnotationsWithoutTests() {
    this.map.addAnnotations(Array.from(this.annotationsToLocationsWithoutTest.keys()));
  }

  public hideAnnotationsWithoutTests() {
    this.map.removeAnnotations(Array.from(this.annotationsToLocationsWithoutTest.keys()));
  }

  /** PRIVATE METHODS ************************************************************************** **/

  private makeAnnotationCalloutDelegate(): mapkit.AnnotationCalloutDelegate {
    return {
      calloutElementForAnnotation: (annotation: mapkit.Annotation): Element => {
        return this.makeCallout(annotation);
      },

      calloutAppearanceAnimationForAnnotation: () =>
        '.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein'
    };
  }

  private makeCallout(annotation: mapkit.Annotation): Element {
    let provider: Provider | undefined;
    let hasTests: boolean;

    if (annotation.clusteringIdentifier?.startsWith('annotation-tests')) {
      provider = this.annotationsToLocationsWithTest.get(annotation);
      hasTests = true;
    } else {
      provider = this.annotationsToLocationsWithoutTest.get(annotation);
      hasTests = false;
    }

    if (provider === undefined || provider === null) {
      return document.createElement('div');
    }

    const innerMarker = document.createElement('div');
    innerMarker.classList.add('inner-marker');

    innerMarker.appendChild(this.makeCalloutHeader(provider, hasTests));

    if (provider.outOfStock !== undefined && provider.outOfStock === true) {
      innerMarker.appendChild(this.makeCalloutNoStockSection());
      innerMarker.append(document.createElement('hr'));
    }

    // Section I
    if (hasTests) {
      const testProvider = provider as TestProvider;
      innerMarker.appendChild(this.makeCalloutTestInformationSection(testProvider));
    } else {
      innerMarker.appendChild(this.makeCalloutNoTestsSection());
    }

    innerMarker.append(document.createElement('hr'));

    innerMarker.appendChild(this.makeCalloutLocationInformationSection(provider));

    // Section 3
    const footer = document.createElement('footer');
    const pFooter = document.createElement('p');

    const lastUpdate = new Date(provider.lastUpdate);
    footer.classList.add('last-update');
    pFooter.textContent = `Last update: ${lastUpdate.toUpdateDateString()}`;

    footer.append(pFooter);
    innerMarker.appendChild(footer);

    return innerMarker as Element;
  }

  private makeCalloutHeader(location: Provider, hasTests: boolean): Element {
    const header = document.createElement('header');
    header.classList.add(location.type);

    if (!hasTests) {
      header.classList.add('no-test');
    }

    const h2 = document.createElement('h2');
    h2.textContent = location.name;

    header.appendChild(h2);

    return header;
  }

  private makeCalloutTestInformationSection(location: TestProvider): Element {
    const section = document.createElement('section');
    section.classList.add('location-information');

    const locationWithTests = location as TestProvider;
    const ul = document.createElement('ul');

    const liTest = this.makeCalloutListElement(
      'Type',
      TestType.getName(locationWithTests.testType),
      'test'
    );

    const liExpiry = this.makeCalloutListElement(
      'Expiration',
      new Date(locationWithTests.expiry).toExpiryDateString(),
      'expiry'
    );

    const expiryStatus = new Date(location.expiry).getExpiryStatus();
    liExpiry.classList.add(Expiry.getClass(expiryStatus));

    const liInformation = this.makeCalloutListElement(
      'Instructions',
      locationWithTests.instructions,
      'information'
    );

    ul.append(liTest);
    ul.append(liExpiry);
    ul.append(liInformation);

    section.append(ul);

    return section;
  }

  private makeCalloutNoTestsSection(): Element {
    const section = document.createElement('section');
    section.classList.add('location-information');

    const p = document.createElement('p');
    p.classList.add('no-test');
    p.textContent = 'This location does not offer free COVID tests.';

    section.append(p);

    return section;
  }

  private makeCalloutNoStockSection(): Element {
    const section = document.createElement('section');
    section.classList.add('location-information');
    section.classList.add('out-of-stock');

    const p = document.createElement('p');
    p.classList.add('no-test');
    p.textContent = '⚠️ Tests are temporarily out of stock at this location.';

    section.append(p);

    return section;
  }

  private makeCalloutLocationInformationSection(location: Provider): Element {
    const section = document.createElement('section');
    section.classList.add('location-information');

    // Section II
    const ul = document.createElement('ul');

    const liPhone = this.makeCalloutListPhoneNumberElement(location.phone);
    const liMaps = this.makeCalloutListMapsElement(location.appleMaps, location.googleMaps);
    const liLocation = this.makeCalloutListLocationElement(location.location);

    ul.append(liPhone);
    ul.append(liMaps);
    ul.append(liLocation);

    section.append(ul);

    return section;
  }

  private makeCalloutListElement(name: string, value: string, className: string): Element {
    const li = document.createElement('li');
    li.classList.add(className);

    const div = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = name;

    const p = document.createElement('p');
    p.textContent = value;

    div.appendChild(h3);
    div.appendChild(p);
    li.appendChild(div);

    return li;
  }

  private makeCalloutListPhoneNumberElement(value: string): Element {
    const li = document.createElement('li');
    li.classList.add('phone');

    const div = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = 'Phone';

    let formattedPhoneNumber;
    const match = value.match(/^(?:\+1)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      formattedPhoneNumber = '(' + match[1] + ') ' + match[2] + '-' + match[3];
    } else {
      formattedPhoneNumber = value;
    }

    const a = document.createElement('a');
    a.textContent = formattedPhoneNumber;
    a.href = `tel:${value}`;

    const p = document.createElement('p');

    p.appendChild(a);

    div.appendChild(h3);
    div.appendChild(p);
    li.appendChild(div);

    return li;
  }

  private makeCalloutListLocationElement(value: string): Element {
    const li = document.createElement('li');
    li.classList.add('location');

    const div = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = 'Location';

    const p = document.createElement('p');
    p.innerHTML = value.replace(/\n/g, '<br>');

    div.appendChild(h3);
    div.appendChild(p);
    li.appendChild(div);

    return li;
  }

  private makeCalloutListMapsElement(apple: string, google: string): Element {
    const li = document.createElement('li');
    li.classList.add('maps');

    const div = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = 'Maps';

    const aApple = document.createElement('a');
    aApple.textContent = 'Apple';
    aApple.href = apple;

    const aGoogle = document.createElement('a');
    aGoogle.textContent = 'Google';
    aGoogle.href = google;

    const p = document.createElement('p');
    p.appendChild(aApple);
    p.appendChild(document.createTextNode(' | '));
    p.appendChild(aGoogle);

    div.appendChild(h3);
    div.appendChild(p);
    li.appendChild(div);

    return li;
  }

  private createLocationWithTestsAnnotations(
    locations: Array<TestProvider>,
    callout: mapkit.AnnotationCalloutDelegate
  ): void {
    for (const location of locations) {
      const coordinates = new mapkit.Coordinate(location.longitude, location.latitude);

      const expiryStatus = new Date(location.expiry).getExpiryStatus();
      const annotation = new mapkit.MarkerAnnotation(coordinates, {
        callout: callout,
        selected: false,
        color: Expiry.getColor(expiryStatus),
        calloutOffset: new DOMPoint(0, 10)
      });

      switch (expiryStatus) {
        case Expiry.Expiring:
          annotation.clusteringIdentifier = 'annotation-tests-expiring';
          this.expiringAnnotationCount++;
          break;
        case Expiry.Expired:
          annotation.clusteringIdentifier = 'annotation-tests-expired';
          this.expiredAnnotationCount++;
          break;
        case Expiry.Good:
          annotation.clusteringIdentifier = 'annotation-tests-good';
          this.goodAnnotationCount++;
          break;
      }

      this.annotationsToLocationsWithTest.set(annotation, location);
    }
  }

  private createLocationWithoutTestsAnnotations(
    locations: Array<Provider>,
    callout: mapkit.AnnotationCalloutDelegate
  ): void {
    for (const location of locations) {
      const coordinates = new mapkit.Coordinate(location.longitude, location.latitude);

      const annotation = new mapkit.MarkerAnnotation(coordinates, {
        callout: callout,
        selected: false,
        color: '#888888',
        calloutOffset: new DOMPoint(0, 10)
      });

      annotation.clusteringIdentifier = 'annotation-no-tests';
      this.annotationsToLocationsWithoutTest.set(annotation, location);
      this.noTestAnnotationCount++;
    }
  }
}

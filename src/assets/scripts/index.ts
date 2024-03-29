// Copyright © 2024 CovidTestMap.ca <contact@covidtestmap.ca>
// Licensed under the terms of the GPL-3 license.

import { addJWT } from './_includes/.jwt';
import { AnnotationManager } from './_includes/annotation_manager';
import { registerExtensions } from './_includes/extensions';

let map: mapkit.Map;
let annotationManager: AnnotationManager;

/**
 * Wait for MapKit JS to be loaded by the script tag,
 * calls `mapkit.init` to set authorizationCallback with your JWT.
 */
const setupMapKitJs = async () => {
  if (!window.mapkit || window.mapkit.loadedLibraries.length === 0) {
    // mapkit.core.js or the libraries are not loaded yet.
    // Set up the callback and wait for it to be called.
    await new Promise((resolve) => {
      window.initMapKit = resolve;
    });

    // Clean up
    delete window.initMapKit;
  }

  addJWT();

  mapkit.init({
    authorizationCallback: (done) => {
      done(window.jwt);
      delete window.jwt;
    }
  });
};

const setupMap = (): mapkit.Map => {
  const toronto = new mapkit.CoordinateRegion(
    new mapkit.Coordinate(43.7, -79.38313),
    new mapkit.CoordinateSpan(0.2, 0.2)
  );

  // Create a map in the element whose ID is "map-container"
  const map = new mapkit.Map('map-container');
  map.region = toronto;
  map.showsPointsOfInterest = false;

  map.annotationForCluster = function (
    clusterAnnotation: mapkit.MarkerAnnotation
  ): mapkit.MarkerAnnotation {
    if (clusterAnnotation.clusteringIdentifier === 'annotation-tests-good') {
      clusterAnnotation.color = '#319462';
    } else if (clusterAnnotation.clusteringIdentifier === 'annotation-tests-expiring') {
      clusterAnnotation.color = '#c97d02';
    } else if (clusterAnnotation.clusteringIdentifier === 'annotation-tests-expired') {
      clusterAnnotation.color = '#b32907';
    } else if (clusterAnnotation.clusteringIdentifier === 'annotation-no-tests') {
      clusterAnnotation.color = '#888888';
    }

    return clusterAnnotation;
  };

  return map;
};

/**
 * Script Entry Point
 */
const main = async () => {
  registerExtensions();

  await setupMapKitJs();

  map = setupMap();
  annotationManager = new AnnotationManager(window.COVID_TEST_LOCATIONS, map);
  annotationManager.prepareAnnotations();
  annotationManager.showAnnotationsWithTests();

  // const goodCount = document.getElementById('good-count');
  // const expiringCount = document.getElementById('expiring-count');
  // const expiredCount = document.getElementById('expired-count');
  // const noTestsCount = document.getElementById('no-tests-count');

  // if (goodCount) {
  //   goodCount.innerText = `(${annotationManager.goodAnnotationCount}) `;
  // }

  // if (expiringCount) {
  //   expiringCount.innerText = `(${annotationManager.expiringAnnotationCount}) `;
  // }

  // if (expiredCount) {
  //   expiredCount.innerText = `(${annotationManager.expiredAnnotationCount}) `;
  // }

  // if (noTestsCount) {
  //   noTestsCount.innerText = `(${annotationManager.noTestAnnotationCount}) `;
  // }
};

main();

document.onreadystatechange = function () {
  const testCaption = document.getElementById('no-tests-caption');
  const questionPopover = document.getElementById('question-popover');

  if (document.readyState === 'complete') {
    const locationToggle = document.getElementById('location-toggle') as HTMLInputElement | null;

    if (locationToggle) {
      locationToggle.addEventListener('change', function (event: Event) {
        const element = event.target as HTMLInputElement | null;

        if (!element) {
          return;
        }

        if (element.checked) {
          testCaption?.classList.remove('hidden');
          annotationManager.showAnnotationsWithoutTests();
        } else {
          testCaption?.classList.add('hidden');
          annotationManager.hideAnnotationsWithoutTests();
        }
      });
    }

    const questionToggle = document.getElementById('question-button') as HTMLInputElement | null;

    if (questionToggle) {
      questionToggle.addEventListener('click', function (event: Event) {
        const element = event.target as HTMLInputElement | null;

        if (!element || !questionPopover) {
          return;
        }

        if (questionPopover.classList.contains('control-hidden')) {
          questionPopover.classList.remove('control-hidden');
        } else {
          questionPopover.classList.add('control-hidden');
        }
      });
    }

    if (window.matchMedia('(min-width: 1000px)').matches) {
      if (questionPopover) {
        questionPopover.classList.remove('control-hidden');
      }
    }
  }
};

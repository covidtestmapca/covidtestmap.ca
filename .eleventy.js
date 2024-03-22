// Copyright © 2024 CovidTestMap.ca <contact@covidtestmap.ca>
// Licensed under the terms of the GPL-3 license.

const postcss = require('postcss');
const postcssImport = require('postcss-import');
const postcssMediaMinmax = require('postcss-media-minmax');
const autoprefixer = require('autoprefixer');
const postcssCustomMedia = require('postcss-custom-media');
const postcssNesting = require('postcss-nesting');
const postcssCsso = require('postcss-csso');

const esbuild = require('esbuild');
const store = require('./scripts/store.js');

module.exports = (config) => {
  config.addNunjucksGlobal("allLocations", () => {
    return store.makeLocations();
  });

  // === Templates ===========================================================
  config.addTemplateFormats('css');
  config.addTemplateFormats('ts');

  config.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (content, path) => {
      if (path !== './src/assets/styles/index.css') {
        return;
      }

      return async () => {
        let output = await postcss([
          postcssImport,
          postcssMediaMinmax,
          postcssCustomMedia,
          autoprefixer,
          postcssNesting,
          postcssCsso,
        ]).process(content, {
          from: path,
        });

        return output.css;
      }
    }
  });

  config.addExtension('ts', {
    outputFileExtension: 'js',
    compile: async (content, path) => {
      return async () => {
        if (path !== './src/assets/scripts/index.ts') {
          return;
        }

        let output = await esbuild.build({
          target: 'es2020',
          entryPoints: [path],
          minify: true,
          bundle: true,
          sourcemap: process.env.ELEVENTY_ENV !== 'production',
          write: false,
          external: ['apple-mapkit-js-browser']
        });

        return output.outputFiles[0].text;
      }
    }
  });

  ["src/assets/images", "src/assets/manifest.webmanifest", "src/robots.txt"].forEach(path => {
    config.addPassthroughCopy(path)
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      layouts: "_layouts",
      data: "_data"
    },
  };
};

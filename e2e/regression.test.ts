import { test, expect } from '@playwright/test';
import fs from 'fs';
import xml2js from 'xml2js';

const baseURL = 'https://docs-smoky-iota.vercel.app';
const targetUrl = 'https://docs-git-nialexsan-docusaurus-3-onflow.vercel.app';
const defaultUrl = 'https://onflow.github.io/docs';
const sitemap = './build/sitemap.xml';
// Read the XML file
const xml = fs.readFileSync(sitemap, 'utf-8');

function getRandomEntries<T>(array: T[], count: number): T[] {
  const shuffled = array.slice(0);
  let i = array.length;
  let temp;
  let index;

  while (i-- > 0) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }

  return shuffled.slice(0, count);
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Parse the XML file
(async () => {
  const sitemap = await xml2js.parseStringPromise(xml);

  const urls: string[] = sitemap.urlset.url.map(({ loc }) =>
    loc[0].replace(defaultUrl, ''),
  );
  // const url = urls[0]; // randomItem(urls);

  // generate screenshots
  // urls.forEach((url) => {
  //   test(`screenshot for ${url}`, async ({ page }) => {
  //     await page.goto(baseURL + url);
  //     expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
  //       `screenshot${url.replace(/\//g, '-')}.png`,
  //       { threshold: 0.3 },
  //     );

  //     await page.goto(targetUrl + url);

  //     expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
  //       `screenshot${url.replace(/\//g, '-')}.png`,
  //       { threshold: 0.3 },
  //     );
  //   });
  // });

  // test a random screenshot
  // const url = randomItem(urls);
  // test(`screenshot test`, async ({ page }) => {
  //   await page.goto(baseURL + url);
  //   expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
  //     `screenshot${url.replace(/\//g, '-')}.png`,
  //     { maxDiffPixelRatio: 0.3 },
  //   );

  //   await page.goto(targetUrl + url);

  //   expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
  //     `screenshot${url.replace(/\//g, '-')}.png`,
  //     { maxDiffPixelRatio: 0.1 },
  //   );
  // });

  // test all screenshots
  test(`screenshots test`, async ({ page }) => {
    const randomUrls = getRandomEntries(urls, 10);
    for (const url of randomUrls) {
      await page.goto(targetUrl + url);

      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
        `screenshot${url.replace(/\//g, '-')}.png`,
        { maxDiffPixelRatio: 0.1 },
      );
    }
  });
})().catch(console.error);

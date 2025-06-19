// ==UserScript==
// @name         AERA Abstract Scraper - ALL Pages (UTF-8 Fixed)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Scrape ALL session abstracts from AERA and output clean UTF-8 CSV
// @match        https://convention2.allacademic.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const allResults = [];

  async function fetchHTML(url) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      return new DOMParser().parseFromString(html, 'text/html');
    } catch (err) {
      console.error('Failed to fetch:', url, err);
      return null;
    }
  }

  function extractText(el) {
    return el?.innerText?.trim().replace(/\s+/g, ' ') || '';
  }

  function getSessionLinksFromDoc(doc) {
    return Array.from(doc.querySelectorAll('#event_list li a'))
      .filter(a => a.href.includes('Online+Program+View+Session'))
      .map(a => a.href);
  }

  function getNextPageUrl(doc) {
    const nextBtn = Array.from(doc.querySelectorAll('a')).find(
      a => a.textContent.trim() === 'Next' && !a.classList.contains('ui-state-disabled')
    );
    return nextBtn?.href || null;
  }

  async function extractSessionData(url) {
    const sessionDoc = await fetchHTML(url);
    if (!sessionDoc) return;

    const sessionTitle = extractText(sessionDoc.querySelector('h3'));
    const timePlace = extractText(sessionDoc.querySelector('strong'));
    const [time, place] = timePlace.split(', The ') || ['', ''];

    const paperHeader = Array.from(sessionDoc.querySelectorAll('h4')).find(h => h.textContent.trim() === 'Papers');
    const paperList = paperHeader?.nextElementSibling;
    const paperLinks = paperList ? Array.from(paperList.querySelectorAll('li a')).map(a => a.href) : [];

    if (paperLinks.length === 0) {
      allResults.push({ sessionTitle, time, place, paperTitle: '', abstract: '' });
      return;
    }

    for (const paperUrl of paperLinks) {
      const paperDoc = await fetchHTML(paperUrl);
      if (!paperDoc) continue;

      const paperTitle = extractText(paperDoc.querySelector('h3'));
      const abstract = extractText(paperDoc.querySelector('blockquote'));
      allResults.push({ sessionTitle, time, place, paperTitle, abstract });

      await delay(800);
    }
  }

  async function scrapeAllPages(startUrl) {
    let currentPageUrl = startUrl;
    let pageCount = 1;

    while (currentPageUrl) {
      const pageDoc = await fetchHTML(currentPageUrl);
      if (!pageDoc) break;

      const sessionLinks = getSessionLinksFromDoc(pageDoc);
      for (const link of sessionLinks) {
        await extractSessionData(link);
        await delay(1000);
      }

      currentPageUrl = getNextPageUrl(pageDoc);
      pageCount++;
    }
  }

  function downloadCSV() {
    const csv = [
      ['Session Title', 'Time', 'Place', 'Paper Title', 'Abstract'],
      ...allResults.map(r =>
        [r.sessionTitle, r.time, r.place, r.paperTitle, r.abstract].map(val =>
          `"${(val || '').replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aera_all_abstracts.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  window.addEventListener('load', () => {
    setTimeout(async () => {
      const initialUrl = window.location.href;
      await scrapeAllPages(initialUrl);
      if (allResults.length > 0) downloadCSV();
    }, 3000);
  });
})();

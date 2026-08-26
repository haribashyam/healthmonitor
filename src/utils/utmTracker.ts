import React, { useState, useEffect } from 'react';

export function getStoredUTM() {
  try {
    const raw = sessionStorage.getItem('vitalos_utm_attribution') || localStorage.getItem('vitalos_utm_attribution');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function initUTMTracking() {
  if (typeof window === 'undefined') return;

  try {
    const params = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref'];

    keys.forEach((key) => {
      const val = params.get(key);
      if (val) {
        utmParams[key] = val;
      }
    });

    if (Object.keys(utmParams).length > 0) {
      const payload = {
        ...utmParams,
        firstTouchTimestamp: new Date().toISOString(),
        landingPage: window.location.pathname
      };
      sessionStorage.setItem('vitalos_utm_attribution', JSON.stringify(payload));
      if (!localStorage.getItem('vitalos_utm_attribution')) {
        localStorage.setItem('vitalos_utm_attribution', JSON.stringify(payload));
      }
    }
  } catch (err) {
    console.debug('UTM tracking error:', err);
  }
}

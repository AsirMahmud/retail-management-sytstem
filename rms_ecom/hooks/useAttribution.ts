"use client";

import { useEffect } from "react";

const ATTRIBUTION_STORAGE_KEY = "rms_ecommerce_attribution";

export interface AttributionData {
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  session_id?: string;
}

export const getBrowserCookie = (name: string): string => {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
};

export const getStoredAttribution = (): AttributionData => {
  if (typeof window === "undefined") return {};

  let stored: AttributionData = {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch {
    stored = {};
  }

  // Always read latest cookies if available
  const fbp = getBrowserCookie("_fbp") || stored.fbp || undefined;
  let fbc = getBrowserCookie("_fbc") || stored.fbc || undefined;

  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get("fbclid") || stored.fbclid || undefined;

  if (!fbc && fbclid) {
    fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  // Get session ID or create temporary session token
  let session_id = sessionStorage.getItem("rms_session_id");
  if (!session_id) {
    session_id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    try {
      sessionStorage.setItem("rms_session_id", session_id);
    } catch {}
  }

  return {
    ...stored,
    fbp,
    fbc: fbc || undefined,
    fbclid,
    session_id,
  };
};

export function useAttribution() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utm_source = urlParams.get("utm_source");
      const utm_medium = urlParams.get("utm_medium");
      const utm_campaign = urlParams.get("utm_campaign");
      const utm_content = urlParams.get("utm_content");
      const utm_term = urlParams.get("utm_term");
      const fbclid = urlParams.get("fbclid");

      if (utm_source || utm_medium || utm_campaign || utm_content || utm_term || fbclid) {
        const existing = getStoredAttribution();
        const updated: AttributionData = {
          ...existing,
          ...(utm_source ? { utm_source } : {}),
          ...(utm_medium ? { utm_medium } : {}),
          ...(utm_campaign ? { utm_campaign } : {}),
          ...(utm_content ? { utm_content } : {}),
          ...(utm_term ? { utm_term } : {}),
          ...(fbclid ? { fbclid } : {}),
        };

        const json = JSON.stringify(updated);
        sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, json);
        localStorage.setItem(ATTRIBUTION_STORAGE_KEY, json);
      }
    } catch {}
  }, []);
}

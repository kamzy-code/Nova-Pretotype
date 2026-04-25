'use client'
import { useState, Suspense } from "react";

// ─── INTERFACES ───────────────────────────────────────────────────────────────
export interface VendorStats {
  transactions: number;
  rating: number;
  fulfilment: number;
}

export interface VendorAttribute {
  label: string;
  pct: number;
}

export interface VendorVerification {
  type: "govId" | "cac" | "smedan" | "phone" | "email";
  label: string;
  desc: string;
}

export interface VendorSales {
  label: string;
  pct: number;
  color: string;
}

export interface VendorReview {
  name: string;
  stars: number;
  text: string;
  image?: string;
  sentiment?: "good" | "neutral" | "bad";
}

export interface CatalogueItem {
  id: string;
  type?: "image" | "video";
  title: string;
  description?: string;
  price: string;
  image: string;
  inStock?: boolean;
}

export interface VendorOperations {
  deliveryScope: string;
  paymentModels: string[];
  refundPolicy: string;
  businessDesc: string;
  socials: Record<string, string>;
}

export interface Vendor {
  name: string;
  handle: string;
  location: string;
  locationAddress?: string;
  locationCity?: string;
  initials: string;
  category: string;
  platform: string;
  coverVideo?: string;
  deliveryCapabilities?: string[];
  stats: VendorStats;
  reviewsCount?: { good: number; neutral: number; bad: number };
  attributes: VendorAttribute[];
  verification: VendorVerification[];
  sales: VendorSales[];
  reviews: VendorReview[];
  catalogue: CatalogueItem[];
  operations?: VendorOperations;
}

export interface TxData {
  item: string;
  desc: string;
  price: string;
  deliveryStart: string;
  deliveryEnd: string;
  deliveryChannel: string;
  notes: string;
}

const theme = {
  navy: "#0F1628",
  navyLight: "#1A2540",
  navyCard: "#1E2D4A",
  teal: "#0D9488",
  tealLight: "#14B8A6",
  tealGlow: "rgba(13,148,136,0.15)",
  amber: "#F59E0B",
  amberLight: "#FCD34D",
  rose: "#F43F5E",
  slate: "#94A3B8",
  slateLight: "#CBD5E1",
  white: "#F8FAFC",
  cardBg: "#FFFFFF",
  pageBg: "#F1F5F9",
};

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: sans-serif;
    background: ${theme.pageBg};
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .app-shell {
    width: 100%;
    max-width: 430px;
    min-height: 100vh;
    background: ${theme.pageBg};
    position: relative;
    overflow-x: hidden;
  }

  .topbar {
    background: ${theme.navy};
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid rgba(13,148,136,0.2);
  }

  .topbar-logo {
    font-family: sans-serif;
    font-weight: 800;
    font-size: 22px;
    color: ${theme.white};
    letter-spacing: -0.5px;
  }

  .topbar-sub {
    font-size: 9px;
    color: ${theme.teal};
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 500;
  }

  .topbar-back {
    background: none;
    border: none;
    color: ${theme.teal};
    font-size: 14px;
    font-family: sans-serif;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 0;
  }

  .screen {
    padding: 20px 16px 100px;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .card {
    background: ${theme.cardBg};
    border-radius: 16px;
    padding: 18px;
    margin-bottom: 12px;
    box-shadow: 0 2px 12px rgba(15,22,40,0.06);
  }

  .card-dark {
    background: ${theme.navy};
    border-radius: 16px;
    padding: 18px;
    margin-bottom: 12px;
  }

  /* PROFILE */
  .vendor-identity {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .vendor-avatar {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${theme.teal};
    flex-shrink: 0;
    background: linear-gradient(135deg, ${theme.teal}, ${theme.navy});
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: white;
  }

  .vendor-name {
    font-family: sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: ${theme.navy};
    line-height: 1.2;
  }

  .vendor-handle {
    font-size: 13px;
    color: ${theme.teal};
    font-weight: 500;
    margin-top: 2px;
  }

  .vendor-location {
    font-size: 12px;
    color: ${theme.slate};
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .nova-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: ${theme.teal};
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    margin-top: 6px;
    font-family: sans-serif;
  }

  .time-toggle {
    display: flex;
    background: #F1F5F9;
    border-radius: 10px;
    padding: 3px;
    margin-bottom: 14px;
  }

  .time-btn {
    flex: 1;
    padding: 7px 4px;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-family: sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
    color: ${theme.slate};
  }

  .time-btn.active {
    background: ${theme.navy};
    color: white;
    box-shadow: 0 2px 8px rgba(15,22,40,0.15);
  }

  .trust-strip {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0;
  }

  .trust-metric {
    text-align: center;
    padding: 4px 0;
    border-right: 1px solid #F1F5F9;
  }

  .trust-metric:last-child { border-right: none; }

  .trust-number {
    font-family: sans-serif;
    font-size: 26px;
    font-weight: 800;
    line-height: 1;
  }

  .trust-label {
    font-size: 10px;
    color: ${theme.slate};
    margin-top: 4px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .attr-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .attr-row:last-child { margin-bottom: 0; }

  .attr-label {
    font-size: 12px;
    font-weight: 500;
    color: ${theme.navy};
    width: 120px;
    flex-shrink: 0;
  }

  .attr-bar-bg {
    flex: 1;
    height: 6px;
    background: #F1F5F9;
    border-radius: 10px;
    overflow: hidden;
  }

  .attr-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, ${theme.teal}, ${theme.tealLight});
    border-radius: 10px;
    transition: width 1s ease;
  }

  .attr-pct {
    font-size: 12px;
    font-weight: 700;
    color: ${theme.teal};
    width: 32px;
    text-align: right;
  }

  .section-title {
    font-family: sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: ${theme.navy};
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .verify-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
  }

  .verify-item:last-child { margin-bottom: 0; }

  .verify-check {
    width: 18px;
    height: 18px;
    background: ${theme.tealGlow};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .verify-text strong {
    font-size: 12px;
    font-weight: 600;
    color: ${theme.navy};
    display: block;
  }

  .verify-text span {
    font-size: 11px;
    color: ${theme.slate};
  }

  .verify-card {
    border-left: 3px solid ${theme.teal};
    padding-left: 14px;
  }

  .sales-bar {
    height: 28px;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    margin-bottom: 10px;
  }

  .sales-seg {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: white;
    transition: width 1s ease;
    white-space: nowrap;
    overflow: hidden;
  }

  .sales-legend {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: ${theme.slate};
    font-weight: 500;
  }

  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .review-card {
    background: #F8FAFC;
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 10px;
  }

  .review-card:last-child { margin-bottom: 0; }

  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .reviewer-name {
    font-size: 13px;
    font-weight: 600;
    color: ${theme.navy};
    font-family: sans-serif;
  }

  .stars {
    color: ${theme.amber};
    font-size: 12px;
    letter-spacing: 1px;
  }

  .review-text {
    font-size: 12px;
    color: #64748B;
    line-height: 1.5;
    font-style: italic;
  }

  .review-img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    margin-top: 10px;
    border: 1px solid #E2E8F0;
  }

  .cta-btn {
    width: 100%;
    padding: 16px;
    background: ${theme.teal};
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 700;
    font-family: sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }

  .cta-btn:hover { background: ${theme.tealLight}; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(13,148,136,0.3); }
  .cta-btn:active { transform: translateY(0); }

  .cta-btn.secondary {
    background: transparent;
    border: 2px solid ${theme.teal};
    color: ${theme.teal};
    margin-top: 10px;
  }

  .cta-sub {
    text-align: center;
    font-size: 11px;
    color: ${theme.slate};
    margin-top: 8px;
  }

  /* FORMS */
  .form-label {
    font-size: 12px;
    font-weight: 600;
    color: ${theme.navy};
    margin-bottom: 6px;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .form-input {
    width: 100%;
    padding: 13px 14px;
    border: 1.5px solid #E2E8F0;
    border-radius: 10px;
    font-size: 14px;
    font-family: sans-serif;
    color: ${theme.navy};
    background: white;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 14px;
  }

  .form-input:focus { border-color: ${theme.teal}; }

  .form-input::placeholder { color: #CBD5E1; }

  textarea.form-input { resize: none; min-height: 80px; }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  /* PAYMENT OPTIONS */
  .payment-option {
    border: 2px solid #E2E8F0;
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .payment-option.selected {
    border-color: ${theme.teal};
    background: ${theme.tealGlow};
  }

  .payment-option-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .payment-option-title {
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: ${theme.navy};
  }

  .payment-radio {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #CBD5E1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .payment-option.selected .payment-radio {
    border-color: ${theme.teal};
    background: ${theme.teal};
  }

  .payment-radio-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: white;
  }

  .payment-option-desc {
    font-size: 12px;
    color: ${theme.slate};
    line-height: 1.5;
  }

  .risk-tag {
    display: inline-flex;
    align-items: center;
    font-size: 10px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 20px;
    margin-top: 8px;
  }

  .risk-low { background: #D1FAE5; color: #065F46; }
  .risk-mid { background: #FEF3C7; color: #92400E; }
  .risk-high { background: #FEE2E2; color: #991B1B; }

  /* CONFIRMATION */
  .confirm-hero {
    text-align: center;
    padding: 30px 20px 20px;
  }

  .confirm-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, ${theme.teal}, ${theme.tealLight});
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    font-size: 36px;
    box-shadow: 0 8px 24px rgba(13,148,136,0.3);
    animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes pop {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .confirm-title {
    font-family: sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: ${theme.navy};
    margin-bottom: 6px;
  }

  .confirm-sub {
    font-size: 13px;
    color: ${theme.slate};
    line-height: 1.5;
  }

  .ref-badge {
    background: ${theme.navy};
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    margin: 16px 0;
  }

  .ref-label {
    font-size: 10px;
    color: ${theme.slate};
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 6px;
  }

  .ref-number {
    font-family: sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: ${theme.teal};
    letter-spacing: 2px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #F1F5F9;
  }

  .detail-row:last-child { border-bottom: none; }

  .detail-key {
    font-size: 12px;
    color: ${theme.slate};
    font-weight: 500;
  }

  .detail-val {
    font-size: 13px;
    font-weight: 600;
    color: ${theme.navy};
    text-align: right;
    max-width: 180px;
  }

  /* TRACKING */
  .track-timeline {
    position: relative;
    padding-left: 28px;
  }

  .track-timeline::before {
    content: '';
    position: absolute;
    left: 9px;
    top: 12px;
    bottom: 12px;
    width: 2px;
    background: #E2E8F0;
  }

  .track-step {
    position: relative;
    margin-bottom: 20px;
    padding-bottom: 4px;
  }

  .track-step:last-child { margin-bottom: 0; }

  .track-dot {
    position: absolute;
    left: -28px;
    top: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #E2E8F0;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
  }

  .track-dot.done {
    background: ${theme.teal};
    border-color: ${theme.teal};
    color: white;
  }

  .track-dot.active {
    background: white;
    border-color: ${theme.teal};
    box-shadow: 0 0 0 4px ${theme.tealGlow};
  }

  .track-step-title {
    font-size: 13px;
    font-weight: 600;
    color: ${theme.navy};
    margin-bottom: 2px;
  }

  .track-step-title.muted { color: ${theme.slate}; font-weight: 500; }

  .track-step-time {
    font-size: 11px;
    color: ${theme.slate};
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    font-family: sans-serif;
  }

  .status-active { background: #D1FAE5; color: #065F46; }
  .status-pending { background: #FEF3C7; color: #92400E; }
  .status-escrow { background: rgba(13,148,136,0.12); color: ${theme.teal}; }

  /* REVIEW */
  .star-row {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin: 14px 0;
  }

  .star-btn {
    font-size: 32px;
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.15s;
    line-height: 1;
  }

  .star-btn:hover { transform: scale(1.2); }

  .attr-review-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #F1F5F9;
  }

  .attr-review-row:last-child { border-bottom: none; }

  .attr-review-label {
    font-size: 13px;
    font-weight: 500;
    color: ${theme.navy};
  }

  .mini-stars {
    display: flex;
    gap: 4px;
  }

  .mini-star {
    font-size: 18px;
    cursor: pointer;
    transition: transform 0.1s;
  }

  .mini-star:hover { transform: scale(1.15); }

  /* DIRECTORY STYLES */
  .search-container {
    background: white;
    padding: 12px 16px;
    border-radius: 12px;
    margin-bottom: 16px;
    box-shadow: 0 2px 10px rgba(15,22,40,0.05);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    font-family: sans-serif;
    color: ${theme.navy};
  }

  .search-input::placeholder { color: ${theme.slate}; }

  .vendor-list {
    display: grid;
    gap: 12px;
  }

  .vendor-list-card {
    background: white;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(15,22,40,0.04);
  }

  .vendor-list-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(15,22,40,0.08);

  }

  .vendor-list-info { flex: 1; }
  .vendor-list-name { font-size: 15px; font-weight: 700; color: ${theme.navy}; display: flex; align-items: center; gap: 6px; }
  .vendor-list-handle { font-size: 12px; color: ${theme.slate}; margin-top: 2px; }
  .vendor-list-meta { font-size: 11px; color: ${theme.slate}; margin-top: 6px; display: flex; gap: 10px; }

  /* PROFILE TABS */
  .profile-tabs {
    display: flex;
    border-bottom: 1px solid #E2E8F0;
    margin: 10px 0 16px;
  }

  .profile-tab {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-size: 13px;
    font-family: sans-serif;
    font-weight: 600;
    color: ${theme.slate};
    cursor: pointer;
    position: relative;
    transition: color 0.2s;
  }

  .profile-tab.active {
    color: ${theme.teal};
  }

  .profile-tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 20%;
    right: 20%;
    height: 3px;
    background: ${theme.teal};
    border-radius: 3px 3px 0 0;
  }

  /* CATALOGUE */
  .catalogue-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .catalogue-item {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(15,22,40,0.04);
  }

  .catalogue-img {
    width: 100%;
    aspect-ratio: 1;
    background-size: cover;
    background-position: center;
    background-color: #F1F5F9;
  }

  .catalogue-info {
    padding: 10px;
  }

  .catalogue-title {
    font-size: 11px;
    color: ${theme.navy};
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
  }

  .catalogue-price {
    font-size: 12px;
    font-weight: 700;
    color: ${theme.teal};
  }

  .nav-tabs {
    display: flex;
    background: white;
    border-top: 1px solid #E2E8F0;
    position: fixed;
    bottom: 0;
    width: 100%;
    max-width: 430px;
    z-index: 100;
  }

  .nav-tab {
    flex: 1;
    padding: 12px 4px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    border: none;
    background: none;
    font-size: 10px;
    color: ${theme.slate};
    font-family: sans-serif;
    font-weight: 500;
    transition: color 0.2s;
  }

  .nav-tab.active { color: ${theme.teal}; }

  .escrow-banner {
    background: linear-gradient(135deg, ${theme.navy}, #162040);
    border-radius: 14px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    border: 1px solid rgba(13,148,136,0.2);
  }

  .escrow-icon {
    font-size: 28px;
    flex-shrink: 0;
  }

  .escrow-text strong {
    font-family: sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: ${theme.white};
    display: block;
    margin-bottom: 3px;
  }

  .escrow-text span {
    font-size: 11px;
    color: ${theme.slate};
    line-height: 1.4;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    background: #F1F5F9;
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 500;
    color: ${theme.navy};
    gap: 4px;
  }

  .page-title {
    font-family: sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: ${theme.navy};
    margin-bottom: 4px;
  }

  .page-sub {
    font-size: 13px;
    color: ${theme.slate};
    margin-bottom: 20px;
    line-height: 1.4;
  }

  /* v3 Styles */
  .cover-video-container {
    width: 100%;
    height: 120px;
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    position: relative;
    background: #1E2D4A;
  }
  .cover-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.8;
  }
  .vendor-profile-header {
    background: white;
    border-radius: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 12px rgba(15,22,40,0.06);
    position: relative;
  }
  .vendor-avatar-overlap {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    border: 4px solid white;
    background: linear-gradient(135deg, ${theme.teal}, ${theme.navy});
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 26px;
    font-weight: 700;
    font-family: sans-serif;
    position: absolute;
    top: 80px;
    left: 20px;
    z-index: 10;
  }
  .vendor-info-section {
    padding: 50px 20px 20px 20px;
  }
  .badge-icon {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    font-family: sans-serif;
    margin-right: 6px;
    margin-bottom: 6px;
  }
  .badge-gov { background: rgba(15, 22, 40, 0.08); color: ${theme.navy}; }
  .badge-cac { background: rgba(13, 148, 136, 0.12); color: #0D9488; }
  .badge-smedan { background: rgba(245, 158, 11, 0.15); color: #D97706; }
  
  .circular-progress-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .circle-svg {
    width: 56px;
    height: 56px;
    transform: rotate(-90deg);
  }
  .circle-bg {
    fill: none;
    stroke: #F1F5F9;
    stroke-width: 6;
  }
  .circle-fill {
    fill: none;
    stroke: ${theme.teal};
    stroke-width: 6;
    stroke-linecap: round;
    transition: stroke-dasharray 1s ease;
  }
  .circle-text {
    position: absolute;
    font-size: 13px;
    font-weight: 800;
    color: ${theme.navy};
    margin-top: 19px;
  }
  .circle-label {
    font-size: 10px;
    font-weight: 600;
    color: ${theme.slate};
    text-align: center;
    max-width: 65px;
    line-height: 1.2;
  }

  .map-placeholder {
    width: 100%;
    height: 140px;
    background: url('https://picsum.photos/seed/map/400/200') center/cover;
    border-radius: 12px;
    margin-top: 12px;
    position: relative;
    border: 1px solid #E2E8F0;
  }
  .map-pin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  }
  .map-nav-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: white;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 11px;
    font-weight: 700;
    color: ${theme.navy};
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .expander-card {
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .expander-header {
    padding: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: ${theme.navy};
  }
  .expander-body {
    padding: 0 14px 14px;
    background: #FAFAFA;
    border-top: 1px solid #E2E8F0;
    font-size: 12px;
    color: ${theme.slate};
    line-height: 1.5;
  }
  .social-grid {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }
  .social-btn {
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    background: white;
    border: 1px solid #E2E8F0;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: ${theme.navy};
  }
  
  .media-feed {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .media-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 4/5;
    background: #F1F5F9;
  }
  .media-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .media-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24px 8px 8px;
    background: linear-gradient(0deg, rgba(15,22,40,0.8) 0%, transparent 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .media-price {
    color: white;
    font-size: 14px;
    font-weight: 800;
    font-family: sans-serif;
  }
  .media-title {
    color: rgba(255,255,255,0.9);
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .stock-indicator {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    backdrop-filter: blur(4px);
  }
  .stock-in { background: rgba(16,185,129,0.9); color: white; }
  .stock-out { background: rgba(244,63,94,0.9); color: white; }

  .review-segments {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
  .segment-pill {
    flex: 1;
    text-align: center;
    padding: 8px 0;
    border-radius: 8px;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
  }
  .segment-val {
    font-size: 16px;
    font-weight: 800;
    color: ${theme.navy};
  }
  .segment-label {
    font-size: 10px;
    color: ${theme.slate};
    text-transform: uppercase;
    margin-top: 2px;
  }
  
  .share-btn {
    width: 100%;
    padding: 12px;
    border: 2px solid #E2E8F0;
    background: white;
    border-radius: 12px;
    color: ${theme.navy};
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .success-animation {
    animation: fadeUp 0.5s ease;
  }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const vendors: Record<string, Vendor> = {
  good: {
    name: "Chioma Adeleke",
    handle: "@ChiStyleHub",
    location: "Lagos",
    locationAddress: "Plot 14 Admiralty Way, Lekki Phase 1",
    locationCity: "Lagos, Nigeria",
    initials: "CA",
    category: "Fashion & Clothing",
    platform: "TikTok",
    coverVideo: "https://videos.pexels.com/video-files/5784918/5784918-uhd_2160_4096_24fps.mp4",
    deliveryCapabilities: ["Nationwide", "Intra-state"],
    stats: { transactions: 34, rating: 4.8, fulfilment: 97 },
    reviewsCount: { good: 12, neutral: 1, bad: 0 },
    attributes: [
      { label: "Order Fulfilment", pct: 97 },
      { label: "Response Time", pct: 98 },
      { label: "On-Time Delivery", pct: 92 },
    ],
    verification: [
      { type: "govId", label: "Identity Verified", desc: "Government ID confirmed" },
      { type: "cac", label: "Business Activity Verified", desc: "CAC registered, TikTok reviewed" },
      { type: "phone", label: "Phone Confirmed", desc: "Active phone number" },
    ],
    sales: [
      { label: "WhatsApp", pct: 55, color: "#10B981" },
      { label: "TikTok", pct: 30, color: "#0D9488" },
      { label: "Instagram", pct: 15, color: "#EC4899" },
    ],
    reviews: [
      { name: "Tunde", stars: 5, text: "She delivered exactly what I ordered. Packaging was clean and she kept me updated the whole time.", image: "https://picsum.photos/seed/rev1/200/200", sentiment: "good" },
      { name: "Amaka", stars: 5, text: "First time buying from someone I didn't know online. The NOVA badge made me feel safe enough to try. No regrets.", sentiment: "good" },
      { name: "Dayo", stars: 4, text: "Had a small issue with sizing, raised a dispute and it was resolved in 24 hours. Impressed.", sentiment: "neutral" },
    ],
    catalogue: [
      { id: "c1", type: "image", title: "Custom Ankara Dress", description: "Beautiful custom-tailored dress natively styled.", price: "25000", image: "https://picsum.photos/seed/ankara/400/400", inStock: true },
      { id: "c2", type: "image", title: "Silk Two-Piece", description: "Soft 100% silk lounging wear.", price: "32000", image: "https://picsum.photos/seed/silk/400/400", inStock: true },
      { id: "c3", type: "image", title: "Maxi Summer Gown", description: "Perfect for the beach and outdoor events.", price: "18500", image: "https://picsum.photos/seed/maxi/400/400", inStock: false },
    ],
    operations: {
      deliveryScope: "Nationwide Delivery, International (UK/US/CAN)",
      paymentModels: ["Flex Advance (50/50)", "Full Escrow"],
      refundPolicy: "Returns accepted within 48 hours for sizing issues (buyer covers return shipping). No refunds on custom tailored items unless defective.",
      businessDesc: "ChiStyleHub specializes in premium and ready-to-wear tailored outfits for the modern African woman. Quality fabrics, exceptional stitching.",
      socials: { whatsapp: "wa.me/+234123", instagram: "@ChiStyleHub", tiktok: "@ChiStyleHub" }
    }
  },
  average: {
    name: "Emeka Gadgets",
    handle: "@EmvyTech",
    location: "Abuja",
    locationAddress: "Shop B4, Wuse Zone 3 Plaza",
    locationCity: "Abuja, Nigeria",
    initials: "EG",
    category: "Electronics",
    platform: "Instagram",
    deliveryCapabilities: ["Intra-state"],
    stats: { transactions: 12, rating: 3.5, fulfilment: 74 },
    reviewsCount: { good: 1, neutral: 2, bad: 1 },
    attributes: [
      { label: "Order Fulfilment", pct: 74 },
      { label: "Response Time", pct: 81 },
      { label: "On-Time Delivery", pct: 65 },
    ],
    verification: [
      { type: "govId", label: "Identity Verified", desc: "Government ID confirmed" },
      { type: "smedan", label: "Registered SME", desc: "SMEDAN verification active" },
    ],
    sales: [
      { label: "WhatsApp", pct: 60, color: "#10B981" },
      { label: "TikTok", pct: 25, color: "#0D9488" },
      { label: "Instagram", pct: 15, color: "#EC4899" },
    ],
    reviews: [
      { name: "Sarah", stars: 3, text: "Got the phone but it took 4 days longer than expected to arrive.", sentiment: "neutral" },
      { name: "KC", stars: 4, text: "Good product, but the vendor takes hours to reply to DMs.", sentiment: "good" },
    ],
    catalogue: [
      { id: "e1", type: "image", title: "Used iPhone 12 Pro", price: "350000", image: "https://picsum.photos/seed/iphone12/400/400", inStock: true },
      { id: "e2", type: "image", title: "AirPods Pro Gen 2", price: "120000", image: "https://picsum.photos/seed/airpods/400/400", inStock: true }
    ],
    operations: {
      deliveryScope: "Abuja only (Waybill upon request and prepay)",
      paymentModels: ["Full Upfront", "Flex Advance"],
      refundPolicy: "No refunds on fairly used gadgets. Test before paying balance.",
      businessDesc: "We sell fairly used phones and laptops at cheap prices in Wuse 3.",
      socials: { whatsapp: "wa.me/+234123" }
    }
  },
  bad: {
    name: "Quick Kicks",
    handle: "@SneakerPlug01",
    location: "Port Harcourt",
    locationAddress: "15 Rumuola Road",
    locationCity: "Rivers, Nigeria",
    initials: "QK",
    category: "Sneakers",
    platform: "Twitter",
    deliveryCapabilities: ["Nationwide"],
    stats: { transactions: 3, rating: 2.1, fulfilment: 42 },
    reviewsCount: { good: 0, neutral: 0, bad: 3 },
    attributes: [
      { label: "Order Fulfilment", pct: 42 },
      { label: "Response Time", pct: 30 },
      { label: "On-Time Delivery", pct: 15 },
    ],
    verification: [
      { type: "phone", label: "Phone Number Verified", desc: "Basic phone verification only" },
      { type: "email", label: "Email Verified", desc: "Confirmation link clicked" },
    ],
    sales: [
      { label: "WhatsApp", pct: 70, color: "#10B981" },
      { label: "TikTok", pct: 30, color: "#0D9488" },
    ],
    reviews: [
      { name: "Bola", stars: 1, text: "Never received my order. Had to go through NOVA support to get my refund.", sentiment: "bad" },
      { name: "Dimi", stars: 2, text: "Sent the wrong size and refused to cover the return shipping cost.", image: "https://picsum.photos/seed/wrongsize/200/200", sentiment: "bad" },
    ],
    catalogue: [
      { id: "b1", type: "image", title: "Nike Air Force 1", price: "45000", image: "https://picsum.photos/seed/nikeaf1/400/400", inStock: false }
    ],
    operations: {
      deliveryScope: "Nationwide Waybill",
      paymentModels: ["Full Upfront"],
      refundPolicy: "No refunds.",
      businessDesc: "Trendy wears.",
      socials: { twitter: "@SneakerPlug01" }
    }
  },
  new1: {
    name: "Lola Beauty",
    handle: "@LolaLashes",
    location: "Lagos",
    locationAddress: "Suite 4, Ikeja City Mall",
    locationCity: "Lagos, Nigeria",
    initials: "LB",
    category: "Beauty",
    platform: "Instagram",
    deliveryCapabilities: ["Nationwide"],
    stats: { transactions: 150, rating: 4.9, fulfilment: 99 },
    reviewsCount: { good: 48, neutral: 1, bad: 0 },
    attributes: [
      { label: "Order Fulfilment", pct: 99 },
      { label: "Response Time", pct: 95 },
      { label: "On-Time Delivery", pct: 96 },
    ],
    verification: [
      { type: "govId", label: "Identity Verified", desc: "Government ID confirmed" },
      { type: "cac", label: "Business Registration", desc: "CAC Document Verified" },
    ],
    sales: [
      { label: "WhatsApp", pct: 45, color: "#10B981" },
      { label: "TikTok", pct: 35, color: "#0D9488" },
      { label: "Instagram", pct: 20, color: "#EC4899" },
    ],
    reviews: [
      { name: "Favour", stars: 5, text: "The very best lashes. Delivery was faster than expected.", sentiment: "good" },
    ],
    catalogue: [
       { id: "n1", type: "image", title: "Mink Lashes Set", price: "5500", image: "https://picsum.photos/seed/lashes/400/400", inStock: true },
       { id: "n2", type: "image", title: "Glossy Lip Kit", price: "8000", image: "https://picsum.photos/seed/lipkit/400/400", inStock: true },
       { id: "n3", type: "image", title: "Makeup Brush Set", price: "15000", image: "https://picsum.photos/seed/brushes/400/400", inStock: true }
    ],
    operations: {
      deliveryScope: "Nationwide",
      paymentModels: ["Full Escrow", "Flex Advance"],
      refundPolicy: "Returns within 3 days if sealed.",
      businessDesc: "Top-tier beauty products.",
      socials: { instagram: "@LolaLashes" }
    }
  },
  new2: {
    name: "Tech Bro Store",
    handle: "@TechBroX",
    location: "Abuja",
    locationAddress: "Phase 1 Gwarinpa",
    locationCity: "Abuja, Nigeria",
    initials: "TB",
    category: "Gadgets",
    platform: "Twitter",
    deliveryCapabilities: ["Nationwide"],
    stats: { transactions: 42, rating: 4.5, fulfilment: 88 },
    reviewsCount: { good: 15, neutral: 2, bad: 1 },
    attributes: [
      { label: "Order Fulfilment", pct: 88 },
      { label: "Response Time", pct: 90 },
      { label: "On-Time Delivery", pct: 85 },
    ],
    verification: [
      { type: "govId", label: "Identity Verified", desc: "Government ID confirmed" },
      { type: "smedan", label: "SME Active", desc: "Registered SMEDAN business" },
    ],
    sales: [
      { label: "WhatsApp", pct: 50, color: "#10B981" },
      { label: "TikTok", pct: 35, color: "#0D9488" },
      { label: "Instagram", pct: 15, color: "#EC4899" },
    ],
    reviews: [
      { name: "Bayo", stars: 4, text: "Laptop was in good condition but charger stopped working after a week.", sentiment: "neutral" },
    ],
    catalogue: [
       { id: "n4", type: "image", title: "MacBook Pro M1 (Used)", price: "850000", image: "https://picsum.photos/seed/macbook/400/400", inStock: true },
       { id: "n5", type: "image", title: "Samsung 27' Monitor", price: "120000", image: "https://picsum.photos/seed/monitor/400/400", inStock: false }
    ],
    operations: {
      deliveryScope: "Nationwide via GIG Logistics",
      paymentModels: ["Flex Advance", "Full Escrow"],
      refundPolicy: "Returns within 24 hours only if defective.",
      businessDesc: "Specialists in Apple and Samsung products.",
      socials: { twitter: "@TechBroX" }
    }
  }
};

function Stars({ count, total = 5 }: { count: number; total?: number }) {
  return (
    <span className="stars">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i}>{i < count ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

// ─── SCREEN 0: DIRECTORY ──────────────────────────────────────────────────────
function DirectoryScreen({ onSelect }: { onSelect: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"txn"|"fulfilment">("txn");
  const [filterLoc, setFilterLoc] = useState("");
  const [filterCap, setFilterCap] = useState("");

  const [compareMode, setCompareMode] = useState(false);
  const [compareSelections, setCompareSelections] = useState<string[]>([]);

  const filtered = Object.entries(vendors).filter(([, v]) => {
    const q = query.toLowerCase();
    const matchesQ = v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
    const matchesLoc = filterLoc ? v.location.toLowerCase().includes(filterLoc.toLowerCase()) : true;
    const matchesCap = filterCap ? (v.deliveryCapabilities || []).some(c => c.toLowerCase().includes(filterCap.toLowerCase())) : true;
    return matchesQ && matchesLoc && matchesCap;
  }).sort(([, a], [, b]) => {
    if (sortBy === "txn") return b.stats.transactions - a.stats.transactions;
    if (sortBy === "fulfilment") return b.stats.fulfilment - a.stats.fulfilment;
    return 0;
  });

  const toggleCompare = (id: string) => {
    if (compareSelections.includes(id)) {
      setCompareSelections(prev => prev.filter(x => x !== id));
    } else {
      if (compareSelections.length < 2) setCompareSelections(prev => [...prev, id]);
    }
  };

  if (compareMode && compareSelections.length === 2) {
    const v1 = vendors[compareSelections[0]];
    const v2 = vendors[compareSelections[1]];
    return (
      <div className="screen success-animation">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="page-title" style={{ marginBottom: 0 }}>Compare Vendors</div>
          <button className="topbar-back" onClick={() => { setCompareMode(false); setCompareSelections([]); }}>Close</button>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Vendor 1 */}
          <div className="card" style={{ padding: 12, textAlign: "center" }}>
            <div className="vendor-avatar" style={{ width: 56, height: 56, margin: "0 auto 8px" }}>{v1.initials}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.navy }}>{v1.name}</div>
            <div style={{ fontSize: 11, color: theme.slate, marginBottom: 12 }}>{v1.category}</div>
            
            <div style={{ fontSize: 10, color: theme.slate, textTransform: "uppercase", marginTop: 8 }}>Transactions</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.navy }}>{v1.stats.transactions}</div>
            
            <div style={{ fontSize: 10, color: theme.slate, textTransform: "uppercase", marginTop: 8 }}>Fulfilment</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.teal }}>{v1.stats.fulfilment}%</div>
            
            <div style={{ fontSize: 10, color: theme.slate, textTransform: "uppercase", marginTop: 8 }}>Rating</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.amber }}>⭐ {v1.stats.rating}</div>

            <button className="cta-btn secondary" style={{ marginTop: 16, padding: "8px", fontSize: 12 }} onClick={() => onSelect(compareSelections[0])}>View Profile</button>
          </div>
          
          {/* Vendor 2 */}
          <div className="card" style={{ padding: 12, textAlign: "center" }}>
            <div className="vendor-avatar" style={{ width: 56, height: 56, margin: "0 auto 8px" }}>{v2.initials}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.navy }}>{v2.name}</div>
            <div style={{ fontSize: 11, color: theme.slate, marginBottom: 12 }}>{v2.category}</div>
            
            <div style={{ fontSize: 10, color: theme.slate, textTransform: "uppercase", marginTop: 8 }}>Transactions</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.navy }}>{v2.stats.transactions}</div>
            
            <div style={{ fontSize: 10, color: theme.slate, textTransform: "uppercase", marginTop: 8 }}>Fulfilment</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.teal }}>{v2.stats.fulfilment}%</div>
            
            <div style={{ fontSize: 10, color: theme.slate, textTransform: "uppercase", marginTop: 8 }}>Rating</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.amber }}>⭐ {v2.stats.rating}</div>

            <button className="cta-btn secondary" style={{ marginTop: 16, padding: "8px", fontSize: 12 }} onClick={() => onSelect(compareSelections[1])}>View Profile</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div className="page-title">Trusted Directory</div>
          <p className="page-sub" style={{ marginBottom: 0 }}>Find verified vendors for your next purchase.</p>
        </div>
        <button 
          onClick={() => setCompareMode(!compareMode)} 
          style={{ background: compareMode ? theme.teal : "white", color: compareMode ? "white" : theme.navy, border: "1px solid #E2E8F0", padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
        >
          {compareMode ? "Cancel" : "Compare"}
        </button>
      </div>

      <div className="search-container" style={{ marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>🔍</span>
        <input 
          className="search-input" 
          placeholder="Search by name, category..." 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        <select className="form-input" style={{ marginBottom: 0, padding: "8px", fontSize: 12, minWidth: 100 }} value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
          <option value="txn">Sort: Volume</option>
          <option value="fulfilment">Sort: Fulfilment</option>
        </select>
        <select className="form-input" style={{ marginBottom: 0, padding: "8px", fontSize: 12, minWidth: 100 }} value={filterLoc} onChange={e => setFilterLoc(e.target.value)}>
          <option value="">All Locations</option>
          <option value="Lagos">Lagos</option>
          <option value="Abuja">Abuja</option>
          <option value="Port Harcourt">Port Harcourt</option>
        </select>
        <select className="form-input" style={{ marginBottom: 0, padding: "8px", fontSize: 12, minWidth: 100 }} value={filterCap} onChange={e => setFilterCap(e.target.value)}>
          <option value="">All Delivery</option>
          <option value="Nationwide">Nationwide</option>
          <option value="Intra-state">Intra-state</option>
        </select>
      </div>

      {compareMode && (
        <div style={{ background: theme.tealGlow, color: theme.teal, fontSize: 12, padding: 10, borderRadius: 8, marginBottom: 12, fontWeight: 600, textAlign: "center" }}>
          Select 2 vendors to compare ({compareSelections.length}/2)
        </div>
      )}

      <div className="vendor-list">
        {filtered.map(([id, v]) => (
          <div key={id} className="vendor-list-card" style={{ border: compareSelections.includes(id) ? `2px solid ${theme.teal}` : "2px solid transparent" }} onClick={() => {
            if (compareMode) toggleCompare(id);
            else onSelect(id);
          }}>
            <div className="vendor-avatar" style={{ width: 48, height: 48, fontSize: 18, borderWidth: 2 }}>{v.initials}</div>
            <div className="vendor-list-info" style={{ flex: 1 }}>
              <div className="vendor-list-name">
                {v.name} 
                <span style={{color: theme.teal, fontSize: 12, display: "inline-flex", background: theme.tealGlow, padding: "2px 6px", borderRadius: 10, marginLeft: 6}}>✓ Verified</span>
              </div>
              <div className="vendor-list-handle" style={{ fontSize: 11, marginTop: 4 }}>
                <span style={{ fontWeight: 800, color: theme.navy, fontSize: 13 }}>{v.stats.transactions}</span> txns
                <span style={{ margin: "0 6px", color: "#CBD5E1" }}>|</span>
                <span style={{ fontWeight: 800, color: theme.teal, fontSize: 13 }}>{v.stats.fulfilment}%</span> flfl
              </div>
              <div style={{ fontSize: 11, color: theme.slate, marginTop: 4, display: "flex", gap: 8 }}>
                <span>⭐ {v.stats.rating} rating</span>
                <span>💬 {(v.reviewsCount?.good || 0) + (v.reviewsCount?.neutral || 0) + (v.reviewsCount?.bad || 0)} reviews</span>
              </div>
            </div>
            {compareMode ? (
              <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${theme.teal}`, display: "flex", alignItems: "center", justifyContent: "center", background: compareSelections.includes(id) ? theme.teal : "transparent" }}>
                {compareSelections.includes(id) && <span style={{ color: "white", fontSize: 12 }}>✓</span>}
              </div>
            ) : (
              <div style={{ color: theme.slate, fontSize: 18 }}>→</div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: theme.slate, fontSize: 13 }}>
            No vendors found.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN 1: VENDOR PROFILE ─────────────────────────────────────────────────
function ProfileScreen({ onContact, onCreateTx, vendor }: { onContact: () => void; onCreateTx: () => void; vendor: Vendor }) {
  const [timeTab, setTimeTab] = useState(0);
  const [activeTab, setActiveTab] = useState<"identity" | "catalogue" | "reviews">("identity");
  const timeTabs = ["Last 30 days", "3 months", "All time"];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="screen" style={{ padding: "0 0 100px 0" }}>
      {/* VENDOR HEADER (WITH VIDEO AND BADGES) */}
      <div className="vendor-profile-header">
        <div className="cover-video-container">
          {vendor.coverVideo ? (
            <video src={vendor.coverVideo} className="cover-video" autoPlay loop muted playsInline />
          ) : (
            <div className="cover-video" style={{ background: "linear-gradient(135deg, #1A2540, #0F1628)" }} />
          )}
        </div>
        <div className="vendor-avatar-overlap">{vendor.initials}</div>
        
        <div style={{ position: "absolute", top: 130, right: 20, display: "flex", flexWrap: "wrap", justifyContent: "flex-end", maxWidth: "200px" }}>
          {vendor.verification.map((v, i) => {
            if (v.type === "govId") return <span key={i} className="badge-icon badge-gov">🏛️ Gov ID</span>;
            if (v.type === "cac") return <span key={i} className="badge-icon badge-cac">🏢 CAC</span>;
            if (v.type === "smedan") return <span key={i} className="badge-icon badge-smedan">🏷️ SMEDAN</span>;
            return null;
          })}
        </div>
        
        <div className="vendor-info-section">
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
            <span className="vendor-name" style={{ fontSize: 20 }}>{vendor.name}</span>
            <span className="nova-badge">✓ Verified</span>
          </div>
          <div className="vendor-handle">{vendor.handle} • {vendor.category}</div>
          <div className="vendor-location" style={{ marginTop: 8 }}>
            📍 {vendor.locationAddress ? `${vendor.locationAddress}, ${vendor.locationCity}` : vendor.location}
          </div>
          
          <button className="share-btn" style={{ marginTop: 16 }} onClick={() => alert("Copied Profile Link!")}>
            <span>🔗 Share Profile</span>
          </button>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div className="profile-tabs">
          <div className={`profile-tab ${activeTab === "identity" ? "active" : ""}`} onClick={() => setActiveTab("identity")}>Trust Stack</div>
          <div className={`profile-tab ${activeTab === "catalogue" ? "active" : ""}`} onClick={() => setActiveTab("catalogue")}>Catalogue</div>
          <div className={`profile-tab ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>Reviews</div>
        </div>

        {activeTab === "identity" && (
          <div className="success-animation">
            {/* CIRCULAR METRICS */}
            <div className="card">
              <div className="section-title">Performance Metrics</div>
              <div className="time-toggle">
                {timeTabs.map((t, i) => (
                  <button key={i} className={`time-btn ${timeTab === i ? "active" : ""}`} onClick={() => setTimeTab(i)}>{t}</button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-around", marginTop: 16 }}>
                {vendor.attributes.map((a, i) => {
                  const cir = 2 * Math.PI * 25;
                  const offset = cir - (a.pct / 100) * cir;
                  return (
                    <div key={i} className="circular-progress-wrap">
                      <div style={{ position: "relative", width: 56, height: 56, display: "flex", justifyContent: "center" }}>
                        <svg className="circle-svg">
                          <circle className="circle-bg" cx="28" cy="28" r="25" />
                          <circle className="circle-fill" cx="28" cy="28" r="25" strokeDasharray={cir} strokeDashoffset={offset} />
                        </svg>
                        <div className="circle-text">{a.pct}%</div>
                      </div>
                      <div className="circle-label">{a.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LOCATION OVERVIEW */}
            <div className="card">
              <div className="section-title">Verified Location</div>
              <div style={{ fontSize: 13, color: theme.navy, fontWeight: 500 }}>
                {vendor.locationAddress}<br />
                {vendor.locationCity}
              </div>
              <div className="map-placeholder">
                <span className="map-pin">📍</span>
                <button className="map-nav-btn" onClick={() => alert("Navigating to Google Maps...")}>Open Map →</button>
              </div>
            </div>

            {/* VENDOR OPERATIONS (EXPANDABLE) */}
            {vendor.operations && (
              <div className="card">
                <div className="section-title">Vendor Operations</div>
                
                <div className="expander-card">
                  <div className="expander-header" onClick={() => toggleExpand("delivery")}>
                    Delivery Scope
                    <span>{expanded["delivery"] ? "▼" : "▶"}</span>
                  </div>
                  {expanded["delivery"] && <div className="expander-body">{vendor.operations.deliveryScope}</div>}
                </div>

                <div className="expander-card">
                  <div className="expander-header" onClick={() => toggleExpand("payment")}>
                    Payment Structure
                    <span>{expanded["payment"] ? "▼" : "▶"}</span>
                  </div>
                  {expanded["payment"] && (
                    <div className="expander-body">
                      We support: {vendor.operations.paymentModels.join(", ")}
                    </div>
                  )}
                </div>

                <div className="expander-card">
                  <div className="expander-header" onClick={() => toggleExpand("refund")}>
                    Refund Policies
                    <span>{expanded["refund"] ? "▼" : "▶"}</span>
                  </div>
                  {expanded["refund"] && <div className="expander-body">{vendor.operations.refundPolicy}</div>}
                </div>

                <div className="expander-card" style={{ marginBottom: 0 }}>
                  <div className="expander-header" onClick={() => toggleExpand("desc")}>
                    Business Description
                    <span>{expanded["desc"] ? "▼" : "▶"}</span>
                  </div>
                  {expanded["desc"] && <div className="expander-body">{vendor.operations.businessDesc}</div>}
                </div>

                <div className="social-grid">
                  {Object.keys(vendor.operations.socials).map(s => (
                    <button key={s} className="social-btn" onClick={() => alert("Redirecting to " + s)}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "catalogue" && (
          <div className="success-animation">
            {vendor.catalogue && vendor.catalogue.length > 0 ? (
              <div className="media-feed">
                {vendor.catalogue.map((item, i) => (
                  <div key={i} className="media-card">
                    <img src={item.image} className="media-img" alt={item.title} />
                    <div className="media-overlay">
                      <div className="media-price">₦{parseInt(item.price).toLocaleString()}</div>
                      <div className="media-title">{item.title}</div>
                    </div>
                    {item.inStock !== undefined && (
                      <div className={`stock-indicator ${item.inStock ? 'stock-in' : 'stock-out'}`}>
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px", color: theme.slate, fontSize: 13 }}>
                No posts available.
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="success-animation">
            <div className="card">
              <div className="section-title">Review Volume Summary</div>
              <div className="review-segments">
                <div className="segment-pill">
                  <div className="segment-val" style={{ color: theme.teal }}>{vendor.reviewsCount?.good || 0}</div>
                  <div className="segment-label">Good 👍</div>
                </div>
                <div className="segment-pill">
                  <div className="segment-val" style={{ color: theme.amber }}>{vendor.reviewsCount?.neutral || 0}</div>
                  <div className="segment-label">Neutral 😐</div>
                </div>
                <div className="segment-pill">
                  <div className="segment-val" style={{ color: theme.rose }}>{vendor.reviewsCount?.bad || 0}</div>
                  <div className="segment-label">Bad 👎</div>
                </div>
              </div>
              
              <div className="section-title" style={{ marginTop: 16 }}>Detailed Reviews</div>
              {vendor.reviews && vendor.reviews.length > 0 ? (
                vendor.reviews.map((r: VendorReview, i: number) => (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <span className="reviewer-name">{r.name}</span>
                      <Stars count={r.stars} />
                    </div>
                    <p className="review-text">&quot;{r.text}&quot;</p>
                    {r.image && <img src={r.image} className="review-img" alt="Review attachment" />}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: theme.slate, fontSize: 13 }}>
                  No detailed reviews.
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div style={{ marginTop: 24, paddingBottom: 24 }}>
          <button className="cta-btn" onClick={onContact}>Contact Vendor on WhatsApp</button>
          <p className="cta-sub">🔒 Transactions on NOVA are protected</p>
          <button className="cta-btn secondary" style={{ marginTop: 10 }} onClick={onCreateTx}>
            + Create NOVA Transaction
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 2: VENDOR CREATE TRANSACTION ─────────────────────────────────────
function CreateTransactionScreen({ onNext }: { onNext: (data: TxData) => void }) {
  const [form, setForm] = useState<TxData>({ item: "", desc: "", price: "", deliveryStart: "", deliveryEnd: "", deliveryChannel: "", notes: "" });

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const valid = form.item && form.price && form.deliveryStart && form.deliveryEnd && form.deliveryChannel;

  return (
    <div className="screen">
      <div className="page-title">Create Transaction</div>
      <p className="page-sub">Fill in the agreed details from your DM conversation. Your buyer will confirm and choose a payment model.</p>

      <div className="card">
        <label className="form-label">Item / Product Name</label>
        <input className="form-input" placeholder="e.g. Custom ankara dress (size M)" value={form.item} onChange={e => set("item", e.target.value)} />

        <label className="form-label">Item Description</label>
        <textarea className="form-input" placeholder="Describe the item, colour, size, specifications..." value={form.desc} onChange={e => set("desc", e.target.value)} />

        <div className="form-row">
          <div>
            <label className="form-label">Price (₦)</label>
            <input className="form-input" type="number" placeholder="25000" value={form.price} onChange={e => set("price", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Delivery Channel</label>
            <select className="form-input" value={form.deliveryChannel} onChange={e => set("deliveryChannel", e.target.value)}>
              <option value="">Select channel...</option>
              <option value="Pickup">Pickup</option>
              <option value="Dispatch Rider">Dispatch Rider</option>
              <option value="Waybill">Waybill (Interstate)</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label className="form-label">Delivery Start Date</label>
            <input className="form-input" type="date" value={form.deliveryStart} onChange={e => set("deliveryStart", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Delivery End Date</label>
            <input className="form-input" type="date" value={form.deliveryEnd} onChange={e => set("deliveryEnd", e.target.value)} />
          </div>
        </div>

        <label className="form-label">Additional Notes (optional)</label>
        <textarea className="form-input" placeholder="Delivery instructions, special requests..." value={form.notes} onChange={e => set("notes", e.target.value)} />
      </div>

      <div className="escrow-banner">
        <span className="escrow-icon">🔐</span>
        <div className="escrow-text">
          <strong>NOVA Buyer Protection Active</strong>
          <span>Your buyer will select a payment model. Escrow funds are only released when they confirm delivery.</span>
        </div>
      </div>

      <button className="cta-btn" disabled={!valid} style={{ opacity: valid ? 1 : 0.4 }} onClick={() => onNext(form)}>
        Generate Transaction Link →
      </button>
    </div>
  );
}

// ─── SCREEN 3: BUYER CONFIRM + PAYMENT ───────────────────────────────────────
function BuyerConfirmScreen({ txData, vendor, onConfirm }: { txData: TxData; vendor: Vendor; onConfirm: (model: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    {
      id: "escrow",
      title: "🔐 Escrow Hold",
      desc: "Your full payment is held securely by NOVA and released to the vendor only after you confirm delivery.",
      risk: "Lowest Risk",
      riskClass: "risk-low",
    },
    {
      id: "split",
      title: "⚖️ Flex Advance",
      desc: "Pay in full upfront. 50% is released to the vendor immediately, and 50% is held in escrow until you confirm delivery.",
      risk: "Balanced Risk",
      riskClass: "risk-mid",
    },
    {
      id: "upfront",
      title: "💸 Full Upfront",
      desc: "Pay the full amount now. Vendor starts immediately. Best for established relationships.",
      risk: "Buyer Takes Risk",
      riskClass: "risk-high",
    },
  ];

  return (
    <div className="screen">
      <div className="page-title">Confirm Terms</div>
      <p className="page-sub">Review what you and the vendor agreed. Select your preferred payment protection model.</p>

      {/* Transaction Summary */}
      <div className="card">
        <div className="section-title">Transaction Summary</div>
        <div className="detail-row">
          <span className="detail-key">Vendor</span>
          <span className="detail-val">{vendor.name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-key">Item</span>
          <span className="detail-val">{txData?.item || "Custom ankara dress (size M)"}</span>
        </div>
        <div className="detail-row">
          <span className="detail-key">Price</span>
          <span className="detail-val" style={{ color: theme.teal, fontWeight: 700 }}>₦{parseInt(String(txData?.price || "25000")).toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-key">Delivery Window</span>
          <span className="detail-val">{txData?.deliveryStart ? `${txData.deliveryStart} to ${txData.deliveryEnd}` : "Mar 15 - Mar 18, 2026"}</span>
        </div>
        <div className="detail-row">
          <span className="detail-key">Delivery Channel</span>
          <span className="detail-val">{txData?.deliveryChannel || "Dispatch Rider"}</span>
        </div>
        {txData?.notes && (
          <div className="detail-row">
            <span className="detail-key">Notes</span>
            <span className="detail-val">{txData.notes}</span>
          </div>
        )}
      </div>

      {/* Payment Options */}
      <div className="card">
        <div className="section-title">Choose Payment Model</div>
        {options.map(opt => (
          <div key={opt.id} className={`payment-option ${selected === opt.id ? "selected" : ""}`} onClick={() => setSelected(opt.id)}>
            <div className="payment-option-header">
              <span className="payment-option-title">{opt.title}</span>
              <div className="payment-radio">
                {selected === opt.id && <div className="payment-radio-dot" />}
              </div>
            </div>
            <p className="payment-option-desc">{opt.desc}</p>
            <span className={`risk-tag ${opt.riskClass}`}>{opt.risk}</span>
          </div>
        ))}
      </div>

      <button className="cta-btn" disabled={!selected} style={{ opacity: selected ? 1 : 0.4 }} onClick={() => onConfirm(selected as string)}>
        Confirm & Pay ₦{parseInt(String(txData?.price || "25000")).toLocaleString()} →
      </button>
      <p className="cta-sub">🔒 Payment secured by NOVA · SSL encrypted</p>
    </div>
  );
}

// ─── SCREEN 4: CONFIRMATION ───────────────────────────────────────────────────
function ConfirmationScreen({ vendor, txData, paymentModel, onTrack }: { vendor: Vendor; txData: TxData; paymentModel: string; onTrack: () => void }) {
  const refNum = "NOVA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const modelLabels: Record<string, string> = { escrow: "Escrow Hold", split: "Flex Advance", upfront: "Full Upfront" };

  return (
    <div className="screen success-animation">
      <div className="confirm-hero">
        <div className="confirm-icon">✓</div>
        <div className="confirm-title">Transaction Confirmed!</div>
        <p className="confirm-sub">Your payment is secured. {vendor?.name} has been notified and will begin processing your order.</p>
      </div>

      <div className="card">
        <div className="ref-badge">
          <div className="ref-label">NOVA Transaction Reference</div>
          <div className="ref-number">{refNum}</div>
        </div>

        <div className="detail-row">
          <span className="detail-key">Vendor</span>
          <span className="detail-val">{vendor?.name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-key">Item</span>
          <span className="detail-val">{txData?.item || "Custom ankara dress"}</span>
        </div>
        <div className="detail-row">
          <span className="detail-key">Amount</span>
          <span className="detail-val" style={{ color: theme.teal, fontWeight: 700 }}>₦{parseInt(String(txData?.price || "25000")).toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-key">Payment Model</span>
          <span className="detail-val">{modelLabels[paymentModel]}</span>
        </div>
        <div className="detail-row">
          <span className="detail-key">Delivery Window</span>
          <span className="detail-val">{txData?.deliveryStart ? `${txData.deliveryStart} to ${txData.deliveryEnd}` : "Mar 15 - Mar 18, 2026"}</span>
        </div>
        <div className="detail-row">
          <span className="detail-key">Delivery Channel</span>
          <span className="detail-val">{txData?.deliveryChannel || "Dispatch Rider"}</span>
        </div>
        <div className="detail-row">
          <span className="detail-key">Status</span>
          <span className="detail-val"><span className="status-pill status-active">● Order Confirmed</span></span>
        </div>
      </div>

      <div className="escrow-banner">
        <span className="escrow-icon">🛡️</span>
        <div className="escrow-text">
          <strong>Your money is protected</strong>
          <span>Funds are held securely and only released when you confirm delivery is satisfactory.</span>
        </div>
      </div>

      <button className="cta-btn" onClick={onTrack}>Track My Order →</button>
    </div>
  );
}

// ─── SCREEN 5: ORDER TRACKING ─────────────────────────────────────────────────
function TrackingScreen({ vendor, onReview }: { vendor: Vendor; onReview: () => void }) {
  const steps = [
    { label: "Order Confirmed", time: "Today, 2:34 PM", done: true },
    { label: "Vendor Processing", time: "Today, 2:45 PM", done: true },
    { label: "Ready for Dispatch", time: "Expected Mar 13", done: false, active: true },
    { label: "With Courier", time: "Expected Mar 14", done: false },
    { label: "Delivered", time: "Expected Mar 15", done: false },
  ];

  return (
    <div className="screen">
      <div className="page-title">Order Tracking</div>
      <p className="page-sub">Live updates from {vendor.name} on your order.</p>

      {/* Public Shareable Link Feature */}
      <div className="card" style={{ background: theme.tealGlow, borderColor: theme.teal }}>
        <div className="section-title" style={{ color: theme.teal }}>Share Tracking Link</div>
        <p style={{ fontSize: 12, color: theme.navy, marginBottom: 10 }}>Share this link with your buyer or a recipient. They can track the order without installing the app or signing up.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="form-input" style={{ marginBottom: 0, flex: 1, fontSize: 13, color: theme.slate }} value="https://nova.app/t/tx8823" readOnly />
          <button className="cta-btn" style={{ padding: "0 16px", background: theme.teal, width: "auto" }} onClick={() => alert("Tracking link copied to clipboard!")}>Copy</button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: theme.slate, marginBottom: 4 }}>Transaction</div>
            <div style={{ fontFamily: "sans-serif", fontWeight: 700, color: theme.navy, fontSize: 14 }}>NOVA-TX8823</div>
          </div>
          <span className="status-pill status-pending">⏳ In Progress</span>
        </div>

        <div className="track-timeline">
          {steps.map((s, i) => (
            <div key={i} className="track-step">
              <div className={`track-dot ${s.done ? "done" : s.active ? "active" : ""}`}>
                {s.done ? "✓" : ""}
              </div>
              <div className={`track-step-title ${!s.done && !s.active ? "muted" : ""}`}>{s.label}</div>
              <div className="track-step-time">{s.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title">Escrow Status</div>
        <div className="escrow-banner" style={{ margin: 0 }}>
          <span className="escrow-icon">🔐</span>
          <div className="escrow-text">
            <strong>₦25,000 held in escrow</strong>
            <span>Funds release to vendor automatically when you confirm delivery below.</span>
          </div>
        </div>
      </div>

      <button className="cta-btn" onClick={onReview} style={{ background: theme.navy }}>
        ✓ Confirm Delivery & Release Payment
      </button>
      <button className="cta-btn secondary" style={{ marginTop: 10, borderColor: theme.rose, color: theme.rose }}>
        🚨 Raise a Dispute
      </button>
      <p className="cta-sub">Disputes are reviewed by the NOVA team within 24 hours</p>
    </div>
  );
}

// ─── SCREEN 6: REVIEW ─────────────────────────────────────────────────────────
function ReviewScreen({ vendor, onDone }: { vendor: Vendor; onDone: () => void }) {
  const [overall, setOverall] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [attrs, setAttrs] = useState({ fulfilment: 0, response: 0, delivery: 0 });
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const setAttr = (k: keyof typeof attrs, v: number) => setAttrs(p => ({ ...p, [k]: v }));

  const attrRows: { key: keyof typeof attrs; label: string }[] = [
    { key: "fulfilment", label: "Order Fulfilment" },
    { key: "response", label: "Response Time" },
    { key: "delivery", label: "On-Time Delivery" },
  ];

  if (submitted) {
    return (
      <div className="screen success-animation">
        <div className="confirm-hero">
          <div className="confirm-icon" style={{ fontSize: 40 }}>⭐</div>
          <div className="confirm-title">Review Submitted!</div>
          <p className="confirm-sub">Thank you. Your review helps the next buyer make a confident decision.</p>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: 13, color: theme.slate, marginBottom: 8 }}>Your review has been added to</div>
          <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 16, color: theme.navy }}>{vendor.name}</div>
          <div style={{ color: theme.teal, fontSize: 13, marginTop: 4 }}>{vendor.handle}</div>
          <div style={{ marginTop: 16 }}>
            <Stars count={overall} />
          </div>
          {comment && <p className="review-text" style={{ marginTop: 12 }}>&quot;{comment}&quot;</p>}
        </div>
        <button className="cta-btn" onClick={onDone}>Back to Profile</button>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="page-title">Leave a Review</div>
      <p className="page-sub">How was your experience with {vendor.name}? Your review builds trust for the next buyer.</p>

      {/* Overall Rating */}
      <div className="card" style={{ textAlign: "center" }}>
        <div className="section-title" style={{ textAlign: "center" }}>Overall Rating</div>
        <div className="star-row">
          {[1, 2, 3, 4, 5].map(i => (
            <button key={i} className="star-btn"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setOverall(i)}>
              {i <= (hovered || overall) ? "★" : "☆"}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: theme.slate }}>
          {overall === 0 ? "Tap to rate" : ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][overall]}
        </div>
      </div>

      {/* Attribute Ratings */}
      <div className="card">
        <div className="section-title">Rate Specific Areas</div>
        {attrRows.map(({ key, label }) => (
          <div key={key} className="attr-review-row">
            <span className="attr-review-label">{label}</span>
            <div className="mini-stars">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className="mini-star" onClick={() => setAttr(key, i)}>
                  {i <= attrs[key] ? "★" : "☆"}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Written Review */}
      <div className="card">
        <label className="form-label">Write a Review (optional)</label>
        <textarea className="form-input" placeholder="Tell the next buyer what your experience was like..." value={comment} onChange={e => setComment(e.target.value)} style={{ minHeight: 100 }} />
        <button style={{ padding: "10px", borderRadius: 8, border: "2px dashed #E2E8F0", background: "white", fontSize: 13, color: theme.slate, display: "flex", gap: 8, alignItems: "center", cursor: "pointer", marginTop: 4, width: "100%", justifyContent: "center", fontWeight: 600, fontFamily: "sans-serif" }} onClick={() => alert("Image attachment flow")}>
          <span style={{ fontSize: 16 }}>📷</span> Attach Image
        </button>
      </div>

      <button className="cta-btn" disabled={overall === 0} style={{ opacity: overall > 0 ? 1 : 0.4 }} onClick={() => setSubmitted(true)}>
        Submit Review
      </button>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
function AppContent() {
  const [selectedVendorId, setSelectedVendorId] = useState<string>("good");
  const vendor = vendors[selectedVendorId] || vendors.good;

  const [screen, setScreen] = useState<string>("directory");
  const [txData, setTxData] = useState<TxData | null>(null);
  const [paymentModel, setPaymentModel] = useState<string>("");

  const screenTitles: Record<string, { title: string; sub: string; back: string | null }> = {
    directory: { title: "NOVA", sub: "Verified Commerce", back: null },
    profile: { title: "NOVA", sub: "Verified Commerce", back: "directory" },
    create: { title: "NOVA", sub: "Verified Commerce", back: "profile" },
    confirm: { title: "NOVA", sub: "Verified Commerce", back: "profile" },
    confirmation: { title: "NOVA", sub: "Verified Commerce", back: null },
    tracking: { title: "NOVA", sub: "Verified Commerce", back: "confirmation" },
    review: { title: "NOVA", sub: "Verified Commerce", back: "tracking" },
  };

  const current = screenTitles[screen];

  return (
    <>
      <style>{styles}</style>
      <div className="app-shell">
        {/* Top Bar */}
        <div className="topbar">
          {current.back ? (
            <button className="topbar-back" onClick={() => setScreen(current.back as string)}>← Back</button>
          ) : <div style={{ width: 60 }} />}
          <div style={{ textAlign: "center" }}>
            <div className="topbar-logo">{current.title}</div>
            <div className="topbar-sub">{current.sub}</div>
          </div>
          <div style={{ width: 60 }} />
        </div>

        {/* Screens */}
        {screen === "directory" && (
          <DirectoryScreen onSelect={(id) => {
            setSelectedVendorId(id);
            setScreen("profile");
          }} />
        )}
        {screen === "profile" && (
          <ProfileScreen
            vendor={vendor}
            onContact={() => alert(`Opening WhatsApp with ${vendor.name} (In live product this opens wa.me link)`)}
            onCreateTx={() => setScreen("create")}
          />
        )}
        {screen === "create" && (
          <CreateTransactionScreen onNext={(data) => { setTxData(data); setScreen("confirm"); }} />
        )}
        {screen === "confirm" && txData && (
          <BuyerConfirmScreen vendor={vendor} txData={txData} onConfirm={(model: string) => { setPaymentModel(model); setScreen("confirmation"); }} />
        )}
        {screen === "confirmation" && txData && (
          <ConfirmationScreen vendor={vendor} txData={txData} paymentModel={paymentModel} onTrack={() => setScreen("tracking")} />
        )}
        {screen === "tracking" && (
          <TrackingScreen vendor={vendor} onReview={() => setScreen("review")} />
        )}
        {screen === "review" && (
          <ReviewScreen vendor={vendor} onDone={() => setScreen("profile")} />
        )}
      </div>
    </>
  );
}

export default function NOVAApp() {
  return (
    <Suspense fallback={<div className="app-shell" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Loading Nova...</div>}>
      <AppContent />
    </Suspense>
  );
}

'use client'
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
}

export interface Vendor {
  name: string;
  handle: string;
  location: string;
  initials: string;
  category: string;
  platform: string;
  stats: VendorStats;
  attributes: VendorAttribute[];
  verification: VendorVerification[];
  sales: VendorSales[];
  reviews: VendorReview[];
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

  .success-animation {
    animation: fadeUp 0.5s ease;
  }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const vendors: Record<string, Vendor> = {
  good: {
    name: "Chioma Adeleke",
    handle: "@ChiStyleHub",
    location: "Lagos, Nigeria",
    initials: "CA",
    category: "Fashion & Clothing",
    platform: "TikTok",
    stats: { transactions: 34, rating: 4.8, fulfilment: 97 },
    attributes: [
      { label: "Order Fulfilment", pct: 97 },
      { label: "Response Time", pct: 98 },
      { label: "On-Time Delivery", pct: 92 },
    ],
    verification: [
      { label: "Identity Verified", desc: "Government ID confirmed" },
      { label: "Business Activity Verified", desc: "TikTok page and transaction history reviewed" },
      { label: "Social Presence Reviewed", desc: "Active TikTok seller verified" },
      { label: "Location Confirmed", desc: "Lagos, Nigeria" },
    ],
    sales: [
      { label: "TikTok", pct: 68, color: "#0D9488" },
      { label: "Instagram", pct: 22, color: "#EC4899" },
      { label: "WhatsApp", pct: 10, color: "#F59E0B" },
    ],
    reviews: [
      { name: "Tunde", stars: 5, text: "She delivered exactly what I ordered. Packaging was clean and she kept me updated the whole time." },
      { name: "Amaka", stars: 5, text: "First time buying from someone I didn't know online. The NOVA badge made me feel safe enough to try. No regrets." },
      { name: "Dayo", stars: 4, text: "Had a small issue with sizing, raised a dispute and it was resolved in 24 hours. Impressed." },
    ],
  },
  average: {
    name: "Emeka Gadgets",
    handle: "@EmvyTech",
    location: "Abuja, Nigeria",
    initials: "EG",
    category: "Electronics",
    platform: "Instagram",
    stats: { transactions: 12, rating: 3.5, fulfilment: 74 },
    attributes: [
      { label: "Order Fulfilment", pct: 74 },
      { label: "Response Time", pct: 81 },
      { label: "On-Time Delivery", pct: 65 },
    ],
    verification: [
      { label: "Identity Verified", desc: "Government ID confirmed" },
      { label: "Location Confirmed", desc: "Abuja, Nigeria" },
    ],
    sales: [
      { label: "Instagram", pct: 85, color: "#EC4899" },
      { label: "Twitter", pct: 15, color: "#0F1628" },
    ],
    reviews: [
      { name: "Sarah", stars: 3, text: "Got the phone but it took 4 days longer than expected to arrive." },
      { name: "KC", stars: 4, text: "Good product, but the vendor takes hours to reply to DMs." },
    ],
  },
  bad: {
    name: "Quick Kicks",
    handle: "@SneakerPlug01",
    location: "Port Harcourt",
    initials: "QK",
    category: "Sneakers",
    platform: "Twitter",
    stats: { transactions: 3, rating: 2.1, fulfilment: 42 },
    attributes: [
      { label: "Order Fulfilment", pct: 42 },
      { label: "Response Time", pct: 30 },
      { label: "On-Time Delivery", pct: 15 },
    ],
    verification: [
      { label: "Phone Number Verified", desc: "Basic phone verification only" },
    ],
    sales: [
      { label: "Twitter", pct: 100, color: "#0F1628" },
    ],
    reviews: [
      { name: "Bola", stars: 1, text: "Never received my order. Had to go through NOVA support to get my refund." },
      { name: "Dimi", stars: 2, text: "Sent the wrong size and refused to cover the return shipping cost." },
    ],
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

// ─── SCREEN 1: VENDOR PROFILE ─────────────────────────────────────────────────
function ProfileScreen({ onContact, onCreateTx, vendor }: { onContact: () => void; onCreateTx: () => void; vendor: Vendor }) {
  const [timeTab, setTimeTab] = useState(0);
  const tabs = ["Last 30 days", "3 months", "All time"];

  return (
    <div className="screen">
      {/* Identity */}
      <div className="card">
        <div className="vendor-identity">
          <div className="vendor-avatar">{vendor.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="vendor-name">{vendor.name}</span>
              <span className="nova-badge">✓ NOVA Verified</span>
            </div>
            <div className="vendor-handle">{vendor.handle}</div>
            <div className="vendor-location">📍 {vendor.location}</div>
            <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
              <span className="chip">👗 {vendor.category}</span>
              <span className="chip">📱 {vendor.platform}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="card">
        <div className="time-toggle">
          {tabs.map((t, i) => (
            <button key={i} className={`time-btn ${timeTab === i ? "active" : ""}`} onClick={() => setTimeTab(i)}>{t}</button>
          ))}
        </div>
        <div className="trust-strip">
          <div className="trust-metric">
            <div className="trust-number" style={{ color: theme.navy }}>{vendor.stats.transactions}</div>
            <div className="trust-label">Transactions</div>
          </div>
          <div className="trust-metric">
            <div className="trust-number" style={{ color: theme.amber }}>{vendor.stats.rating}★</div>
            <div className="trust-label">Avg. Rating</div>
          </div>
          <div className="trust-metric">
            <div className="trust-number" style={{ color: theme.teal }}>{vendor.stats.fulfilment}%</div>
            <div className="trust-label">Fulfilment Rate</div>
          </div>
        </div>
      </div>

      {/* Attribute Breakdown */}
      <div className="card">
        {vendor.attributes.map((a: VendorAttribute, i: number) => (
          <div key={i} className="attr-row">
            <span className="attr-label">{a.label}</span>
            <div className="attr-bar-bg">
              <div className="attr-bar-fill" style={{ width: `${a.pct}%` }} />
            </div>
            <span className="attr-pct">{a.pct}%</span>
          </div>
        ))}
      </div>

      {/* Verification */}
      <div className="card verify-card">
        <div className="section-title">Verification Status</div>
        {vendor.verification.map((v: VendorVerification, i: number) => (
          <div key={i} className="verify-item">
            <div className="verify-check">
              <span style={{ color: theme.teal, fontSize: 11, fontWeight: 700 }}>✓</span>
            </div>
            <div className="verify-text">
              <strong>{v.label}</strong>
              <span>{v.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Activity */}
      <div className="card">
        <div className="section-title">Sales Activity</div>
        <div className="sales-bar">
          {vendor.sales.map((s: VendorSales, i: number) => (
            <div key={i} className="sales-seg" style={{ width: `${s.pct}%`, background: s.color }}>
              {s.pct >= 15 ? `${s.label} ${s.pct}%` : ""}
            </div>
          ))}
        </div>
        <div className="sales-legend">
          {vendor.sales.map((s: VendorSales, i: number) => (
            <div key={i} className="legend-item">
              <div className="legend-dot" style={{ background: s.color }} />
              {s.label} — {s.pct}%
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="card">
        <div className="section-title">Buyer Reviews</div>
        {vendor.reviews.map((r: VendorReview, i: number) => (
          <div key={i} className="review-card">
            <div className="review-header">
              <span className="reviewer-name">{r.name}</span>
              <Stars count={r.stars} />
            </div>
            <p className="review-text">&quot;{r.text}&quot;</p>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <button className="cta-btn" onClick={onContact}>Contact Vendor on WhatsApp</button>
      <p className="cta-sub">🔒 Transactions on NOVA are protected</p>
      <button className="cta-btn secondary" style={{ marginTop: 10 }} onClick={onCreateTx}>
        + Create NOVA Transaction
      </button>
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
      title: "⚖️ 50 / 50 Split",
      desc: "Pay half now to confirm the order. Pay the remaining half on delivery.",
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
  const modelLabels: Record<string, string> = { escrow: "Escrow Hold", split: "50/50 Split", upfront: "Full Upfront" };

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

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: theme.slate, marginBottom: 4 }}>Transaction</div>
            <div style={{ fontFamily: "sans-serif", fontWeight: 700, color: theme.teal, fontSize: 14 }}>NOVA-TX8823</div>
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
      </div>

      <button className="cta-btn" disabled={overall === 0} style={{ opacity: overall > 0 ? 1 : 0.4 }} onClick={() => setSubmitted(true)}>
        Submit Review
      </button>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
function AppContent() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("v") || "good";
  const vendor = vendors[vendorId] || vendors.good;

  const [screen, setScreen] = useState<string>("profile");
  const [txData, setTxData] = useState<TxData | null>(null);
  const [paymentModel, setPaymentModel] = useState<string>("");

  const screenTitles: Record<string, { title: string; sub: string; back: string | null }> = {
    profile: { title: "NOVA", sub: "Verified Commerce", back: null },
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

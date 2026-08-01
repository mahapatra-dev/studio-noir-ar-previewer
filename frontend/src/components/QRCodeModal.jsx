import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Generates a QR code pointing to this product's page so the user can
// scan it with their phone and open the AR "View in Your Space" experience there.
export default function QRCodeModal({ url, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }} onClick={onClose}>
      <div style={{ background: '#141416', padding: 32, borderRadius: 12, border: '1px solid #d4af37', textAlign: 'center' }}
        onClick={(e) => e.stopPropagation()}>
        <h3 style={{ color: '#d4af37' }}>Scan to View in AR</h3>
        <div style={{ background: '#fff', padding: 16, borderRadius: 8, display: 'inline-block' }}>
          <QRCodeSVG value={url} size={200} />
        </div>
        <p style={{ color: '#a8a49c', marginTop: 12 }}>Open your phone camera and scan this code</p>
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

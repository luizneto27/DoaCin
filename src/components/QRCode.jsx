// card pra exibir QR Code

import React from 'react';

function QRCode({ qrCodeUrl }) {
    return (
        <div className='qr-code-div' style={{ border: '1px solid gray', padding: '16px', margin: '8px', borderRadius: '8px' }}>
            <button className='button-qr-code' type='button' style={{ backgroundColor: 'white', border: '1px solid gray', padding: '16px', margin: '8px', borderRadius: '8px', color: 'rgba(235, 14, 14, 0.87)', cursor: 'pointer' }}>QR Code</button>
        </div>
    );
}

export default QRCode;
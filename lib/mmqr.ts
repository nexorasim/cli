
// lib/mmqr.ts

// CRC-16/CCITT-FALSE implementation (common for QR codes)
const crc16 = (data: string): string => {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
        }
    }
    return ('0000' + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
};

// Based on EMVCo-Merchant-Presented-QR-Specification
export const generateMMQRData = (orderId: string, price: number): string => {
    // A simplified MMQR template. Real implementation may vary.
    const templates = {
        // ID: 00, Payload Format Indicator
        f_00: '01',
        // ID: 01, Point of Initiation Method (12 for dynamic QR)
        f_01: '12',
        // ID: 29, Merchant Account Information (e.g., for a bank or wallet)
        // ID: 00, Globally Unique Identifier (example: A000000677010111)
        // ID: 01, Merchant Identifier (e.g., phone number)
        f_29_00: 'A000000677010111',
        f_29_01: '09650000172',
        // ID: 52, Merchant Category Code (e.g., 4814 for Telecom)
        f_52: '4814',
        // ID: 53, Transaction Currency (MMK code is 104)
        f_53: '104',
        // ID: 54, Transaction Amount
        f_54: price.toFixed(2),
        // ID: 58, Country Code (MM for Myanmar)
        f_58: 'MM',
        // ID: 59, Merchant Name
        f_59: 'eSIM Myanmar',
        // ID: 60, Merchant City
        f_60: 'Yangon',
        // ID: 62, Additional Data Field
        // ID: 01, Bill/Invoice Number (our orderId)
        f_62_01: orderId,
        // ID: 63, CRC
        f_63: '{{CRC}}',
    };

    const formatField = (id: string, value: string): string => id.padStart(2, '0') + value.length.toString().padStart(2, '0') + value;

    const merchantAccountInfo = formatField('00', templates.f_29_00) + formatField('01', templates.f_29_01);
    const additionalData = formatField('01', templates.f_62_01);

    const dataWithoutCrc = [
        formatField('00', templates.f_00),
        formatField('01', templates.f_01),
        formatField('29', merchantAccountInfo),
        formatField('52', templates.f_52),
        formatField('53', templates.f_53),
        formatField('54', templates.f_54),
        formatField('58', templates.f_58),
        formatField('59', templates.f_59),
        formatField('60', templates.f_60),
        formatField('62', additionalData),
        '6304' // CRC field ID and length placeholder
    ].join('');

    const crc = crc16(dataWithoutCrc);
    const finalData = dataWithoutCrc + crc;

    return finalData;
}

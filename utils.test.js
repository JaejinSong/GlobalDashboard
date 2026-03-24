import { describe, it, expect } from 'vitest';
import { 
    parseCurrency, 
    formatCurrency, 
    parseExcelDate, 
    normalizeCountry, 
    isCountryMatch 
} from './utils.js';

describe('utils.js', () => {
    describe('parseCurrency', () => {
        it('should parse numbers correctly', () => {
            expect(parseCurrency(1234.56)).toBe(1234.56);
            expect(parseCurrency(0)).toBe(0);
        });

        it('should parse currency strings correctly', () => {
            expect(parseCurrency('$1,234.56')).toBe(1234.56);
            expect(parseCurrency('₩1,234,567')).toBe(1234567);
            expect(parseCurrency('-123.45')).toBe(-123.45);
        });

        it('should return 0 for empty or invalid values', () => {
            expect(parseCurrency(null)).toBe(0);
            expect(parseCurrency('')).toBe(0);
            expect(parseCurrency('abc')).toBe(0);
        });
    });

    describe('formatCurrency', () => {
        it('should format USD correctly', () => {
            expect(formatCurrency(1234.56)).toBe('1,235'); // Math.round
        });

        it('should format KRW correctly', () => {
            expect(formatCurrency(1234567, true)).toBe('1,234,567');
        });
    });

    describe('parseExcelDate', () => {
        it('should handle Date objects', () => {
            const d = new Date();
            expect(parseExcelDate(d)).toBe(d);
        });

        it('should handle Excel serial numbers', () => {
            // 46024 is Jan 2nd or 3rd 2026 depending on TZ/Leap year bug handling
            const d = parseExcelDate(46024);
            expect(d.getFullYear()).toBe(2026);
            expect(d.getMonth()).toBe(0); // Jan
        });

        it('should handle date strings', () => {
            const d = parseExcelDate('2026-03-24');
            expect(d.getFullYear()).toBe(2026);
            expect(d.getMonth()).toBe(2); // Mar
        });
    });

    describe('normalizeCountry', () => {
        it('should normalize IDN to Indonesia', () => {
            expect(normalizeCountry('IDN')).toBe('Indonesia');
            expect(normalizeCountry('Indonesia')).toBe('Indonesia');
        });

        it('should normalize USA variations', () => {
            expect(normalizeCountry('USA')).toBe('USA');
            expect(normalizeCountry('United States')).toBe('USA');
            expect(normalizeCountry('미국')).toBe('USA');
        });

        it('should return other countries as is (trimmed)', () => {
            expect(normalizeCountry(' Brazil ')).toBe('Brazil');
        });
    });

    describe('isCountryMatch', () => {
        const row = { 'Country': 'IDN' };
        it('should match All', () => {
            expect(isCountryMatch(row, 'All')).toBe(true);
            expect(isCountryMatch(row, null)).toBe(true);
        });

        it('should match normalized country', () => {
            expect(isCountryMatch(row, 'Indonesia')).toBe(true);
            expect(isCountryMatch(row, 'USA')).toBe(false);
        });
    });
});

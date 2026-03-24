import { describe, it, expect } from 'vitest';
import { 
    getOrderSheetStats, 
    getPipelineStats, 
    getPartnerStats, 
    getGenericCountryStats 
} from './services.js';

describe('services.js', () => {
    describe('getOrderSheetStats', () => {
        const mockData = [
            { 'Local TCV': '$1,000', 'KORTCV': '$1,000', 'KORARR': '$1,000', 'KORMRR': '$83', 'CONTRACTSTART': 46024, 'Country': 'Indonesia' },
            { 'Local TCV': '$2,000', 'KORTCV': '$2,000', 'KORARR': '$2,000', 'KORMRR': '$167', 'CONTRACTSTART': '2026-02-01', 'Country': 'USA' }
        ];

        it('should calculate stats correctly for All countries', () => {
            const stats = getOrderSheetStats(mockData, 'All', 'ORDER SHEET', {});
            expect(stats.sumLocalTcv).toBe(3000);
            expect(stats.sumKorTcv).toBe(3000);
            expect(stats.dealCount).toBe(2);
            expect(stats.qSums['Q1']).toBe(3000); // Jan and Feb are in Q1
        });

        it('should filter by country correctly', () => {
            const stats = getOrderSheetStats(mockData, 'Indonesia', 'ORDER SHEET', {});
            expect(stats.sumLocalTcv).toBe(1000);
            expect(stats.dealCount).toBe(1);
        });
    });

    describe('getPipelineStats', () => {
        const mockPData = [
            { 'Amount': '$10,000', 'Weighted Amount': '$5,000', 'Country': 'IDN', 'Quarter': '2026 Q1', 'Deal Name': 'Deal 1', 'Created Date': '2026-01-10' },
            { 'Amount': '$20,000', 'Weighted Amount': '$10,000', 'Country': 'Malaysia', 'Quarter': '2026 Q2', 'Deal Name': 'Deal 2', 'Created Date': '2026-04-10' }
        ];

        it('should calculate pipeline stats correctly', () => {
            const stats = getPipelineStats(mockPData);
            expect(stats.globalTotalAmount).toBe(30000);
            expect(stats.globalTotalWeighted).toBe(15000);
            expect(stats.pipelineByCountry['Indonesia'].amount).toBe(10000);
            // pipelineByQuarter['Q1'] has countries and deals
            expect(stats.pipelineByQuarter['Q1'].countries['Indonesia'].amount).toBe(10000);
            expect(stats.pipelineByQuarter['Q2'].countries['Malaysia'].amount).toBe(20000);
            expect(stats.pipelineByQuarter['Q1'].deals.length).toBe(1);
        });
    });

    describe('getPartnerStats', () => {
        const mockData = [
            { 'Country': 'Indonesia', 'Partner Name': 'Partner A' },
            { 'Country': 'Malaysia', 'Partner Name': 'Partner B' }
        ];
        const mockWorkbook = { 'POC': [] };

        it('should group partners by country', () => {
            const stats = getPartnerStats(mockData, 'All', mockWorkbook);
            expect(stats.counts['Indonesia']).toBe(1);
            expect(stats.counts['Malaysia']).toBe(1);
        });
    });

    describe('getGenericCountryStats', () => {
        const mockData = [
            { 'Country': 'IDN', 'CONTRACTSTART': '2026-01-01' },
            { 'Country': 'Indonesia', 'CONTRACTSTART': '2025-01-01' }
        ];

        it('should count countries and group by year', () => {
            const stats = getGenericCountryStats(mockData, 'All');
            expect(stats.yearlyCounts['2026']['Indonesia']).toBe(1);
            expect(stats.yearlyCounts['2025']['Indonesia']).toBe(1);
        });
    });
});

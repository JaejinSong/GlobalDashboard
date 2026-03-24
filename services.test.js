import { describe, it, expect } from 'vitest';
import { 
    getOrderSheetStats, 
    getPipelineStats, 
    getPartnerStats, 
    getGenericCountryStats,
    getExpiringContractsStats,
    getServiceAnalysisStats,
    getEventStats,
    getPocStats
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

    describe('getExpiringContractsStats', () => {
        const mockData = [
            { 'CRM Deal Name': 'Deal A', 'Contract End': '2026-04-01', 'Client': 'Client A' }, // Expires soon
            { 'CRM Deal Name': 'Deal B', 'Contract End': '2026-08-01', 'Client': 'Client B' }, // Expires later
            { 'CRM Deal Name': 'Deal C', 'Contract End': '2026-03-01', 'Client': 'Client C' }  // Already expired (before Mar 18)
        ];

        it('should identify contracts expiring within 3 months', () => {
            const stats = getExpiringContractsStats(mockData);
            // Mar 18 to Jun 18 is the range
            expect(stats.length).toBe(1);
            expect(stats[0].name).toBe('Deal A');
        });
    });

    describe('getServiceAnalysisStats', () => {
        const mockData = [
            { 'Status': 'Active', 'Services': 'WhaTap Monitoring', 'End User': 'User A', 'Country': 'KR', 'TCV Amount': '$1000' },
            { 'Status': 'Active', 'Services': 'WhaTap Monitoring, DB Monitoring', 'End User': 'User B', 'Country': 'ID', 'TCV Amount': '$2000' }
        ];

        it('should analyze service combinations', () => {
            const stats = getServiceAnalysisStats(mockData);
            expect(stats.totalCustomers).toBe(2);
            expect(stats.singleServiceCustomers).toBe(1);
            expect(stats.multiServiceCustomers).toBe(1);
            expect(stats.sortedCombos[0][0]).toBe('DB Monitoring + WhaTap Monitoring');
        });
    });

    describe('getEventStats', () => {
        const mockData = [
            { 'Event Name': 'Event A', 'Country': 'Global', 'Date': '2026-01-01', 'Total Spending': '$5000', 'POC Generated': 10, 'Deal Converted': 2 },
            { 'Event Name': 'Event B', 'Country': 'KR', 'Date': '2026-02-01', 'Total Spending': '$3000', 'POC Generated': 5, 'Deal Converted': 1 }
        ];

        it('should calculate event ROI stats', () => {
            const stats = getEventStats(mockData, 'All');
            expect(stats.totalSpending).toBe(8000);
            expect(stats.totalPOC).toBe(15);
            expect(stats.totalDeals).toBe(3);
            expect(stats.costPerPOC).toBeCloseTo(8000 / 15);
        });
    });

    describe('getPocStats', () => {

        const mockPData = [
            { 'CRM POC Name': 'POC 1', 'Country': 'Indonesia', 'Partner': 'Partner A', 'Current Status': 'Running', 'Working Days': '120', 'Estimated Value(KOR TCV USD)': '$10,000', 'POC Start': '2026-01-01' }
        ];
        const mockWorkbook = {
            'Sheet9': [
                { 'CRM POC Name': 'POC 1', 'Notes': 'Some important note' }
            ]
        };
        const filters = { country: 'All', industry: 'All', partner: 'All' };

        it('should correctly merge data and calculate stats', () => {
            const { stats } = getPocStats(mockPData, filters, mockWorkbook);
            expect(stats.longTermCount).toBe(1); // 120 days >= 100
            expect(stats.statusStats.running).toBe(1);
            expect(stats.runningList[0].name).toBe('POC 1');
            expect(stats.runningList[0].notes).toBe('Some important note');
            expect(stats.influxData[0].estimated).toBe(10000); // Jan
        });

        it('should filter POC data correctly', () => {
            const filtersIDN = { country: 'Indonesia', industry: 'All', partner: 'All' };
            const { stats } = getPocStats(mockPData, filtersIDN, mockWorkbook);
            expect(stats.runningList.length).toBe(1);

            const filtersUSA = { country: 'USA', industry: 'All', partner: 'All' };
            const { stats: statsUSA } = getPocStats(mockPData, filtersUSA, mockWorkbook);
            expect(statsUSA.runningList.length).toBe(0);
        });
    });
});



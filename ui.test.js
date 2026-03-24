import { describe, it, expect } from 'vitest';
import * as UI from './ui/index.js';

describe('UI Component Templates', () => {
    describe('Common Components', () => {
        it('should render a metric card', () => {
            const html = UI.renderMetricCard('Test Title', '$1,000', 'fa-test', 'test-class');
            expect(html).toContain('Test Title');
            expect(html).toContain('$1,000');
            expect(html).toContain('fa-test');
            expect(html).toContain('test-class');
        });

        it('should render a section header', () => {
            const html = UI.renderSectionHeader('Section Title', 'Sub text');
            expect(html).toContain('Section Title');
            expect(html).toContain('Sub text');
        });
    });

    describe('Ordersheet UI', () => {
        it('should render ordersheet HTML structure', () => {
            const mockStats = {
                sumLocalTcv: 1000,
                sumKorTcv: 1100,
                sumArr: 500,
                sumMrr: 40,
                dealCount: 5,
                yearlyTcv: {},
                qSums: { 'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0 }
            };
            const html = UI.getOrderSheetHTML(mockStats);
            expect(html).toContain('ACCUMULATED TCV');
            expect(html).toContain('1,000');
            expect(html).toContain('1,100');
        });
    });


    describe('KPI UI', () => {
        it('should render KPI table', () => {
            const mockData = [
                {
                    id: 'kpi-1',
                    category: 'Sales',
                    objective: 'Revenue',
                    indicator: 'Annual Sales',
                    target: 1000000,
                    achievement: 500000,
                    weight: 100
                }
            ];
            const html = UI.getKPIHTML(mockData);
            expect(html).toContain('Sales');
            expect(html).toContain('Revenue');
            expect(html).toContain('50.0%');
        });
    });
});


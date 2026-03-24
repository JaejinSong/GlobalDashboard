/**
 * ui/partner.js - Partner network dashboard components
 */
import { formatCurrency } from '../utils.js';

/**
 * Returns HTML for the partner network dashboard.
 * @param {Object} stats - Partner stats
 * @returns {string}
 */
export function getPartnerHTML(stats) {
    if (!stats) return '';
    
    const partnerItemsHtml = stats.sortedPartners.slice(0, 8).map(([p, count]) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #F9FAFB; border-radius: 8px; border-left: 3px solid #6366f1;">
            <span style="font-weight: 700; color: #374151; font-size: 0.78rem;">${p}</span>
            <div style="background: rgba(99, 102, 241, 0.15); color: #6366f1; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 0.75rem;">${count} POCs</div>
        </div>
    `).join('');

    return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 24px;">
            <div class="stat-card" style="padding: 24px; background: #FFF; border-top: 4px solid #6366f1; flex-direction: column; align-items: stretch;">
                <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
                    <div class="stat-icon" style="background: rgba(99, 102, 241, 0.1); color: #6366f1; width: 42px; height: 42px; border-radius: 10px;"><i class="fa-solid fa-handshake"></i></div>
                    <h2 style="font-size: 1.1rem; font-weight: 800; color: #111827; margin: 0;">Top Partners by POC Volume</h2>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    ${partnerItemsHtml}
                </div>
            </div>
            <div class="stat-card" style="padding: 24px; background: #FFF; border-top: 4px solid #10b981; flex-direction: column; align-items: stretch;">
                <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
                    <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981; width: 42px; height: 42px; border-radius: 10px;"><i class="fa-solid fa-chart-column"></i></div>
                    <h2 style="font-size: 1.1rem; font-weight: 800; color: #111827; margin: 0;">POC Performance Distribution</h2>
                </div>
                <div style="height: 250px; position: relative;"><canvas id="partner-poc-chart"></canvas></div>
            </div>
        </div>
    `;
}

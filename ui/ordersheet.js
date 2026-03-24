/**
 * ui/ordersheet.js - Ordersheet dashboard components
 */
import { formatCurrency } from '../utils.js';

/**
 * Returns HTML for the ordersheet dashboard.
 * @param {Object} stats - Ordersheet stats
 * @returns {string}
 */
export function getOrderSheetHTML(stats) {
    if (!stats) return '';
    return `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
            <div class="stat-card" style="border-left: 5px solid #0ea5e9; background:#FFF; padding:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <h3 style="color:#0ea5e9; font-size:0.75rem; font-weight:700;">ACCUMULATED TCV</h3>
                <h2 style="font-size:1.6rem; font-weight:800;">${formatCurrency(stats.sumLocalTcv)}</h2>
                <div style="font-size: 0.75rem; color: #6B7280;">${stats.dealCount} Deals Total</div>
            </div>
            <div class="stat-card" style="border-left: 5px solid #6366f1; background:#FFF; padding:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <h3 style="color:#6366f1; font-size:0.75rem; font-weight:700;">ACCUMULATED KTCV</h3>
                <h2 style="font-size:1.6rem; font-weight:800;">US$ ${formatCurrency(stats.sumKorTcv)}</h2>
            </div>
            <div class="stat-card" style="grid-column: 1 / -1; border-left: 5px solid #8b5cf6; background:#FFF; padding:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <h3 style="color:#8b5cf6; font-size:0.75rem; font-weight:700;">ARR & MRR PERFORMANCE</h3>
                <div style="display: flex; gap: 60px;">
                    <div><span style="font-size: 0.7rem; color: #6B7280;">ACCUMULATED ARR</span><h2 style="font-size:1.6rem; font-weight:800;">US$ ${formatCurrency(stats.sumArr)}</h2></div>
                    <div><span style="font-size: 0.7rem; color: #6B7280;">ACCUMULATED MRR</span><h2 style="font-size:1.6rem; font-weight:800;">US$ ${formatCurrency(stats.sumMrr)}</h2></div>
                </div>
            </div>
            <div class="stat-card" style="background:#FFF; padding:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-left: 5px solid #f59e0b;">
                <h3 style="color:#f59e0b; font-size:0.75rem; font-weight:700;">QUARTERLY TCV (2026)</h3>
                <div style="height:180px; position:relative;"><canvas id="quarterly-tcv-bar"></canvas></div>
            </div>
            <div class="stat-card" style="background:#FFF; padding:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-left: 5px solid #10b981;">
                <h3 style="color:#10b981; font-size:0.75rem; font-weight:700;">YEARLY TCV GROWTH</h3>
                <div style="height:180px; position:relative;"><canvas id="tcv-growth-chart"></canvas></div>
            </div>
        </div>
    `;
}

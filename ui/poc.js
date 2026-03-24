/**
 * ui/poc.js - POC dashboard components
 */
import { formatCurrency } from '../utils.js';

/**
 * Returns HTML for the POC dashboard.
 * @param {Object} stats - POC stats
 * @param {Object} filters - Current filters
 * @param {Object} uniqueValues - Unique filter values
 * @returns {string}
 */
export function getPocHTML(stats, filters, uniqueValues) {
    if (!stats) return '';
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTableRows = months.map((m, i) => {
        const newCount = stats.influxData[i].count;
        const estVal = stats.influxData[i].estimated;
        const wVal = stats.influxData[i].weighted;
        return `
            <tr style="border-bottom: 1px solid #F3F4F6;">
                <td style="padding: 10px; color: #374151; font-weight: 600;">${m}</td>
                <td style="padding: 10px; text-align: center; color: #10b981; font-weight: 700; background: rgba(16, 185, 129, 0.05);">${newCount}</td>
                <td style="padding: 10px; text-align: right; color: #007AFF; font-weight: 600;">$${formatCurrency(estVal)}</td>
                <td style="padding: 10px; text-align: right; color: #6366f1; font-weight: 600;">$${formatCurrency(wVal)}</td>
            </tr>`;
    }).join('');

    return `
        <div class="stat-card" style="display:flex; flex-wrap: wrap; gap: 20px; padding: 18px; background: #FFFFFF; border: 1px solid #F3F4F6; margin-bottom: 24px;">
            <div style="display:flex; flex-direction:column; gap:8px;">
                <label style="font-size:0.8rem; color: #6B7280; font-weight:600; text-transform: uppercase;"><i class="fa-solid fa-earth-americas" style="margin-right: 6px;"></i>Country</label>
                <select id="poc-filter-country" style="background:#F9FAFB; color:#111827; border:1px solid #334155; padding:8px 12px; border-radius:6px; width: 180px;">
                    ${Array.from(uniqueValues.countries).map(c => `<option value="${c}" ${filters.country === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
                <label style="font-size:0.8rem; color: #6B7280; font-weight:600; text-transform: uppercase;"><i class="fa-solid fa-industry" style="margin-right: 6px;"></i>Industry</label>
                <select id="poc-filter-industry" style="background:#F9FAFB; color:#111827; border:1px solid #334155; padding:8px 12px; border-radius:6px; width: 240px;">
                    ${Array.from(uniqueValues.industries).map(c => `<option value="${c}" ${filters.industry === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
                <label style="font-size:0.8rem; color: #6B7280; font-weight:600; text-transform: uppercase;"><i class="fa-solid fa-handshake" style="margin-right: 6px;"></i>Partner</label>
                <select id="poc-filter-partner" style="background:#F9FAFB; color:#111827; border:1px solid #334155; padding:8px 12px; border-radius:6px; width: 180px;">
                    ${Array.from(uniqueValues.partners).map(c => `<option value="${c}" ${filters.partner === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="stat-card highlight-card" style="background: #EBF4FF; border: 1px solid rgba(0,122,255,0.2); padding: 24px; border-left: 5px solid #007AFF;" id="poc-card-running">
                <div class="stat-icon" style="background: rgba(0, 122, 255, 0.15); color: #007AFF; width: 56px; height: 56px; font-size: 1.5rem;"><i class="fa-solid fa-play"></i></div>
                <div>
                    <h3 style="color: #007AFF; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Total Running POCs</h3>
                    <h2 style="color: #111827; font-size: 2.2rem; font-weight: 800; margin: 0;">${stats.statusStats.running} <span style="font-size: 1rem; font-weight: 400; opacity: 0.7;">Companies</span></h2>
                </div>
            </div>
            <div class="stat-card" style="padding: 24px; border-left: 5px solid #10b981;">
                <div class="stat-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981; width: 56px; height: 56px; font-size: 1.5rem;"><i class="fa-solid fa-check-double"></i></div>
                <div>
                    <h3 style="color: #10b981; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Won Deals</h3>
                    <h2 style="color: #111827; font-size: 2.2rem; font-weight: 800; margin: 0;">${stats.statusStats.won}</h2>
                </div>
            </div>
            <div class="stat-card" style="padding: 24px; border-left: 5px solid #ef4444;">
                <div class="stat-icon" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; width: 56px; height: 56px; font-size: 1.5rem;"><i class="fa-solid fa-xmark"></i></div>
                <div>
                    <h3 style="color: #ef4444; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Lost / Canceled</h3>
                    <h2 style="color: #111827; font-size: 2.2rem; font-weight: 800; margin: 0;">${stats.statusStats.lost}</h2>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div class="stat-card" style="padding: 24px; background: #FFF; flex-direction: column; align-items: stretch;">
                <h3 style="font-size: 1rem; color: #111827; font-weight: 800; margin-bottom: 20px; border-bottom: 2px solid #F3F4F6; padding-bottom: 12px;"><i class="fa-solid fa-chart-line" style="margin-right: 10px; color: #10b981;"></i>2026 Monthly POC Influx</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #F9FAFB;">
                            <th style="padding: 12px; text-align: left; font-size: 0.7rem; color: #6B7280;">MONTH</th>
                            <th style="padding: 12px; text-align: center; font-size: 0.7rem; color: #6B7280;">NEW POCs</th>
                            <th style="padding: 12px; text-align: right; font-size: 0.7rem; color: #6B7280;">ESTIMATED</th>
                            <th style="padding: 12px; text-align: right; font-size: 0.7rem; color: #6B7280;">WEIGHTED</th>
                        </tr>
                    </thead>
                    <tbody>${monthlyTableRows}</tbody>
                </table>
            </div>
            <div class="stat-card" style="padding: 24px; background: #FFF; flex-direction: column; align-items: stretch;">
                <h3 style="font-size: 1rem; color: #111827; font-weight: 800; margin-bottom: 20px; border-bottom: 2px solid #F3F4F6; padding-bottom: 12px;"><i class="fa-solid fa-chart-pie" style="margin-right: 10px; color: #6366f1;"></i>Status Distribution</h3>
                <div style="height: 300px; position: relative;"><canvas id="poc-status-chart"></canvas></div>
            </div>
        </div>
        <div id="poc-hover-tooltip" style="position:fixed; display:none; background:white; border:1px solid #10b981; border-radius:8px; padding:12px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1); z-index:1000; width:250px;"></div>
    `;
}

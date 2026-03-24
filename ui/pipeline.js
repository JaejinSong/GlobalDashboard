/**
 * ui/pipeline.js - Pipeline dashboard components and tooltip logic
 */
import { formatCurrency, sortCountriesByAmount } from '../utils.js';
import { CONFIG } from '../config.js';

/**
 * Returns HTML for the pipeline dashboard.
 * @param {Object} stats - Pipeline stats
 * @param {string|null} filterCountry - Selected country
 * @param {string} tabName - Current tab name
 * @returns {string}
 */
export function getPipelineHTML(stats, filterCountry, tabName) {
    if (!stats) return '';
    
    const pipelineItemsHtml = stats.sortedPipeline.map(([country, values]) => `
        <div style="display: flex; flex-direction: column; padding: 10px; background: #F9FAFB; border-radius: 8px; border-left: 3px solid #10b981;">
            <span style="font-weight: 700; color: #374151; font-size: 0.8rem; margin-bottom: 6px;">${filterCountry ? 'Total Summary' : country}</span>
            <div style="display: flex; justify-content: space-between; font-size: 0.72rem; margin-bottom: 2px;">
                <span style="color: var(--text-muted);">PIPELINE</span>
                <span style="color: #34C759; font-weight: 600;">$${formatCurrency(values.amount)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.72rem;">
                <span style="color: var(--text-muted);">WEIGHTED</span>
                <span style="color: #007AFF; font-weight: 600;">$${formatCurrency(values.weighted)}</span>
            </div>
        </div>
    `).join('');

    const quarterlyItemsHtml = stats.sortedQuarterly.map(([q, qData]) => {
        const countryEntries = Object.entries(qData.countries);
        const qTotalAmount = countryEntries.reduce((acc, curr) => acc + curr[1].amount, 0);
        const qTotalWeighted = countryEntries.reduce((acc, curr) => acc + curr[1].weighted, 0);

        const countryBreakdown = countryEntries
            .sort(sortCountriesByAmount)
            .map(([country, values]) => `
                <div style="margin-top: 8px; padding: 6px; background: rgba(255, 255, 255, 0.03); border-radius: 4px; border: 1px solid #F3F4F6;">
                    <div style="font-weight: 600; color: #111827; font-size: 0.72rem; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                        <i class="fa-solid fa-location-dot" style="font-size: 0.6rem; color: #34C759;"></i> ${filterCountry ? 'Total' : country}
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.68rem; margin-bottom: 2px;">
                        <span style="color: var(--text-muted);">PIPELINE</span>
                        <span style="color: #34C759;">$${formatCurrency(values.amount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.68rem;">
                        <span style="color: var(--text-muted);">WEIGHTED</span>
                        <span style="color: #007AFF;">$${formatCurrency(values.weighted)}</span>
                    </div>
                </div>
            `).join('');

        const dealListJson = JSON.stringify(qData.deals.slice(0, 50).map(d => ({ n: d.name, a: formatCurrency(d.amount) })));

        return `
            <div class="quarter-card" 
                 data-q="${q}" 
                 data-deals='${dealListJson.replace(/'/g, "&apos;")}'
                 style="display: flex; flex-direction: column; padding: 12px; background: #F9FAFB; border-radius: 8px; border-top: 3px solid #10b981; cursor: pointer; transition: all 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px;">
                    <span style="font-weight: 800; color: #111827; font-size: 0.9rem; margin-top: 2px;">${q}</span>
                    <div style="text-align: right; display: flex; flex-direction: column; gap: 3px;">
                        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 8px;">
                            <span style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">PIPELINE</span>
                            <span style="font-size: 0.95rem; color: #34C759; font-weight: 800;">$${formatCurrency(qTotalAmount)}</span>
                        </div>
                        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 8px;">
                            <span style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">WEIGHTED</span>
                            <span style="font-size: 0.95rem; color: #34C759; font-weight: 800;">$${formatCurrency(qTotalWeighted)}</span>
                        </div>
                    </div>
                </div>
                ${!filterCountry ? `
                <div style="background: rgba(0,0,0,0.15); border-radius: 10px; padding: 12px; margin-top: 10px;">
                    <div style="max-height: 150px; overflow-y: auto; padding-right: 2px;">
                        ${countryBreakdown}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }).join('');

    return `
        <div style="padding: 24px; background: #EDFAF1; border-radius: 16px; border: 1px solid rgba(16, 185, 129, 0.15); display: flex; flex-direction: column; gap: 24px;">
            ${tabName === 'PIPELINE' ? `
            <div class="stat-card" style="display:flex; align-items:center; gap:15px; padding: 14px 20px; background: #FFFFFF; border: 1px solid rgba(16, 185, 129, 0.2); border-left: 4px solid #10b981; margin-bottom: 4px;">
                <label style="font-size:0.85rem; color:#34C759; font-weight:700; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-earth-americas" style="margin-right: 10px;"></i>Select Country</label>
                <select id="pipeline-filter-country" style="background:#F9FAFB; color:#111827; border:1px solid #334155; padding:8px 16px; border-radius:8px; width: 220px; font-family: 'Inter', sans-serif; cursor: pointer; font-weight: 500;">
                    ${['All', ...CONFIG.COUNTRIES].map(c => `<option value="${c}" ${(filterCountry || 'All') === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
                <span style="font-size: 0.75rem; color: var(--text-secondary); margin-left: auto;">Showing pipeline metrics for ${filterCountry || 'All Regions'}</span>
            </div>
            ` : ''}

            <div style="background: rgba(52,199,89,0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 16px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div class="stat-icon" style="width: 45px; height: 45px; font-size: 1.3rem; background: rgba(16, 185, 129, 0.2); color: #34C759;"><i class="fa-solid fa-globe"></i></div>
                    <div>
                        <h2 style="font-size: 1.2rem; font-weight: 700; color: #111827; margin: 0;">${filterCountry ? 'Total Pipeline' : 'Global Total Pipeline'}</h2>
                        <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 2px 0 0 0;">${filterCountry ? 'Aggregated metrics' : 'Aggregated metrics across all regions'}</p>
                    </div>
                </div>
                <div style="display: flex; gap: 30px; text-align: right;">
                    <div>
                        <span style="font-size: 0.75rem; color: #34C759; text-transform: uppercase; letter-spacing: 0.05em;">PIPELINE</span>
                        <h2 style="font-size: 1.4rem; font-weight: 800; color: #111827; margin: 0;">US$ ${formatCurrency(stats.globalTotalAmount)}</h2>
                    </div>
                    <div>
                        <span style="font-size: 0.75rem; color: #007AFF; text-transform: uppercase; letter-spacing: 0.05em;">WEIGHTED</span>
                        <h2 style="font-size: 1.4rem; font-weight: 800; color: #111827; margin: 0;">US$ ${formatCurrency(stats.globalTotalWeighted)}</h2>
                    </div>
                </div>
            </div>

            ${!filterCountry ? `
            <div>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div class="stat-icon" style="width: 36px; height: 36px; font-size: 1rem; background: rgba(16, 185, 129, 0.15); color: #34C759;"><i class="fa-solid fa-earth-americas"></i></div>
                    <h2 style="font-size: 1rem; font-weight: 600; color: #111827;">Pipeline by Country</h2>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
                    ${pipelineItemsHtml}
                </div>
            </div>
            ` : ''}

            <div style="border-top: 1px solid #E5E7EB; pt: 20px; margin-top: 4px; padding-top: 16px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div class="stat-icon" style="width: 36px; height: 36px; font-size: 1rem; background: rgba(20, 184, 166, 0.15); color: #14b8a6;"><i class="fa-solid fa-calendar-quarter"></i></div>
                    <h2 style="font-size: 1rem; font-weight: 600; color: #111827;">Pipeline by Quarter (Expected Close)</h2>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
                    ${quarterlyItemsHtml}
                </div>
                <div id="pipeline-selected-quarter-container" style="margin-top: 24px; display: none;"></div>
            </div>
            <div id="pipeline-quarter-tooltip" class="pipeline-tooltip" style="width: 280px; pointer-events: none;"></div>
        </div>
    `;
}

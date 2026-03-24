/**
 * ui/common.js - Shared UI fragments and small utility components
 */
import { formatCurrency, sortCountriesByCount } from '../utils.js';

/**
 * Returns HTML for the generic country summary card.
 * @param {Object} stats - Stats object
 * @param {string|null} filterCountry - Selected country
 * @returns {string}
 */
export function getGenericCountryHTML(stats, filterCountry) {
    if (!stats) return '';
    const totalHtml = stats.sortedTotal.map(([c, count]) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(0,0,0,0.05); border-radius:6px;">
            <span style="font-size:0.75rem; color:#4B5563;"><i class="fa-solid fa-earth-americas" style="margin-right:6px;"></i>${filterCountry ? 'Total Deals' : c}</span>
            <span style="font-weight:700; color:#111827;">${count}</span>
        </div>
    `).join('');

    let yearlyHtml = '';
    stats.sortedYears.forEach(y => {
        const items = Object.entries(stats.yearlyCounts[y]).sort(sortCountriesByCount).map(([c, count]) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px solid #F9FAFB;">
                <span style="font-size:0.75rem; color:#6B7280;">${filterCountry ? 'Deals' : c}</span>
                <span style="font-size:0.75rem; font-weight:600; color:#374151;">${count}</span>
            </div>
        `).join('');
        yearlyHtml += `<div style="margin-top:12px; border-top:1px solid #F3F4F6; padding-top:8px;"><h4 style="font-size:0.75rem; font-weight:800; color:#6366f1; margin-bottom:4px; text-transform:uppercase;">${y} PERFORMANCE</h4>${items}</div>`;
    });

    return `
        <div class="stat-card" style="padding:20px; background:#FFF; border:1px solid #F3F4F6; max-width:400px; display:block; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                <div class="stat-icon" style="background:rgba(99,102,241,0.1); color:#6366f1; width:36px; height:36px; font-size:1rem;"><i class="fa-solid fa-handshake"></i></div>
                <div class="stat-details"><h3 style="margin:0; font-size:0.8rem; color:#6B7280;">CLOSED DEALS</h3><h2 style="margin:0; font-size:0.95rem; font-weight:700; color:#111827;">Summary by Country/Year</h2></div>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:8px;">${totalHtml}</div>
            <div style="max-height:220px; overflow-y:auto; margin-top:12px; padding-right:4px;">${yearlyHtml}</div>
        </div>
    `;
}

/**
 * Returns HTML for expiring contracts list.
 * @param {Array} stats - List of expiring contracts
 * @returns {string}
 */
export function getExpiringContractsHTML(stats) {
    if (!stats || stats.length === 0) return '';
    const items = stats.slice(0, 5).map(d => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(239, 68, 68, 0.08); border-radius: 10px; border-left: 4px solid #ef4444; margin-bottom: 8px; transition: transform 0.2s;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='translateX(0)'">
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <span style="font-size: 0.9rem; font-weight: 700; color: #111827;">${d.name}</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 0.75rem; color: #DC2626; font-weight: 500;"><i class="fa-regular fa-calendar-alt"></i> End: ${d.date}</span>
                    ${d.year ? `<span style="font-size: 0.7rem; background: rgba(239, 68, 68, 0.15); color: #B91C1C; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${d.year} Yr</span>` : ''}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.65rem; font-weight: 800; color: #ef4444; text-transform: uppercase; background: rgba(239, 68, 68, 0.1); padding: 4px 8px; border-radius: 6px; letter-spacing: 0.05em;">Expiring Soon</span>
                <i class="fa-solid fa-chevron-right" style="color: #ef4444; font-size: 0.7rem; opacity: 0.5;"></i>
            </div>
        </div>
    `).join('');

    return `
        <div class="stat-card" style="display: flex; flex-direction: column; align-items: stretch; padding: 24px; border: 1px solid rgba(239, 68, 68, 0.2); background: #FFF; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.05); border-radius: 12px;">
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px; border-bottom: 2px solid #FEF2F2; padding-bottom: 12px;">
                <div class="stat-icon" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-clock-rotate-left"></i></div>
                <div class="stat-details">
                    <h3 style="margin:0; font-size: 0.8rem; color: #ef4444; font-weight:800; text-transform:uppercase; letter-spacing: 0.05em;">EXPIRING SOON</h3>
                    <h2 style="font-size: 1.1rem; font-weight: 800; color: #111827; margin: 0;">Contracts Renewals (Within 3 Months)</h2>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px;">
                ${items}
            </div>
            ${stats.length > 5 ? `<div style="text-align: center; font-size: 0.75rem; color: #ef4444; margin-top: 12px; font-weight: 600; cursor: pointer; padding: 8px; border-radius: 8px; background: rgba(239, 68, 68, 0.05);"><i class="fa-solid fa-plus-circle"></i> View ${stats.length - 5} more expiring contracts</div>` : ''}
        </div>
    `;
}

/**
 * Empty state HTML.
 * @returns {string}
 */
export function getEmptyStateHTML() {
    return `
        <div id="empty-state" style="padding: 60px; text-align: center; color: #94A3B8;">
            <i class="fa-solid fa-database" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.3;"></i>
            <p>No data selected or tab is empty.</p>
        </div>
    `;
}

/**
 * Renders a standard metric card.
 */
export function renderMetricCard(title, value, icon, className = '') {
    return `
        <div class="stat-card ${className}" style="padding:20px; background:#FFF; border:1px solid #F3F4F6; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <div style="display:flex; align-items:center; gap:12px;">
                <div class="stat-icon" style="background:rgba(99,102,241,0.1); color:#6366f1; width:36px; height:36px; font-size:1rem;"><i class="fa-solid ${icon}"></i></div>
                <div class="stat-details">
                    <h3 style="margin:0; font-size:0.8rem; color:#6B7280;">${title}</h3>
                    <h2 style="margin:0; font-size:1.2rem; font-weight:700; color:#111827;">${value}</h2>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renders a section header.
 */
export function renderSectionHeader(title, subtext) {
    return `
        <div style="margin-bottom: 24px; border-bottom: 2px solid #F3F4F6; padding-bottom: 12px;">
            <h2 style="font-size: 1.25rem; font-weight: 800; color: #1E293B; margin: 0 0 4px 0;">${title}</h2>
            <p style="font-size: 0.875rem; color: #64748B; margin: 0;">${subtext}</p>
        </div>
    `;
}


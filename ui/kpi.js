/**
 * ui/kpi.js - KPI dashboard components
 */

/**
 * Returns HTML for the KPI dashboard.
 * @param {Array} kpiData - KPI data
 * @returns {string}
 */
export function getKPIHTML(kpiData) {
    if (!kpiData) return '';
    
    let tableHtml = '';
    const categories = [...new Set(kpiData.map(item => item.category))];

    categories.forEach(cat => {
        const catRows = kpiData.filter(item => item.category === cat);
        catRows.forEach((item, index) => {
            const isFirst = index === 0;
            const achieveRate = (item.achievement / item.target) * 100 || 0;
            const rateColor = achieveRate >= 100 ? '#10b981' : (achieveRate >= 80 ? '#f59e0b' : '#ef4444');
            
            tableHtml += `
            <tr class="kpi-row" data-id="${item.id}">
                ${isFirst ? `<td rowspan="${catRows.length}" class="kpi-cat-cell" style="background: #1E293B;">${cat}</td>` : ''}
                <td class="kpi-objective">${item.objective}</td>
                <td class="kpi-indicator">${item.indicator}</td>
                <td style="width: 120px;">
                    <input type="text" class="kpi-target-input" value="${item.target}" data-field="target">
                </td>
                <td style="width: 120px;">
                    <input type="text" class="kpi-achieve-input" value="${item.achievement}" data-field="achievement">
                </td>
                <td class="kpi-weight">${item.weight}%</td>
                <td class="kpi-rate" style="color: ${rateColor}">${achieveRate.toFixed(1)}%</td>
            </tr>`;
        });
    });

    return `
        <div class="kpi-container">
            <div class="kpi-actions">
                <button class="btn-kpi btn-reset" id="kpi-reset"><i class="fa-solid fa-rotate-left"></i> Reset Defaults</button>
                <button class="btn-kpi btn-export" id="kpi-export"><i class="fa-solid fa-file-export"></i> Export PDF</button>
                <button class="btn-kpi btn-save" id="kpi-save"><i class="fa-solid fa-floppy-disk"></i> Save Changes</button>
            </div>
            <table class="kpi-table">
                <thead class="kpi-header">
                    <tr>
                        <th style="width: 60px;">Category</th>
                        <th>Objective</th>
                        <th>Key Indicator</th>
                        <th>Target</th>
                        <th>Achievement</th>
                        <th style="width: 80px;">Weight</th>
                        <th style="width: 100px;">Rate</th>
                    </tr>
                </thead>
                <tbody>${tableHtml}</tbody>
            </table>
        </div>
    `;
}

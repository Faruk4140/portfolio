/**
 * ============================================================================
 * FARUK SAYYAD - PORTFOLIO ANALYTICS DASHBOARD ENGINE
 * Interactive Data Processing, KPI Computation & Dynamic Chart Rendering
 * Powered by Vanilla JavaScript and Chart.js
 * ============================================================================
 */

(function () {
  'use strict';

  // Standard Demonstration Dataset (Simulated Retail & Sales Analytics)
  const DEFAULT_SAMPLE_DATA = [
    { Date: '2025-01-15', Category: 'Electronics', Region: 'North', Sales: 12400, Units: 45, Profit: 3100 },
    { Date: '2025-01-20', Category: 'Fashion', Region: 'West', Sales: 8200, Units: 120, Profit: 2400 },
    { Date: '2025-02-05', Category: 'Home & Living', Region: 'East', Sales: 6500, Units: 55, Profit: 1800 },
    { Date: '2025-02-18', Category: 'Electronics', Region: 'South', Sales: 15800, Units: 60, Profit: 4200 },
    { Date: '2025-03-10', Category: 'Books', Region: 'North', Sales: 3400, Units: 85, Profit: 950 },
    { Date: '2025-03-22', Category: 'Sports', Region: 'West', Sales: 5100, Units: 40, Profit: 1350 },
    { Date: '2025-04-05', Category: 'Fashion', Region: 'East', Sales: 9800, Units: 140, Profit: 2900 },
    { Date: '2025-04-20', Category: 'Electronics', Region: 'North', Sales: 18500, Units: 72, Profit: 5100 },
    { Date: '2025-05-12', Category: 'Home & Living', Region: 'South', Sales: 7200, Units: 65, Profit: 2100 },
    { Date: '2025-05-28', Category: 'Sports', Region: 'East', Sales: 6400, Units: 50, Profit: 1700 },
    { Date: '2025-06-15', Category: 'Electronics', Region: 'West', Sales: 14200, Units: 54, Profit: 3900 },
    { Date: '2025-06-30', Category: 'Books', Region: 'South', Sales: 4100, Units: 110, Profit: 1200 },
    { Date: '2025-07-14', Category: 'Fashion', Region: 'North', Sales: 11200, Units: 165, Profit: 3300 },
    { Date: '2025-07-29', Category: 'Home & Living', Region: 'West', Sales: 8600, Units: 75, Profit: 2500 },
    { Date: '2025-08-10', Category: 'Electronics', Region: 'East', Sales: 19800, Units: 80, Profit: 5600 },
    { Date: '2025-08-25', Category: 'Sports', Region: 'North', Sales: 7100, Units: 58, Profit: 1950 },
    { Date: '2025-09-08', Category: 'Fashion', Region: 'South', Sales: 10500, Units: 150, Profit: 3100 },
    { Date: '2025-09-22', Category: 'Books', Region: 'West', Sales: 3800, Units: 95, Profit: 1050 },
    { Date: '2025-10-05', Category: 'Electronics', Region: 'North', Sales: 21400, Units: 85, Profit: 6200 },
    { Date: '2025-10-20', Category: 'Home & Living', Region: 'East', Sales: 9100, Units: 82, Profit: 2750 },
    { Date: '2025-11-12', Category: 'Sports', Region: 'South', Sales: 7800, Units: 62, Profit: 2200 },
    { Date: '2025-11-26', Category: 'Fashion', Region: 'West', Sales: 12300, Units: 175, Profit: 3700 },
    { Date: '2025-12-10', Category: 'Electronics', Region: 'East', Sales: 23500, Units: 95, Profit: 6900 },
    { Date: '2025-12-22', Category: 'Books', Region: 'North', Sales: 4500, Units: 125, Profit: 1350 }
  ];

  // State
  let activeDataset = [...DEFAULT_SAMPLE_DATA];
  let customDatasetLoaded = false;
  let parsedCustomRows = [];

  // Chart References
  let barChartInstance = null;
  let doughnutChartInstance = null;
  let lineChartInstance = null;

  // DOM Elements
  const categoryFilter = document.getElementById('category-filter');
  const regionFilter = document.getElementById('region-filter');
  const metricToggle = document.getElementById('metric-toggle');
  const recordsIndicator = document.getElementById('records-indicator');
  const datasetSourceLabel = document.getElementById('dataset-source-label');
  const resetDatasetBtn = document.getElementById('reset-dataset-btn');

  // KPI Elements
  const kpiTotalSales = document.getElementById('kpi-total-sales');
  const kpiTotalUnits = document.getElementById('kpi-total-units');
  const kpiTotalProfit = document.getElementById('kpi-total-profit');
  const kpiProfitMargin = document.getElementById('kpi-profit-margin');
  const kpiAvgSales = document.getElementById('kpi-avg-sales');
  const kpiTopCategory = document.getElementById('kpi-top-category');
  const barChartTitle = document.getElementById('bar-chart-title');

  // CSV Modal Elements
  const openCsvImporterBtn = document.getElementById('open-csv-importer-btn');
  const csvModal = document.getElementById('csv-modal');
  const csvModalClose = document.getElementById('csv-modal-close');
  const csvModalCancel = document.getElementById('csv-modal-cancel');
  const csvDropzone = document.getElementById('csv-dropzone');
  const csvFileInput = document.getElementById('csv-file-input');
  const csvStatusBox = document.getElementById('csv-status-box');
  const csvPreviewContainer = document.getElementById('csv-preview-container');
  const previewRowCount = document.getElementById('preview-row-count');
  const previewThead = document.getElementById('preview-thead');
  const previewTbody = document.getElementById('preview-tbody');
  const applyCsvBtn = document.getElementById('apply-csv-btn');

  // Color Palette for Charts
  const CHART_COLORS = {
    cyan: '#00f2fe',
    sky: '#38bdf8',
    blue: '#2563eb',
    indigo: '#6366f1',
    purple: '#a855f7',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e'
  };

  const CATEGORY_COLORS = [
    '#38bdf8',
    '#00f2fe',
    '#818cf8',
    '#34d399',
    '#fbbf24',
    '#f472b6',
    '#a78bfa'
  ];

  /**
   * Currency / Number Formatter Helper
   */
  function formatCurrency(num) {
    return '₹' + Number(num || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  function formatNumber(num) {
    return Number(num || 0).toLocaleString('en-IN');
  }

  /**
   * Populate Filter Dropdowns dynamically based on active dataset
   */
  function populateFilters() {
    if (!categoryFilter || !regionFilter) return;

    const currentCat = categoryFilter.value;
    const currentReg = regionFilter.value;

    const categories = Array.from(new Set(activeDataset.map(item => item.Category).filter(Boolean))).sort();
    const regions = Array.from(new Set(activeDataset.map(item => item.Region).filter(Boolean))).sort();

    // Populate Category Dropdown
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });

    if (categories.includes(currentCat)) {
      categoryFilter.value = currentCat;
    } else {
      categoryFilter.value = 'all';
    }

    // Populate Region Dropdown
    regionFilter.innerHTML = '<option value="all">All Regions</option>';
    regions.forEach(reg => {
      const opt = document.createElement('option');
      opt.value = reg;
      opt.textContent = reg;
      regionFilter.appendChild(opt);
    });

    if (regions.includes(currentReg)) {
      regionFilter.value = currentReg;
    } else {
      regionFilter.value = 'all';
    }
  }

  /**
   * Get filtered dataset based on active user filter selections
   */
  function getFilteredData() {
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const selectedRegion = regionFilter ? regionFilter.value : 'all';

    return activeDataset.filter(item => {
      const matchCat = (selectedCategory === 'all') || (item.Category === selectedCategory);
      const matchReg = (selectedRegion === 'all') || (item.Region === selectedRegion);
      return matchCat && matchReg;
    });
  }

  /**
   * Update Dynamic KPI Cards
   */
  function updateKPIs(data) {
    const count = data.length;
    if (recordsIndicator) {
      recordsIndicator.textContent = `Showing ${count} ${count === 1 ? 'record' : 'records'}`;
    }

    if (count === 0) {
      if (kpiTotalSales) kpiTotalSales.textContent = '₹0';
      if (kpiTotalUnits) kpiTotalUnits.textContent = '0';
      if (kpiTotalProfit) kpiTotalProfit.textContent = '₹0';
      if (kpiProfitMargin) kpiProfitMargin.textContent = 'Profit margin: 0%';
      if (kpiAvgSales) kpiAvgSales.textContent = '₹0';
      if (kpiTopCategory) kpiTopCategory.textContent = 'N/A';
      return;
    }

    const totalSales = data.reduce((sum, item) => sum + (Number(item.Sales) || 0), 0);
    const totalUnits = data.reduce((sum, item) => sum + (Number(item.Units) || 0), 0);
    const totalProfit = data.reduce((sum, item) => sum + (Number(item.Profit) || 0), 0);
    const avgSales = Math.round(totalSales / count);
    const margin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : 0;

    // Find top performing category
    const catTotals = {};
    data.forEach(item => {
      const cat = item.Category || 'Other';
      catTotals[cat] = (catTotals[cat] || 0) + (Number(item.Sales) || 0);
    });

    let topCat = 'None';
    let maxVal = -1;
    for (const [cat, val] of Object.entries(catTotals)) {
      if (val > maxVal) {
        maxVal = val;
        topCat = cat;
      }
    }

    if (kpiTotalSales) kpiTotalSales.textContent = formatCurrency(totalSales);
    if (kpiTotalUnits) kpiTotalUnits.textContent = formatNumber(totalUnits);
    if (kpiTotalProfit) kpiTotalProfit.textContent = formatCurrency(totalProfit);
    if (kpiProfitMargin) kpiProfitMargin.textContent = `Profit margin: ${margin}%`;
    if (kpiAvgSales) kpiAvgSales.textContent = formatCurrency(avgSales);
    if (kpiTopCategory) {
      kpiTopCategory.textContent = topCat;
      kpiTopCategory.title = `${topCat} (${formatCurrency(maxVal)})`;
    }
  }

  /**
   * Initialize or Update Chart.js Canvases
   */
  function renderCharts(data) {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js library is not loaded. Analytics charts cannot render.');
      return;
    }

    const activeMetric = metricToggle ? metricToggle.value : 'Sales';
    if (barChartTitle) {
      barChartTitle.textContent = `${activeMetric} Performance by Category`;
    }

    // 1. Group data by Category for Bar and Doughnut charts
    const categoryAggregates = {};
    data.forEach(item => {
      const cat = item.Category || 'Uncategorized';
      if (!categoryAggregates[cat]) {
        categoryAggregates[cat] = { Sales: 0, Units: 0, Profit: 0, count: 0 };
      }
      categoryAggregates[cat].Sales += Number(item.Sales) || 0;
      categoryAggregates[cat].Units += Number(item.Units) || 0;
      categoryAggregates[cat].Profit += Number(item.Profit) || 0;
      categoryAggregates[cat].count += 1;
    });

    const categoryLabels = Object.keys(categoryAggregates);
    const metricValues = categoryLabels.map(cat => categoryAggregates[cat][activeMetric]);

    // 2. Group data by Month/Timeline for Line chart
    const monthlyAggregates = {};
    data.forEach(item => {
      let monthKey = 'Period';
      if (item.Date) {
        // Expected YYYY-MM or YYYY-MM-DD
        const parts = String(item.Date).split('-');
        if (parts.length >= 2) {
          const monthNum = parseInt(parts[1], 10);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          monthKey = monthNames[monthNum - 1] || parts[1];
        } else {
          monthKey = item.Date;
        }
      }
      if (!monthlyAggregates[monthKey]) {
        monthlyAggregates[monthKey] = { Sales: 0, Profit: 0 };
      }
      monthlyAggregates[monthKey].Sales += Number(item.Sales) || 0;
      monthlyAggregates[monthKey].Profit += Number(item.Profit) || 0;
    });

    const timelineLabels = Object.keys(monthlyAggregates);
    const timelineSales = timelineLabels.map(m => monthlyAggregates[m].Sales);
    const timelineProfit = timelineLabels.map(m => monthlyAggregates[m].Profit);

    // Common Chart Defaults for Dark Theme
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // -------------------------------------------------------------
    // RENDER / UPDATE BAR CHART
    // -------------------------------------------------------------
    const barCanvas = document.getElementById('categoryBarChart');
    if (barCanvas) {
      if (barChartInstance) {
        barChartInstance.data.labels = categoryLabels;
        barChartInstance.data.datasets[0].label = activeMetric;
        barChartInstance.data.datasets[0].data = metricValues;
        barChartInstance.update();
      } else {
        barChartInstance = new Chart(barCanvas, {
          type: 'bar',
          data: {
            labels: categoryLabels,
            datasets: [{
              label: activeMetric,
              data: metricValues,
              backgroundColor: CATEGORY_COLORS.map(c => c + 'cc'),
              borderColor: CATEGORY_COLORS,
              borderWidth: 1.5,
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#38bdf8',
                borderColor: 'rgba(56, 189, 248, 0.3)',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                  label: function (ctx) {
                    const val = ctx.parsed.y;
                    return activeMetric === 'Units' ? `${val} Units` : formatCurrency(val);
                  }
                }
              }
            },
            scales: {
              x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
              },
              y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: {
                  color: '#94a3b8',
                  callback: function (val) {
                    return activeMetric === 'Units' ? val : '₹' + (val >= 1000 ? (val / 1000) + 'k' : val);
                  }
                }
              }
            }
          }
        });
      }
    }

    // -------------------------------------------------------------
    // RENDER / UPDATE DOUGHNUT CHART
    // -------------------------------------------------------------
    const doughnutCanvas = document.getElementById('categoryDoughnutChart');
    if (doughnutCanvas) {
      if (doughnutChartInstance) {
        doughnutChartInstance.data.labels = categoryLabels;
        doughnutChartInstance.data.datasets[0].data = metricValues;
        doughnutChartInstance.update();
      } else {
        doughnutChartInstance = new Chart(doughnutCanvas, {
          type: 'doughnut',
          data: {
            labels: categoryLabels,
            datasets: [{
              data: metricValues,
              backgroundColor: CATEGORY_COLORS,
              borderColor: '#0f172a',
              borderWidth: 2,
              hoverOffset: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: '#cbd5e1',
                  boxWidth: 12,
                  padding: 12,
                  font: { size: 11 }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#00f2fe',
                borderColor: 'rgba(56, 189, 248, 0.3)',
                borderWidth: 1,
                callbacks: {
                  label: function (ctx) {
                    const val = ctx.parsed;
                    return ` ${ctx.label}: ${activeMetric === 'Units' ? val + ' Units' : formatCurrency(val)}`;
                  }
                }
              }
            },
            cutout: '65%'
          }
        });
      }
    }

    // -------------------------------------------------------------
    // RENDER / UPDATE LINE CHART
    // -------------------------------------------------------------
    const lineCanvas = document.getElementById('trendLineChart');
    if (lineCanvas) {
      if (lineChartInstance) {
        lineChartInstance.data.labels = timelineLabels;
        lineChartInstance.data.datasets[0].data = timelineSales;
        lineChartInstance.data.datasets[1].data = timelineProfit;
        lineChartInstance.update();
      } else {
        lineChartInstance = new Chart(lineCanvas, {
          type: 'line',
          data: {
            labels: timelineLabels,
            datasets: [
              {
                label: 'Sales Revenue',
                data: timelineSales,
                borderColor: CHART_COLORS.cyan,
                backgroundColor: 'rgba(0, 242, 254, 0.1)',
                borderWidth: 2.5,
                tension: 0.35,
                fill: true,
                pointBackgroundColor: CHART_COLORS.cyan,
                pointRadius: 4,
                pointHoverRadius: 6
              },
              {
                label: 'Net Profit',
                data: timelineProfit,
                borderColor: CHART_COLORS.emerald,
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                borderWidth: 2,
                tension: 0.35,
                fill: true,
                pointBackgroundColor: CHART_COLORS.emerald,
                pointRadius: 3,
                pointHoverRadius: 5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#cbd5e1',
                  boxWidth: 14,
                  padding: 14
                }
              },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#f8fafc',
                borderColor: 'rgba(56, 189, 248, 0.3)',
                borderWidth: 1,
                callbacks: {
                  label: function (ctx) {
                    return ` ${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`;
                  }
                }
              }
            },
            scales: {
              x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
              },
              y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: {
                  color: '#94a3b8',
                  callback: function (val) {
                    return '₹' + (val >= 1000 ? (val / 1000) + 'k' : val);
                  }
                }
              }
            }
          }
        });
      }
    }
  }

  /**
   * Main Refresh Cycle
   */
  function refreshDashboard() {
    const filtered = getFilteredData();
    updateKPIs(filtered);
    renderCharts(filtered);
  }

  // --------------------------------------------------------------------------
  // CSV Import & Parsing Logic
  // --------------------------------------------------------------------------

  /**
   * Robust Vanilla JS CSV Line Parser
   */
  function parseCSVText(csvText) {
    if (!csvText || !csvText.trim()) {
      throw new Error('The selected CSV file appears to be empty.');
    }

    const lines = csvText.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0);
    if (lines.length < 2) {
      throw new Error('CSV must contain a header row and at least one row of data.');
    }

    // Helper to split row by comma taking quotes into account
    function splitCSVRow(row) {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    }

    const rawHeaders = splitCSVRow(lines[0]).map(h => h.replace(/^["']|["']$/g, '').trim());
    
    // Normalize header names to support custom CSVs
    // Target columns: Category, Sales, Profit, Units, Region, Date
    const headerMapping = {};
    rawHeaders.forEach((h, idx) => {
      const lower = h.toLowerCase();
      if (/category|type|segment|product/i.test(lower)) {
        headerMapping.Category = idx;
      } else if (/sales|revenue|amount|total/i.test(lower)) {
        headerMapping.Sales = idx;
      } else if (/profit|margin|earnings/i.test(lower)) {
        headerMapping.Profit = idx;
      } else if (/unit|qty|quantity|count|items/i.test(lower)) {
        headerMapping.Units = idx;
      } else if (/region|city|location|state/i.test(lower)) {
        headerMapping.Region = idx;
      } else if (/date|month|time|year/i.test(lower)) {
        headerMapping.Date = idx;
      }
    });

    // Fallbacks if not recognized explicitly
    if (headerMapping.Category === undefined) {
      // Find first string column
      headerMapping.Category = 0;
    }
    if (headerMapping.Sales === undefined) {
      // Find first numeric column
      headerMapping.Sales = 1 < rawHeaders.length ? 1 : 0;
    }

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = splitCSVRow(lines[i]);
      if (cols.length < 2) continue;

      const item = {
        Category: cols[headerMapping.Category] ? cols[headerMapping.Category].replace(/^["']|["']$/g, '') : 'General',
        Sales: parseFloat(cols[headerMapping.Sales]) || 0,
        Profit: headerMapping.Profit !== undefined ? parseFloat(cols[headerMapping.Profit]) || 0 : (parseFloat(cols[headerMapping.Sales]) || 0) * 0.2,
        Units: headerMapping.Units !== undefined ? parseInt(cols[headerMapping.Units], 10) || 1 : 1,
        Region: headerMapping.Region !== undefined && cols[headerMapping.Region] ? cols[headerMapping.Region] : 'Global',
        Date: headerMapping.Date !== undefined && cols[headerMapping.Date] ? cols[headerMapping.Date] : `Record-${i}`
      };

      rows.push(item);
    }

    if (rows.length === 0) {
      throw new Error('No valid data rows could be extracted from the file.');
    }

    return { headers: rawHeaders, rows: rows };
  }

  /**
   * Handle CSV File Selection
   */
  function handleCSVFile(file) {
    if (!file) return;

    if (!file.name.endsWith('.csv') && file.type && !file.type.includes('csv') && !file.type.includes('text')) {
      showCSVStatus('Please upload a valid .csv format file.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showCSVStatus('File size exceeds the 5 MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = parseCSVText(e.target.result);
        parsedCustomRows = parsed.rows;
        renderCSVPreview(parsed.headers, parsed.rows);
        showCSVStatus(`Successfully validated CSV: ${parsed.rows.length} rows detected ready for visualization!`, 'success');
        if (applyCsvBtn) applyCsvBtn.disabled = false;
      } catch (err) {
        showCSVStatus(`Validation error: ${err.message}`, 'error');
        if (csvPreviewContainer) csvPreviewContainer.hidden = true;
        if (applyCsvBtn) applyCsvBtn.disabled = true;
      }
    };

    reader.onerror = function () {
      showCSVStatus('Error reading file. Please try again.', 'error');
    };

    reader.readAsText(file);
  }

  function showCSVStatus(msg, type) {
    if (!csvStatusBox) return;
    csvStatusBox.hidden = false;
    csvStatusBox.className = `csv-status-box status-${type}`;
    csvStatusBox.textContent = msg;
  }

  function renderCSVPreview(headers, rows) {
    if (!csvPreviewContainer || !previewThead || !previewTbody) return;

    previewThead.innerHTML = '';
    previewTbody.innerHTML = '';

    const trHead = document.createElement('tr');
    headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      trHead.appendChild(th);
    });
    previewThead.appendChild(trHead);

    const previewRows = rows.slice(0, 5);
    previewRows.forEach(row => {
      const tr = document.createElement('tr');
      // Render standard mapped fields
      Object.values(row).forEach(val => {
        const td = document.createElement('td');
        td.textContent = val;
        tr.appendChild(td);
      });
      previewTbody.appendChild(tr);
    });

    if (previewRowCount) {
      previewRowCount.textContent = `${rows.length} total rows`;
    }
    csvPreviewContainer.hidden = false;
  }

  // --------------------------------------------------------------------------
  // Event Listeners Initialization
  // --------------------------------------------------------------------------
  function initDashboard() {
    // Dropdown change handlers
    if (categoryFilter) categoryFilter.addEventListener('change', refreshDashboard);
    if (regionFilter) regionFilter.addEventListener('change', refreshDashboard);
    if (metricToggle) metricToggle.addEventListener('change', refreshDashboard);

    // Reset Dataset
    if (resetDatasetBtn) {
      resetDatasetBtn.addEventListener('click', function () {
        activeDataset = [...DEFAULT_SAMPLE_DATA];
        customDatasetLoaded = false;
        if (datasetSourceLabel) {
          datasetSourceLabel.textContent = 'Demonstration Retail Sales & Performance Dataset (Simulated Sample Data)';
        }
        populateFilters();
        refreshDashboard();
        if (window.showToast) {
          window.showToast('Analytics dataset reset to default demonstration data.', 'info');
        }
      });
    }

    // Open CSV Importer Modal
    if (openCsvImporterBtn && csvModal) {
      openCsvImporterBtn.addEventListener('click', function () {
        csvModal.hidden = false;
        csvModal.classList.add('is-active');
      });
    }

    function closeCSVModal() {
      if (csvModal) {
        csvModal.classList.remove('is-active');
        csvModal.hidden = true;
      }
    }

    if (csvModalClose) csvModalClose.addEventListener('click', closeCSVModal);
    if (csvModalCancel) csvModalCancel.addEventListener('click', closeCSVModal);

    // Drag and Drop
    if (csvDropzone && csvFileInput) {
      csvDropzone.addEventListener('click', () => csvFileInput.click());
      csvDropzone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          csvFileInput.click();
        }
      });

      ['dragenter', 'dragover'].forEach(evt => {
        csvDropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          csvDropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(evt => {
        csvDropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          csvDropzone.classList.remove('dragover');
        });
      });

      csvDropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer && e.dataTransfer.files.length > 0) {
          handleCSVFile(e.dataTransfer.files[0]);
        }
      });

      csvFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          handleCSVFile(e.target.files[0]);
        }
      });
    }

    // Apply Custom CSV Dataset
    if (applyCsvBtn) {
      applyCsvBtn.addEventListener('click', function () {
        if (parsedCustomRows.length > 0) {
          activeDataset = [...parsedCustomRows];
          customDatasetLoaded = true;
          if (datasetSourceLabel) {
            datasetSourceLabel.textContent = `Custom Uploaded CSV Dataset (${activeDataset.length} records analyzed)`;
          }
          populateFilters();
          refreshDashboard();
          closeCSVModal();
          if (window.showToast) {
            window.showToast(`Custom CSV loaded successfully! ${activeDataset.length} records active.`, 'success');
          }
        }
      });
    }

    // Initial setup
    populateFilters();
    refreshDashboard();

    // Theme Awareness Engine for Chart.js
    function updateChartTheme(theme) {
      const isLight = theme === 'light';
      const gridColor = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.05)';
      const tickColor = isLight ? '#475569' : '#94a3b8';
      const legendColor = isLight ? '#334155' : '#cbd5e1';
      const tooltipBg = isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(15, 23, 42, 0.95)';
      const tooltipTitleColor = isLight ? '#0f172a' : '#f8fafc';
      const tooltipBorderColor = isLight ? 'rgba(2, 132, 199, 0.25)' : 'rgba(56, 189, 248, 0.3)';
      const doughnutBorderColor = isLight ? '#ffffff' : '#0f172a';

      const charts = [barChartInstance, lineChartInstance];
      charts.forEach(chart => {
        if (chart && chart.options && chart.options.scales) {
          if (chart.options.scales.x) {
            chart.options.scales.x.grid.color = gridColor;
            chart.options.scales.x.ticks.color = tickColor;
          }
          if (chart.options.scales.y) {
            chart.options.scales.y.grid.color = gridColor;
            chart.options.scales.y.ticks.color = tickColor;
          }
          if (chart.options.plugins && chart.options.plugins.legend) {
            chart.options.plugins.legend.labels.color = legendColor;
          }
          if (chart.options.plugins && chart.options.plugins.tooltip) {
            chart.options.plugins.tooltip.backgroundColor = tooltipBg;
            chart.options.plugins.tooltip.titleColor = tooltipTitleColor;
            chart.options.plugins.tooltip.borderColor = tooltipBorderColor;
          }
          chart.update('none');
        }
      });

      if (doughnutChartInstance && doughnutChartInstance.options) {
        if (doughnutChartInstance.options.plugins && doughnutChartInstance.options.plugins.legend) {
          doughnutChartInstance.options.plugins.legend.labels.color = legendColor;
        }
        if (doughnutChartInstance.options.plugins && doughnutChartInstance.options.plugins.tooltip) {
          doughnutChartInstance.options.plugins.tooltip.backgroundColor = tooltipBg;
          doughnutChartInstance.options.plugins.tooltip.titleColor = tooltipTitleColor;
          doughnutChartInstance.options.plugins.tooltip.borderColor = tooltipBorderColor;
        }
        if (doughnutChartInstance.data.datasets && doughnutChartInstance.data.datasets[0]) {
          doughnutChartInstance.data.datasets[0].borderColor = doughnutBorderColor;
        }
        doughnutChartInstance.update('none');
      }
    }

    window.addEventListener('themeChanged', (e) => {
      if (e.detail && e.detail.theme) {
        updateChartTheme(e.detail.theme);
      }
    });

    // Check if initial theme is light
    const currentTheme = document.documentElement.getAttribute('data-theme') || (document.body.classList.contains('light-theme') ? 'light' : 'dark');
    if (currentTheme === 'light') {
      updateChartTheme('light');
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }

})();

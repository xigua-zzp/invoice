// 发票管理系统 - 磨砂玻璃风格

const mockData = [
    { id: "inv_001", customer: "Acme Corp", amount: 1250.00, status: "paid", dueDate: "2025-01-15", issuedAt: "2025-01-01" },
    { id: "inv_002", customer: "Globex Inc", amount: 3420.50, status: "overdue", dueDate: "2025-01-10", issuedAt: "2024-12-27" },
    { id: "inv_003", customer: "Initech", amount: 890.00, status: "pending", dueDate: "2025-01-25", issuedAt: "2025-01-11" },
    { id: "inv_004", customer: "Umbrella LLC", amount: 5100.00, status: "paid", dueDate: "2025-01-05", issuedAt: "2024-12-20" },
    { id: "inv_005", customer: "Acme Corp", amount: 2100.00, status: "pending", dueDate: "2025-01-30", issuedAt: "2025-01-16" },
    { id: "inv_006", customer: "Stark Industries", amount: 8750.00, status: "overdue", dueDate: "2025-01-08", issuedAt: "2024-12-25" },
    { id: "inv_007", customer: "Wayne Enterprises", amount: 4300.00, status: "paid", dueDate: "2025-01-12", issuedAt: "2024-12-29" },
    { id: "inv_008", customer: "Globex Inc", amount: 1875.25, status: "pending", dueDate: "2025-02-01", issuedAt: "2025-01-18" },
    { id: "inv_009", customer: "Initech", amount: 620.00, status: "paid", dueDate: "2025-01-03", issuedAt: "2024-12-18" },
    { id: "inv_010", customer: "Umbrella LLC", amount: 3200.00, status: "overdue", dueDate: "2025-01-07", issuedAt: "2024-12-22" }
];

// 状态映射
const statusMap = {
    paid: "PAID",
    pending: "PENDING",
    overdue: "OVERDUE"
};

// 磨砂玻璃状态徽章
const statusBadgeClass = {
    paid: "status-glass status-paid-glass",
    pending: "status-glass status-pending-glass",
    overdue: "status-glass status-overdue-glass"
};

// 当前状态
let currentFilter = "all";
let currentSort = { column: null, direction: "asc" };

// DOM 元素
const tableBody = document.getElementById("tableBody");
const emptyState = document.getElementById("emptyState");
const invoiceTable = document.getElementById("invoiceTable");
const totalCount = document.getElementById("totalCount");

// 初始化
function init() {
    setupFilterButtons();
    setupSortableHeaders();
    renderTable();
}

// 设置筛选按钮 - 拟态效果
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentFilter = btn.dataset.status;
            renderTable();
        });
    });
}

// 设置可排序列
function setupSortableHeaders() {
    const headers = document.querySelectorAll(".sortable");
    headers.forEach(header => {
        header.addEventListener("click", () => {
            const column = header.parentElement.dataset.column;

            if (currentSort.column === column) {
                // 已排序的列：asc -> desc -> 恢复无排序
                if (currentSort.direction === "asc") {
                    currentSort.direction = "desc";
                } else {
                    // 恢复无排序
                    currentSort.column = null;
                    currentSort.direction = "asc";
                    headers.forEach(h => h.classList.remove("sort-asc", "sort-desc"));
                    renderTable();
                    return;
                }
            } else {
                // 新列：升序开始
                currentSort.column = column;
                currentSort.direction = "asc";
            }

            headers.forEach(h => h.classList.remove("sort-asc", "sort-desc"));
            header.classList.add(currentSort.direction === "asc" ? "sort-asc" : "sort-desc");

            renderTable();
        });
    });
}

// 筛选数据
function filterData(data) {
    if (currentFilter === "all") return data;
    return data.filter(item => item.status === currentFilter);
}

// 排序数据
function sortData(data) {
    if (!currentSort.column) return data;

    return [...data].sort((a, b) => {
        let aVal = a[currentSort.column];
        let bVal = b[currentSort.column];

        if (currentSort.column === "dueDate" || currentSort.column === "issuedAt") {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        }

        if (currentSort.column === "amount") {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        }

        if (aVal < bVal) return currentSort.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return currentSort.direction === "asc" ? 1 : -1;
        return 0;
    });
}

// 渲染表格
function renderTable() {
    const filteredData = filterData(mockData);
    const sortedData = sortData(filteredData);

    totalCount.textContent = `${sortedData.length} invoices`;

    tableBody.innerHTML = "";

    if (sortedData.length === 0) {
        invoiceTable.classList.add("hidden");
        emptyState.classList.remove("hidden");
        return;
    }

    invoiceTable.classList.remove("hidden");
    emptyState.classList.add("hidden");

    sortedData.forEach(item => {
        const row = document.createElement("tr");
        row.className = "glass-row border-b border-gray-100/50";
        row.innerHTML = `
            <td class="px-5 py-4 customer-cell">${item.customer}</td>
            <td class="px-5 py-4 text-right amount-cell w-40"><span class="currency-symbol">$</span>${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="px-5 py-4 w-48">
                <span class="${statusBadgeClass[item.status]}">${statusMap[item.status]}</span>
            </td>
            <td class="px-5 py-4 text-[#6b7280]">${formatDate(item.dueDate)}</td>
            <td class="px-5 py-4 text-[#6b7280]">${formatDate(item.issuedAt)}</td>
            <td class="px-5 py-4 text-[#374151]">${item.id}</td>
        `;
        tableBody.appendChild(row);
    });
}

// 格式化日期
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", init);

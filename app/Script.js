// script.js

// RENDER MAIN TABLE
function renderTable(data) {
  const tbody = $("#jobTable tbody");
  tbody.empty();
  if (!data.length) {
    tbody.html('<tr><td colspan="5" class="text-center text-muted">No records found</td></tr>');
    return;
  }

  data.forEach(order => {
    const row = `
      <tr data-jobno="${order.Job_No}">
        <td>${order.Job_No}</td>
        <td>${order.Client_Name}</td>
        <td>${order.Job_Type}</td>
        <td>${order.Job_Stage || '-'}</td>
        <td>${order.Requested_Delivery_Date || '-'}</td>
      </tr>`;
    tbody.append(row);
  });
}

// FILTER FUNCTION
function applyFilters() {
  const jobFilter = $("#filterJobNo").val().toLowerCase();
  const clientFilter = $("#filterClient").val().toLowerCase();
  const industryFilter = $("#filterIndustry").val();

  const filtered = sampleOrders.filter(o =>
    (!jobFilter || o.Job_No.toLowerCase().includes(jobFilter)) &&
    (!clientFilter || o.Client_Name.toLowerCase().includes(clientFilter)) &&
    (!industryFilter || o.Job_Type === industryFilter)
  );

  renderTable(filtered);
}

// Function to get filtered product details based on industry
function getFilteredProductDetails(product, industry) {
  if (!product || !industry || !industryFields[industry]) {
    return product;
  }

  const filteredProduct = {};
  const allowedFields = industryFields[industry].productFields;
  
  allowedFields.forEach(field => {
    if (product.hasOwnProperty(field)) {
      filteredProduct[field] = product[field];
    }
  });

  return filteredProduct;
}

// ROW CLICK - SHOW MODAL
$(document).on("click", "#jobTable tbody tr", function() {
  const jobNo = $(this).data("jobno");
  const order = sampleOrders.find(o => o.Job_No === jobNo);
  if (!order) return;

  // Basic Summary
  $("#modalJobSummary").html(`
    <div class="p-2">
      <strong>Job No :</strong> ${order.Job_No}<br>
      <strong>Client:</strong> ${order.Client_Name}<br>
      <strong>Industry:</strong> ${order.Job_Type}<br>
      <strong>Delivery:</strong> ${order.Requested_Delivery_Date}<br>
      <strong>Job Stage:</strong> ${order.Job_Stage}
    </div>
  `);

  // Product Details - Filtered by Industry
  const filteredProduct = getFilteredProductDetails(order.Product_Details, order.Job_Type);
  let ph = '<tr>';
  let pv = '<tr>';
  Object.keys(filteredProduct).forEach(k => {
    ph += `<th>${k.replace(/_/g, ' ')}</th>`;
    pv += `<td>${filteredProduct[k] ?? '-'}</td>`;
  });
  ph += '</tr>'; pv += '</tr>';
  $("#modalProductDetails").html(`<table><thead>${ph}</thead><tbody>${pv}</tbody></table>`);

  // Consumption Details
  const cons = order.Consumption_Details || {};
  let ch = '<tr>';
  let cv = '<tr>';
  Object.keys(cons).forEach(k => {
    ch += `<th>${k.replace(/_/g, ' ')}</th>`;
    cv += `<td>${cons[k] ?? '-'}</td>`;
  });
  ch += '</tr>'; cv += '</tr>';
  $("#modalConsumptionDetails").html(`<table><thead>${ch}</thead><tbody>${cv}</tbody></table>`);

  const modal = new bootstrap.Modal(document.getElementById("jobModal"));
  modal.show();
});

// FILTER INPUTS EVENT
$("#filterJobNo, #filterClient, #filterIndustry").on("input change", applyFilters);

// INITIAL RENDER
$(document).ready(() => renderTable(sampleOrders));

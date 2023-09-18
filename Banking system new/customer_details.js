document.addEventListener("DOMContentLoaded", function () {
   
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get("customer_id");

    if (customerId) {
        
        fetchCustomerDetails(customerId);
    } else {
        
        displayErrorMessage("Customer ID not provided.");
    }
});

function fetchCustomerDetails(customerId) {
   
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `api/customer_details.php?customer_id=${customerId}`, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const customer = JSON.parse(xhr.responseText);
            displayCustomerDetails(customer);
        } else {
            displayErrorMessage("Failed to fetch customer details.");
        }
    };

    xhr.send();
}

function displayCustomerDetails(customer) {
    const customerDetailsElement = document.getElementById("customerDetails");
    customerDetailsElement.innerHTML = `
        <h2>Name: ${customer.name}</h2>
        <p>Email: ${customer.email}</p>
        <p>Current Balance: $${customer.current_balance}</p>
        <!-- Add more customer details here -->
    `;
}

function displayErrorMessage(message) {
    const customerDetailsElement = document.getElementById("customerDetails");
    customerDetailsElement.innerHTML = `<p>${message}</p>`;
}

// ==== State ====
// Global state variables, will be populated on load from server
var userName = 'User'; 
var allExpenses = [];
var budgets = {}; 
var incomes = {}; 
var upcomingPayments = []; 
var allBillPhotos = []; 
var spendingTrendChart, categoriesChart;
var expenseIdToDelete = null; // Changed from index to ID
var paymentIdToDelete = null;
var expenseIdToEdit = null; 

// ==== DOM (Selectors remain the same) ====
var dashboardTitle = document.getElementById('dashboard-title');
var dashboardSubtitle = document.getElementById('dashboard-subtitle');

var thisMonthSpent = document.getElementById('this-month-spent');
var monthlyIncome = document.getElementById('monthly-income'); 
var remainingBalance = document.getElementById('remaining-balance'); 
var dailyAverage = document.getElementById('daily-average');
var recentExpensesList = document.getElementById('recent-expenses-list');
var upcomingPaymentsList = document.getElementById('upcoming-payments-list'); 

var homeThisMonth = document.getElementById('home-this-month');
var homeThisMonthIncome = document.getElementById('home-this-month-income'); 
var homeIncomeRemark = document.getElementById('home-income-remark'); 
var homeDailyAvg = document.getElementById('home-daily-avg');
var homeBalance = document.getElementById('home-balance'); 
var homeBudgetRemark = document.getElementById('home-budget-remark');

var filterControlsGroup = document.getElementById('filter-controls-group'); 
var setIncomeBtn = document.getElementById('set-income-btn'); 
var setBudgetBtn = document.getElementById('set-budget-btn'); 
var headerAddBtn = document.getElementById('header-add-btn'); 
var filterButtons = document.querySelectorAll('.filter-btn');
var navLinks = document.querySelectorAll('.sidebar-nav a');
var views = document.querySelectorAll('.view');

// NEW: Time Filter DOM
var timeFilterGroup = document.getElementById('time-filter-group');
var timeFilterSelect = document.getElementById('time-filter-select');

var addExpenseForm = document.getElementById('add-expense-form');
// setBudgetBtn and setIncomeBtn already declared above
var allExpensesTbody = document.getElementById('all-expenses-tbody');
var cancelBtn = document.querySelector('#add-expense-form .cancel-btn');
var expenseTypeBoxes = document.querySelectorAll('.type-box');
var expenseTypeInput = document.getElementById('expense-type');
var expenseDateInput = document.getElementById('expense-date');

// --- Mobile Nav & Sidebar ---
var sidebar = document.getElementById('sidebar');
var collapseToggle = document.getElementById('collapse-toggle');
var mobileNav = document.querySelector('.mobile-bottom-nav');
var mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// UPDATED: Budget Banner DOM
var budgetBanner = document.getElementById('budget-banner');
var budgetBannerText = document.getElementById('budget-banner-text');
var budgetBannerToggle = document.getElementById('budget-banner-toggle');
var budgetBannerDetails = document.getElementById('budget-banner-details');

// Budget modal 
var budgetModal = document.getElementById('budget-modal');
var budgetMonthInput = document.getElementById('budget-month');
var budgetAmountInput = document.getElementById('budget-amount');
var budgetForm = document.getElementById('budget-form');
var budgetModalClose = document.getElementById('budget-modal-close');
var budgetCancel = document.getElementById('budget-cancel');

// Income modal 
var incomeModal = document.getElementById('income-modal');
var incomeMonthInput = document.getElementById('income-month');
var incomeAmountInput = document.getElementById('income-amount');
var incomeForm = document.getElementById('income-form');
var incomeModalClose = document.getElementById('income-modal-close');
var incomeCancel = document.getElementById('income-cancel');

// Upcoming Payment modal 
var addPaymentModal = document.getElementById('add-payment-modal');
var addPaymentForm = document.getElementById('add-payment-form');
var paymentDescInput = document.getElementById('payment-desc');
var paymentAmountInput = document.getElementById('payment-amount');
var paymentDateInput = document.getElementById('payment-date');
var addPaymentModalClose = document.getElementById('add-payment-modal-close');
var paymentCancel = document.getElementById('payment-cancel');
var addPaymentBtn = document.getElementById('add-payment-btn');
var paymentRepeatCheckbox = document.getElementById('payment-repeat'); 
var repeatAfterGroup = document.getElementById('repeat-after-group'); 
var paymentRepeatDaysInput = document.getElementById('payment-repeat-days'); 

// Welcome modal 
var welcomeModal = document.getElementById('welcome-modal');
var welcomeForm = document.getElementById('welcome-form');
var userNameInput = document.getElementById('user-name-input');
var userNameDisplay = document.getElementById('user-name-display');
var sidebarAvatarInitial = document.getElementById('sidebar-avatar-initial');
var renameBtn = document.getElementById('rename-btn'); 

// Delete modals
var deleteModal = document.getElementById('delete-modal');
var deleteModalClose = document.getElementById('delete-modal-close');
var deleteCancel = document.getElementById('delete-cancel');
var deleteConfirm = document.getElementById('delete-confirm');
var expenseToDeleteInfo = document.getElementById('expense-to-delete-info');

var deletePaymentModal = document.getElementById('delete-payment-modal');
var deletePaymentModalClose = document.getElementById('delete-payment-modal-close');
var deletePaymentCancel = document.getElementById('delete-payment-cancel');
var deletePaymentConfirm = document.getElementById('delete-payment-confirm');
var paymentToDeleteInfo = document.getElementById('payment-to-delete-info');

// Photo modal
var photoModal = document.getElementById('photo-modal');
var photoModalClose = document.getElementById('photo-modal-close');
var photoModalImage = document.getElementById('photo-modal-image');

var billPhotoUploadInput = document.getElementById('bill-photo-upload'); 
var billGallery = document.getElementById('bill-gallery');

// Edit modal
var editExpenseModal = document.getElementById('edit-expense-modal');
var editExpenseModalClose = document.getElementById('edit-expense-modal-close');
var editExpenseCancel = document.getElementById('edit-expense-cancel');
var editExpenseForm = document.getElementById('edit-expense-form');
var editExpenseIdInput = document.getElementById('edit-expense-id');
var editExpenseTypeSelector = document.getElementById('edit-expense-type-selector');
var editExpenseTypeInput = document.getElementById('edit-expense-type');
var editExpenseAmountInput = document.getElementById('edit-expense-amount');
var editExpenseCategoryInput = document.getElementById('edit-expense-category');
var editExpenseDescInput = document.getElementById('edit-expense-desc');
var editExpenseDateInput = document.getElementById('edit-expense-date');
var editPaymentMethodInput = document.getElementById('edit-payment-method');
var editMoodInput = document.getElementById('edit-mood');
var editLocationInput = document.getElementById('edit-location');
var editPhotoManager = document.getElementById('edit-photo-manager');
var editPhotoPreviewContainer = document.getElementById('edit-photo-preview-container');
var editBillPhotoPreview = document.getElementById('edit-bill-photo-preview');
var editViewPhotoBtn = document.getElementById('edit-view-photo-btn');
var editDeletePhotoBtn = document.getElementById('edit-delete-photo-btn');
var editPhotoUploadContainer = document.getElementById('edit-photo-upload-container');
var editBillPhotoUploadInput = document.getElementById('edit-bill-photo-upload');

// NEW: Mobile filter modal DOM
var mobileFilterBtn = document.getElementById('mobile-filter-btn');
var mobileFilterModal = document.getElementById('mobile-filter-modal');
var mobileFilterClose = document.getElementById('mobile-filter-close');
var mobileFilterOptions = document.getElementById('mobile-filter-options');

// NEW: Notification Modal DOM
var notificationModal = document.getElementById('notification-modal');
var notificationModalClose = document.getElementById('notification-modal-close');
var notificationModalOk = document.getElementById('notification-modal-ok');
var notificationModalMessage = document.getElementById('notification-modal-message');


// ==== Helpers ====
function ymKey(dateObj){ return `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}`; }
function getCurrentMonthKey(){ return ymKey(new Date()); }

// UPDATED: getBudgetForMonth to return object or null
function getBudgetForMonth(key){ 
    // Returns the budget *object* or null
    return budgets[key] || null; 
}
// UPDATED: setBudgetForMonth - This now makes an API call
async function setBudgetForMonth(key, budgetObject){ 
    budgets[key] = budgetObject; 
    // Send only the 'budgets' object to the server
    await saveSettings('budgets', budgets);
}

function getIncomeForMonth(key){ return incomes[key] || null; } 
// UPDATED: setIncomeForMonth - This now makes an API call
async function setIncomeForMonth(key, amount){ 
    incomes[key]=amount; 
    // Send only the 'incomes' object to the server
    await saveSettings('incomes', incomes);
} 

function moodLabel(mood){ return mood||''; }
function formatMonthLabel(d){ const month=d.toLocaleString('default',{month:'long'}); return `${month} ${d.getFullYear()}`; }
function isMobile(){ return window.matchMedia('(max-width: 992px)').matches; }

// UPDATED: saveUserName - This now makes an API call
async function saveUserName(name) { 
    userName = name; 
    await saveSettings('userName', userName);
}
function updateUserNameDisplay() { if (userNameDisplay) userNameDisplay.textContent = userName; if (sidebarAvatarInitial) sidebarAvatarInitial.textContent = userName.charAt(0).toUpperCase(); }

function showWelcomeModal(isRename = false) { 
    if (welcomeModal) { welcomeModal.classList.add('show'); welcomeModal.setAttribute('aria-hidden', 'false'); }
    if (isRename && userName !== 'User') { userNameInput.value = userName; } else { userNameInput.value = ''; }
    userNameInput.focus();
}
function hideWelcomeModal() { if (welcomeModal) welcomeModal.classList.remove('show'); welcomeModal.setAttribute('aria-hidden', 'true'); }
function addDays(dateStr, days) { const date = new Date(dateStr); date.setDate(date.getDate() + days); return date.toISOString().split('T')[0]; }

// NEW: Notification Modal Functions
function showNotificationModal(message) {
    if (notificationModalMessage) notificationModalMessage.innerHTML = message; // Use .innerHTML to allow line breaks
    if (notificationModal) notificationModal.classList.add('show');
}
function hideNotificationModal() {
    if (notificationModal) notificationModal.classList.remove('show');
}

// ==== NEW: API Persistence Functions ====

/**
 * Fetches data from the server.
 * @param {string} endpoint The API endpoint (e.g., '/api/expenses')
 * @param {string} method HTTP method (GET, POST, PUT, DELETE)
 * @param {object} [body] The JSON data to send
 * @returns {Promise<any>} The JSON response from the server
 */
async function api(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(endpoint, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }
        // Return nothing for 204 No Content (e.g., some DELETEs)
        if (response.status === 204) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`API Error (${method} ${endpoint}):`, error);
        showNotificationModal(`Error: ${error.message}. Please try again.`);
        throw error; // Re-throw to stop subsequent logic if needed
    }
}

/**
 * Saves a single setting (like userName, budgets, or incomes) to the server.
 * @param {string} key The setting key
 * @param {any} value The setting value
 */
async function saveSettings(key, value) {
    try {
        await api('/api/settings', 'POST', { key, value });
    } catch (error) {
        console.error(`Failed to save setting ${key}:`, error);
    }
}

/**
 * Loads all initial data from the server and populates the state.
 */
async function loadData() {
    try {
        const data = await api('/api/data');
        userName = data.userName || 'User';
        allExpenses = data.allExpenses || [];
        budgets = data.budgets || {};
        incomes = data.incomes || {};
        upcomingPayments = data.upcomingPayments || [];
        allBillPhotos = data.allBillPhotos || [];
        return true; // Success
    } catch (error) {
        console.error("Error loading data:", error);
        showNotificationModal("Could not load data from the server. Please check your connection and refresh.");
        return false; // Failure
    }
}

// Photo modal functions
function showPhotoModal(dataUrl) { photoModalImage.src = dataUrl; photoModal.classList.add('show'); photoModal.setAttribute('aria-hidden', 'false'); }
function hidePhotoModal() { photoModal.classList.remove('show'); photoModal.setAttribute('aria-hidden', 'true'); photoModalImage.src = ''; }

// Payment modal functions
function showAddPaymentModal() {
    addPaymentModal.classList.add('show'); addPaymentModal.setAttribute('aria-hidden', 'false');
    paymentDateInput.value = new Date().toISOString().split('T')[0]; 
    paymentRepeatCheckbox.checked = false; repeatAfterGroup.classList.add('hidden');
    paymentRepeatDaysInput.disabled = true; paymentRepeatDaysInput.removeAttribute('required'); paymentRepeatDaysInput.value = '';
    paymentDescInput.focus();
}
function hideAddPaymentModal() { addPaymentModal.classList.remove('show'); addPaymentModal.setAttribute('aria-hidden', 'true'); addPaymentForm.reset(); }

// UPDATED: handleAddPayment to use API
async function handleAddPayment(e) {
    e.preventDefault();
    const isRepeating = paymentRepeatCheckbox.checked;
    const repeatDays = isRepeating ? parseInt(paymentRepeatDaysInput.value) : 0;
    if (isRepeating && (!repeatDays || repeatDays <= 0)) { showNotificationModal('Please enter a valid number of days to repeat.'); paymentRepeatDaysInput.focus(); return; }
    
    const newPaymentData = { 
        desc: paymentDescInput.value, 
        amount: parseFloat(paymentAmountInput.value), 
        date: paymentDateInput.value, 
        isRepeating: isRepeating, 
        repeatDays: repeatDays 
    };

    if (newPaymentData.amount > 0) { 
        try {
            const newPayment = await api('/api/payments', 'POST', newPaymentData);
            upcomingPayments.push(newPayment); 
            populateUpcomingPayments(); 
            hideAddPaymentModal(); 
        } catch (error) {
            console.error("Failed to add payment:", error);
        }
    }
}

// UPDATED: handlePaymentDone to use API
async function handlePaymentDone(id) { 
    const index = upcomingPayments.findIndex(p => p.id === id);
    if (index > -1) {
        const paidPayment = upcomingPayments[index];
        
        // 1. Add the new expense
        const newExpenseData = { 
            date: paidPayment.date, 
            desc: paidPayment.desc, 
            cat: 'Other', 
            amount: paidPayment.amount, 
            type: 'personal', 
            paymentMethod: 'Bank Transfer', 
            location: 'Scheduled Payment', 
            mood: '😌 Satisfied', 
            billPhoto: false 
        };
        
        try {
            const newExpense = await api('/api/expenses', 'POST', newExpenseData);
            allExpenses.unshift(newExpense); 
            
            // 2. Update or delete the payment
            if (paidPayment.isRepeating && paidPayment.repeatDays > 0) {
                const nextDate = addDays(paidPayment.date, paidPayment.repeatDays);
                const updatedPaymentData = { date: nextDate };
                const updatedPayment = await api(`/api/payments/${id}`, 'PUT', updatedPaymentData);
                upcomingPayments.splice(index, 1, updatedPayment);
            } else { 
                await api(`/api/payments/${id}`, 'DELETE');
                upcomingPayments.splice(index, 1); 
            }
            
            // 3. Refresh UI
            populateUpcomingPayments(); 
            applyFilters(); 
            updateHomeSummary();
        } catch (error) {
            console.error("Failed to process 'Done' payment:", error);
        }
    }
}

function populateUpcomingPayments() {
    if (!upcomingPaymentsList) return; // Guard
    upcomingPaymentsList.innerHTML = '';
    const sortedPayments = [...upcomingPayments].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (!sortedPayments.length) { upcomingPaymentsList.innerHTML = '<li>No upcoming payments scheduled.</li>'; return; }
    sortedPayments.forEach(payment => {
        const repeatTag = payment.isRepeating ? `(Repeats every ${payment.repeatDays} days)` : '';
        const li = document.createElement('li');
        li.innerHTML = `<div class="payment-item-info"><h4>${escapeHtml(payment.desc)}</h4><p>Due: ${escapeHtml(payment.date)} ${repeatTag}</p></div><div class="payment-item-amount">₹${Number(payment.amount).toFixed(2)}<button class="payment-action-btn done-btn" data-id="${payment.id}" title="Mark as Paid"><i class="fas fa-check-circle"></i></button><button class="payment-action-btn delete-payment-btn" data-id="${payment.id}" title="Delete Payment"><i class="fas fa-trash"></i></button></div>`;
        upcomingPaymentsList.appendChild(li);
    });
    upcomingPaymentsList.querySelectorAll('.done-btn').forEach(btn => { btn.addEventListener('click', function() { handlePaymentDone(parseInt(this.dataset.id)); }); });
    upcomingPaymentsList.querySelectorAll('.delete-payment-btn').forEach(btn => { btn.addEventListener('click', function() { const id = parseInt(this.dataset.id); const payment = upcomingPayments.find(p => p.id === id); if (payment) { showDeletePaymentModal(payment); } }); });
}

// Income modal functions
function showIncomeModal(isForced = false) {
    const now = new Date(); const monthKey = getCurrentMonthKey(); const existingIncome = getIncomeForMonth(monthKey);
    if (!isForced && existingIncome !== null) return;
    incomeMonthInput.value = formatMonthLabel(now); incomeAmountInput.value = existingIncome != null ? Number(existingIncome) : '';
    incomeModal.classList.add('show'); incomeModal.setAttribute('aria-hidden', 'false'); incomeAmountInput.focus();
    if (existingIncome !== null) { incomeModalClose.style.display = 'grid'; incomeCancel.style.display = 'inline-block'; } else { incomeModalClose.style.display = 'none'; incomeCancel.style.display = 'none'; }
}
function hideIncomeModal() { incomeModal.classList.remove('show'); incomeModal.setAttribute('aria-hidden', 'true'); }

// Delete functions
function showDeleteModal(expense) { 
    expenseIdToDelete = expense.id; 
    expenseToDeleteInfo.textContent = `${expense.desc} (${expense.cat}) - ₹${Number(expense.amount).toFixed(2)} on ${expense.date}`; 
    deleteModal.classList.add('show'); 
    deleteModal.setAttribute('aria-hidden', 'false'); 
}
function hideDeleteModal() { deleteModal.classList.remove('show'); deleteModal.setAttribute('aria-hidden', 'true'); expenseIdToDelete = null; }

// UPDATED: handleDeleteExpense to use API
async function handleDeleteExpense() {
    if (expenseIdToDelete !== null) {
        try {
            await api(`/api/expenses/${expenseIdToDelete}`, 'DELETE');
            
            // Remove from local state
            const deletedExpenseIndex = allExpenses.findIndex(e => e.id === expenseIdToDelete);
            if (deletedExpenseIndex > -1) {
                const deletedExpense = allExpenses[deletedExpenseIndex];
                allExpenses.splice(deletedExpenseIndex, 1);
                
                if (deletedExpense.billPhoto) { 
                    const photoIndex = allBillPhotos.findIndex(p => p.expenseId === deletedExpense.id); 
                    if (photoIndex > -1) { 
                        allBillPhotos.splice(photoIndex, 1); 
                        populateBillPhotosGallery(); 
                    } 
                }
            }
            
            hideDeleteModal(); 
            updateHomeSummary();
            applyFilters(); // Re-populate dashboard/table with current filters
        } catch (error) {
            console.error("Failed to delete expense:", error);
        }
    }
}
function showDeletePaymentModal(payment) { paymentIdToDelete = payment.id; const repeatTag = payment.isRepeating ? `(Repeats every ${payment.repeatDays} days)` : ''; paymentToDeleteInfo.textContent = `${escapeHtml(payment.desc)} (₹${Number(payment.amount).toFixed(2)}) on ${escapeHtml(payment.date)} ${repeatTag}`; deletePaymentModal.classList.add('show'); deletePaymentModal.setAttribute('aria-hidden', 'false'); }
function hideDeletePaymentModal() { deletePaymentModal.classList.remove('show'); deletePaymentModal.setAttribute('aria-hidden', 'true'); paymentIdToDelete = null; }

// UPDATED: handlePaymentDeleteConfirm to use API
async function handlePaymentDeleteConfirm() { 
    if (paymentIdToDelete !== null) { 
        try {
            await api(`/api/payments/${paymentIdToDelete}`, 'DELETE');
            const index = upcomingPayments.findIndex(p => p.id === paymentIdToDelete); 
            if (index > -1) { 
                upcomingPayments.splice(index, 1); 
                populateUpcomingPayments(); 
            } 
            hideDeletePaymentModal();
        } catch (error) {
            console.error("Failed to delete payment:", error);
        }
    } 
}

// Bill photos logic
// UPDATED: addBillPhotoToGallery to use API
async function addBillPhotoToGallery(file, expense) {
    const reader = new FileReader();
    reader.onload = async function(e) {
        const photoRecord = { 
            dataUrl: e.target.result, 
            date: expense.date, 
            description: `${expense.desc} (${expense.cat})`, 
            expenseId: expense.id 
        };
        
        try {
            // Send to server
            const savedPhoto = await api('/api/photos', 'POST', photoRecord);
            
            // Update local state
            const existingPhotoIndex = allBillPhotos.findIndex(p => p.expenseId === expense.id);
            if (existingPhotoIndex > -1) { 
                allBillPhotos[existingPhotoIndex] = savedPhoto; 
            } else { 
                allBillPhotos.unshift(savedPhoto); 
            }
            populateBillPhotosGallery();
        } catch (error) {
            console.error("Failed to save photo:", error);
        }
    };
    reader.readAsDataURL(file);
}

function populateBillPhotosGallery() {
    if (!billGallery) return; // Guard
    billGallery.innerHTML = '';
    if (!allBillPhotos.length) { billGallery.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No bills or receipts uploaded yet. Add an expense to include a photo!</p>'; return; }
    const sortedPhotos = [...allBillPhotos].sort((a, b) => b.id - a.id);
    sortedPhotos.forEach(photo => {
        const card = document.createElement('div'); card.className = 'bill-card fade-in-up'; card.dataset.dataurl = photo.dataUrl; 
        card.innerHTML = `<img src="${escapeHtml(photo.dataUrl)}" alt="${escapeHtml(photo.description)}"><p title="${escapeHtml(photo.description)}">${escapeHtml(photo.description)}</p>`;
        billGallery.appendChild(card);
    });
    billGallery.querySelectorAll('.bill-card').forEach(card => { card.addEventListener('click', function() { showPhotoModal(this.dataset.dataurl); }); });
}
function updateTopBarActions(viewId) { 
    const isFilterView = viewId === 'dashboard' || viewId === 'all-expenses';
    // Use 'style.display' to let CSS handle the 'flex' or 'none'
    if (filterControlsGroup) filterControlsGroup.style.display = isFilterView ? '' : 'none'; 
    if (timeFilterGroup) timeFilterGroup.style.display = isFilterView ? '' : 'none';
}

// Edit modal functions
function showEditModal(expenseId) {
    const expense = allExpenses.find(e => e.id === expenseId); if (!expense) return;
    expenseIdToEdit = expenseId;
    editExpenseIdInput.value = expense.id; editExpenseAmountInput.value = expense.amount; editExpenseCategoryInput.value = expense.cat;
    editExpenseDescInput.value = expense.desc; editExpenseDateInput.value = expense.date; editPaymentMethodInput.value = expense.paymentMethod;
    editMoodInput.value = expense.mood; editLocationInput.value = expense.location || '';
    editExpenseTypeInput.value = expense.type;
    editExpenseTypeSelector.querySelectorAll('.type-box').forEach(box => { if (box.dataset.type === expense.type) { box.classList.add('selected'); } else { box.classList.remove('selected'); } });
    const photo = allBillPhotos.find(p => p.expenseId === expenseId);
    if (expense.billPhoto && photo) { editBillPhotoPreview.src = photo.dataUrl; editPhotoPreviewContainer.classList.remove('hidden'); editPhotoUploadContainer.classList.add('hidden'); } 
    else { editPhotoPreviewContainer.classList.add('hidden'); editPhotoUploadContainer.classList.remove('hidden'); editBillPhotoUploadInput.value = ''; }
    editExpenseModal.classList.add('show'); editExpenseModal.setAttribute('aria-hidden', 'false');
}
function hideEditModal() { expenseIdToEdit = null; editExpenseForm.reset(); editExpenseModal.classList.remove('show'); editExpenseModal.setAttribute('aria-hidden', 'true'); }

// UPDATED: handleEditExpenseSubmit to use API
async function handleEditExpenseSubmit(e) {
    e.preventDefault(); if (!expenseIdToEdit) return;
    const expenseIndex = allExpenses.findIndex(e => e.id === expenseIdToEdit); if (expenseIndex === -1) return;
    
    // Create the updated expense object
    const updatedExpenseData = {
        id: expenseIdToEdit,
        date: editExpenseDateInput.value, 
        desc: editExpenseDescInput.value, 
        cat: editExpenseCategoryInput.value,
        amount: parseFloat(editExpenseAmountInput.value), 
        type: editExpenseTypeInput.value, 
        paymentMethod: editPaymentMethodInput.value,
        location: editLocationInput.value, 
        mood: editMoodInput.value,
        billPhoto: allExpenses[expenseIndex].billPhoto // Assume billPhoto state is managed by photo helpers
    };

    const files = editBillPhotoUploadInput.files;
    const isNewFile = files && files.length > 0;
    
    if (isNewFile) {
        updatedExpenseData.billPhoto = true;
    }
    
    try {
        // 1. Save the expense data
        const savedExpense = await api(`/api/expenses/${expenseIdToEdit}`, 'PUT', updatedExpenseData);
        
        // 2. If new file, upload it
        if (isNewFile) {
            await addBillPhotoToGallery(files[0], savedExpense); 
        }
        
        // 3. Update local photo description if no new file but text changed
        if (!isNewFile && savedExpense.billPhoto) {
            const photo = allBillPhotos.find(p => p.expenseId === savedExpense.id); 
            if (photo && (photo.description !== `${savedExpense.desc} (${savedExpense.cat})`)) {
                photo.description = `${savedExpense.desc} (${savedExpense.cat})`;
                // Send update to server
                await api('/api/photos', 'POST', photo);
            }
        }
        
        // 4. Update local state and UI
        allExpenses[expenseIndex] = savedExpense; // Update local array
        hideEditModal();
        applyFilters(); 
        if (document.getElementById('bill-photos-view').classList.contains('active')) { 
            populateBillPhotosGallery(); 
        }
        updateHomeSummary();
        
    } catch (error) {
        console.error("Failed to edit expense:", error);
    }
}

// UPDATED: handleDeletePhotoInEditModal to use API
async function handleDeletePhotoInEditModal() {
    if (!expenseIdToEdit) return;
    const expense = allExpenses.find(e => e.id === expenseIdToEdit); if (!expense) return;
    
    try {
        // 1. Delete photo from server (this also sets expense.billPhoto=0 on server)
        await api(`/api/photos/${expenseIdToEdit}`, 'DELETE');
        
        // 2. Update local state
        expense.billPhoto = false;
        const photoIndex = allBillPhotos.findIndex(p => p.expenseId === expenseIdToEdit); 
        if (photoIndex > -1) { 
            allBillPhotos.splice(photoIndex, 1); 
        }
        
        // 3. Update UI
        editPhotoPreviewContainer.classList.add('hidden'); 
        editPhotoUploadContainer.classList.remove('hidden'); 
        editBillPhotoUploadInput.value = '';
        if (document.getElementById('bill-photos-view').classList.contains('active')) { 
            populateBillPhotosGallery(); 
        }
        applyFilters(); // To update the table icon
    } catch (error) {
        console.error("Failed to delete photo:", error);
    }
}
function handleViewPhotoInEditModal() { if (!expenseIdToEdit) return; const photo = allBillPhotos.find(p => p.expenseId === expenseIdToEdit); if (photo) { showPhotoModal(photo.dataUrl); } }


// NEW: Helper function for category budgets (with guard)
function addCategoryBudgetRow(category = 'Food & Dining', amount = '') {
    const container = document.getElementById('category-budgets-container');
    if (!container) return; // FIX: Guard against null
    const row = document.createElement('div');
    row.className = 'form-section category-budget-row';
    row.innerHTML = `
        <div class="form-group">
            <select class="category-budget-select" style="width:100%; padding:.75rem; border:1px solid #ddd; border-radius:10px; font-family:inherit;">
                <option>Food & Dining</option>
                <option>Travel</option>
                <option>Education</option>
                <option>Entertainment</option>
                <option>Shopping</option>
                <option>Other</option>
            </select>
        </div>
        <div class="form-group">
            <input type="number" class="category-budget-amount" placeholder="₹ 0.00" step="0.01" min="0" value="${amount}" style="width:100%; padding:.75rem; border:1px solid #ddd; border-radius:10px; font-family:inherit;"/>
        </div>
    `;
    row.querySelector('.category-budget-select').value = category;
    container.appendChild(row);
}

// ==== Init ====
// UPDATED: initializeApp to be async and use loadData
async function initializeApp(){
  const dataLoaded = await loadData();
  
  if(!isMobile()) openSidebarStatic();
  
  switchView('home'); 
  updateHomeSummary();
  if(expenseDateInput) expenseDateInput.value = new Date().toISOString().split('T')[0];
  const now = new Date(); if(budgetMonthInput) budgetMonthInput.value = formatMonthLabel(now);
  if(incomeMonthInput) incomeMonthInput.value = formatMonthLabel(now); if(paymentDateInput) paymentDateInput.value = new Date().toISOString().split('T')[0];

  // NEW: Notification modal listeners
  if (notificationModalClose) notificationModalClose.addEventListener('click', hideNotificationModal);
  if (notificationModalOk) notificationModalOk.addEventListener('click', hideNotificationModal);

  // NEW: Budget banner toggle listener
  if (budgetBannerToggle) {
    budgetBannerToggle.addEventListener('click', () => {
        budgetBannerDetails.classList.toggle('open');
        budgetBannerToggle.classList.toggle('open');
    });
  }

  if (deleteModalClose) deleteModalClose.addEventListener('click', hideDeleteModal); 
  if (deleteCancel) deleteCancel.addEventListener('click', hideDeleteModal); 
  if (deleteConfirm) deleteConfirm.addEventListener('click', handleDeleteExpense);
  if (paymentRepeatCheckbox) paymentRepeatCheckbox.addEventListener('change', function() { if (this.checked) { repeatAfterGroup.classList.remove('hidden'); paymentRepeatDaysInput.disabled = false; paymentRepeatDaysInput.setAttribute('required', 'required'); paymentRepeatDaysInput.focus(); } else { repeatAfterGroup.classList.add('hidden'); paymentRepeatDaysInput.disabled = true; paymentRepeatDaysInput.removeAttribute('required'); paymentRepeatDaysInput.value = ''; } });
  if (photoModalClose) photoModalClose.addEventListener('click', hidePhotoModal);
  if (setIncomeBtn) setIncomeBtn.addEventListener('click', () => showIncomeModal(true)); 
  if (incomeModalClose) incomeModalClose.addEventListener('click', hideIncomeModal); 
  if (incomeCancel) incomeCancel.addEventListener('click', hideIncomeModal);
  
  // UPDATED: incomeForm submit listener to be async
  if (incomeForm) incomeForm.addEventListener('submit', async (e) => { 
      e.preventDefault(); 
      const val = Number(incomeAmountInput.value); 
      if (!isFinite(val) || val < 0) { 
          incomeAmountInput.focus(); 
          incomeAmountInput.select(); 
          return; 
      } 
      const key = getCurrentMonthKey(); 
      await setIncomeForMonth(key, val); 
      updateHomeSummary(); 
      applyFilters(); 
      hideIncomeModal(); 
  });
  
  if (addPaymentBtn) addPaymentBtn.addEventListener('click', showAddPaymentModal); 
  if (addPaymentModalClose) addPaymentModalClose.addEventListener('click', hideAddPaymentModal); 
  if (paymentCancel) paymentCancel.addEventListener('click', hideAddPaymentModal); 
  if (addPaymentForm) addPaymentForm.addEventListener('submit', handleAddPayment);
  if (deletePaymentModalClose) deletePaymentModalClose.addEventListener('click', hideDeletePaymentModal); 
  if (deletePaymentCancel) deletePaymentCancel.addEventListener('click', hideDeletePaymentModal); 
  if (deletePaymentConfirm) deletePaymentConfirm.addEventListener('click', handlePaymentDeleteConfirm);
  
  // UPDATED: budgetForm submit listener to be async
  if (budgetForm) budgetForm.addEventListener('submit', async (e)=>{ 
    e.preventDefault(); 
    const totalVal = Number(budgetAmountInput.value); 
    if (!isFinite(totalVal) || totalVal < 0){ 
        showNotificationModal("Please enter a valid total budget amount.");
        budgetAmountInput.focus(); 
        budgetAmountInput.select(); 
        return; 
    } 
    
    let categorySum = 0;
    const tempCategories = {}; 

    document.querySelectorAll('.category-budget-row').forEach(row => {
        const category = row.querySelector('.category-budget-select').value;
        const amount = Number(row.querySelector('.category-budget-amount').value);
        if (category && amount > 0) {
            categorySum += amount;
            tempCategories[category] = (tempCategories[category] || 0) + amount;
        }
    });

    if (categorySum > totalVal) {
        showNotificationModal(`Error: The sum of your category budgets (₹${categorySum.toFixed(2)}) exceeds your total budget (₹${totalVal.toFixed(2)}).<br><br>Please adjust your amounts.`);
        return; 
    }

    const key = getCurrentMonthKey(); 
    const newBudget = {
        total: totalVal,
        categories: tempCategories 
    };

    await setBudgetForMonth(key, newBudget); // Save the new object
    updateHomeSummary(); 
    applyFilters(); 
    hideBudgetModal(); 
  });

  // NEW: Add category budget row listener (with guard)
  const addCatBudgetBtn = document.getElementById('add-category-budget-btn');
  if (addCatBudgetBtn) {
      addCatBudgetBtn.addEventListener('click', () => {
        addCategoryBudgetRow();
      });
  } else {
      console.warn("Spendlens: 'add-category-budget-btn' not found in HTML. Category budget feature will be limited.");
  }


  if (editExpenseModalClose) editExpenseModalClose.addEventListener('click', hideEditModal); 
  if (editExpenseCancel) editExpenseCancel.addEventListener('click', hideEditModal); 
  if (editExpenseForm) editExpenseForm.addEventListener('submit', handleEditExpenseSubmit);
  if (editDeletePhotoBtn) editDeletePhotoBtn.addEventListener('click', handleDeletePhotoInEditModal); 
  if (editViewPhotoBtn) editViewPhotoBtn.addEventListener('click', handleViewPhotoInEditModal); 
  if (editBillPhotoPreview) editBillPhotoPreview.addEventListener('click', handleViewPhotoInEditModal); 
  if (editExpenseTypeSelector) editExpenseTypeSelector.querySelectorAll('.type-box').forEach(box => { box.addEventListener('click', function() { editExpenseTypeSelector.querySelectorAll('.type-box').forEach(b => b.classList.remove('selected')); this.classList.add('selected'); editExpenseTypeInput.value = this.dataset.type; }); });

  // Only show welcome modal if data loaded AND userName is still 'User'
  if (dataLoaded && userName === 'User') {
      showWelcomeModal(false);
  }
  
  // UPDATED: welcomeForm submit listener to be async
  if (renameBtn) renameBtn.addEventListener('click', () => { showWelcomeModal(true); });
  if (welcomeForm) welcomeForm.addEventListener('submit', async function(e) { 
      e.preventDefault(); 
      const name = userNameInput.value.trim(); 
      if (name) { 
          await saveUserName(name); 
          updateUserNameDisplay(); 
          hideWelcomeModal(); 
          if (document.getElementById('home-view').classList.contains('active')) { 
              dashboardSubtitle.textContent=`Welcome to Spendlens, ${userName}!`; 
          } 
      } 
  });

  const homeCtaEmpty = document.getElementById('home-cta-add-first');
  const homeCtaManage = document.getElementById('home-cta-manage');
  const homeCtaAdd = document.getElementById('home-cta-add');
  if (homeCtaEmpty) homeCtaEmpty.addEventListener('click', () => switchView('add-expense'));
  if (homeCtaManage) homeCtaManage.addEventListener('click', () => switchView('dashboard'));
  if (homeCtaAdd) homeCtaAdd.addEventListener('click', () => switchView('add-expense'));

  updateUserNameDisplay();

  // NEW: Mobile Filter Modal Logic (with guards)
  if (filterButtons && mobileFilterOptions) {
      filterButtons.forEach(btn => {
          const clone = btn.cloneNode(true);
          clone.style.width = '100%';
          clone.style.padding = '0.75rem';
          clone.style.justifyContent = 'center';
          clone.classList.remove('active'); // Remove active state
          
          if (btn.classList.contains('active')) {
              clone.classList.add('active'); 
          }
          
          clone.addEventListener('click', function() {
              filterButtons.forEach(b => b.classList.remove('active'));
              const originalBtn = document.querySelector(`.filter-btn[data-filter="${this.dataset.filter}"]`);
              if (originalBtn) originalBtn.classList.add('active');
              
              mobileFilterOptions.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
              this.classList.add('active');
              
              applyFilters();
              if (mobileFilterModal) mobileFilterModal.classList.remove('show');
          });
          mobileFilterOptions.appendChild(clone);
      });
  }

  if (mobileFilterBtn) mobileFilterBtn.addEventListener('click', () => {
      const currentFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
      if (mobileFilterOptions) {
          mobileFilterOptions.querySelectorAll('.filter-btn').forEach(b => {
              if (b.dataset.filter === currentFilter) {
                  b.classList.add('active');
              } else {
                  b.classList.remove('active');
              }
          });
      }
      if (mobileFilterModal) mobileFilterModal.classList.add('show');
  });

  if (mobileFilterClose) mobileFilterClose.addEventListener('click', () => {
      if (mobileFilterModal) mobileFilterModal.classList.remove('show');
  });
  // END: Mobile Filter Modal Logic

}

function switchView(viewId){
  views.forEach(v=>v.classList.remove('active')); 
  navLinks.forEach(a=>a.classList.remove('active'));
  mobileNavLinks.forEach(a=>a.classList.remove('active')); 

  const activeView = document.getElementById(viewId+'-view'); 
  const activeLink = document.querySelector(`.sidebar-nav a[data-view="${viewId}"]`); 
  const activeMobileLink = document.querySelector(`.mobile-nav-link[data-view="${viewId}"]`); 

  if(activeView) activeView.classList.add('active'); 
  if(activeLink) activeLink.classList.add('active');
  if(activeMobileLink) activeMobileLink.classList.add('active'); 

  updateTopBarActions(viewId); // Update button/filter visibility
  
  const currentFilter = document.querySelector('.filter-btn.active');
  const typeFilter = currentFilter?.dataset.filter || 'all';

  if (viewId !== 'dashboard' && viewId !== 'all-expenses') {
    if (currentFilter && typeFilter !== 'all') {
        currentFilter.classList.remove('active');
        const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allFilterBtn) allFilterBtn.classList.add('active');
    }
    if (timeFilterSelect) timeFilterSelect.value = 'this-month'; // Reset time filter
  }

  if(viewId==='home'){ dashboardTitle.textContent='Home'; dashboardSubtitle.textContent=`Welcome to Spendlens, ${userName}!`; updateHomeSummary(); }
  else if(viewId==='dashboard'){ 
    dashboardTitle.textContent='Financial Dashboard'; 
    const now=new Date(); 
    dashboardSubtitle.textContent=`${now.toLocaleString('default',{month:'long'})} ${now.getFullYear()} • A lens to view your spending habits`; 
    if (timeFilterSelect) timeFilterSelect.value = 'this-month'; // Default to this month
    applyFilters(); // Apply default filters
    populateUpcomingPayments(); 
  }
  else if(viewId==='add-expense'){ dashboardTitle.textContent='Add Expense'; dashboardSubtitle.textContent='Record a new transaction'; if (expenseDateInput) expenseDateInput.value=new Date().toISOString().split('T')[0]; const monthKey = getCurrentMonthKey(); if (getIncomeForMonth(monthKey) === null) { showIncomeModal(true); } }
  else if(viewId==='all-expenses'){ 
    dashboardTitle.textContent='All Expenses'; 
    dashboardSubtitle.textContent='Browse every recorded transaction'; 
    if (timeFilterSelect) timeFilterSelect.value = 'this-month'; // Default to this month
    applyFilters(); // Apply default filters
  }
  else if(viewId==='bill-photos'){ dashboardTitle.textContent='Bills & Receipts'; dashboardSubtitle.textContent='Manage your uploaded bills'; populateBillPhotosGallery(); } 
}

// UPDATED: updateHomeSummary logic for new budget object
function updateHomeSummary(){
  const now = new Date(); const m = now.getMonth(); const y = now.getFullYear(); const monthKey=getCurrentMonthKey();
  const thisMonthExpenses = allExpenses.filter(e=>{ const d=new Date(e.date); return d.getMonth()===m && d.getFullYear()===y; });
  const thisMonthTotal = thisMonthExpenses.reduce((s,e)=>s+Number(e.amount||0),0);
  
  const dailyAvg = thisMonthTotal > 0 ? thisMonthTotal / now.getDate() : 0;
  const income = getIncomeForMonth(monthKey); const balance = income != null ? income - thisMonthTotal : null; 
  
  const heroEmpty = document.getElementById('home-hero-empty');
  const heroActive = document.getElementById('home-hero-active');
  const summarySection = document.getElementById('home-summary-section');

  if (heroEmpty && heroActive && summarySection) {
      if (allExpenses.length === 0) {
          heroEmpty.classList.remove('hidden');
          heroActive.classList.add('hidden');
          summarySection.classList.add('hidden');
      } else {
          heroEmpty.classList.add('hidden');
          heroActive.classList.remove('hidden');
          summarySection.classList.remove('hidden');
      }
  }

  if (homeThisMonth) homeThisMonth.textContent = `₹${thisMonthTotal.toFixed(2)}`; 
  if (homeDailyAvg) homeDailyAvg.textContent = `₹${dailyAvg.toFixed(2)}`;
  if (income != null) { 
      if (homeThisMonthIncome) homeThisMonthIncome.textContent = `₹${Number(income).toFixed(2)}`; 
      if (homeIncomeRemark) homeIncomeRemark.textContent = 'Total Income'; 
      if (homeBalance) homeBalance.textContent = `₹${balance.toFixed(2)}`; 
  } else { 
      if (homeThisMonthIncome) homeThisMonthIncome.textContent = '—'; 
      if (homeIncomeRemark) homeIncomeRemark.textContent = 'Tap "Set Income" to start'; 
      if (homeBalance) homeBalance.textContent = '—'; 
  }
  
  const budget = getBudgetForMonth(monthKey); // This is now an object
  if(budget != null && budget.total){ 
      const totalBudget = Number(budget.total);
      if (homeBudgetRemark) homeBudgetRemark.textContent = thisMonthTotal <= totalBudget ? `Budget: ₹${totalBudget.toFixed(2)}` : `Budget exceeded by: ₹${(thisMonthTotal - totalBudget).toFixed(2)}`; 
  } else { 
      if (homeBudgetRemark) homeBudgetRemark.textContent='Tap “Set Budget” to start'; 
  }
}

// NEW: Central filter function
function getFilteredExpenses(typeFilter = 'all', timeFilter = 'this-month') {
    let filtered = allExpenses;
    
    if (typeFilter === 'personal') {
        filtered = allExpenses.filter(e => e.type === 'personal');
    } else if (typeFilter === 'organization') {
        filtered = allExpenses.filter(e => e.type === 'organization');
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 

    switch (timeFilter) {
        case 'this-month':
            return filtered.filter(e => {
                const d = new Date(e.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
        case 'last-7-days':
            const sevenDaysAgo = new Date(today.getTime() - (6 * 24 * 60 * 60 * 1000)); 
            return filtered.filter(e => new Date(e.date) >= sevenDaysAgo);
        case 'last-30-days':
            const thirtyDaysAgo = new Date(today.getTime() - (29 * 24 * 60 * 60 * 1000)); 
            return filtered.filter(e => new Date(e.date) >= thirtyDaysAgo);
        case 'this-year':
            return filtered.filter(e => new Date(e.date).getFullYear() === now.getFullYear());
        case 'all':
        default:
            return filtered; 
    }
}

// NEW: Central function to apply filters from UI
function applyFilters() {
    const typeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const timeFilter = timeFilterSelect ? timeFilterSelect.value : 'this-month';
    const currentView = document.querySelector('.view.active');
    if (!currentView) return;
    
    if (currentView.id === 'dashboard-view') {
        populateDashboard(typeFilter, timeFilter);
    } else if (currentView.id === 'all-expenses-view') {
        populateAllExpensesTable(typeFilter, timeFilter);
    }
}

// ******** CHANGED BLOCK START ********
// UPDATED: populateDashboard to handle *all* budget alerts
function populateDashboard(typeFilter, timeFilter){
  const filteredExpenses = getFilteredExpenses(typeFilter, timeFilter);
  
  const now=new Date(); const cm=now.getMonth(); const cy=now.getFullYear(); const monthKey=getCurrentMonthKey();
  
  const thisMonthExpenses = getFilteredExpenses(typeFilter, 'this-month');
  const thisMonthTotal = thisMonthExpenses.reduce((s,e)=>s+Number(e.amount||0),0);
  const dailyAvg = thisMonthTotal > 0 ? thisMonthTotal / new Date().getDate() : 0;
  
  const income = getIncomeForMonth(monthKey) || 0; const balance = income - thisMonthTotal;
  if (monthlyIncome) monthlyIncome.textContent = `₹${Number(income).toFixed(2)}`; 
  if (thisMonthSpent) thisMonthSpent.textContent=`₹${thisMonthTotal.toFixed(2)}`; 
  if (dailyAverage) dailyAverage.textContent=`₹${dailyAvg.toFixed(2)}`; 
  if (remainingBalance) remainingBalance.textContent=`₹${balance.toFixed(2)}`;
  
  const budgetData = getBudgetForMonth(monthKey); 
  
  // NEW: Collect all alerts
  let budgetAlerts = []; 
  
  if (budgetData && budgetData.total && thisMonthTotal > Number(budgetData.total)) {
      budgetAlerts.push(`<b>Total Budget:</b> Crossed by ₹${(thisMonthTotal - budgetData.total).toFixed(2)}`);
  } 
  
  if (budgetData && budgetData.categories) {
      const categoryTotals = thisMonthExpenses.reduce((acc, e) => {
          acc[e.cat] = (acc[e.cat] || 0) + Number(e.amount);
          return acc;
      }, {});
      
      // Check *all* categories, don't break
      for (const category in budgetData.categories) {
          const categoryBudget = budgetData.categories[category];
          const categorySpent = categoryTotals[category] || 0;
          if (categorySpent > categoryBudget) {
              budgetAlerts.push(`<b>${category}:</b> Crossed by ₹${(categorySpent - categoryBudget).toFixed(2)}`);
          }
      }
  }
  
  // Now, render the alerts
  if (budgetBanner) {
      if (budgetAlerts.length > 0) {
          // Set summary text
          if (budgetBannerText) budgetBannerText.textContent = `Budget crossed in ${budgetAlerts.length} ${budgetAlerts.length > 1 ? 'areas' : 'area'}.`;
          
          // Populate details
          if (budgetBannerDetails) {
              budgetBannerDetails.innerHTML = `<ul>${budgetAlerts.map(alert => `<li>${alert}</li>`).join('')}</ul>`;
          }
          
          // Show banner and toggle button
          budgetBanner.classList.remove('hidden');
          if (budgetBannerToggle) budgetBannerToggle.classList.remove('hidden');

      } else {
          // Hide all
          budgetBanner.classList.add('hidden');
          if (budgetBannerToggle) budgetBannerToggle.classList.add('hidden');
          if (budgetBannerDetails) budgetBannerDetails.classList.remove('open'); // Close it
          if (budgetBannerToggle) budgetBannerToggle.classList.remove('open');
      }
  }
  
  if (recentExpensesList) {
      recentExpensesList.innerHTML=''; 
      const sortedRecent=[...filteredExpenses].sort((a,b)=> new Date(b.date)-new Date(a.date)).slice(0,5);
      if(!sortedRecent.length) recentExpensesList.innerHTML='<li>No expenses found for this period.</li>';
      else sortedRecent.forEach(exp=>{ const li=document.createElement('li'); const mood=exp.mood? ` • <span>${moodLabel(exp.mood)}</span>`:''; li.innerHTML=`<div class="expense-item-info"><h4>${escapeHtml(exp.desc)} <span class="expense-category ${escapeHtml(exp.cat.split(' ')[0].toLowerCase())}">${escapeHtml(exp.cat)}</span></h4><p>${escapeHtml(exp.date)}${mood}</p></div><div class="expense-item-amount">₹${Number(exp.amount).toFixed(2)}</div>`; recentExpensesList.appendChild(li); });
  }
  
  updateCharts(filteredExpenses);
}
// ******** CHANGED BLOCK END ********


function updateCharts(data){
  const trendCanvas=document.getElementById('spending-trend-chart'); const catCanvas=document.getElementById('categories-chart'); if(!trendCanvas||!catCanvas) return;
  const trendCtx=trendCanvas.getContext('2d'); if(spendingTrendChart) spendingTrendChart.destroy();
  const sorted=[...data].sort((a,b)=> new Date(a.date)-new Date(a.date)); const labels=sorted.map(e=>e.date); const values=sorted.map(e=>Number(e.amount||0));
  spendingTrendChart=new Chart(trendCtx,{ type:'line', data:{ labels: labels.length?labels:['No data'], datasets:[{ label:'Spending', data:values, borderColor:'#18BC9C', backgroundColor:'rgba(24,188,156,.1)', fill:true, tension:.4 }]}, options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true } } } });
  const catCtx=catCanvas.getContext('2d'); const categoryData=data.reduce((acc,e)=>{ acc[e.cat]=(acc[e.cat]||0)+Number(e.amount||0); return acc; },{});
  if(categoriesChart) categoriesChart.destroy();
  categoriesChart=new Chart(catCtx,{ type:'doughnut', data:{ labels:Object.keys(categoryData).length?Object.keys(categoryData):['No expenses'], datasets:[{ data:Object.keys(categoryData).length?Object.values(categoryData):[1], backgroundColor:['purple','orange','crimson','steelblue','mediumseagreen','darkgray'] }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ usePointStyle:true, pointStyle:'circle', boxWidth:12, boxHeight:12 }, display:true, position:'top', align:'center' } } } });
}

// UPDATED: populateAllExpensesTable to use new filters and ID
function populateAllExpensesTable(typeFilter, timeFilter){
  if (!allExpensesTbody) return; // Guard
  allExpensesTbody.innerHTML=''; 
  const filteredExpenses = getFilteredExpenses(typeFilter, timeFilter);
  
  const sorted=[...filteredExpenses].sort((a,b)=> new Date(b.date)-new Date(a.date)); 
  if(!sorted.length){ allExpensesTbody.innerHTML=`<tr><td colspan="10">No ${typeFilter === 'all' ? '' : typeFilter} expenses found for this period.</td></tr>`; return; } 

  sorted.forEach((exp)=>{
    let imageCellContent = '<span class="table-no-img">—</span>';
    if (exp.billPhoto) {
        imageCellContent = `
            <div class="table-img-icon-group">
                <i class="fas fa-image table-view-img-btn" data-id="${exp.id}" title="View Photo"></i>
                <i class="fas fa-pen table-edit-img-btn" data-id="${exp.id}" title="Edit Image"></i>
            </div>
        `;
    } else {
         imageCellContent = `
            <div class="table-img-icon-group">
                 <span class="table-no-img" style="margin-right: 4px;">—</span>
                <i class="fas fa-plus table-edit-img-btn" data-id="${exp.id}" title="Add Image"></i>
            </div>
        `;
    }

    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td data-label="Date">${escapeHtml(exp.date)}</td>
      <td data-label="Description">${escapeHtml(exp.desc)}</td>
      <td data-label="Category"><span class="expense-category ${escapeHtml(exp.cat.split(' ')[0].toLowerCase())}">${escapeHtml(exp.cat)}</span></td>
      <td data-label="Amount">₹${Number(exp.amount).toFixed(2)}</td>
      <td data-label="Payment Method">${escapeHtml(exp.paymentMethod||'')}</td>
      <td data-label="Type">${escapeHtml(exp.type||'')}</td>
      <td data-label="Location">${escapeHtml(exp.location||'')}</td>
      <td data-label="Mood">${exp.mood? moodLabel(exp.mood):''}</td>
      <td data-label="Image">${imageCellContent}</td>
      <td data-label="Action">
        <button class="edit-action-btn" data-id="${exp.id}" title="Edit Expense"><i class="fas fa-pen-to-square"></i></button>
        <button class="delete-action-btn" data-id="${exp.id}" title="Delete"><i class="fas fa-trash"></i></button>
      </td>
    `;
    allExpensesTbody.appendChild(tr);
  });

  document.querySelectorAll('.table-view-img-btn').forEach(btn => {
      btn.addEventListener('click', function() {
          const id = parseInt(this.dataset.id);
          const photo = allBillPhotos.find(p => p.expenseId === id);
          if (photo) showPhotoModal(photo.dataUrl);
      });
  });
  
  document.querySelectorAll('.table-edit-img-btn, .edit-action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const id = parseInt(this.dataset.id);
        showEditModal(id);
    });
  });

  document.querySelectorAll('.delete-action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      const expense = allExpenses.find(e => e.id === id);
      if (expense) {
        showDeleteModal(expense);
      }
    });
  });
}

function openSidebarStatic(){ if (sidebar) { sidebar.classList.remove('open'); sidebar.setAttribute('aria-hidden','false'); } }

if (collapseToggle) collapseToggle.addEventListener('click', function(){ if(isMobile()) return; if (sidebar) sidebar.classList.toggle('collapsed'); this.querySelector('i').classList.toggle('fa-angles-left'); this.querySelector('i').classList.toggle('fa-angles-right'); });
window.addEventListener('resize', ()=>{ if(!isMobile()) { openSidebarStatic(); } const activeView = document.querySelector('.view.active'); if (activeView) updateTopBarActions(activeView.id); });
const sidebarNavUl = document.querySelector('.sidebar-nav ul');
if (sidebarNavUl) sidebarNavUl.addEventListener('click', function(e){ const link=e.target.closest('a[data-view]'); if(!link) return; e.preventDefault(); switchView(link.dataset.view); });
if (mobileNav) mobileNav.addEventListener('click', function(e) { const link = e.target.closest('a[data-view]'); if (!link) return; e.preventDefault(); switchView(link.dataset.view); });

const rightActions = document.querySelector('.right-actions');
if (rightActions) rightActions.addEventListener('click', function(e){ const btn=e.target.closest('.filter-btn'); if(!btn) return; filterButtons.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); applyFilters(); });
if (timeFilterSelect) timeFilterSelect.addEventListener('change', applyFilters);

if (headerAddBtn) headerAddBtn.addEventListener('click', ()=> switchView('add-expense')); 
if (cancelBtn) cancelBtn.addEventListener('click', ()=> switchView('home')); 
if (expenseTypeBoxes) expenseTypeBoxes.forEach(box=>{ box.addEventListener('click', function(){ expenseTypeBoxes.forEach(b=>b.classList.remove('selected')); this.classList.add('selected'); if (expenseTypeInput) expenseTypeInput.value=this.dataset.type; }); });

// UPDATED: showBudgetModal function (with guards)
function showBudgetModal(){
    const now=new Date();
    const monthKey = getCurrentMonthKey();
    const existingBudget = getBudgetForMonth(monthKey); // This will be an object or null
    
    if (budgetMonthInput) budgetMonthInput.value = formatMonthLabel(now);
    
    // Clear old category rows (with guard)
    const catContainer = document.getElementById('category-budgets-container');
    if (catContainer) {
        catContainer.innerHTML = '';
        if (existingBudget && existingBudget.categories) {
            for (const category in existingBudget.categories) {
                addCategoryBudgetRow(category, existingBudget.categories[category]);
            }
        }
    }

    if (existingBudget) {
        if (budgetAmountInput) budgetAmountInput.value = existingBudget.total || '';
    } else {
        if (budgetAmountInput) budgetAmountInput.value = '';
    }
    
    if (budgetModal) {
        budgetModal.classList.add('show');
        budgetModal.setAttribute('aria-hidden','false');
    }
    if (budgetAmountInput) budgetAmountInput.focus();
}
function hideBudgetModal(){ if (budgetModal) { budgetModal.classList.remove('show'); budgetModal.setAttribute('aria-hidden','true'); } }
if (setBudgetBtn) setBudgetBtn.addEventListener('click', showBudgetModal); 
if (budgetModalClose) budgetModalClose.addEventListener('click', hideBudgetModal); 
if (budgetCancel) budgetCancel.addEventListener('click', hideBudgetModal); 

// UPDATED: addExpenseForm submit listener to be async and use API
if (addExpenseForm) addExpenseForm.addEventListener('submit', async function(e){ 
    e.preventDefault(); 
    const monthKey = getCurrentMonthKey(); 
    if (getIncomeForMonth(monthKey) === null) { 
        showIncomeModal(true); 
        return; 
    } 
    
    const files = billPhotoUploadInput.files; 
    const hasBillPhoto = files && files.length > 0; 
    
    const newExpenseData={ 
        date: document.getElementById('expense-date').value, 
        desc: document.getElementById('expense-desc').value, 
        cat: document.getElementById('expense-category').value, 
        amount: parseFloat(document.getElementById('expense-amount').value), 
        type: document.getElementById('expense-type').value, 
        paymentMethod: document.getElementById('payment-method').value, 
        location: document.getElementById('location').value, 
        mood: document.getElementById('mood').value, 
        billPhoto: hasBillPhoto 
    }; 
    
    try {
        // 1. Save the new expense, get the saved version back
        const newExpense = await api('/api/expenses', 'POST', newExpenseData);
        allExpenses.unshift(newExpense); 
        
        // 2. If there's a photo, upload it
        if (hasBillPhoto) { 
            await addBillPhotoToGallery(files[0], newExpense); 
        }
        
        // 3. Reset form and switch view
        addExpenseForm.reset(); 
        if (billPhotoUploadInput) billPhotoUploadInput.value = ''; 
        expenseTypeBoxes.forEach(b=>b.classList.remove('selected')); 
        const defaultTypeBox = document.querySelector('.type-box[data-type="personal"]'); 
        if (defaultTypeBox) defaultTypeBox.classList.add('selected'); 
        if (expenseTypeInput) expenseTypeInput.value='personal'; 
        if (expenseDateInput) expenseDateInput.value=new Date().toISOString().split('T')[0]; 
        switchView('home');
    } catch (error) {
        console.error("Failed to add expense:", error);
    }
});
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ if(welcomeModal && welcomeModal.classList.contains('show')) hideWelcomeModal(); else if(budgetModal && budgetModal.classList.contains('show')) hideBudgetModal(); else if(incomeModal && incomeModal.classList.contains('show')) hideIncomeModal(); else if(addPaymentModal && addPaymentModal.classList.contains('show')) hideAddPaymentModal(); else if(deleteModal && deleteModal.classList.contains('show')) hideDeleteModal(); else if(deletePaymentModal && deletePaymentModal.classList.contains('show')) hideDeletePaymentModal(); else if(photoModal && photoModal.classList.contains('show')) hidePhotoModal(); else if(editExpenseModal && editExpenseModal.classList.contains('show')) hideEditModal(); else if(mobileFilterModal && mobileFilterModal.classList.contains('show')) mobileFilterModal.classList.remove('show'); else if(notificationModal && notificationModal.classList.contains('show')) hideNotificationModal(); } });
function escapeHtml(str){ return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }

// Call the async initializer
initializeApp();
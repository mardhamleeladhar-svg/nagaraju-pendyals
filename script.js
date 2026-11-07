
// ============================================
// NAGARAJU PENDYALS WEBSITE
// SERVICES + GALLERY + FEEDBACK + OWNER LOGIN
// FORGOT PASSWORD + PRIVATE OWNER DASHBOARD
// ============================================

// ============================================
// SUPABASE SETTINGS
// ============================================

const SUPABASE_URL = "https://fiqasbcxxulzsdkhermp.supabase.co/rest/v1";

const SUPABASE_KEY = "sb_publishable_Dud-B8aj8jiBboAswq8Svg_QyYK5CA4";




const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Netlify website address for password recovery
const PASSWORD_REDIRECT_URL =
    "https://sweet-fudge-839125.netlify.app/";

// ============================================
// PAGINATION SETTINGS
// ============================================

const SERVICES_PER_PAGE = 4;
const PHOTOS_PER_PAGE = 4;

let currentServicesPage = 1;
let currentGalleryPage = 1;
let selectedService = null;

// ============================================
// SERVICE DATA — 8 CATEGORIES
// ============================================

const services = [
    {
        name: "Wedding Pandals",
        description: "Beautiful pandal arrangements for weddings.",
        photos: [
            "photo-1519741497674-611481863552",
            "photo-1519225421980-715cb0215aed",
            "photo-1464366400600-7168b8af9bc3",
            "photo-1511285560929-80b456fea0bc",
            "photo-1465495976277-4387d4b0e4a6",
            "photo-1507504031003-b417219a0fde"
        ]
    },
    {
        name: "Event Tents",
        description: "Tent arrangements for special occasions.",
        photos: [
            "photo-1519167758481-83f550bb49b3",
            "photo-1511795409834-ef04bbd61622",
            "photo-1478146896981-b80fe463b330",
            "photo-1519225421980-715cb0215aed",
            "photo-1464366400600-7168b8af9bc3",
            "photo-1507504031003-b417219a0fde"
        ]
    },
    {
        name: "Chairs",
        description: "Seating arrangements for your guests.",
        photos: [
            "photo-1507504031003-b417219a0fde",
            "photo-1511795409834-ef04bbd61622",
            "photo-1519167758481-83f550bb49b3",
            "photo-1464366400600-7168b8af9bc3",
            "photo-1519225421980-715cb0215aed",
            "photo-1478146896981-b80fe463b330"
        ]
    },
    {
        name: "Tables",
        description: "Table arrangements for events and functions.",
        photos: [
            "photo-1519167758481-83f550bb49b3",
            "photo-1464366400600-7168b8af9bc3",
            "photo-1511795409834-ef04bbd61622",
            "photo-1507504031003-b417219a0fde",
            "photo-1519225421980-715cb0215aed",
            "photo-1478146896981-b80fe463b330"
        ]
    },
    {
        name: "Iron Poles",
        description: "Support poles for event structures.",
        photos: [
            "photo-1519167758481-83f550bb49b3",
            "photo-1511795409834-ef04bbd61622",
            "photo-1507504031003-b417219a0fde",
            "photo-1464366400600-7168b8af9bc3",
            "photo-1519225421980-715cb0215aed",
            "photo-1478146896981-b80fe463b330"
        ]
    },
    {
        name: "Stage Decoration",
        description: "Stage decoration for weddings and celebrations.",
        photos: [
            "photo-1519741497674-611481863552",
            "photo-1464366400600-7168b8af9bc3",
            "photo-1519225421980-715cb0215aed",
            "photo-1511285560929-80b456fea0bc",
            "photo-1465495976277-4387d4b0e4a6",
            "photo-1507504031003-b417219a0fde"
        ]
    },
    {
        name: "Lighting Decoration",
        description: "Lighting ideas for memorable celebrations.",
        photos: [
            "photo-1519167758481-83f550bb49b3",
            "photo-1511795409834-ef04bbd61622",
            "photo-1464366400600-7168b8af9bc3",
            "photo-1519225421980-715cb0215aed",
            "photo-1507504031003-b417219a0fde",
            "photo-1478146896981-b80fe463b330"
        ]
    },
    {
        name: "Flower Decoration",
        description: "Flower decoration for special occasions.",
        photos: [
            "photo-1464366400600-7168b8af9bc3",
            "photo-1519741497674-611481863552",
            "photo-1519225421980-715cb0215aed",
            "photo-1511285560929-80b456fea0bc",
            "photo-1465495976277-4387d4b0e4a6",
            "photo-1507504031003-b417219a0fde"
        ]
    }
];

// ============================================
// IMAGE HELPER
// ============================================

function imageURL(photoId) {
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;
}

// ============================================
// PAGE NAVIGATION
// ============================================

function showPage(pageId, clickedButton) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    document.querySelectorAll("nav button").forEach(button => {
        button.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    } else {
        const matchingButton = [...document.querySelectorAll("nav button")]
            .find(button =>
                button.getAttribute("onclick")?.includes(pageId)
            );

        if (matchingButton) {
            matchingButton.classList.add("active");
        }
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageId === "ownerPage") {
        checkOwnerSession();
    }

    if (pageId === "reviewsPage") {
        document.getElementById("reviewsMessage").textContent =
            "Customer reviews are private. Only the website owner can view them.";

        document.getElementById("reviewsGrid").innerHTML = "";
    }
}

// ============================================
// DISPLAY SERVICES
// ============================================

function displayServices() {
    const grid = document.getElementById("servicesGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const start = (currentServicesPage - 1) * SERVICES_PER_PAGE;

    const visibleServices = services.slice(
        start,
        start + SERVICES_PER_PAGE
    );

    visibleServices.forEach((service, index) => {
        const actualIndex = start + index;

        const card = document.createElement("div");
        card.className = "service-card";

        card.innerHTML = `
            <img
                src="${imageURL(service.photos[0])}"
                alt="${service.name}"
                loading="lazy">

            <div class="service-card-content">
                <h3>${service.name}</h3>
                <p>${service.description}</p>

                <button class="primary-button" type="button">
                    View Photos
                </button>
            </div>
        `;

        card.addEventListener("click", () => {
            openGallery(actualIndex);
        });

        grid.appendChild(card);
    });

    renderServicesPagination();
}

// ============================================
// SERVICES PAGINATION
// ============================================

function renderServicesPagination() {
    const container = document.getElementById("servicesPagination");

    if (!container) return;

    const totalPages = Math.ceil(
        services.length / SERVICES_PER_PAGE
    );

    container.innerHTML = "";

    const previous = document.createElement("button");
    previous.textContent = "Previous";
    previous.disabled = currentServicesPage === 1;

    previous.onclick = () => {
        changeServicesPage(currentServicesPage - 1);
    };

    container.appendChild(previous);

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");
        button.textContent = page;

        if (page === currentServicesPage) {
            button.classList.add("active");
        }

        button.onclick = () => changeServicesPage(page);

        container.appendChild(button);
    }

    const next = document.createElement("button");
    next.textContent = "Next";
    next.disabled = currentServicesPage === totalPages;

    next.onclick = () => {
        changeServicesPage(currentServicesPage + 1);
    };

    container.appendChild(next);
}

function changeServicesPage(page) {
    const totalPages = Math.ceil(
        services.length / SERVICES_PER_PAGE
    );

    if (page < 1 || page > totalPages) return;

    currentServicesPage = page;
    displayServices();

    document.getElementById("servicesGrid").scrollIntoView({
        behavior: "smooth"
    });
}

// ============================================
// GALLERY
// ============================================

function openGallery(serviceIndex) {
    selectedService = services[serviceIndex];

    if (!selectedService) return;

    currentGalleryPage = 1;

    document.getElementById("galleryTitle").textContent =
        selectedService.name + " Gallery";

    document.getElementById("galleryDescription").textContent =
        selectedService.description + " These are sample reference photos.";

    displayGalleryPhotos();

    showPage("galleryPage");
}

function displayGalleryPhotos() {
    if (!selectedService) return;

    const grid = document.getElementById("photoGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const start = (currentGalleryPage - 1) * PHOTOS_PER_PAGE;

    const visiblePhotos = selectedService.photos.slice(
        start,
        start + PHOTOS_PER_PAGE
    );

    visiblePhotos.forEach((photo, index) => {
        const photoNumber = start + index + 1;

        const card = document.createElement("div");
        card.className = "gallery-card";

        const img = document.createElement("img");
        img.src = imageURL(photo);
        img.alt = selectedService.name + " sample photo " + photoNumber;
        img.loading = "lazy";

        const caption = document.createElement("p");
        caption.textContent =
            selectedService.name + " - Photo " + photoNumber;

        card.appendChild(img);
        card.appendChild(caption);

        grid.appendChild(card);
    });

    renderGalleryPagination();
}

function renderGalleryPagination() {
    const container = document.getElementById("galleryPagination");

    if (!container || !selectedService) return;

    const totalPages = Math.ceil(
        selectedService.photos.length / PHOTOS_PER_PAGE
    );

    container.innerHTML = "";

    const previous = document.createElement("button");
    previous.textContent = "Previous";
    previous.disabled = currentGalleryPage === 1;

    previous.onclick = () => {
        changeGalleryPage(currentGalleryPage - 1);
    };

    container.appendChild(previous);

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");
        button.textContent = page;

        if (page === currentGalleryPage) {
            button.classList.add("active");
        }

        button.onclick = () => changeGalleryPage(page);

        container.appendChild(button);
    }

    const next = document.createElement("button");
    next.textContent = "Next";
    next.disabled = currentGalleryPage === totalPages;

    next.onclick = () => {
        changeGalleryPage(currentGalleryPage + 1);
    };

    container.appendChild(next);
}

function changeGalleryPage(page) {
    if (!selectedService) return;

    const totalPages = Math.ceil(
        selectedService.photos.length / PHOTOS_PER_PAGE
    );

    if (page < 1 || page > totalPages) return;

    currentGalleryPage = page;

    displayGalleryPhotos();

    document.getElementById("photoGrid").scrollIntoView({
        behavior: "smooth"
    });
}

function backToServices() {
    showPage("servicesPage");
}

// ============================================
// MESSAGE HELPER
// ============================================

function showMessage(elementId, message, color = "#b83262") {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.textContent = message;
    element.style.color = color;
}

// ============================================
// CUSTOMER FEEDBACK SUBMISSION
// CUSTOMERS DO NOT NEED TO LOGIN
// ============================================

async function submitFeedback(event) {
    event.preventDefault();

    const name = document.getElementById("customerName")
        .value.trim();

    const rating = Number(
        document.getElementById("customerRating").value
    );

    const comment = document.getElementById("customerComment")
        .value.trim();

    if (!name || !rating || !comment) {
        showMessage(
            "feedbackMessage",
            "Please fill in all fields.",
            "red"
        );
        return;
    }

    const submitButton = document.querySelector(
        "#feedbackForm button[type='submit']"
    );

    if (!submitButton) return;

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    showMessage(
        "feedbackMessage",
        "Submitting your feedback..."
    );

    try {
        const { error } = await supabaseClient
            .from("reviews")
            .insert([
                {
                    name: name,
                    rating: rating,
                    comment: comment
                }
            ]);

        if (error) throw error;

        showMessage(
            "feedbackMessage",
            "Thank you! Your feedback has been submitted successfully.",
            "green"
        );

        document.getElementById("feedbackForm").reset();

    } catch (error) {
        console.error("Feedback error:", error);

        showMessage(
            "feedbackMessage",
            "Feedback failed: " + error.message,
            "red"
        );

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Feedback";
    }
}

// ============================================
// CREATE OWNER LOGIN PAGE
// ============================================

function createOwnerPage() {
    if (document.getElementById("ownerPage")) return;

    const ownerButton = document.createElement("button");
    ownerButton.textContent = "Owner Login";

    ownerButton.onclick = function () {
        showPage("ownerPage", ownerButton);
    };

    document.querySelector("nav").appendChild(ownerButton);

    const ownerPage = document.createElement("div");
    ownerPage.id = "ownerPage";
    ownerPage.className = "page";

    ownerPage.innerHTML = `
        <section class="section">

            <h2 class="section-title">
                Owner Dashboard
            </h2>

            <div class="form-container" id="ownerLoginBox">

                <h3 style="text-align:center;color:#b83262;">
                    Owner Login
                </h3>

                <label for="ownerEmail">Email Address</label>

                <input
                    type="email"
                    id="ownerEmail"
                    placeholder="Enter owner email"
                    required>

                <label for="ownerPassword">Password</label>

                <input
                    type="password"
                    id="ownerPassword"
                    placeholder="Enter password"
                    required>

                <button
                    type="button"
                    class="primary-button"
                    id="ownerLoginButton">
                    Login
                </button>

                <button
                    type="button"
                    class="secondary-button"
                    id="forgotPasswordButton">
                    Forgot Password?
                </button>

                <p id="ownerMessage" class="message"></p>

            </div>

            <div
                class="form-container"
                id="resetPasswordBox"
                style="display:none;">

                <h3 style="color:#b83262;">
                    Set New Password
                </h3>

                <p>Enter your new owner account password below.</p>

                <label for="newOwnerPassword">New Password</label>

                <input
                    type="password"
                    id="newOwnerPassword"
                    placeholder="Enter new password">

                <label for="confirmOwnerPassword">
                    Confirm New Password
                </label>

                <input
                    type="password"
                    id="confirmOwnerPassword"
                    placeholder="Confirm new password">

                <button
                    type="button"
                    class="primary-button"
                    id="saveNewPasswordButton">
                    Update Password
                </button>

                <p id="resetPasswordMessage" class="message"></p>

            </div>

            <div id="ownerDashboard" style="display:none;">

                <h3 style="color:#b83262;">
                    Private Customer Reviews
                </h3>

                <p id="ownerReviewMessage" class="message"></p>

                <div
                    id="ownerReviewsGrid"
                    class="reviews-grid">
                </div>

                <button
                    type="button"
                    class="primary-button"
                    id="ownerLogoutButton">
                    Logout
                </button>

            </div>

        </section>
    `;

    document.getElementById("contactPage")
        .insertAdjacentElement("beforebegin", ownerPage);

    document.getElementById("ownerLoginButton")
        .addEventListener("click", ownerLogin);

    document.getElementById("ownerLogoutButton")
        .addEventListener("click", ownerLogout);

    document.getElementById("forgotPasswordButton")
        .addEventListener("click", resetOwnerPassword);

    document.getElementById("saveNewPasswordButton")
        .addEventListener("click", saveNewOwnerPassword);
}

// ============================================
// OWNER LOGIN
// ============================================

async function ownerLogin() {
    const email = document.getElementById("ownerEmail")
        .value.trim();

    const password = document.getElementById("ownerPassword")
        .value;

    if (!email || !password) {
        showMessage(
            "ownerMessage",
            "Please enter email and password.",
            "red"
        );
        return;
    }

    const loginButton = document.getElementById("ownerLoginButton");

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    showMessage("ownerMessage", "Checking login...");

    try {
        const { error } = await supabaseClient.auth
            .signInWithPassword({
                email: email,
                password: password
            });

        if (error) throw error;

        showMessage(
            "ownerMessage",
            "Login successful!",
            "green"
        );

        await checkOwnerSession();

    } catch (error) {
        console.error("Owner login error:", error);

        showMessage(
            "ownerMessage",
            "Login failed: " + error.message,
            "red"
        );

    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
}

// ============================================
// FORGOT OWNER PASSWORD
// ============================================

async function resetOwnerPassword() {
    const email = document.getElementById("ownerEmail")
        .value.trim();

    if (!email) {
        showMessage(
            "ownerMessage",
            "Please enter your registered owner email first.",
            "red"
        );
        return;
    }

    const forgotButton = document.getElementById(
        "forgotPasswordButton"
    );

    forgotButton.disabled = true;
    forgotButton.textContent = "Sending email...";

    try {
        showMessage(
            "ownerMessage",
            "Sending password recovery email..."
        );

        const { error } = await supabaseClient.auth
            .resetPasswordForEmail(email, {
                redirectTo: PASSWORD_REDIRECT_URL
            });

        if (error) throw error;

        showMessage(
            "ownerMessage",
            "Password reset email sent! Please check your Gmail.",
            "green"
        );

    } catch (error) {
        console.error("Password reset error:", error);

        showMessage(
            "ownerMessage",
            "Password reset failed: " + error.message,
            "red"
        );

    } finally {
        forgotButton.disabled = false;
        forgotButton.textContent = "Forgot Password?";
    }
}

// ============================================
// SAVE NEW OWNER PASSWORD
// ============================================

async function saveNewOwnerPassword() {
    const password = document.getElementById("newOwnerPassword")
        .value;

    const confirmPassword =
        document.getElementById("confirmOwnerPassword").value;

    if (password.length < 8) {
        showMessage(
            "resetPasswordMessage",
            "Password must contain at least 8 characters.",
            "red"
        );
        return;
    }

    if (password !== confirmPassword) {
        showMessage(
            "resetPasswordMessage",
            "Passwords do not match.",
            "red"
        );
        return;
    }

    const saveButton = document.getElementById(
        "saveNewPasswordButton"
    );

    saveButton.disabled = true;
    saveButton.textContent = "Updating...";

    try {
        const { error } = await supabaseClient.auth
            .updateUser({
                password: password
            });

        if (error) throw error;

        showMessage(
            "resetPasswordMessage",
            "Password updated successfully! Please log in again.",
            "green"
        );

        await supabaseClient.auth.signOut();

        document.getElementById("newOwnerPassword").value = "";
        document.getElementById("confirmOwnerPassword").value = "";

        document.getElementById("resetPasswordBox").style.display =
            "none";

        document.getElementById("ownerLoginBox").style.display =
            "block";

        document.getElementById("ownerPassword").value = "";

    } catch (error) {
        console.error("Password update error:", error);

        showMessage(
            "resetPasswordMessage",
            "Password update failed: " + error.message,
            "red"
        );

    } finally {
        saveButton.disabled = false;
        saveButton.textContent = "Update Password";
    }
}

// ============================================
// CHECK OWNER SESSION
// ============================================

async function checkOwnerSession() {
    const resetBox = document.getElementById("resetPasswordBox");

    // Do not interrupt an active password recovery form.
    if (resetBox && resetBox.style.display === "block") {
        return;
    }

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error("Session error:", error);
        return;
    }

    const loginBox = document.getElementById("ownerLoginBox");
    const dashboard = document.getElementById("ownerDashboard");

    if (!loginBox || !dashboard) return;

    if (data.session) {
        loginBox.style.display = "none";
        dashboard.style.display = "block";

        await loadOwnerReviews();

    } else {
        loginBox.style.display = "block";
        dashboard.style.display = "none";
    }
}

// ============================================
// HANDLE PASSWORD RECOVERY
// ============================================

function handlePasswordRecovery() {
    const resetBox = document.getElementById("resetPasswordBox");
    const loginBox = document.getElementById("ownerLoginBox");
    const dashboard = document.getElementById("ownerDashboard");

    if (!resetBox || !loginBox || !dashboard) return;

    // Show reset form BEFORE navigating to owner page.
    // This prevents the session check from hiding it.
    resetBox.style.display = "block";
    loginBox.style.display = "none";
    dashboard.style.display = "none";

    showPage("ownerPage");

    showMessage(
        "resetPasswordMessage",
        "Enter your new password below.",
        "green"
    );
}

// ============================================
// LOAD PRIVATE OWNER REVIEWS
// ============================================

async function loadOwnerReviews() {
    const grid = document.getElementById("ownerReviewsGrid");

    if (!grid) return;

    grid.innerHTML = "";

    showMessage(
        "ownerReviewMessage",
        "Loading customer reviews..."
    );

    try {
        const { data: reviews, error } = await supabaseClient
            .from("reviews")
            .select("name,rating,comment")
            .order("created_at", { ascending: false });

        if (error) throw error;

        if (!reviews || reviews.length === 0) {
            showMessage(
                "ownerReviewMessage",
                "No customer reviews found."
            );
            return;
        }

        showMessage(
            "ownerReviewMessage",
            "Total customer reviews: " + reviews.length,
            "green"
        );

        reviews.forEach(review => {
            const card = document.createElement("div");
            card.className = "review-card";

            const name = document.createElement("h3");
            name.textContent = review.name || "Customer";

            const stars = document.createElement("div");
            stars.className = "stars";

            const rating = Math.max(
                0,
                Math.min(5, Number(review.rating) || 0)
            );

            stars.textContent =
                "★".repeat(rating) +
                "☆".repeat(5 - rating);

            const comment = document.createElement("p");
            comment.textContent = review.comment || "";

            card.appendChild(name);
            card.appendChild(stars);
            card.appendChild(comment);

            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Owner reviews error:", error);

        showMessage(
            "ownerReviewMessage",
            "Unable to load reviews: " + error.message,
            "red"
        );
    }
}

// ============================================
// OWNER LOGOUT
// ============================================

async function ownerLogout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        showMessage(
            "ownerReviewMessage",
            "Logout failed: " + error.message,
            "red"
        );
        return;
    }

    document.getElementById("ownerEmail").value = "";
    document.getElementById("ownerPassword").value = "";

    document.getElementById("ownerDashboard").style.display =
        "none";

    document.getElementById("ownerLoginBox").style.display =
        "block";

    showMessage(
        "ownerMessage",
        "You have logged out successfully.",
        "green"
    );
}

// ============================================
// WEBSITE STARTUP
// ============================================

document.addEventListener("DOMContentLoaded", async function () {

    // Display website services
    displayServices();

    // Create owner login page
    createOwnerPage();

    // Customer feedback form
    const feedbackForm = document.getElementById("feedbackForm");

    if (feedbackForm) {
        feedbackForm.addEventListener(
            "submit",
            submitFeedback
        );
    }

    // Listen for Supabase password recovery
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY") {
            handlePasswordRecovery();
        }
    });

    // Check whether the browser returned from a recovery link.
    if (window.location.hash.includes("type=recovery")) {
        handlePasswordRecovery();
    } else {
        await checkOwnerSession();
    }

});

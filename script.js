
// ============================================
// NAGARAJU PENDYALS WEBSITE
// SERVICES + GALLERIES + SUPABASE REVIEWS
// ============================================

// SUPABASE SETTINGS

const SUPABASE_URL = "https://fiqasbcxxulzsdkhermp.supabase.co/rest/v1";

const SUPABASE_KEY = "sb_publishable_Dud-B8aj8jiBboAswq8Svg_QyYK5CA4";

const TABLE_URL = `${SUPABASE_URL}/reviews`;


// PAGINATION SETTINGS
const SERVICES_PER_PAGE = 4;
const PHOTOS_PER_PAGE = 4;

let currentServicesPage = 1;
let currentGalleryPage = 1;
let selectedService = null;

// ============================================
// SERVICE DATA
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

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    document.querySelectorAll("nav button").forEach(button => {
        button.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    } else {
        const matchingButton = [...document.querySelectorAll("nav button")]
            .find(button => button.getAttribute("onclick")?.includes(pageId));

        if (matchingButton) {
            matchingButton.classList.add("active");
        }
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageId === "reviewsPage") {
        displayReviews();
    }
}

// ============================================
// SERVICES DISPLAY
// ============================================

function displayServices() {
    const grid = document.getElementById("servicesGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const start = (currentServicesPage - 1) * SERVICES_PER_PAGE;
    const end = start + SERVICES_PER_PAGE;

    const visibleServices = services.slice(start, end);

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

function renderServicesPagination() {
    const container = document.getElementById("servicesPagination");

    if (!container) return;

    const totalPages = Math.ceil(services.length / SERVICES_PER_PAGE);

    container.innerHTML = "";

    const previous = document.createElement("button");
    previous.textContent = "Previous";
    previous.disabled = currentServicesPage === 1;
    previous.onclick = () => changeServicesPage(currentServicesPage - 1);
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
    next.onclick = () => changeServicesPage(currentServicesPage + 1);
    container.appendChild(next);
}

function changeServicesPage(page) {
    const totalPages = Math.ceil(services.length / SERVICES_PER_PAGE);

    if (page < 1 || page > totalPages) return;

    currentServicesPage = page;
    displayServices();

    document.getElementById("servicesGrid").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ============================================
// GALLERY
// ============================================

function openGallery(serviceIndex) {
    selectedService = services[serviceIndex];
    currentGalleryPage = 1;

    if (!selectedService) return;

    document.getElementById("galleryTitle").textContent =
        selectedService.name + " Gallery";

    document.getElementById("galleryDescription").textContent =
        selectedService.description +
        " These are sample reference photos.";

    displayGalleryPhotos();

    showPage("galleryPage");
}

function displayGalleryPhotos() {
    if (!selectedService) return;

    const grid = document.getElementById("photoGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const photos = selectedService.photos;

    const start = (currentGalleryPage - 1) * PHOTOS_PER_PAGE;
    const end = start + PHOTOS_PER_PAGE;

    const visiblePhotos = photos.slice(start, end);

    visiblePhotos.forEach((photo, index) => {
        const photoNumber = start + index + 1;

        const card = document.createElement("div");
        card.className = "gallery-card";

        const img = document.createElement("img");
        img.src = imageURL(photo);
        img.alt = selectedService.name + " sample photo " + photoNumber;
        img.loading = "lazy";

        const caption = document.createElement("p");
        caption.textContent = selectedService.name + " - Photo " + photoNumber;

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
    previous.onclick = () => changeGalleryPage(currentGalleryPage - 1);

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
    next.onclick = () => changeGalleryPage(currentGalleryPage + 1);

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
        behavior: "smooth",
        block: "start"
    });
}

function backToServices() {
    showPage("servicesPage");
}

// ============================================
// SUPABASE HELPERS
// ============================================

function supabaseHeaders() {
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
    };
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });
}

function showMessage(elementId, message, color = "#b83262") {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.textContent = message;
    element.style.color = color;
}

// ============================================
// LOAD CUSTOMER REVIEWS
// ============================================

async function displayReviews() {
    const grid = document.getElementById("reviewsGrid");

    if (!grid) return;

    grid.innerHTML = "";

    if (SUPABASE_KEY === "YOUR_EXISTING_PUBLISHABLE_KEY") {
        showMessage(
            "reviewsMessage",
            "Please add your Supabase publishable key in script.js.",
            "#b83262"
        );
        return;
    }

    showMessage("reviewsMessage", "Loading reviews...");

    try {
        const response = await fetch(
            `${TABLE_URL}?select=name,rating,comment`,
            {
                method: "GET",
                headers: supabaseHeaders(),
                cache: "no-store"
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const reviews = await response.json();

        if (!reviews.length) {
            showMessage(
                "reviewsMessage",
                "No customer reviews yet. Be the first to share your feedback!"
            );
            return;
        }

        showMessage("reviewsMessage", "");

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
                "★".repeat(rating) + "☆".repeat(5 - rating);

            const comment = document.createElement("p");
            comment.textContent = review.comment || "";

            card.appendChild(name);
            card.appendChild(stars);
            card.appendChild(comment);

            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Review loading error:", error);

        showMessage(
            "reviewsMessage",
            "Unable to load reviews. Please check your Supabase settings.",
            "#c0392b"
        );
    }
}

// ============================================
// SUBMIT CUSTOMER FEEDBACK
// ============================================

async function submitFeedback(event) {
    event.preventDefault();

    if (SUPABASE_KEY === "YOUR_EXISTING_PUBLISHABLE_KEY") {
        showMessage(
            "feedbackMessage",
            "Please add your Supabase publishable key in script.js.",
            "#c0392b"
        );
        return;
    }

    const name = document.getElementById("customerName").value.trim();

    const rating = Number(
        document.getElementById("customerRating").value
    );

    const comment = document.getElementById("customerComment").value.trim();

    if (!name || !rating || !comment) {
        showMessage(
            "feedbackMessage",
            "Please fill in all fields.",
            "#c0392b"
        );
        return;
    }

    const submitButton = document.querySelector(
        "#feedbackForm button[type='submit']"
    );

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    showMessage("feedbackMessage", "Submitting your feedback...");

    try {
        const response = await fetch(TABLE_URL, {
            method: "POST",
            headers: {
                ...supabaseHeaders(),
                "Prefer": "return=minimal"
            },
            body: JSON.stringify({
                name: name,
                rating: rating,
                comment: comment
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        showMessage(
            "feedbackMessage",
            "Thank you! Your feedback has been submitted successfully.",
            "green"
        );

        document.getElementById("feedbackForm").reset();

        await displayReviews();

    } catch (error) {
        console.error("Feedback submission error:", error);

        showMessage(
            "feedbackMessage",
            "Feedback could not be submitted. Please check your Supabase table and INSERT policy.",
            "#c0392b"
        );
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Feedback";
    }
}

// ============================================
// WEBSITE STARTUP
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    displayServices();

    const feedbackForm = document.getElementById("feedbackForm");

    if (feedbackForm) {
        feedbackForm.addEventListener("submit", submitFeedback);
    }
});

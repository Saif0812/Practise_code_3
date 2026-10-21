const form = document.getElementById("form");
const cards = document.getElementById("cards");
const loading = document.getElementById("loading");
const welcomeUser = document.getElementById("welcomeUser");

const footer = document.createElement("footer");
const year = new Date().getFullYear();

footer.textContent = `Copyright©${year} All rights reserved.`;
document.body.appendChild(footer);

function showLoading() {
  loading.classList.remove("hidden");
  cards.innerHTML = "";
}

function hideLoading() {
  loading.classList.add("hidden");
}

function handleHttpError(response) {
  hideLoading();
  welcomeUser.textContent = "";
  renderError({
    message: `We couldn't load the user details. Error code: ${response.status}.`
  });
}

function renderError(error) {

  welcomeUser.textContent = "";
  cards.innerHTML = `<li class="tag-error">${error?.message || "Unexpected Error."}</li><button id="retry" class="retry-btn">Try Again</button>`;
  document.getElementById("retry").addEventListener("click", fetchRandom);

  form.reset();
}

async function showWelcomeUser(name) {

  try {
    const response = await fetch("/api/welcome", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name
      })
    });

    const data = await response.json();
    welcomeUser.textContent = data.message;

  } catch (error) {
    console.error(error);
  }
}

async function fetchRandom() {

  showLoading();

  try {
    const response = await fetch("/api/random");

    if (!response.ok)
      return handleHttpError(response);

    const data = await response.json();

    // Show welcome message for random user
    await showWelcomeUser(data.name);

    hideLoading();
    renderCard(data);

  } catch (error) {
    hideLoading();
    welcomeUser.textContent = "";
    renderError(error);
  }
}

let requestId = 0;
async function fetchFiltered(id) {

  const currentRequestId = ++requestId;

  showLoading();
  
  try {
    const response = await fetch(`/api/filter?id=${encodeURIComponent(id)}`);

    if (!response.ok)
      return handleHttpError(response);

    const data = await response.json();

    if (currentRequestId !== requestId) {
      return;
    }

    await showWelcomeUser(data.name);

    hideLoading();
    renderCard(data);

  } catch (error) {
    hideLoading();
    renderError(error);
  }
}

function renderCard(data) {
  cards.innerHTML = "";

  const user = Array.isArray(data) ? data[0] : data;

  if (!user?.id) {
    renderError({ message: data?.error || "User not found." });
    return;
  }

  const userItem = document.createElement("li");
  userItem.innerHTML = `
    <strong>UserId:</strong> ${user.id} <br>
    <strong>Name:</strong> ${user.name} <br>
    <strong>UserName:</strong> ${user.username} <br>
    <strong>EmailId:</strong> ${user.email}
  `;
  cards.appendChild(userItem);

  if (user.address) {
    const addrItem = document.createElement("li");
    addrItem.innerHTML = `
      <strong>Address:</strong> ${user.address.street} ${user.address.suite}, ${user.address.city}<br>
      <strong>Zip Code:</strong> ${user.address.zipcode}
    `;
    cards.appendChild(addrItem);
  }

  if (user.phone) {
    const phoneItem = document.createElement("li");
    phoneItem.innerHTML = `<strong>Phone:</strong> ${user.phone}`;
    cards.appendChild(phoneItem);
  }

  if (user.website) {
    const webItem = document.createElement("li");
    webItem.innerHTML = `<strong>Website:</strong> ${user.website}`;
    cards.appendChild(webItem);
  }

  if (user.company) {
    const companyItem = document.createElement("li");
    companyItem.innerHTML = `<strong>Company:</strong> ${user.company.name}`;
    cards.appendChild(companyItem);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const userId = document.getElementById("userId").value.trim();
  const num = Number(userId);

  if (!Number.isInteger(num)) {
    renderError({ message: "Invalid User ID. User ID should be number." });
    return;
  }

  await fetchFiltered(num);
  document.getElementById("userId").value = "";
}

form.addEventListener("submit", handleFormSubmit);

await fetchRandom();

const form = document.getElementById("form");
const cards = document.getElementById("cards");
const loading = document.getElementById("loading");

function showLoading() {
  loading.classList.remove("hidden");
  cards.innerHTML = "";
}

function hideLoading() {
  loading.classList.add("hidden");
}

function handleHttpError(response) {
  hideLoading();
  renderError({
    message: `We couldn't load the user details. Error code: ${response.status}.`
  });
}

function renderError(error) {
  cards.innerHTML = `
    <li class="tag-error">${error?.message || "Unexpected Error."}</li>
    <button id="retry" class="retry-btn">Try Again</button>
  `;
  document.getElementById("retry").addEventListener("click", fetchRandom);
  form.reset();
}

async function fetchRandom() {
  showLoading();
  try {
    const response = await fetch("/api/random");

    if (!response.ok) 
      return handleHttpError(response);


    const data = await response.json();
    hideLoading();
    renderCard(data);

  } catch (error) {
    hideLoading();
    renderError(error);
  }
}

async function fetchFiltered(id) {
  showLoading();
  try {
    const response = await fetch(`/api/filter?id=${encodeURIComponent(id)}`);

    if (!response.ok) 
      return handleHttpError(response);

    const data = await response.json();
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

  // if (!Number.isInteger(num)) {
  //   renderError({ message: "Invalid User ID. User ID should be number." });
  //   return;
  // }

  await fetchFiltered(num);
  document.getElementById("userId").value = "";
}

form.addEventListener("submit", handleFormSubmit);

await fetchRandom();

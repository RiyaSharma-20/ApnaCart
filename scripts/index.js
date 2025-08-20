let bagItems;
onLoad();

function onLoad() {
  let bagItemsStr = localStorage.getItem('bagItems');
  bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  displayItemsOnHomePage();
  displayBagIcon();
}

function updateProfileUI() {
  const user = JSON.parse(localStorage.getItem("user"));
  const profileName = document.getElementById("profileName");
  if (user && profileName) {
    profileName.innerText = `Hi, ${user.name}`;
  }
}
onLoad();
updateProfileUI();


function addToBag(itemId) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Save intended item and redirect to login
    localStorage.setItem("redirectAfterLogin", "home");
    localStorage.setItem("intendedItem", itemId);
    localStorage.setItem("cartMessage", "Please login first to buy items.");
    window.location.href = "pages/signup.html";
    return;
  }

  // ✅ Logged in → normal flow
  bagItems.push(itemId);
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  displayBagIcon();
  alert("Item added to cart!");
}


function displayBagIcon() {
  let bagItemCountElement = document.querySelector('.bag-item-count');
  if (bagItems.length > 0) {
    console.log('I am here');
    bagItemCountElement.style.visibility = 'visible';
    bagItemCountElement.innerText = bagItems.length;
  } else {
    bagItemCountElement.style.visibility = 'hidden';
  }
}

function displayItemsOnHomePage(category = 'All') {
  let itemsContainerElement = document.querySelector('.items-container');
  if (!itemsContainerElement) return;

  let filteredItems = category === 'All'
    ? items
    : items.filter(item => item.category === category);

  // Group by category if showing All
  let grouped = {};
  filteredItems.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  let innerHtml = '';
  for (let cat in grouped) {
    innerHtml += `<h2 class="category-heading">${cat}</h2><div class="category-grid">`;
    grouped[cat].forEach(item => {
      innerHtml += `
        <div class="item-container">
          <img class="item-image" src="${item.image}" alt="${item.item_name}">
          <div class="rating">${item.rating.stars} ⭐ | ${item.rating.count}</div>
          <div class="company-name">${item.company}</div>
          <div class="item-name">${item.item_name}</div>
          <div class="price">
            <span class="current-price">Rs ${item.current_price}</span>
            <span class="original-price">Rs ${item.original_price}</span>
            <span class="discount">(${item.discount_percentage}% OFF)</span>
          </div>
          <button class="btn-add-bag" onclick="addToBag('${item.id}')">Add to Bag</button>
        </div>`;
    });
    innerHtml += `</div>`;
  }

  itemsContainerElement.innerHTML = innerHtml;
}

// Filter button click handler
function filterItems(category) {
  displayItemsOnHomePage(category);
}

import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let page = 1;
let matches = books;

//get DOM elements function
const getDom = (selector) => document.querySelector(selector);//getting DOM elements

//function to create and append book previews
const bookPreviews = (books, container) => {
    const starting = document.createDocumentFragment();
    books.forEach(({ author, id, image, title }) => {
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)

    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>const starting = document.createDocumentFragment()
    `

    starting.appendChild(element)
    });
    container.appendChild(starting);
};




//document.querySelector('[data-list-items]').appendChild(starting)
//Create a function to create and append options to select element
const createOptions = (options, defaultOption, container) => {
    const starting = document.createDocumentFragment();
    const firstOption = document.createElement("option");
    firstOption.value = "any";
    firstOption.innerText = defaultOption;
    starting.appendChild(firstOption);
    Object.entries(options).forEach(([id, name]) => {
      const element = document.createElement("option");
      element.value = id;
      element.innerText = name;
      starting.appendChild(element);
    });
    container.appendChild(starting);
  };



//document.querySelector('[data-search-genres]').appendChild(genreHtml)

//Applying theme:
const applyTheme = (theme) => {
    const isNight = theme === "night";
    document.documentElement.style.setProperty(
      "--color-dark",
      isNight ? "255, 255, 255" : "10, 10, 20"
    );
    document.documentElement.style.setProperty(
      "--color-light",
      isNight ? "10, 10, 20" : "255, 255, 255"
    );
  };

  //Create function to update "Show more" button inner text
  const updateShowMoreButton = () => {
    const remainingBooks = matches.length - page * BOOKS_PER_PAGE;
    const button = getDom("[data-list-button]");
    button.innerText = `Show more ${remainingBooks}`;
    
    button.disabled = remainingBooks <= 0;
    button.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining">(${
        remainingBooks > 0 ? remainingBooks : 0
      })</span>
    `;
  };


//Event listener functions:
const closeOverlay = (selector) => {
    getDom(selector).open = false;
  };
  
  const openOverlay = (selector, focusSelector = null) => {
    getDom(selector).open = true;
    if (focusSelector) getDom(focusSelector).focus();
  };
  
  const applySearchFilters = (filters) => {
    return books.filter((book) => {
      const titleMatch =
        filters.title.trim() === "" ||
        book.title.toLowerCase().includes(filters.title.toLowerCase());
      const authorMatch =
        filters.author === "any" || book.author === filters.author;
      const genreMatch =
        filters.genre === "any" || book.genres.includes(filters.genre);
      return titleMatch && authorMatch && genreMatch;
    });
  };

//Event listeners
getDom("[data-search-cancel]").addEventListener("click", () =>
    closeOverlay("[data-search-overlay]")
  );
  getDom("[data-settings-cancel]").addEventListener("click", () =>
    closeOverlay("[data-settings-overlay]")
  );
  getDom("[data-header-search]").addEventListener("click", () =>
    openOverlay("[data-search-overlay]", "[data-search-title]")
  );
  getDom("[data-header-settings]").addEventListener("click", () =>
    openOverlay("[data-settings-overlay]")
  );
  getDom("[data-list-close]").addEventListener("click", () =>
    closeOverlay("[data-list-active]")
  );
  
  getDom("[data-settings-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    applyTheme(theme);
    closeOverlay("[data-settings-overlay]");
  });
  
  getDom("[data-search-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    matches = applySearchFilters(filters);
    page = 1;
    getDom("[data-list-message]").classList.toggle(
      "list__message_show",
      matches.length < 1
    );
    getDom("[data-list-items]").innerHTML = "";
    bookPreviews(
      matches.slice(0, BOOKS_PER_PAGE),
      getDom("[data-list-items]")
    );
    updateShowMoreButton();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeOverlay("[data-search-overlay]");
  });
  
  getDom("[data-list-button]").addEventListener("click", () => {
    bookPreviews(
      matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE),
      getElement("[data-list-items]")
    );
    page += 1;
    updateShowMoreButton();
  });
  
  getDom("[data-list-items]").addEventListener("click", (event) => {
    const pathArray = Array.from(event.composedPath());
    const active = pathArray.find((node) => node?.dataset?.preview);
    if (active) {
      const book = books.find((book) => book.id === active.dataset.preview);
      if (book) {
        getDom("[data-list-active]").open = true;
        getDom("[data-list-blur]").src = book.image;
        getDom("[data-list-image]").src = book.image;
        getDom("[data-list-title]").innerText = book.title;
        getDom("[data-list-subtitle]").innerText = `${
          authors[book.author]
        } (${new Date(book.published).getFullYear()})`;
        getDom("[data-list-description]").innerText = book.description;
      }
    }
  });

// Initial setup
createOptions(genres, "All Genres", getDom("[data-search-genres]"));
createOptions(authors, "All Authors", getDom("[data-search-authors]"));
applyTheme(
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day"
);
bookPreviews(
  matches.slice(0, BOOKS_PER_PAGE),
  getDom("[data-list-items]")
);
updateShowMoreButton();


// const authorsHtml = document.createDocumentFragment()
// const firstAuthorElement = document.createElement('option')
// firstAuthorElement.value = 'any'
// firstAuthorElement.innerText = 'All Authors'
// authorsHtml.appendChild(firstAuthorElement)

// for (const [id, name] of Object.entries(authors)) {
//     const element = document.createElement('option')
//     element.value = id
//     element.innerText = name
//     authorsHtml.appendChild(element)
// }

// document.querySelector('[data-search-authors]').appendChild(authorsHtml)

// if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//     document.querySelector('[data-settings-theme]').value = 'night'
//     document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
//     document.documentElement.style.setProperty('--color-light', '10, 10, 20');
// } else {
//     document.querySelector('[data-settings-theme]').value = 'day'
//     document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
//     document.documentElement.style.setProperty('--color-light', '255, 255, 255');
// }

// document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
// document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

// document.querySelector('[data-list-button]').innerHTML = `
//     <span>Show more</span>
//     <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
// `

// document.querySelector('[data-search-cancel]').addEventListener('click', () => {
//     document.querySelector('[data-search-overlay]').open = false
// })

// document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
//     document.querySelector('[data-settings-overlay]').open = false
// })

// document.querySelector('[data-header-search]').addEventListener('click', () => {
//     document.querySelector('[data-search-overlay]').open = true 
//     document.querySelector('[data-search-title]').focus()
// })

// document.querySelector('[data-header-settings]').addEventListener('click', () => {
//     document.querySelector('[data-settings-overlay]').open = true 
// })

// document.querySelector('[data-list-close]').addEventListener('click', () => {
//     document.querySelector('[data-list-active]').open = false
// })

// document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
//     event.preventDefault()
//     const formData = new FormData(event.target)
//     const { theme } = Object.fromEntries(formData)

//     if (theme === 'night') {
//         document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
//         document.documentElement.style.setProperty('--color-light', '10, 10, 20');
//     } else {
//         document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
//         document.documentElement.style.setProperty('--color-light', '255, 255, 255');
//     }
    
//     document.querySelector('[data-settings-overlay]').open = false
// })

// document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
//     event.preventDefault()
//     const formData = new FormData(event.target)
//     const filters = Object.fromEntries(formData)
//     const result = []

//     for (const book of books) {
//         let genreMatch = filters.genre === 'any'

//         for (const singleGenre of book.genres) {
//             if (genreMatch) break;
//             if (singleGenre === filters.genre) { genreMatch = true }
//         }

//         if (
//             (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
//             (filters.author === 'any' || book.author === filters.author) && 
//             genreMatch
//         ) {
//             result.push(book)
//         }
//     }

//     page = 1;
//     matches = result

//     if (result.length < 1) {
//         document.querySelector('[data-list-message]').classList.add('list__message_show')
//     } else {
//         document.querySelector('[data-list-message]').classList.remove('list__message_show')
//     }

//     document.querySelector('[data-list-items]').innerHTML = ''
//     const newItems = document.createDocumentFragment()

//     for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
//         const element = document.createElement('button')
//         element.classList = 'preview'
//         element.setAttribute('data-preview', id)
    
//         element.innerHTML = `
//             <img
//                 class="preview__image"
//                 src="${image}"
//             />
            
//             <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${authors[author]}</div>
//             </div>
//         `

//         newItems.appendChild(element)
//     }

//     document.querySelector('[data-list-items]').appendChild(newItems)
//     document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

//     document.querySelector('[data-list-button]').innerHTML = `
//         <span>Show more</span>
//         <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
//     `

//     window.scrollTo({top: 0, behavior: 'smooth'});
//     document.querySelector('[data-search-overlay]').open = false
// })

// document.querySelector('[data-list-button]').addEventListener('click', () => {
//     const fragment = document.createDocumentFragment()

//     for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
//         const element = document.createElement('button')
//         element.classList = 'preview'
//         element.setAttribute('data-preview', id)
    
//         element.innerHTML = `
//             <img
//                 class="preview__image"
//                 src="${image}"
//             />
            
//             <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${authors[author]}</div>
//             </div>
//         `

//         fragment.appendChild(element)
//     }

//     document.querySelector('[data-list-items]').appendChild(fragment)
//     page += 1
// })

// document.querySelector('[data-list-items]').addEventListener('click', (event) => {
//     const pathArray = Array.from(event.path || event.composedPath())
//     let active = null

//     for (const node of pathArray) {
//         if (active) break

//         if (node?.dataset?.preview) {
//             let result = null
    
//             for (const singleBook of books) {
//                 if (result) break;
//                 if (singleBook.id === node?.dataset?.preview) result = singleBook
//             } 
        
//             active = result
//         }
//     }
    
//     if (active) {
//         document.querySelector('[data-list-active]').open = true
//         document.querySelector('[data-list-blur]').src = active.image
//         document.querySelector('[data-list-image]').src = active.image
//         document.querySelector('[data-list-title]').innerText = active.title
//         document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
//         document.querySelector('[data-list-description]').innerText = active.description
//     }
// })
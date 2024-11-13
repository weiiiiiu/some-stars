addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  if (url.pathname === '/data.json') {
    return await fetchData()
  }

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}

async function fetchData() {
  const response = await fetch('https://raw.githubusercontent.com/weiiiiiu/some-stars/main/data.json')
  return response
}

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Github Star 导航</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/gh/TheSmallHanCat/Better_Alist@main/alist.css" rel="stylesheet" type="text/css">  
    <style>
      .container {
        margin-left: auto;
        margin-right: auto;
        max-width: 1800px;
        padding-left: 20px;
        padding-right: 20px;
        overflow-x: hidden;
      }
      #language-select {
        width: 100%;
        max-width: 200px;
        padding: 8px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        background-color: white;
        margin-right: 10px;
      }
      #main-content {
        width: 100%;
        padding: 20px 0;
      }
      .repo-card {
        width: 300px;
        height: auto;
        min-height: 350px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      @media (max-width: 768px) {
        .repo-card {
          width: 100%;
          max-width: 300px;
          min-height: 300px;
        }
        .container {
          padding-left: 10px;
          padding-right: 10px;
        }
      }
      .repo-card img {
        height: 150px;
        width: 100%;
        object-fit: contain;
      }
      .repo-card .description {
        flex-grow: 1;
        overflow-y: hidden;
      }
      .highlight {
        background-color: yellow;
      }
      .sticky-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        background-color: white;
        padding: 10px;
      }
      #back-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #1a202c;
        color: white;
        padding: 10px 15px;
        border-radius: 50%;
        display: none;
        cursor: pointer;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        transition: opacity 0.3s;
      }
      #back-to-top:hover {
        background-color: #2d3748;
      }
      .search-container {
        display: none;
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        align-items: center;
        gap: 10px;
      }
      #search {
        width: 150px;
        padding: 8px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }
      @media (max-width: 640px) {
        .search-container {
          width: 90%;
          flex-wrap: wrap;
          justify-content: center;
        }
        #search, #language-select {
          width: 100%;
          max-width: none;
          margin: 5px 0;
        }
      }
    </style>
  </head>
  <body class="bg-gray-100">
    <header class="sticky-header flex justify-between items-center px-4 py-2 bg-white shadow-md">
      <h1 class="text-xl md:text-2xl font-bold">
        <a href="/">Github Star 导航</a>
      </h1>
      <div class="flex items-center">
        <select id="language-select" class="text-sm md:text-base mr-4">
          <option value="">选择语言</option>
        </select>
        <input id="search" type="text" placeholder="搜索..." class="text-sm md:text-base w-40" />
      </div>
    </header>
    <div class="container mx-auto py-16">
      <div id="main-content">
        <div id="categories-container"></div>
      </div>
    </div>
    <button id="back-to-top">↑</button>
    <script>
      async function fetchData() {
        const response = await fetch("/data.json");
        return response.json();
      }

      function generateHTML(data) {
        const repoCardsHtml = (repos) => {
          return repos
            .map((repo) => {
              const truncatedDescription = repo.description && repo.description.length > 100 
                ? repo.description.slice(0, 100) + "..." 
                : repo.description;
              return \`
                <div class="repo-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col m-2">
                  <div class="h-36 overflow-hidden flex items-center justify-center p-4">
                    <img class="object-contain h-full w-full" src="\${repo.owner.avatar_url}" alt="\${repo.owner.login}" />
                  </div>
                  <div class="p-4 flex-grow flex flex-col">
                    <div class="mb-4">
                      <h3 class="text-lg font-bold text-blue-600 truncate">
                        <a href="https://github.com/\${repo.full_name}" target="_blank">\${repo.name}</a>
                      </h3>
                      <p class="text-sm text-gray-600 truncate mb-2">
                        <a href="https://github.com/\${repo.owner.login}" target="_blank">\${repo.owner.login}</a>
                      </p>
                      <p class="text-sm text-gray-700 line-clamp-3">
                        \${truncatedDescription}
                      </p>
                    </div>
                    <div class="mt-auto">
                      <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Stars: \${repo.stargazers_count}
                      </span>
                    </div>
                  </div>
                </div>\`;
            })
            .join("");
        };

        const categoriesHtml = Object.keys(data)
          .map(
            (language) => \`
      <div id="\${language}" class="mb-8 category">
        <h2 class="text-xl font-bold mb-4">\${language}</h2>
        <div class="flex flex-wrap justify-center">
          \${repoCardsHtml(data[language])}
        </div>
      </div>\`
          )
          .join("");

        const languageSelect = document.getElementById("language-select");
        Object.keys(data).forEach(language => {
          const option = document.createElement("option");
          option.value = language;
          option.textContent = language;
          languageSelect.appendChild(option);
        });

        document.getElementById("categories-container").innerHTML = categoriesHtml;
      }

      document.addEventListener("DOMContentLoaded", async function () {
        const searchInput = document.getElementById("search");
        const languageSelect = document.getElementById("language-select");
        const categoriesContainer = document.getElementById("categories-container");
        const backToTopButton = document.getElementById("back-to-top");
        const data = await fetchData();
        generateHTML(data);

        languageSelect.addEventListener("change", function() {
          const selectedLanguage = this.value;
          if (selectedLanguage) {
            const element = document.getElementById(selectedLanguage);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }
        });

        window.addEventListener("scroll", function () {
          if (window.scrollY > 200) {
            backToTopButton.style.display = "block";
          } else {
            backToTopButton.style.display = "none";
          }
        });

        backToTopButton.addEventListener("click", function () {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });

        function searchRepositories(query) {
          const normalizedQuery = query.toLowerCase();
          return Object.values(data)
            .flat()
            .filter((repo) => {
              return (
                repo.full_name.toLowerCase().includes(normalizedQuery) ||
                (repo.description && repo.description.toLowerCase().includes(normalizedQuery)) ||
                repo.topics.some((topic) => topic.toLowerCase().includes(normalizedQuery))
              );
            });
        }

        function escapeRegExp(string) {
          return string.replace(/[$()*+?.^{}|[\]\\]/g, '\\$&');
        }

        function highlightText(text, query) {
          const escapedQuery = escapeRegExp(query);
          return text.replace(new RegExp(escapedQuery, "gi"), (match) => \`<span class="highlight">\${match}</span>\`);
        }

        searchInput.addEventListener("input", function () {
          const query = this.value.trim();
          if (query) {
            const matchedRepos = searchRepositories(query);
            categoriesContainer.innerHTML = \`
              <div class="mb-8">
                <h2 class="text-xl font-bold mb-4">搜索结果</h2>
                <div class="flex flex-wrap justify-center">
                  \${matchedRepos.map(repo => {
                    const truncatedDescription = repo.description && repo.description.length > 100 
                      ? repo.description.slice(0, 100) + "..." 
                      : repo.description;
                    return \`
                      <div class="repo-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col m-2">
                        <div class="h-36 overflow-hidden flex items-center justify-center p-4">
                          <img class="object-contain h-full w-full" src="\${repo.owner.avatar_url}" alt="\${repo.owner.login}" />
                        </div>
                        <div class="p-4 flex-grow flex flex-col">
                          <div class="mb-4">
                            <h3 class="text-lg font-bold text-blue-600 truncate">
                              <a href="https://github.com/\${repo.full_name}" target="_blank">\${highlightText(repo.name, query)}</a>
                            </h3>
                            <p class="text-sm text-gray-600 truncate mb-2">
                              <a href="https://github.com/\${repo.owner.login}" target="_blank">\${highlightText(repo.owner.login, query)}</a>
                            </p>
                            <p class="text-sm text-gray-700 line-clamp-3">
                              \${repo.description ? highlightText(truncatedDescription, query) : ''}
                            </p>
                          </div>
                          <div class="mt-auto">
                            <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Stars: \${repo.stargazers_count}
                            </span>
                          </div>
                        </div>
                      </div>\`
                  }).join('')}
                </div>
              </div>
            \`;
          } else {
            generateHTML(data);
          }
        });
      });
    </script>
  </body>
</html>
`

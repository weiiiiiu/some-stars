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
  try {
    const response = await fetch('https://raw.githubusercontent.com/weiiiiiu/some-stars/main/data.json')
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    return response
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
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
        margin: 0 auto;
        max-width: 1800px;
        padding: 0 20px;
        overflow-x: hidden;
      }
      #language-select {
        width: 100%;
        max-width: 200px;
        padding: 8px;
        border-radius: 8px;
        border: 1px solid rgba(226, 232, 240, 0.8);
        background-color: rgba(255, 255, 255, 0.7);
        margin-right: 10px;
      }
      #main-content {
        width: 100%;
        padding: 20px 0;
      }
      .repo-card {
        width: 300px;
        min-height: 350px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 20px;
        transition: transform 0.2s, box-shadow 0.2s;
        border: 1px solid rgba(226, 232, 240, 0.8);
      }
      @media (max-width: 768px) {
        .repo-card {
          width: 100%;
          max-width: 300px;
          min-height: 300px;
        }
        .container { padding: 0 10px; }
      }
      .repo-card img {
        height: 150px;
        width: 100%;
        object-fit: contain;
      }
      .highlight { background-color: rgba(255, 255, 0, 0.5); }
      .sticky-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        background-color: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        border-bottom: 1px solid rgba(226, 232, 240, 0.8);
      }
      #back-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(45deg, #2563eb, #3b82f6);
        color: white;
        padding: 10px 15px;
        border-radius: 50%;
        cursor: pointer;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
      }
      #back-to-top.visible {
        transform: translateY(0);
        opacity: 1;
      }
      #back-to-top:hover {
        transform: translateY(-5px);
      }
      .search-container {
        display: none;
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
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
        border: 1px solid rgba(226, 232, 240, 0.8);
        background-color: rgba(255, 255, 255, 0.7);
        transition: all 0.3s ease;
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
      .repo-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }
      #language-select:hover, #search:hover {
        border-color: #4299e1;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
      }
      #language-select:focus, #search:focus {
        outline: none;
        border-color: #4299e1;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
      }
      .category h2 {
        position: relative;
        padding-bottom: 0.5rem;
        margin-bottom: 1.5rem;
        color: #1e40af;
        font-weight: 700;
      }
      .category h2::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 50px;
        height: 3px;
        background: linear-gradient(90deg, #4299e1, #667eea);
        border-radius: 3px;
      }
      header h1 a {
        background: linear-gradient(45deg, #2563eb, #3b82f6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
      }
      .repo-card h3 a {
        color: #1e40af;
        transition: color 0.2s;
      }
      .repo-card h3 a:hover { color: #3b82f6; }
      .repo-card .description { color: #475569; }
      .repo-card .text-gray-600 a {
        color: #64748b;
        transition: color 0.2s;
      }
      .repo-card .text-gray-600 a:hover { color: #3b82f6; }
      .repo-card .bg-blue-100 {
        background-color: rgba(59, 130, 246, 0.1);
        color: #1e40af;
      }
      #search, #language-select { color: #334155; }
      #search::placeholder { color: #94a3b8; }
    </style>
  </head>
  <body class="bg-gray-100">
    <header class="sticky-header flex justify-between items-center px-4 py-2 shadow-md">
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
        try {
          const response = await fetch("/data.json");
          if (!response.ok) throw new Error('Failed to fetch data');
          return response.json();
        } catch (error) {
          console.error('Error fetching data:', error);
          return {};
        }
      }

      function generateHTML(data) {
        const repoCardsHtml = (repos) => repos
          .map((repo) => {
            const truncatedDescription = repo.description && repo.description.length > 100 
              ? repo.description.slice(0, 100) + "..." 
              : repo.description;
            return \`
              <div class="repo-card shadow-md overflow-hidden flex flex-col m-2">
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
                    <p class="text-sm text-gray-700 line-clamp-3">\${truncatedDescription}</p>
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

        const categoriesHtml = Object.keys(data)
          .map(language => \`
            <div id="\${language}" class="mb-8 category">
              <h2 class="text-xl font-bold mb-4">\${language}</h2>
              <div class="flex flex-wrap justify-center">
                \${repoCardsHtml(data[language])}
              </div>
            </div>\`)
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
            document.getElementById(selectedLanguage)?.scrollIntoView({ behavior: "smooth" });
          }
        });

        window.addEventListener("scroll", () => {
          backToTopButton.classList.toggle('visible', window.scrollY > 200);
        });

        backToTopButton.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });

        function searchRepositories(query) {
          const normalizedQuery = query.toLowerCase();
          return Object.values(data)
            .flat()
            .filter(repo => 
              repo.full_name.toLowerCase().includes(normalizedQuery) ||
              (repo.description && repo.description.toLowerCase().includes(normalizedQuery)) ||
              (repo.topics && repo.topics.some(topic => topic.toLowerCase().includes(normalizedQuery)))
            );
        }

        function escapeRegExp(string) {
          return string.replace(/[$()*+?.^{}|[\\]\\\\]/g, '\\\\$&');
        }

        function highlightText(text, query) {
          if (!text) return '';
          const escapedQuery = escapeRegExp(query);
          return text.replace(new RegExp(escapedQuery, "gi"), match => \`<span class="highlight">\${match}</span>\`);
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
                      <div class="repo-card shadow-md overflow-hidden flex flex-col m-2">
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


// Event listener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Request handler
async function handleRequest(request) {
  const url = new URL(request.url)
  
  try {
    // 获取KV中的dashboard内容
    const dashboardHtml = await WEBLIST.get('DASHBOARD')
    
    if (url.pathname === '/login' && request.method === 'POST') {
      const formData = await request.formData()
      const password = formData.get('password')
      
      if (password === PASSWORD) {
        const response = new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        })
        response.headers.set('Set-Cookie', `auth=${PASSWORD}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`)
        return response
      } else {
        return new Response(JSON.stringify({ success: false }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
    } else if (url.pathname === '/check-auth' && request.method === 'GET') {
      return new Response(JSON.stringify({ authenticated: isAuthenticated(request) }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      if (!isAuthenticated(request)) {
        return new Response(getLoginHtml(), {
          headers: { 'Content-Type': 'text/html' },
        })
      }
      
      if (!dashboardHtml) {
        return new Response('Dashboard content not found', { status: 500 })
      }
      
      return new Response(getHtmlContent(dashboardHtml), {
        headers: { 'Content-Type': 'text/html' },
      })
    }
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}

// Authentication check
function isAuthenticated(request) {
  const cookies = request.headers.get('Cookie')
  if (cookies) {
    const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth='))
    if (authCookie) {
      const authValue = authCookie.split('=')[1]
      return authValue === PASSWORD
    }
  }
  return false
}

// Login page HTML
function getLoginHtml() {
  return `
  
<!DOCTYPE html>
<html data-theme="light">
<head>
    <meta charset="UTF-8">
    <title>AITO WebList Login</title>
    <style>
        /* Theme variables */
        [data-theme="light"] {
            --bg-color: #ffffff;
            --text-color: #333333;
            --card-bg: #ffffff;
            --card-shadow: 0 2px 8px rgba(0,0,0,0.1);
            --button-bg: #f0f0f0;
            --button-text: #333333;
            --border-color: #eeeeee;
        }

        [data-theme="dark"] {
            --bg-color: #1a1a1a;
            --text-color: #ffffff;
            --card-bg: #242424;
            --card-shadow: 0 2px 8px rgba(0,0,0,0.3);
            --button-bg: #333333;
            --button-text: #ffffff;
            --border-color: #333333;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: all 0.3s ease;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #loginForm {
            background-color: var(--card-bg);
            padding: 30px;
            border-radius: 10px;
            box-shadow: var(--card-shadow);
            width: 300px;
            text-align: center;
        }

        #loginForm h1 {
            margin: 0 0 20px 0;
            color: var(--text-color);
            font-size: 24px;
        }

        #loginForm input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-color);
            color: var(--text-color);
            font-size: 16px;
            box-sizing: border-box;
        }

        #loginForm button {
            width: 100%;
            padding: 12px;
            margin-top: 20px;
            background: var(--button-bg);
            color: var(--button-text);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        #loginForm button:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div id="loginForm">
        <h1>AITO WebList</h1>
        <input type="password" id="password" placeholder="Enter password">
        <button onclick="login()">Login</button>
    </div>

    <script>
        async function login() {
            const password = document.getElementById('password').value;
            const formData = new FormData();
            formData.append('password', password);
            
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                
                if (result.success) {
                    window.location.reload();
                } else {
                    alert('Incorrect password');
                }
            } catch (error) {
                alert('Login failed. Please try again.');
            }
        }

        // Add Enter key listener
        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    </script>
</body>
</html>

  `
}


// Main page HTML generator
function getHtmlContent(dashboardHtml) {
  return `
  
<!DOCTYPE html>
<html data-theme="light">
<head>
    <meta charset="UTF-8">
    <title>AITO WebList</title>
    <style>
        /* Theme variables */
        [data-theme="light"] {
            --bg-color: #ffffff;
            --text-color: #333333;
            --link-color: #0066cc;
            --border-color: #eeeeee;
            --hover-color: #f5f5f5;
            --button-bg: #f0f0f0;
            --button-text: #333333;
            --card-bg: #ffffff;
            --card-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        [data-theme="dark"] {
            --bg-color: #1a1a1a;
            --text-color: #ffffff;
            --link-color: #66b3ff;
            --border-color: #333333;
            --hover-color: #2d2d2d;
            --button-bg: #333333;
            --button-text: #ffffff;
            --card-bg: #242424;
            --card-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        /* Base styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: all 0.3s ease;
            line-height: 1.6;
        }

        /* Theme switch button */
        .mode-switch-wrapper {
            text-align: right;
            padding: 10px 20px;
            position: sticky;
            top: 0;
            background-color: var(--bg-color);
            z-index: 100;
        }

        #modeToggle {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            background-color: var(--button-bg);
            color: var(--button-text);
            transition: all 0.3s ease;
        }

        /* Project card styles */
        .project {
            background-color: var(--card-bg);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: var(--card-shadow);
        }

        .project h2 {
            margin: 0 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--border-color);
            color: var(--text-color);
        }

        .links {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
        }

        /* Link styles */
        a {
            color: var(--link-color);
            text-decoration: none;
            padding: 10px;
            border-radius: 6px;
            transition: all 0.2s ease;
            display: block;
        }

        a:hover {
            background-color: var(--hover-color);
            transform: translateY(-2px);
        }

        /* Subproject styles */
        .subproject {
            margin: 20px 0;
        }

        .subproject h3 {
            color: var(--text-color);
            margin: 10px 0;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }

            .links {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    ${dashboardHtml}
    <script>
        // Theme toggle functionality
        function toggleTheme() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }

        // Page load initialization
        window.onload = function() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
            }
        }
    </script>
</body>
</html>

  `
}

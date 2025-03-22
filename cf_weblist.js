
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
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
    return new Response(getHtmlContent(), {
      headers: { 'Content-Type': 'text/html' },
    })
  }
}

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

function getHtmlContent() {
  return `
  
<!DOCTYPE html>
<html data-theme="light">
<head>
    <meta charset="UTF-8">
    <title>WebList</title>
    <style>
        /* 主题变量 */
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

        /* 基础样式 */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: all 0.3s ease;
            line-height: 1.6;
        }

		/* 登录表单样式 */
		#loginForm {
			position: fixed; /* 固定定位 */
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%); /* 使用transform居中 */
			text-align: center;
			background-color: var(--card-bg);
			padding: 30px;
			border-radius: 10px;
			box-shadow: var(--card-shadow);
			width: 300px;
			z-index: 1000;
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

		/* 添加标题样式 */
		#loginForm h1 {
			margin: 0 0 20px 0;
			color: var(--text-color);
			font-size: 24px;
		}

        /* 主题切换按钮 */
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

        /* 项目卡片样式 */
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

        /* 链接样式 */
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

        /* 子项目样式 */
        .subproject {
            margin: 20px 0;
        }

        .subproject h3 {
            color: var(--text-color);
            margin: 10px 0;
        }

        /* 响应式设计 */
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
	<div id="loginForm">
		<h1>WebList</h1>
		<input type="password" id="password" placeholder="Enter password">
		<button onclick="login()">Login</button>
	</div>

    <div id="dashboard" style="display:none;">
        <div class="mode-switch-wrapper">
            <button onclick="toggleTheme()" id="modeToggle">🌓 切换模式</button>
        </div>

        <div class="project">
            <h2>主站</h2>
            <div class="links">
                <a href="https://m5.aitoo.fun/" target="_blank">AI明语 AITO</a>
            </div>
        </div>

        <div class="project">
            <h2>子站</h2>
            <div class="subproject">
                <h3>开发</h3>
                <div class="subproject">
                    <h3>论坛</h3>
                    <div class="links">
                        <a href="https://linux.do/" target="_blank">Linux.do</a>
                    </div>
                </div>

                <div class="subproject">
                    <h3>Git</h3>
                    <div class="links">
                        <a href="https://github.com/" target="_blank">Github</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="subproject">
            <h3>工具</h3>
            <div class="links">
                <a href="https://www.jyshare.com/" target="_blank">jyshare</a>
            </div>
        </div>

        <div class="subproject">
            <h3>电影</h3>
            <div class="links">
                <a href="https://47bt.com/" target="_blank">47bt</a>
            </div>
        </div>
    </div>

    <script>
        // 主题切换功能
        function toggleTheme() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }

        // 认证相关功能
        let password = '';

        function showLoginForm() {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('dashboard').style.display = 'none';
        }

        function showDashboard() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
        }

        async function checkAuth() {
            const response = await fetch('/check-auth');
            const data = await response.json();
            if (data.authenticated) {
                showDashboard();
            } else {
                showLoginForm();
            }
        }

        async function login() {
            password = document.getElementById('password').value;
            const formData = new FormData();
            formData.append('password', password);
            const response = await fetch('/login', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showDashboard();
            } else {
                alert('Incorrect password');
            }
        }

        // 页面加载时的初始化
        window.onload = function() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
            }
            checkAuth();
        }
    </script>
</body>
</html>

  `
}

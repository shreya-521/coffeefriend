# Security Headers Configuration for CoffeeFriend PWA

This file contains security header configurations for different web servers.
Use the appropriate section for your server setup.

---

## Apache (.htaccess)

If using Apache web server, create a `.htaccess` file in your coffeeapp directory:

```apache
# Enable HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
<IfModule mod_headers.c>
    # Prevent clickjacking
    Header always set X-Frame-Options "SAMEORIGIN"
    
    # Prevent MIME type sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Enable XSS protection
    Header always set X-XSS-Protection "1; mode=block"
    
    # Content Security Policy
    Header always set Content-Security-Policy "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'"
    
    # Referrer Policy
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Permissions Policy
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Cache control for service worker
<FilesMatch "^sw\.js$">
    Header set Cache-Control "public, max-age=3600"
</FilesMatch>

# Cache control for manifest
<FilesMatch "manifest\.json$">
    Header set Cache-Control "public, max-age=3600"
</FilesMatch>

# Cache static assets
<FilesMatch "\.(js|css|svg|woff2)$">
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Don't cache HTML
<FilesMatch "\.html$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
</FilesMatch>
```

---

## Nginx Configuration

If using Nginx, add these headers to your server block:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'" always;

    # Root directory
    root /var/www/coffeeapp;

    # Service Worker cache control
    location /sw.js {
        add_header Cache-Control "public, max-age=3600" always;
    }

    # Manifest cache control
    location /manifest.json {
        add_header Cache-Control "public, max-age=3600" always;
    }

    # Static assets cache
    location ~* \.(js|css|svg|woff2)$ {
        add_header Cache-Control "public, max-age=31536000" always;
    }

    # HTML - no caching
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    }

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /pageone.html;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Vercel/Netlify (vercel.json or netlify.toml)

### For Vercel - Create `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)$",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/pageone.html"
    }
  ]
}
```

### For Netlify - Create/Update `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Content-Security-Policy = "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'"

[[redirects]]
  from = "/*"
  to = "/pageone.html"
  status = 200
```

---

## GitHub Pages (Automatic - No Configuration Needed)

GitHub Pages automatically serves over HTTPS. Your PWA will work as-is!

---

## Node.js/Express Server

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy', 
    "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; " +
    "script-src 'self'; " +
    "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self'"
  );
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'coffeeapp')));

// Cache control
app.get(/\.js$|\.css$|\.svg$|\.woff2$/, (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.sendFile(path.join(__dirname, 'coffeeapp', req.path));
});

app.get('/sw.js', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.join(__dirname, 'coffeeapp', 'sw.js'));
});

app.get('/*.html', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'coffeeapp', req.path));
});

// SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'coffeeapp', 'pageone.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CoffeeFriend PWA running on port ${PORT} with HTTPS`);
});
```

---

## Security Headers Explanation

| Header | Purpose |
|--------|---------|
| **X-Frame-Options** | Prevents clickjacking attacks |
| **X-Content-Type-Options** | Prevents MIME sniffing |
| **X-XSS-Protection** | Enables XSS filter in browsers |
| **Content-Security-Policy** | Controls resource loading (prevents injection attacks) |
| **Referrer-Policy** | Controls what referrer info is shared |
| **Permissions-Policy** | Restricts access to device features |

---

## Testing Security Headers

Use these tools to verify your security headers:

1. **Online Scanner**
   - https://securityheaders.com/
   - https://observatory.mozilla.org/

2. **Command Line**
   ```bash
   curl -I https://yourdomain.com/coffeeapp/
   ```

3. **Browser DevTools**
   - Open DevTools → Network tab
   - Click any request → Headers tab
   - Look for Response Headers section

---

## Common Hosting Providers

### ✅ Best Options
- **Netlify** - Automatic HTTPS, easy setup
- **Vercel** - Automatic HTTPS, fast
- **GitHub Pages** - Free, automatic HTTPS
- **Cloudflare** - Enterprise security

### Good Options
- **Heroku** - Free tier available
- **AWS** - Complete control
- **DigitalOcean** - Affordable

---

## Quick Deployment Checklist

- [ ] Choose your hosting provider
- [ ] Get HTTPS certificate (Let's Encrypt = free)
- [ ] Upload all files to server
- [ ] Add security headers (see above for your server)
- [ ] Test with securityheaders.com
- [ ] Test PWA installation
- [ ] Test offline functionality

---

## HTTPS Setup (Free Option)

**Using Let's Encrypt:**

```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure renewal
sudo certbot renew --dry-run
```

**Using hosting provider:**
- Most providers (Netlify, Vercel, GitHub Pages) offer free HTTPS
- Some like cPanel have automatic HTTPS setup

---

**Your CoffeeFriend PWA is now secure and production-ready!** ✨

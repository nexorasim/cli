#!/usr/bin/env python3

import os
import xml.etree.ElementTree as ET
from pathlib import Path

def validate_seo_files():
    """Validate SEO files for correct structure and content"""
    print("=== SEO FILES VALIDATION ===")
    
    # Validate sitemap.xml
    try:
        tree = ET.parse('sitemap.xml')
        root = tree.getroot()
        urls = root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}url')
        print(f"✓ sitemap.xml: Valid XML with {len(urls)} URLs")
        
        # Check for correct domain
        for url in urls[:3]:
            loc = url.find('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text
            if 'esim.com.mm' in loc:
                print(f"✓ Domain validation: {loc}")
                break
    except Exception as e:
        print(f"✗ sitemap.xml error: {e}")
    
    # Validate robots.txt
    try:
        with open('robots.txt', 'r') as f:
            robots_content = f.read()
        if 'esim.com.mm' in robots_content and 'Sitemap:' in robots_content:
            print("✓ robots.txt: Valid with correct domain and sitemap reference")
        else:
            print("✗ robots.txt: Missing domain or sitemap reference")
    except Exception as e:
        print(f"✗ robots.txt error: {e}")
    
    # Validate RSS feed
    try:
        tree = ET.parse('rss.xml')
        root = tree.getroot()
        channel = root.find('.//channel')
        title = channel.find('title').text
        if 'ESIM MYANMAR' in title:
            print(f"✓ rss.xml: Valid RSS feed - {title}")
        else:
            print("✗ rss.xml: Missing company branding")
    except Exception as e:
        print(f"✗ rss.xml error: {e}")

def validate_company_info():
    """Validate company information in key files"""
    print("\n=== COMPANY INFORMATION VALIDATION ===")
    
    company_details = {
        'name': 'ESIM MYANMAR COMPANY LIMITED',
        'phone': '(+95) 96 50000172',
        'website': 'https://www.esim.com.mm',
        'email': 'info@esim.com.mm'
    }
    
    # Check frontend HTML
    try:
        with open('frontend/public/index.html', 'r') as f:
            html_content = f.read()
        
        found_items = []
        for key, value in company_details.items():
            if value in html_content:
                found_items.append(key)
        
        print(f"✓ frontend/public/index.html: {len(found_items)}/4 company details found")
    except Exception as e:
        print(f"✗ HTML validation error: {e}")
    
    # Check React App
    try:
        with open('frontend/src/App.js', 'r') as f:
            app_content = f.read()
        
        if company_details['name'] in app_content and company_details['phone'] in app_content:
            print("✓ frontend/src/App.js: Company information integrated")
        else:
            print("✗ frontend/src/App.js: Missing company information")
    except Exception as e:
        print(f"✗ React App validation error: {e}")

def validate_nginx_config():
    """Validate nginx configuration for production readiness"""
    print("\n=== NGINX CONFIGURATION VALIDATION ===")
    
    try:
        with open('nginx.conf', 'r') as f:
            nginx_content = f.read()
        
        checks = {
            'SSL/HTTPS': 'ssl_certificate' in nginx_content,
            'HTTP/2': 'http2' in nginx_content,
            'Gzip': 'gzip on' in nginx_content,
            'Security Headers': 'X-Frame-Options' in nginx_content,
            'Rate Limiting': 'limit_req' in nginx_content,
            'Correct Domain': 'esim.com.mm' in nginx_content
        }
        
        for check, passed in checks.items():
            status = "✓" if passed else "✗"
            print(f"{status} {check}: {'Configured' if passed else 'Missing'}")
            
    except Exception as e:
        print(f"✗ nginx.conf validation error: {e}")

def validate_file_structure():
    """Validate required files and directory structure"""
    print("\n=== FILE STRUCTURE VALIDATION ===")
    
    required_files = [
        'README.md',
        'sitemap.xml',
        'robots.txt',
        'rss.xml',
        'nginx.conf',
        'frontend/package.json',
        'frontend/src/App.js',
        'frontend/public/index.html',
        'backend/server.py',
        'backend/requirements.txt'
    ]
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✓ {file_path}: Present")
        else:
            print(f"✗ {file_path}: Missing")

if __name__ == "__main__":
    validate_seo_files()
    validate_company_info()
    validate_nginx_config()
    validate_file_structure()
    print("\n=== VALIDATION COMPLETE ===")
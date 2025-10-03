#!/usr/bin/env python3

import os
import sys
import json
import subprocess
from pathlib import Path

def check_file_permissions():
    """Check critical file permissions"""
    errors = []
    
    critical_files = [
        'deploy.sh',
        'backend/server.py',
        'nginx.conf',
        'README.md'
    ]
    
    for file_path in critical_files:
        if os.path.exists(file_path):
            stat = os.stat(file_path)
            if file_path == 'deploy.sh' and not (stat.st_mode & 0o111):
                errors.append(f"deploy.sh not executable")
        else:
            errors.append(f"Missing critical file: {file_path}")
    
    return errors

def check_syntax_errors():
    """Check for syntax errors in Python and JavaScript files"""
    errors = []
    
    # Check Python files
    python_files = ['backend/server.py', 'backend/auth.py', 'test_api.py', 'validate_website.py']
    for py_file in python_files:
        if os.path.exists(py_file):
            try:
                with open(py_file, 'r') as f:
                    compile(f.read(), py_file, 'exec')
            except SyntaxError as e:
                errors.append(f"Python syntax error in {py_file}: {e}")
    
    # Check JavaScript files
    js_files = ['frontend/src/App.js', 'frontend/src/components/ContactForm.js', 'frontend/src/components/LoginForm.js']
    for js_file in js_files:
        if os.path.exists(js_file):
            with open(js_file, 'r') as f:
                content = f.read()
                if 'import' not in content and 'export' not in content:
                    errors.append(f"JavaScript file {js_file} missing import/export")
    
    return errors

def check_configuration_errors():
    """Check configuration file errors"""
    errors = []
    
    # Check nginx.conf
    if os.path.exists('nginx.conf'):
        with open('nginx.conf', 'r') as f:
            nginx_content = f.read()
            if 'server_name' not in nginx_content:
                errors.append("nginx.conf missing server_name")
            if 'ssl_certificate' not in nginx_content:
                errors.append("nginx.conf missing SSL configuration")
    
    # Check package.json
    if os.path.exists('frontend/package.json'):
        try:
            with open('frontend/package.json', 'r') as f:
                package_data = json.load(f)
                if 'scripts' not in package_data:
                    errors.append("frontend/package.json missing scripts")
        except json.JSONDecodeError:
            errors.append("frontend/package.json invalid JSON")
    
    return errors

def check_api_dependencies():
    """Check API and dependency errors"""
    errors = []
    
    # Check requirements.txt
    if os.path.exists('backend/requirements.txt'):
        with open('backend/requirements.txt', 'r') as f:
            requirements = f.read()
            required_packages = ['fastapi', 'uvicorn', 'pydantic', 'passlib', 'python-jose']
            for package in required_packages:
                if package not in requirements:
                    errors.append(f"Missing required package: {package}")
    else:
        errors.append("Missing backend/requirements.txt")
    
    return errors

def check_security_issues():
    """Check for security configuration issues"""
    errors = []
    
    # Check for hardcoded secrets
    sensitive_files = ['backend/server.py', 'backend/auth.py']
    for file_path in sensitive_files:
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                content = f.read()
                if 'password' in content.lower() and '=' in content:
                    lines = content.split('\n')
                    for i, line in enumerate(lines):
                        if 'password' in line.lower() and '=' in line and not line.strip().startswith('#'):
                            if '"' in line or "'" in line:
                                errors.append(f"Potential hardcoded password in {file_path}:{i+1}")
    
    # Check CORS configuration
    if os.path.exists('backend/server.py'):
        with open('backend/server.py', 'r') as f:
            content = f.read()
            if 'allow_origins=["*"]' in content:
                errors.append("CORS allows all origins - security risk")
    
    return errors

def check_company_information():
    """Verify company information consistency"""
    errors = []
    
    company_name = "ESIM MYANMAR COMPANY LIMITED"
    phone = "(+95) 96 50000172"
    website = "https://www.esim.com.mm"
    email = "info@esim.com.mm"
    
    files_to_check = [
        'README.md',
        'frontend/src/App.js',
        'backend/server.py'
    ]
    
    for file_path in files_to_check:
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                content = f.read()
                if company_name not in content:
                    errors.append(f"Company name missing in {file_path}")
                if website not in content and file_path != 'backend/server.py':
                    errors.append(f"Website URL missing in {file_path}")
    
    return errors

def run_all_checks():
    """Run all error checks"""
    print("ERROR CHECK REPORT")
    print("Company: ESIM MYANMAR COMPANY LIMITED")
    print("Website: https://www.esim.com.mm")
    print("=" * 50)
    
    all_errors = []
    
    checks = [
        ("File Permissions", check_file_permissions),
        ("Syntax Errors", check_syntax_errors),
        ("Configuration", check_configuration_errors),
        ("Dependencies", check_api_dependencies),
        ("Security Issues", check_security_issues),
        ("Company Information", check_company_information)
    ]
    
    for check_name, check_func in checks:
        print(f"\n{check_name}:")
        errors = check_func()
        if errors:
            for error in errors:
                print(f"  ERROR: {error}")
                all_errors.append(f"{check_name}: {error}")
        else:
            print("  PASS: No errors found")
    
    print(f"\n{'='*50}")
    print(f"TOTAL ERRORS: {len(all_errors)}")
    
    if all_errors:
        print("\nERRORS SUMMARY:")
        for i, error in enumerate(all_errors, 1):
            print(f"{i}. {error}")
        return 1
    else:
        print("STATUS: ALL CHECKS PASSED")
        return 0

if __name__ == "__main__":
    sys.exit(run_all_checks())
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

console.log('🚀 eSIM Myanmar - Comprehensive Validation Suite');
console.log('================================================');

let passed = 0;
let failed = 0;

function checkPassed(message) {
    console.log(`✅ ${message}`);
    passed++;
}

function checkFailed(message) {
    console.log(`❌ ${message}`);
    failed++;
}

function checkWarning(message) {
    console.log(`⚠️  ${message}`);
}

// 1. Validate company details consistency
console.log('\n1. 🏢 Validating Company Details Consistency');
console.log('--------------------------------------------');

try {
    const constants = fs.readFileSync('constants.ts', 'utf8');
    
    const requiredDetails = {
        'ESIM MYANMAR COMPANY LIMITED': constants.includes('ESIM MYANMAR COMPANY LIMITED'),
        'Parami Road, No-70/A, Ward (16), Hlaing Township, Yangon, Myanmar': constants.includes('Parami Road, No-70/A, Ward (16), Hlaing Township, Yangon, Myanmar'),
        '(+95) 96 50000172': constants.includes('(+95) 96 50000172'),
        'https://www.esim.com.mm': constants.includes('https://www.esim.com.mm'),
        'info@esim.com.mm': constants.includes('info@esim.com.mm')
    };
    
    for (const [detail, found] of Object.entries(requiredDetails)) {
        if (found) {
            checkPassed(`Company detail found: ${detail}`);
        } else {
            checkFailed(`Missing company detail: ${detail}`);
        }
    }
} catch (error) {
    checkFailed(`Could not read constants.ts: ${error.message}`);
}

// 2. Validate XML files
console.log('\n2. 📄 Validating XML Files');
console.log('-------------------------');

const xmlFiles = [
    'public/sitemap.xml',
    'public/atom.xml',
    'public/feeds/atom.xml',
    'public/rss.xml'
];

xmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            // Basic XML validation
            if (content.includes('<?xml') && content.includes('<') && content.includes('>')) {
                checkPassed(`${file} has valid XML structure`);
                
                // Check for www.esim.com.mm
                if (content.includes('www.esim.com.mm')) {
                    checkPassed(`${file} uses correct www domain`);
                } else {
                    checkWarning(`${file} should use www.esim.com.mm domain`);
                }
            } else {
                checkFailed(`${file} has invalid XML structure`);
            }
        } catch (error) {
            checkFailed(`Could not read ${file}: ${error.message}`);
        }
    } else {
        checkWarning(`${file} not found`);
    }
});

// 3. Validate robots.txt
console.log('\n3. 🤖 Validating robots.txt');
console.log('---------------------------');

if (fs.existsSync('public/robots.txt')) {
    const robotsContent = fs.readFileSync('public/robots.txt', 'utf8');
    if (robotsContent.trim().length > 0) {
        checkPassed('robots.txt is non-empty');
        if (robotsContent.includes('www.esim.com.mm')) {
            checkPassed('robots.txt uses correct www domain');
        } else {
            checkFailed('robots.txt should use www.esim.com.mm domain');
        }
    } else {
        checkFailed('robots.txt is empty');
    }
} else {
    checkFailed('robots.txt not found');
}

// 4. Validate nginx configuration
console.log('\n4. 🌐 Validating Nginx Configuration');
console.log('-----------------------------------');

const nginxFiles = [
    'nginx/default.conf',
    'nginx/nginx.conf',
    'nginx/ssl.conf'
];

nginxFiles.forEach(file => {
    if (fs.existsSync(file)) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('server') || content.includes('http') || content.includes('events')) {
                checkPassed(`${file} has valid nginx structure`);
                
                // Check for security headers
                if (content.includes('X-Frame-Options') && content.includes('X-Content-Type-Options')) {
                    checkPassed(`${file} includes security headers`);
                } else {
                    checkWarning(`${file} missing some security headers`);
                }
            } else {
                checkFailed(`${file} has invalid nginx structure`);
            }
        } catch (error) {
            checkFailed(`Could not read ${file}: ${error.message}`);
        }
    } else {
        checkWarning(`${file} not found`);
    }
});

// 5. Validate package.json and dependencies
console.log('\n5. 📦 Validating Package Configuration');
console.log('-------------------------------------');

try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const requiredDeps = ['react', 'react-dom', 'react-router-dom'];
    const requiredDevDeps = ['@types/react', '@types/react-dom', '@vitejs/plugin-react', 'typescript', 'vite'];
    
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            checkPassed(`Required dependency found: ${dep}`);
        } else {
            checkFailed(`Missing required dependency: ${dep}`);
        }
    });
    
    requiredDevDeps.forEach(dep => {
        if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
            checkPassed(`Required dev dependency found: ${dep}`);
        } else {
            checkFailed(`Missing required dev dependency: ${dep}`);
        }
    });
    
} catch (error) {
    checkFailed(`Could not validate package.json: ${error.message}`);
}

// 6. Validate TypeScript configuration
console.log('\n6. 🔧 Validating TypeScript Configuration');
console.log('----------------------------------------');

try {
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    
    if (tsConfig.compilerOptions) {
        checkPassed('tsconfig.json has compilerOptions');
        
        const requiredOptions = ['jsx', 'target', 'module'];
        requiredOptions.forEach(option => {
            if (tsConfig.compilerOptions[option]) {
                checkPassed(`TypeScript option found: ${option}`);
            } else {
                checkWarning(`TypeScript option missing: ${option}`);
            }
        });
    } else {
        checkFailed('tsconfig.json missing compilerOptions');
    }
} catch (error) {
    checkFailed(`Could not validate tsconfig.json: ${error.message}`);
}

// 7. Validate Vite configuration
console.log('\n7. ⚡ Validating Vite Configuration');
console.log('----------------------------------');

try {
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
    
    if (viteConfig.includes('@vitejs/plugin-react')) {
        checkPassed('Vite config includes React plugin');
    } else {
        checkFailed('Vite config missing React plugin');
    }
    
    if (viteConfig.includes('plugins:')) {
        checkPassed('Vite config has plugins array');
    } else {
        checkFailed('Vite config missing plugins configuration');
    }
    
} catch (error) {
    checkFailed(`Could not validate vite.config.ts: ${error.message}`);
}

// 8. Check CI/CD workflow
console.log('\n8. 🔄 Validating CI/CD Workflow');
console.log('------------------------------');

if (fs.existsSync('.github/workflows/ci.yml')) {
    try {
        const workflow = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
        
        if (workflow.includes('validate:') && workflow.includes('deploy:')) {
            checkPassed('CI/CD workflow has validate and deploy jobs');
        } else {
            checkWarning('CI/CD workflow missing validate or deploy jobs');
        }
        
        if (workflow.includes('npm run build')) {
            checkPassed('CI/CD workflow includes build step');
        } else {
            checkFailed('CI/CD workflow missing build step');
        }
        
    } catch (error) {
        checkFailed(`Could not read CI/CD workflow: ${error.message}`);
    }
} else {
    checkWarning('CI/CD workflow file not found');
}

// Summary
console.log('\n📊 VALIDATION SUMMARY');
console.log('====================');
console.log(`✅ Checks Passed: ${passed}`);
console.log(`❌ Checks Failed: ${failed}`);

if (failed === 0) {
    console.log('\n🎉 All critical validations passed! Ready for deployment.');
    process.exit(0);
} else {
    console.log('\n💥 Some validations failed. Please fix the issues before deployment.');
    process.exit(1);
}
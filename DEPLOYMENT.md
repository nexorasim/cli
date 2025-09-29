# eSIM Myanmar - Deployment Guide

## Version Management

### Semantic Versioning
- **Major** (1.0.0): Breaking changes, new architecture
- **Minor** (1.1.0): New features, backward compatible
- **Patch** (1.1.1): Bug fixes, security updates

### Release Process
1. Create feature branch: `git checkout -b feature/new-plan-type`
2. Make changes and test locally
3. Create PR to `main` branch
4. Auto-deploy to staging after merge
5. Manual promotion to production

## Environment Setup

### Staging Environment
- URL: https://staging.esim-myanmar.com
- Auto-deploy from `main` branch
- Test all features before production

### Production Environment
- URL: https://esim-myanmar.com
- Manual deployment only
- Requires staging validation

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] XML files validated (sitemap, RSS, Atom)
- [ ] OpenAPI spec validated
- [ ] Security headers configured
- [ ] Performance benchmarks met

### SEO & Content
- [ ] Meta tags updated (English + Burmese)
- [ ] Sitemap includes new pages
- [ ] RSS/Atom feeds updated
- [ ] Structured data validated
- [ ] Canonical URLs set

### API & Integration
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] Rate limiting configured
- [ ] Error handling implemented

### Infrastructure
- [ ] SSL certificates valid
- [ ] CDN cache purged
- [ ] Database migrations run
- [ ] Backup completed

## Rollout Strategy

### Blue-Green Deployment
1. Deploy to green environment
2. Run validation checks
3. Switch traffic gradually (10% → 50% → 100%)
4. Monitor metrics and errors
5. Rollback if issues detected

### Feature Flags
```javascript
// Example feature flag usage
if (featureFlags.newPlanType && userRegion === 'MM') {
  showNewPlanType();
}
```

### Monitoring
- Response time < 2s
- Error rate < 0.1%
- Uptime > 99.9%
- API rate limits not exceeded

## Rollback Procedure

### Quick Rollback
```bash
# Revert to previous version
git revert HEAD
git push origin main

# Or use deployment tool
./deploy.sh rollback v1.2.3
```

### Database Rollback
```bash
# Restore from backup
pg_restore -d esim_myanmar backup_20240115.sql

# Run down migrations if needed
npm run migrate:down
```

## Post-Deployment

### Validation Steps
1. Run `./update-check.sh production`
2. Check key user journeys
3. Verify payment processing
4. Test eSIM activation flow
5. Monitor error logs for 30 minutes

### Search Engine Updates
```bash
# Ping search engines (automated in CI)
curl "https://www.google.com/ping?sitemap=https://esim-myanmar.com/sitemap.xml"
curl "https://www.bing.com/ping?sitemap=https://esim-myanmar.com/sitemap.xml"
```

### Performance Monitoring
- Core Web Vitals
- API response times
- Database query performance
- CDN hit rates

## Emergency Procedures

### Critical Issues
1. **Immediate**: Switch to maintenance mode
2. **Assess**: Determine impact and root cause
3. **Communicate**: Update status page and notify users
4. **Fix**: Apply hotfix or rollback
5. **Verify**: Run full validation suite
6. **Document**: Post-mortem and lessons learned

### Contact Information
- **On-call Engineer**: +95-xxx-xxx-xxxx
- **DevOps Team**: devops@esim-myanmar.com
- **Status Page**: https://status.esim-myanmar.com
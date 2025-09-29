# eSIM Myanmar - Quick Rollout Checklist

## Pre-Launch (24 hours before)

### Technical Preparation
- [ ] **Code freeze** - No new commits to main branch
- [ ] **Staging validation** - All tests passing on staging environment
- [ ] **Database backup** - Fresh backup of production database
- [ ] **SSL certificates** - Verify expiry dates (>30 days remaining)
- [ ] **CDN cache** - Prepare cache purge strategy
- [ ] **Monitoring** - Set up alerts for deployment window

### Content & SEO
- [ ] **Sitemap updated** - New pages included, lastmod dates current
- [ ] **Meta tags** - English + Burmese titles/descriptions ready
- [ ] **Structured data** - JSON-LD validated for new content
- [ ] **RSS/Atom feeds** - New content prepared for feeds
- [ ] **Robots.txt** - Updated if new sections added

### Team Coordination
- [ ] **Deployment window** - Team notified of maintenance window
- [ ] **Rollback plan** - Quick rollback procedure documented
- [ ] **Communication** - Customer notification prepared if needed
- [ ] **On-call engineer** - Designated person available for 2 hours post-deploy

## Launch Day

### 30 Minutes Before
- [ ] **Final staging check** - Run `./update-check.sh staging`
- [ ] **Team standup** - Brief deployment team on plan
- [ ] **Monitoring dashboard** - Open and ready
- [ ] **Rollback assets** - Previous version tagged and ready

### Deployment (15 minutes)
- [ ] **Deploy to production** - Execute deployment script
- [ ] **Initial validation** - Run `./update-check.sh production`
- [ ] **Smoke tests** - Test critical user journeys:
  - [ ] Homepage loads (English + Burmese)
  - [ ] Plan selection works
  - [ ] Payment flow functional
  - [ ] eSIM activation process
  - [ ] API endpoints responding

### Immediate Post-Deploy (30 minutes)
- [ ] **Performance check** - Page load times < 3s
- [ ] **Error monitoring** - No spike in error rates
- [ ] **API health** - All endpoints returning expected responses
- [ ] **Search engine ping** - Sitemap notifications sent
- [ ] **CDN cache** - Purge completed successfully

## Post-Launch (2 hours)

### Monitoring & Validation
- [ ] **User analytics** - Traffic patterns normal
- [ ] **Conversion rates** - No significant drops
- [ ] **Customer support** - No unusual ticket volume
- [ ] **Payment processing** - Transactions completing successfully
- [ ] **Mobile responsiveness** - Test on actual devices

### SEO & Performance
- [ ] **Core Web Vitals** - LCP, FID, CLS within targets
- [ ] **Search console** - No new crawl errors
- [ ] **Structured data** - Rich snippets displaying correctly
- [ ] **Social media** - Open Graph tags working

### Documentation
- [ ] **Deployment log** - Record version, time, issues
- [ ] **Performance baseline** - Update benchmarks
- [ ] **Known issues** - Document any minor issues for next release

## 24 Hours Later

### Health Check
- [ ] **Full validation suite** - Run comprehensive checks
- [ ] **User feedback** - Review support tickets and feedback
- [ ] **Analytics review** - Compare metrics to previous period
- [ ] **Search rankings** - Monitor for any drops

### Cleanup
- [ ] **Old assets** - Clean up unused files/images
- [ ] **Log analysis** - Review deployment logs for improvements
- [ ] **Team retrospective** - Quick lessons learned session

## Emergency Rollback Triggers

**Immediate rollback if:**
- Error rate > 1%
- Page load time > 5s
- Payment processing failure > 5%
- API downtime > 2 minutes
- Critical security vulnerability discovered

**Rollback command:**
```bash
git revert HEAD && git push origin main
# Or: ./deploy.sh rollback v1.2.3
```

## Success Criteria

**Deployment is successful when:**
- All checklist items completed ✅
- Error rate < 0.1%
- Page load time < 2s average
- No customer complaints for 2 hours
- All API endpoints healthy
- Search engine indexing normal

---

**Deployment Lead:** _________________ **Date:** _________

**Sign-off:** _________________ **Time:** _________
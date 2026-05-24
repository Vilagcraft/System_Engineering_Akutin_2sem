# RocketSpot — Academic System Engineering Appendix

## 1. Stakeholder Requirements (15)

| ID | Requirement | Metric |
|---|---|---|
| SR-SH-01 | Low-risk withdrawal must complete quickly | 95% < 30 min |
| SR-SH-02 | High-risk withdrawal requires manual approval | 100% of high-risk tx |
| SR-SH-03 | Compliance officer can freeze account | < 5 sec |
| SR-SH-04 | Treasury manages cold storage quorum | M-of-N policy |
| SR-SH-05 | API key management is self-service | Available in UI |
| SR-SH-06 | Audit trail available to regulator | Export < 1 hour |
| SR-SH-07 | Corporate clients can use scoped API keys | RBAC enforced |
| SR-SH-08 | Traders receive notification on withdrawal state | < 10 sec delivery |
| SR-SH-09 | SecOps can revoke credentials instantly | < 60 sec |
| SR-SH-10 | Platform supports tenant isolation | 100% isolation |
| SR-SH-11 | Exchange supports BTC, ETH, TRON | Production support |
| SR-SH-12 | System supports incident investigation | Search by correlation_id |
| SR-SH-13 | Regulator reporting is immutable | WORM retention 5 years |
| SR-SH-14 | Platform supports DR mode | RTO < 15 min |
| SR-SH-15 | API supports idempotent requests | Duplicate protection |

---

## 2. System Requirements (30)

### Security

1. All signing operations SHALL be executed through HSM.
2. Private keys SHALL never leave HSM boundary.
3. Withdraw API SHALL require MFA.
4. Withdraw API SHALL validate IP whitelist.
5. Admin actions SHALL be stored in immutable WORM storage.
6. System SHALL support JWT authentication.
7. System SHALL support RBAC.
8. System SHALL support tenant isolation.
9. API SHALL validate request signatures.
10. API SHALL reject replayed requests.

### Reliability

11. System SHALL retry failed blockchain broadcasts.
12. Wallet orchestrator SHALL support saga compensation.
13. PostgreSQL SHALL use streaming replication.
14. Kafka SHALL retain audit events for 30 days.
15. System SHALL support disaster recovery mode.
16. Matching engine SHALL support graceful restart.
17. AML engine SHALL work asynchronously.
18. Notifications SHALL use retry queue.
19. Platform SHALL support rolling deployment.
20. Platform SHALL support blue-green release.

### Operations

21. Every request SHALL contain correlation_id.
22. Logs SHALL be exported to SIEM.
23. Metrics SHALL be exported to Prometheus.
24. Alerts SHALL integrate with PagerDuty.
25. API SHALL expose OpenAPI schema.
26. Audit exports SHALL support PDF and CSV.
27. Admin UI SHALL support account freeze.
28. Wallet subsystem SHALL support hot/cold segregation.
29. System SHALL support API versioning.
30. Events SHALL support additive-only schema evolution.

---

## 3. NFR Requirements (10)

| ID | Requirement | Metric |
|---|---|---|
| NFR-01 | API availability | 99.99% |
| NFR-02 | Withdrawal subsystem availability | 99.95% |
| NFR-03 | API latency | p99 < 200ms |
| NFR-04 | HSM signing latency | p99 < 1 sec |
| NFR-05 | AML decision latency | < 5 sec |
| NFR-06 | API throughput | 10k RPS |
| NFR-07 | Wallet orchestration throughput | 1000 tx/min |
| NFR-08 | DR recovery objective | RTO < 15 min |
| NFR-09 | Data loss objective | RPO < 1 min |
| NFR-10 | Audit retention | 5 years |

---

## 4. CONOPS Degradation Modes

| Scenario | Degradation |
|---|---|
| SSO unavailable | Local emergency admin accounts enabled |
| Mail server unavailable | Notifications queued in Kafka |
| HSM unavailable | Withdrawals moved to pending_hsm |
| Blockchain node unavailable | Retry on backup node |
| SIEM unavailable | Logs buffered locally |

---

## 5. ICD-lite Contracts

### API Contracts

| Endpoint | Version | Errors |
|---|---|---|
| POST /api/v2/withdraw | v2 | 400, 401, 403, 422, 429 |
| POST /api/v2/apikeys | v2 | 401, 403 |
| POST /api/v2/freeze-account | v1 | 401, 403, 404 |

### Event Contracts

| Event | Version | Description |
|---|---|---|
| transaction.signed.v1 | v1 | HSM signing completed |
| aml.alert.created.v1 | v1 | AML alert generated |
| withdrawal.completed.v1 | v1 | Withdrawal finalized |

---

## 6. Risk Register (8)

| ID | Cause | Consequence | Probability | Impact | Mitigation | Residual Risk |
|---|---|---|---|---|---|---|
| R-01 | Hot wallet compromise | Asset theft | Low | Critical | HSM, limits | Medium |
| R-02 | HSM outage | Withdrawal downtime | Medium | High | HA cluster | Low |
| R-03 | Replay attack | Duplicate withdrawal | Medium | High | Idempotency key | Low |
| R-04 | AML false negative | Regulatory fine | Low | High | External AML scoring | Medium |
| R-05 | API key leak | Unauthorized API usage | Medium | Medium | IP whitelist | Low |
| R-06 | PostgreSQL corruption | Ledger inconsistency | Low | Critical | Replication + backups | Low |
| R-07 | Kafka outage | Event processing lag | Medium | Medium | Retry and replay | Low |
| R-08 | Insider misuse | Fraudulent operations | Medium | High | RBAC + audit | Medium |

---

## 7. V&V Traceability

| Requirement | Verification | Artifact |
|---|---|---|
| SR-SH-01 | Load test | TC-01 |
| SR-SH-03 | Demo | TC-06 |
| SR-SH-06 | Inspection | TC-11 |
| SR-SYS-01 | Security test | TC-10 |
| SR-SYS-08 | Security test | TC-12 |
| NFR-01 | Analysis | TC-07 |
| NFR-08 | Disaster recovery test | TC-09 |

---

## 8. Test Cases (12)

| ID | Description | Expected Result |
|---|---|---|
| TC-01 | Low-risk withdrawal | completed |
| TC-02 | AML blacklist detection | blocked_aml |
| TC-03 | Cold storage quorum | approved only after quorum |
| TC-04 | HSM failure | pending_hsm |
| TC-05 | Withdraw without whitelist | rejected |
| TC-06 | Kill switch | freeze < 5 sec |
| TC-07 | API load test | 10k RPS |
| TC-08 | HSM key rotation | no downtime |
| TC-09 | DR failover | RTO < 15 min |
| TC-10 | CryptoPro integration | valid signature |
| TC-11 | Audit export | PDF/CSV generated |
| TC-12 | RBAC isolation | 403 cross-tenant |

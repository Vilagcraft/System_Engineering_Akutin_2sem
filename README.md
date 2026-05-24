# 🚀 RocketSpot — учебный проект по системной инженерии

**Добро пожаловать!**  
Этот репозиторий создан в рамках учебного курса по системной инженерии. Здесь проектируется российская криптобиржа RocketSpot — от stakeholder requirements до архитектуры, V&V и traceability.

---

## 📖 Что включено в проект

- GitHub Pages с интерактивной документацией
- 5 CONOPS / OPSCON сценариев
- 12 тест-кейсов V&V
- Stakeholder requirements
- System requirements
- Non-functional requirements
- ICD-lite интерфейсы и event contracts
- Архитектурные решения (ADR)
- Risk register
- Traceability matrix

---

## 🎯 Цель проекта

Спроектировать безопасную, масштабируемую и соответствующую нормативным требованиям криптовалютную платформу с:

- self-service API keys
- HSM-based signing
- AML/CFT контролем
- immutable audit trail
- tenant isolation
- отказоустойчивой архитектурой

---

## 🧩 Технологический стек

| Компонент | Стек |
|---|---|
| Trading Engine | Rust |
| Wallet Orchestrator | Go + Temporal |
| AML Engine | Python |
| Frontend | React |
| Database | PostgreSQL |
| Event Bus | Kafka |
| Infrastructure | Kubernetes |
| HSM | CryptoPro |

---

## 🔐 Ключевые инженерные особенности

- HSM signing через CryptoPro
- WORM audit storage
- Kafka event-driven architecture
- Correlation IDs
- RBAC и tenant isolation
- Idempotency-Key protection
- Multisig cold storage
- SLA и SLO метрики

---

## 🌐 Документация

Главная работа:
https://vilagcraft.github.io/System_Engineering_Akutin_2sem/

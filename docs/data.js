// ============================================
// ROCKETSPOT - ДАННЫЕ (ПОЛНАЯ ВЕРСИЯ)
// ============================================

// ГЛОССАРИЙ
const glossary = [
    { term: "Compliance", def: "Отдел соответствия 115-ФЗ и AML/CFT." },
    { term: "Legal", def: "Юридический отдел." },
    { term: "AML/CFT", def: "Противодействие легализации доходов / финансированию терроризма." },
    { term: "Platform Engineering", def: "Инфраструктурная платформа (K8s, сети, HSM)." },
    { term: "DevOps", def: "CI/CD, мониторинг, развертывание приложений." },
    { term: "HSM", def: "Аппаратный модуль безопасности (КриптоПро on-premise кластер)." },
    { term: "Tenant isolation", def: "Логическая изоляция данных клиентов (namespace + RBAC)." },
    { term: "M-of-N", def: "Мультиподпись: M подписей из N." },
    { term: "RPS", def: "Запросов в секунду." },
    { term: "SLA", def: "Соглашение об уровне обслуживания." },
    { term: "Retention", def: "Срок хранения данных." },
    { term: "Throughput", def: "Пропускная способность (событий/сек)." },
    { term: "Latency p99", def: "99-й перцентиль задержки." },
    { term: "WORM", def: "Write Once Read Many – неизменяемое хранилище." }
];

// КОНТЕКСТ
const soiComponents = [
    'Торговый движок (Rust/C++)',
    'API Gateway (Kong/Traefik)',
    'Оркестратор кошельков (Go + Temporal)',
    'HSM-Адаптер (PKCS#11)',
    'AML Risk Engine (Python/FastAPI)',
    'KMS (Key Management Service)',
    'Аудиторское хранилище (WORM, retention 7 лет, 10k событий/сек)',
    'Admin Back Office'
];

const externalSystems = [
    'HSM Cluster (КриптоПро on-premise, 3 узла)',
    'Блокчейн-ноды (BTC/ETH/TRON)',
    'SIEM (MaxPatrol)',
    'KYC сервис (Sumsub)',
    'Платежные шлюзы (Сбер, Т-Банк)'
];

const integrationJustification = [
    { system: 'HSM Cluster', justification: '115-ФЗ, ГОСТ Р 34.10-2021. Аппаратная защита, p99 <500 мс.' },
    { system: 'Блокчейн-ноды', justification: 'Собственные ноды для надёжности. Scope: BTC, ETH, TRON.' },
    { system: 'SIEM', justification: 'Требование ЦБ РФ к мониторингу инцидентов.' },
    { system: 'KYC', justification: '115-ФЗ, идентификация клиентов.' },
    { system: 'Платежные шлюзы', justification: 'Фиатные депозиты/выплаты в рублях.' }
];

const assumptions = [
    'SLA внешних интеграций ≥99.9%',
    'HSM on-premise кластер с синхронной репликацией',
    'Блокчейн-ноды синхронизированы, диск ≥2 ТБ',
    'TLS 1.3 и VPN для платёжных шлюзов',
    '2FA для доступа к админке',
    'Резервное копирование БД каждые 6 часов (RPO <6 ч)',
    'Dual control для админ. действий',
    'Целевая нагрузка: 50k concurrent, 10k RPS, p99 <200 мс'
];

const externalEntities = [
    { entity: 'Трейдер', input: 'Ордера, заявки на вывод, API-ключи', output: 'Исполнение, балансы' },
    { entity: 'Маркет-мейкер', input: 'Высокочастотные ордера', output: 'Рыночные данные, лимиты' },
    { entity: 'Compliance', input: 'Лимиты, заморозка', output: 'Алерты AML, отчёты' },
    { entity: 'Казначей', input: 'Пополнение, мультиподпись', output: 'Статусы резервов' },
    { entity: 'SecOps', input: 'Ротация ключей', output: 'Алерты безопасности' },
    { entity: 'Администратор', input: 'Управление конфигурацией', output: 'Метрики, логи' },
    { entity: 'HSM Cluster', input: 'Криптооперации', output: 'Подпись, ключи' },
    { entity: 'Блокчейн-ноды', input: 'Подтверждения', output: 'Broadcast' }
];

// СТЕЙКХОЛДЕРЫ
const stakeholders = [
    { name: 'Трейдер (розничный)', role: 'Конечный пользователь', interests: 'Скорость, безопасность', requirements: 'Вывод ≤30 мин' },
    { name: 'Маркет-мейкер', role: 'Проф. трейдер', interests: 'Низкая задержка', requirements: '1000+ RPS, SLA 99.99%' },
    { name: 'Корпоративный клиент', role: 'Юр. лицо', interests: 'Мультиподпись, интеграция', requirements: 'Self-service ротация ключей' },
    { name: 'Compliance', role: 'Комплаенс', interests: 'AML/CFT, блокировка', requirements: 'Freeze <5 сек' },
    { name: 'Казначей', role: 'Финансы', interests: 'M-of-N политика', requirements: 'M=2 из N=3' },
    { name: 'SecOps', role: 'ИБ', interests: 'Управление HSM', requirements: 'Все ключи в HSM, revoke <60 сек' },
    { name: 'Аудитор', role: 'Регулятор', interests: 'Неизменяемый журнал', requirements: 'WORM, retention 7 лет' },
    { name: 'Администратор', role: 'SRE', interests: 'Наблюдаемость', requirements: 'RTO <15 мин, RPO <1 мин' },
    { name: 'Бизнес-владелец', role: 'CEO', interests: 'Рентабельность', requirements: 'Доступность 99.95%' },
    { name: 'Разработчик', role: 'Dev', interests: 'API, CI/CD', requirements: 'OpenAPI, тестнет' }
];

const responsibilityMatrix = [
    { area: 'Инфраструктура (K8s, сети, HSM)', platformEng: '✅ владелец', devops: 'использование' },
    { area: 'CI/CD пайплайны', platformEng: 'инструменты', devops: '✅ владелец' },
    { area: 'Мониторинг и алертинг', platformEng: 'база', devops: '✅ настройка метрик' },
    { area: 'Управление секретами (KMS, HSM)', platformEng: '✅ интеграция', devops: 'использование' },
    { area: 'Disaster Recovery', platformEng: '✅ стратегия', devops: 'бекапы БД' }
];

// СЦЕНАРИИ (5)
const scenarios = [
    { id: 'S1', name: 'Вывод криптовалюты', goal: 'Безопасный вывод', steps: ['Инициирование','Pre-flight','Блокировка','Сборка tx','Согласование','Подпись HSM','Публикация','Финализация'], exceptions: ['Недостаточно средств','Адрес в чёрном списке','Превышен лимит'], degradations: ['HSM недоступен','AML недоступен'] },
    { id: 'S2', name: 'Создание API-ключа', goal: 'Self-service', steps: ['2FA','Выбор scope','IP whitelist','KYC','Генерация','Сохранение','Аудит'], exceptions: ['Нет IP whitelist','Дублирование','Лимит ключей'], degradations: ['БД недоступна','Gateway недоступен'] },
    { id: 'S3', name: 'Мультиподпись холодного кошелька', goal: 'Крупные суммы', steps: ['Инициация','Создание запроса','Уведомление','Подтверждение','Сбор подписей','Отправка','Аудит'], exceptions: ['Недостаточно подписей','Ошибка подписи','Конфликт UTXO'], degradations: ['HSM недоступен','Подписант недоступен'] },
    { id: 'S4', name: 'Ротация мастер-ключей HSM', goal: 'Без простоя', steps: ['Инициация SecOps-1','Подтверждение SecOps-2','Генерация','Перешифровка','Валидация','Архивация','Аудит'], exceptions: ['Отказ подтверждения','Ошибка перешифровки','HSM в maintenance'], degradations: ['Частичная перешифровка','Сбой архивации'] },
    { id: 'S5', name: 'Расследование инцидента', goal: 'Отчёт за 1 час', steps: ['Ввод ID','Сбор из WORM','Шкала','Обогащение из SIEM','Экспорт PDF/CSV','Подпись ЭЦП'], exceptions: ['Неполные данные','403 Forbidden','Период >1 года'], degradations: ['SIEM недоступен','Часть логов отсутствует'] }
];

// ТРЕБОВАНИЯ (ИЗМЕРИМЫЕ)
const requirements = [
    { id: 'SR-SH-1', type: 'SR-SH', description: 'Скорость вывода low-risk', metric: '≤30 мин (p99)' },
    { id: 'SR-SH-2', type: 'SR-SH', description: 'Rate limit API', metric: '1000+ RPS, SLA 99.99%' },
    { id: 'SR-SH-3', type: 'SR-SH', description: 'Блокировка счёта real-time', metric: '≤5 сек' },
    { id: 'SR-SH-4', type: 'SR-SH', description: 'M-of-N для cold storage', metric: 'M=2 из N=3, p99 <1 сек' },
    { id: 'SR-SH-5', type: 'SR-SH', description: 'Ключи в HSM', metric: 'HSM on-premise кластер' },
    { id: 'SR-SH-6', type: 'SR-SH', description: 'Отчёт по транзакции', metric: 'WORM, retention 7 лет, отчёт ≤1 ч' },
    { id: 'SR-SH-7', type: 'SR-SH', description: 'Отказоустойчивость', metric: 'RTO <15 мин, RPO <1 мин' },
    { id: 'SR-SYS-1', type: 'SR-SYS', description: 'Взаимодействие через HSM', metric: 'p99 latency <500 мс' },
    { id: 'SR-SYS-2', type: 'SR-SYS', description: 'Ротация ключей', metric: '≤1 год, dual control' },
    { id: 'SR-SYS-3', type: 'SR-SYS', description: 'Проверка санкционных списков', metric: '<100 мс' },
    { id: 'SR-SYS-4', type: 'SR-SYS', description: 'API-ключи с scopes', metric: 'IP whitelist для withdraw' },
    { id: 'SR-SYS-5', type: 'SR-SYS', description: 'Аудит в WORM', metric: 'Throughput 10k/сек, retention 7 лет' },
    { id: 'SR-SYS-6', type: 'SR-SYS', description: '2FA на вывод', metric: 'p99 <30 сек' },
    { id: 'SR-SYS-7', type: 'SR-SYS', description: 'Batch-транзакции', metric: 'до 100 outputs' },
    { id: 'SR-SYS-8', type: 'SR-SYS', description: 'Аномальная активность', metric: 'False positive <0.5%' },
    { id: 'SR-SYS-9', type: 'SR-SYS', description: 'correlation_id', metric: 'обязательный header' },
    { id: 'SR-SYS-10', type: 'SR-SYS', description: 'Graceful shutdown', metric: 'таймаут 30 сек' },
    { id: 'SR-SYS-11', type: 'SR-SYS', description: 'Сессия администратора', metric: '4 часа, затем MFA' },
    { id: 'SR-SYS-12', type: 'SR-SYS', description: 'Резервное копирование БД', metric: 'каждые 6 часов' },
    { id: 'NFR-1', type: 'NFR', description: 'Доступность', metric: 'Trade 99.99%, Withdraw 99.95%' },
    { id: 'NFR-2', type: 'NFR', description: 'Время подписи HSM', metric: 'p99 <500 мс' },
    { id: 'NFR-3', type: 'NFR', description: 'Kill-switch', metric: '≤5 сек' },
    { id: 'NFR-4', type: 'NFR', description: 'False positive AML', metric: '<0.5%' },
    { id: 'NFR-5', type: 'NFR', description: 'Масштабируемость', metric: '1000 tx/мин, 50k concurrent, 10k RPS, p99 <200 мс' }
];

const acceptanceCriteria = [
    { req: 'SR-SH-1', criteria: '99% заявок на вывод <10k USD завершаются за ≤30 мин в testnet.' },
    { req: 'SR-SH-2', criteria: 'Нагрузочный тест: 1000 RPS на ключ без ошибок rate limiting.' },
    { req: 'SR-SH-5', criteria: 'Инспекция HSM: все ключи генерируются внутри HSM, не покидают его.' },
    { req: 'NFR-1', criteria: 'Мониторинг uptime за месяц: Trade API ≥99.99%, Withdraw API ≥99.95%.' },
    { req: 'NFR-5', criteria: 'Тест k6: 50k concurrent, 10k RPS, p99 latency <200 мс, error <0.1%.' }
];

const requirementTraceability = [
    { stakeholder: 'SR-SH-1', system: ['SR-SYS-6'], nfr: ['NFR-2'] },
    { stakeholder: 'SR-SH-2', system: ['SR-SYS-4'], nfr: ['NFR-1','NFR-5'] },
    { stakeholder: 'SR-SH-3', system: ['SR-SYS-3','SR-SYS-8'], nfr: ['NFR-3','NFR-4'] },
    { stakeholder: 'SR-SH-4', system: ['SR-SYS-7'], nfr: ['NFR-2'] },
    { stakeholder: 'SR-SH-5', system: ['SR-SYS-1','SR-SYS-2'], nfr: ['NFR-2'] },
    { stakeholder: 'SR-SH-6', system: ['SR-SYS-5','SR-SYS-9'], nfr: [] },
    { stakeholder: 'SR-SH-7', system: ['SR-SYS-10','SR-SYS-12'], nfr: ['NFR-1','NFR-5'] }
];

// ADR (с альтернативами)
const adrs = [
    { title: 'ADR-1: HSM для ключей', context: 'Соответствие 115-ФЗ, ГОСТ', decision: 'КриптоПро on-premise кластер', alternatives: 'Vault (не соответствует 115-ФЗ), Cloud HSM (нет сертификации)', tradeoff: '+40% бюджета vs защищённость' },
    { title: 'ADR-2: Saga Pattern (Temporal)', context: 'Длительные операции вывода', decision: 'Temporal.io', alternatives: 'Camunda (тяжеловесная), ручная Kafka (сложно)', tradeoff: 'Сложность отладки vs гарантия финишности' },
    { title: 'ADR-3: Изоляция движка и кошельков', context: 'Производительность vs безопасность', decision: 'Физическое разделение, Kafka', alternatives: 'Монолит (риск lateral movement), синхронные REST (задержки)', tradeoff: '+50 мс latency vs изоляция' },
    { title: 'ADR-4: PostgreSQL vs MongoDB', context: 'ACID для финансов', decision: 'PostgreSQL 15+', alternatives: 'MongoDB (слабая ACID), CockroachDB (избыточна)', tradeoff: 'Меньшая горизонтальная запись vs консистентность' },
    { title: 'ADR-5: Kafka vs RabbitMQ', context: 'Высокая пропускная способность', decision: 'Apache Kafka', alternatives: 'RabbitMQ (меньше пропускная), Kinesis (vendor lock-in)', tradeoff: 'Сложнее настройка vs replayability' },
    { title: 'ADR-6: Kubernetes vs Nomad', context: 'Гибридное облако + on-premise', decision: 'Kubernetes (Yandex Cloud + self-managed)', alternatives: 'Nomad (проще, но меньше экосистема), Swarm (недостаточно)', tradeoff: 'Высокая сложность vs стандарт' }
];

// АРХИТЕКТУРНЫЕ КОМПОНЕНТЫ
const archComponents = [
    'Web UI / Mobile Backend', 'API Gateway (Kong/Traefik)', 'Matching Engine (Rust/C++)', 'Account & Ledger (Java/Spring)', 'Orchestrator (Go+Temporal)', 'HSM Adapter (C++/C#)', 'AML Risk Engine (Python/FastAPI)', 'KMS (Go)', 'Audit & Forensics (Elasticsearch WORM)'
];

const componentInteractions = [
    { from: 'Web UI', to: 'API Gateway', protocol: 'HTTPS/REST', description: 'Запросы' },
    { from: 'API Gateway', to: 'Matching Engine', protocol: 'gRPC', description: 'Ордера' },
    { from: 'API Gateway', to: 'Orchestrator', protocol: 'REST', description: 'Вывод' },
    { from: 'Orchestrator', to: 'AML', protocol: 'gRPC', description: 'Скоринг' },
    { from: 'Orchestrator', to: 'HSM Adapter', protocol: 'gRPC/PKCS#11', description: 'Подпись' },
    { from: 'HSM Adapter', to: 'HSM', protocol: 'TCP/TLS', description: 'Криптооперации' },
    { from: 'Orchestrator', to: 'Blockchain', protocol: 'JSON-RPC', description: 'Broadcast' },
    { from: 'Account', to: 'PostgreSQL', protocol: 'SQL', description: 'Балансы' },
    { from: 'Все сервисы', to: 'Kafka', protocol: 'TCP', description: 'Аудит' },
    { from: 'Kafka', to: 'Audit', protocol: 'TCP', description: 'WORM' }
];

const techStack = [
    { component: 'Торговый движок', stack: 'Rust / C++', reason: 'Производительность, p99 <10 мс' },
    { component: 'Оркестратор', stack: 'Go + Temporal', reason: 'Saga, устойчивость' },
    { component: 'API Gateway', stack: 'Kong', reason: 'Rate limiting, JWT' },
    { component: 'Ledger', stack: 'Java + Spring', reason: 'ACID, транзакционность' },
    { component: 'AML', stack: 'Python/FastAPI', reason: 'ML-экосистема' },
    { component: 'HSM Adapter', stack: 'C++/C#', reason: 'PKCS#11, ГОСТ' },
    { component: 'БД', stack: 'PostgreSQL 15+', reason: 'ACID, JSONB' },
    { component: 'Очереди', stack: 'Apache Kafka', reason: 'At-least-once, replay' },
    { component: 'HSM', stack: 'КриптоПро', reason: 'Сертификация ФСБ' }
];

// РИСКИ
const risks = [
    { id: 'R-01', risk: 'Утечка ключей', probability: 'Низкая', probValue:1, impact:'Критическое', impactValue:3, priority:3, mitigation:'HSM, ротация каждые 24ч', residualRisk:'Низкий' },
    { id: 'R-02', risk: '51% атака', probability: 'Средняя', probValue:2, impact:'Высокое', impactValue:3, priority:6, mitigation:'Увеличенные подтверждения', residualRisk:'Средний' },
    { id: 'R-03', risk: 'Ошибка оркестратора', probability: 'Низкая', probValue:1, impact:'Высокое', impactValue:3, priority:3, mitigation:'Идемпотентность, Temporal', residualRisk:'Низкий' },
    { id: 'R-04', risk: 'Заморозка регулятором', probability: 'Средняя', probValue:2, impact:'Среднее', impactValue:2, priority:4, mitigation:'Автоотчётность 115-ФЗ', residualRisk:'Средний' },
    { id: 'R-05', risk: 'Атака на API-ключи', probability: 'Средняя', probValue:2, impact:'Среднее', impactValue:2, priority:4, mitigation:'IP whitelist, 2FA', residualRisk:'Низкий-Средний' }
];

// ТЕСТ-КЕЙСЫ (10)
const testCases = [
    { id: 'TC-WD-001', name: 'Вывод low-risk', goal: 'Проверка успешного вывода', expected: 'completed за 2 мин', method:'Test', methodDesc:'E2E testnet' },
    { id: 'TC-AML-001', name: 'Блокировка по AML', goal: 'Санкционный адрес', expected: 'blocked_aml', method:'Test', methodDesc:'Интеграционный тест' },
    { id: 'TC-CLD-001', name: 'Мультиподпись cold', goal: 'M-of-N', expected: 'Транзакция после 2 подтверждений', method:'Demo', methodDesc:'Демонстрация' },
    { id: 'TC-FAIL-001', name: 'Отказ HSM', goal: 'Деградация', expected: 'pending_hsm, retry', method:'Test', methodDesc:'Fault injection' },
    { id: 'TC-API-001', name: 'API-ключ без IP', goal: 'Отклонение', expected: '422', method:'Test', methodDesc:'Юнит-тест' },
    { id: 'TC-SEC-001', name: 'Kill Switch', goal: 'Экстренная блокировка', expected: '503, заявки frozen', method:'Demo', methodDesc:'Демо SecOps' },
    { id: 'TC-PERF-001', name: 'Нагрузка торгового API', goal: 'Проверка latency', expected: 'p99 <10 мс', method:'Analysis', methodDesc:'k6, 1000 users' },
    { id: 'TC-KMS-001', name: 'Ротация мастер-ключа', goal: 'Dual control', expected: 'Без downtime', method:'Demo+Inspection', methodDesc:'Проверка логов' },
    { id: 'TC-DR-001', name: 'Восстановление БД', goal: 'RPO/RTO', expected: 'RTO <15 мин, RPO <1 мин', method:'Test', methodDesc:'Patroni failover' },
    { id: 'TC-HSM-001', name: 'Интеграция с КриптоПро', goal: 'Подпись ГОСТ', expected: '<500 мс', method:'Test+Inspection', methodDesc:'Реальный HSM' }
];

const verificationMatrix = [
    { requirement: 'SR-SH-1 (скорость вывода)', method: 'E2E тестирование', artifact: 'TC-WD-001, отчёт p99 ≤30 мин' },
    { requirement: 'SR-SH-2 (RPS)', method: 'Нагрузочное тестирование', artifact: 'TC-PERF-001, 1000 RPS' },
    { requirement: 'SR-SH-5 (HSM ключи)', method: 'Инспекция', artifact: 'TC-HSM-001, аудит генерации' },
    { requirement: 'NFR-1 (доступность)', method: 'Анализ мониторинга', artifact: 'Uptime ≥99.95%/99.99%' },
    { requirement: 'NFR-5 (масштабируемость)', method: 'Нагрузочное тестирование', artifact: 'k6: 50k concurrent, 10k RPS, p99 <200 мс' }
];

const traceability = [
    { req: 'SR-SH-1', tc01: true, tc02: false, tc03: false, tc04: false, tc05: false, tc06: false, tc07: false, tc08: false, tc09: false, tc10: false },
    { req: 'SR-SH-2', tc01: false, tc02: false, tc03: false, tc04: false, tc05: true, tc06: false, tc07: true, tc08: false, tc09: false, tc10: false },
    { req: 'SR-SH-3', tc01: false, tc02: true, tc03: false, tc04: false, tc05: false, tc06: true, tc07: false, tc08: false, tc09: false, tc10: false },
    { req: 'SR-SH-4', tc01: false, tc02: false, tc03: true, tc04: false, tc05: false, tc06: false, tc07: false, tc08: false, tc09: false, tc10: false },
    { req: 'SR-SH-5', tc01: true, tc02: false, tc03: false, tc04: true, tc05: false, tc06: false, tc07: false, tc08: true, tc09: false, tc10: true },
    { req: 'SR-SH-6', tc01: true, tc02: true, tc03: true, tc04: true, tc05: true, tc06: true, tc07: false, tc08: true, tc09: true, tc10: true },
    { req: 'SR-SH-7', tc01: false, tc02: false, tc03: false, tc04: false, tc05: false, tc06: false, tc07: true, tc08: false, tc09: true, tc10: false },
    { req: 'NFR-1', tc01: false, tc02: false, tc03: false, tc04: false, tc05: false, tc06: false, tc07: true, tc08: false, tc09: true, tc10: false },
    { req: 'NFR-2', tc01: true, tc02: false, tc03: false, tc04: false, tc05: false, tc06: false, tc07: true, tc08: false, tc09: false, tc10: true },
    { req: 'NFR-3', tc01: false, tc02: false, tc03: false, tc04: false, tc05: false, tc06: true, tc07: false, tc08: false, tc09: false, tc10: false },
    { req: 'NFR-4', tc01: false, tc02: true, tc03: false, tc04: false, tc05: false, tc06: false, tc07: false, tc08: false, tc09: false, tc10: false },
    { req: 'NFR-5', tc01: false, tc02: false, tc03: false, tc04: false, tc05: false, tc06: false, tc07: true, tc08: false, tc09: false, tc10: false }
];

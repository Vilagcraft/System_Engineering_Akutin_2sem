// Данные из task_1.md, структурированные для визуализации

// Компоненты SoI
const soiComponents = [
    'Торговый движок (Matching Engine)',
    'Клиентский портал / API Gateway',
    'Оркестратор Кошельков (Wallet Orchestrator)',
    'HSM-Адаптер',
    'AML/CFT Движок',
    'Система Управления Ключами (KMS)',
    'Аудиторское Хранилище',
    'Административная консоль (Admin Back Office)'
];

const externalSystems = [
    'HSM Cluster (КриптоПро HSM / другие)',
    'Блокчейн-ноды (RPC)',
    'SIEM (MaxPatrol, Kaspersky)',
    'Внешние сервисы KYC (Sumsub)',
    'Платежные шлюзы (Фиат)'
];

// Стейкхолдеры
const stakeholders = [
    {
        name: 'Трейдер (розничный)',
        role: 'Конечный пользователь',
        interests: 'Быстрое исполнение ордеров, прозрачность комиссий, безопасность средств, простой вывод',
        requirements: 'SR-SH-1: Скорость вывода до 30 мин, интуитивный UI'
    },
    {
        name: 'Маркет-мейкер',
        role: 'Профессиональный трейдер',
        interests: 'Низкая задержка, индивидуальные лимиты API, стабильность WebSocket',
        requirements: 'SR-SH-2: Rate limit 1000+ RPS, SLA 99.99%'
    },
    {
        name: 'Корпоративный клиент',
        role: 'Юридическое лицо',
        interests: 'Мультиподпись для вывода, интеграция с казначейскими системами, отчетность',
        requirements: 'SR-SH-6: API для автоматизации, выписки для налоговой'
    },
    {
        name: 'Compliance-офицер',
        role: 'Сотрудник отдела комплаенс',
        interests: 'Инструменты для AML/CFT, блокировка счетов, отчетность для 115-ФЗ',
        requirements: 'SR-SH-3: freeze в real-time, черные списки адресов'
    },
    {
        name: 'Казначей (Treasury)',
        role: 'Финансовый сотрудник',
        interests: 'Управление кошельками, мультиподпись, контроль ликвидности',
        requirements: 'SR-SH-4: M of N policy, автоматическая sweep-функция'
    },
    {
        name: 'SecOps / ИБ-аналитик',
        role: 'Специалист по безопасности',
        interests: 'Мониторинг инцидентов, управление ключами HSM, ротация секретов',
        requirements: 'SR-SH-5: Все ключи в HSM, revoke SLA < 60 сек'
    },
    {
        name: 'Аудитор / Регулятор',
        role: 'Внешний контролирующий орган',
        interests: 'Неизменяемый журнал операций, экспорт данных, соответствие 115-ФЗ',
        requirements: 'SR-SH-6: WORM-хранилище, отчет за 1 час по запросу'
    },
    {
        name: 'Администратор платформы',
        role: 'SRE / Platform Engineer',
        interests: 'Наблюдаемость, автомасштабирование, управление конфигурациями',
        requirements: 'SR-SH-7: HA архитектура, RTO < 15 мин'
    },
    {
        name: 'Бизнес-владелец',
        role: 'CEO / Product Owner',
        interests: 'Рентабельность, удержание клиентов, compliance',
        requirements: 'SR-SH-7: Доступность 99.95%, MTTR < 30 мин'
    },
    {
        name: 'Разработчик (Dev)',
        role: 'Инженер',
        interests: 'Понятные API, CI/CD, тестовая среда, документация',
        requirements: 'SR-SH-8: Swagger/OpenAPI, локальный запуск, тестовые сети'
    }
];

// Требования
const requirements = [
    // Stakeholder Requirements
    { id: 'SR-SH-1', type: 'SR-SH', description: 'Высокая скорость исполнения вывода (до 30 мин для low-risk транзакций) с прозрачным статусом', metric: 'Трейдер' },
    { id: 'SR-SH-2', type: 'SR-SH', description: 'Возможность создания API-ключей с индивидуальными лимитами Rate Limit без повторного KYC', metric: 'Маркет-мейкер' },
    { id: 'SR-SH-3', type: 'SR-SH', description: 'Возможность в реальном времени приостановить (freeze) любой вывод или заблокировать учетную запись', metric: 'Compliance' },
    { id: 'SR-SH-4', type: 'SR-SH', description: 'Политика "M of N" (мультиподпись) для всех транзакций из "холодного" хранилища', metric: 'Treasury' },
    { id: 'SR-SH-5', type: 'SR-SH', description: 'Все мастер-ключи должны генерироваться и храниться исключительно в сертифицированных ФСБ России HSM', metric: 'SecOps' },
    { id: 'SR-SH-6', type: 'SR-SH', description: 'Детальный отчет по любой транзакции (IP, user-agent, время) в течение 1 часа по запросу', metric: 'Аудитор/Регулятор' },
    { id: 'SR-SH-7', type: 'SR-SH', description: 'Отказоустойчивость: отсутствие единой точки отказа (HA) в оркестрации кошельков и торговом движке', metric: 'Бизнес' },
    // System Requirements
    { id: 'SR-SYS-1', type: 'SR-SYS', description: 'Все взаимодействия с блокчейном и хранение мнемонических фраз через HSM (КриптоПро)', metric: 'Криптография' },
    { id: 'SR-SYS-2', type: 'SR-SYS', description: 'Период ротации мастер-ключей HSM не более 1 года, требует физического присутствия 2 сотрудников', metric: 'SecOps' },
    { id: 'SR-SYS-3', type: 'SR-SYS', description: 'Проверка всех исходящих адресов по списку санкционных адресов перед подписью', metric: 'AML' },
    { id: 'SR-SYS-4', type: 'SR-SYS', description: 'API-ключи клиента поддерживают scopes: trade, withdraw, info. withdraw требует привязки к IP', metric: 'API Gateway' },
    { id: 'SR-SYS-5', type: 'SR-SYS', description: 'Все административные действия логируются в WORM-хранилище с гарантией неизменности 5 лет', metric: 'Аудит' },
    // NFR
    { id: 'NFR-1', type: 'NFR', description: 'Доступность торгового API — 99.99%, интерфейса вывода — 99.95%', metric: 'Доступность' },
    { id: 'NFR-2', type: 'NFR', description: 'Время подписи транзакции через HSM — p99 < 1 секунда', metric: 'Задержки' },
    { id: 'NFR-3', type: 'NFR', description: 'Время отклика на экстренную блокировку (kill-switch) — не более 5 секунд', metric: 'Безопасность' },
    { id: 'NFR-4', type: 'NFR', description: 'Процент ложных срабатываний AML-движка — менее 0.5% от общего числа транзакций', metric: 'Управление рисками' },
    { id: 'NFR-5', type: 'NFR', description: 'Оркестрация кошельков выдерживает 1000 исходящих транзакций в минуту', metric: 'Масштабируемость' }
];

// Архитектурные компоненты
const archComponents = [
    'Web UI / Mobile Backend: Общение с клиентом',
    'API Gateway (Kong / Traefik): Маршрутизация, rate limiting, проверка JWT/API-ключей',
    'Matching Engine (Core): Высокопроизводительный движок ордеров (C++/Rust)',
    'Account & Ledger Service: Управление балансами, горячее/холодное хранение',
    'Orchestrator (Workflow Engine): Управление состоянием заявок на вывод (Temporal / Camunda)',
    'HSM Adapter (ГОСТ): Прослойка для связи с КриптоПро HSM',
    'AML Risk Engine: Сервис оценки рисков транзакций',
    'KMS (Key Management Service): Управление метаданными ключей',
    'Audit & Forensics: Elasticsearch с WORM-бакетом'
];

// ADR
const adrs = [
    {
        title: 'ADR-1: Использование HSM для хранения корневых ключей',
        context: 'Необходимость соответствия законодательству РФ и защита от взлома серверов',
        decision: 'Все приватные ключи генерируются и хранятся внутри сертифицированного HSM (КриптоПро)',
        tradeoff: 'Усложнение архитектуры и стоимости против максимальной защищенности'
    },
    {
        title: 'ADR-2: Асинхронная оркестрация вывода (Saga Pattern)',
        context: 'Вывод средств включает множество шагов, которые могут длиться часы',
        decision: 'Использование распределенного оркестратора саг (Temporal)',
        tradeoff: 'Сложность отладки против гарантий финишности'
    },
    {
        title: 'ADR-3: Изоляция торгового движка и кошельков',
        context: 'Торговый движок требует максимальной производительности, сервис кошельков — безопасности',
        decision: 'Физическое разделение: торговый движок в "сети обработки", HSM в "сети активов"',
        tradeoff: 'Сложность коммуникации против изоляции рисков'
    }
];

// Технологический стек
const techStack = [
    { component: 'Торговый движок', stack: 'Rust / C++', reason: 'Максимальная производительность, low latency' },
    { component: 'Оркестратор кошельков', stack: 'Go + Temporal.io', reason: 'Баланс производительности и saga-оркестрации' },
    { component: 'API Gateway', stack: 'Kong / Traefik', reason: 'Готовые плагины rate limiting, JWT' },
    { component: 'Account & Ledger', stack: 'Java 17+ / Spring Boot', reason: 'Стабильность, транзакционность, ACID' },
    { component: 'AML Risk Engine', stack: 'Python 3.11+ / FastAPI', reason: 'Богатая ML/AI экосистема, гибкость правил' },
    { component: 'HSM Adapter', stack: 'C++ / C#', reason: 'Работа с нативными библиотеками КриптоПро' },
    { component: 'База данных', stack: 'PostgreSQL 15+', reason: 'ACID, JSONB, CQRS с read replicas' },
    { component: 'Очереди', stack: 'Apache Kafka', reason: 'At-least-once delivery, replayability' },
    { component: 'HSM (ГОСТ)', stack: 'КриптоПро HSM', reason: 'Сертификация ФСБ, ГОСТ Р 34.10-2021' }
];

// Риски
const risks = [
    { id: 'R-01', risk: 'Утечка ключей горячего кошелька', probability: 'Низкая', impact: 'Критическое', mitigation: 'HSM, ротация каждые 24 часа, sweep в холодное хранилище' },
    { id: 'R-02', risk: '51% атака на сеть блокчейна', probability: 'Средняя', impact: 'Высокое', mitigation: 'Увеличенное число подтверждений, несколько нод' },
    { id: 'R-03', risk: 'Ошибка оркестратора (дублирование отправки)', probability: 'Низкая', impact: 'Высокое', mitigation: 'Идемпотентность, проверка tx_hash перед отправкой' },
    { id: 'R-04', risk: 'Заморозка средств регулятором', probability: 'Средняя', impact: 'Среднее', mitigation: 'Юридическая структура, автоматизация отчетности 115-ФЗ' },
    { id: 'R-05', risk: 'Атака на API-ключи трейдера', probability: 'Средняя', impact: 'Среднее', mitigation: 'Привязка IP для withdraw, 2FA для создания ключей' }
];

// Тест-кейсы
const testCases = [
    { id: 'TC-WD-001', name: 'Автоматический вывод low-risk суммы', goal: 'Проверка успешного low-risk вывода', expected: 'completed за 2 минуты' },
    { id: 'TC-AML-001', name: 'Блокировка вывода по AML', goal: 'Проверка блокировки санкционного адреса', expected: 'blocked_aml, алерт в SIEM' },
    { id: 'TC-CLD-001', name: 'Мультиподпись cold storage', goal: 'Проверка M-of-N мультиподписи', expected: 'Транзакция после 2 approvals' },
    { id: 'TC-FAIL-001', name: 'Отказ HSM (деградация)', goal: 'Проверка поведения при недоступности HSM', expected: 'pending_hsm, автоматический retry' },
    { id: 'TC-API-001', name: 'API-ключ без IP-привязки', goal: 'Проверка отклонения withdraw scope без IP', expected: 'Ошибка 422' },
    { id: 'TC-SEC-001', name: 'Аварийная блокировка (Kill Switch)', goal: 'Проверка экстренной блокировки', expected: '503 для withdrawal, заявки frozen' },
    { id: 'TC-PERF-001', name: 'Нагрузочное тестирование', goal: 'Проверка latency под нагрузкой', expected: 'p99 < 10 мс REST, error < 0.01%' },
    { id: 'TC-KMS-001', name: 'Ротация мастер-ключа HSM', goal: 'Проверка dual-control ротации', expected: 'Без downtime, audit log' },
    { id: 'TC-DR-001', name: 'Восстановление после сбоя БД', goal: 'Проверка RPO/RTO', expected: 'RTO < 15 мин, RPO < 1 мин' },
    { id: 'TC-HSM-001', name: 'Интеграция с КриптоПро HSM', goal: 'Проверка подписи транзакции', expected: 'Подпись валидна, время < 500 мс' }
];

// Матрица трассируемости
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
    { req: 'NFR-3', tc01: false, tc02: false, tc03: false, tc04: false, tc05: false, tc06: true, tc07: false, tc08: false, tc09: false, tc10: false }
];
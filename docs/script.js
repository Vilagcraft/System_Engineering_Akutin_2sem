// ============================================
// ROCKETSPOT - ИСПРАВЛЕННЫЕ ДАННЫЕ ПО РЕЦЕНЗИИ
// Измеримые требования, ADR с альтернативами, V&V, глоссарий
// ============================================

// ---------------------------- ГЛОССАРИЙ ----------------------------
const glossary = [
    { term: "Compliance (комплаенс)", def: "Отдел соответствия требованиям 115-ФЗ и AML/CFT." },
    { term: "Legal (юридический отдел)", def: "Отдел, отвечающий за правовые вопросы и взаимодействие с регуляторами." },
    { term: "AML/CFT", def: "Противодействие легализации доходов / финансированию терроризма." },
    { term: "Platform Engineering", def: "Команда, разрабатывающая и поддерживающая внутреннюю платформу (инфраструктура, базовые сервисы, CI/CD инструменты)." },
    { term: "DevOps", def: "Роль, отвечающая за автоматизацию развертывания приложений, мониторинг и пайплайны CI/CD." },
    { term: "HSM (Hardware Security Module)", def: "Аппаратный модуль безопасности. В проекте – on-premise кластер КриптоПро, сертифицированный ФСБ, с синхронной репликацией." },
    { term: "Tenant isolation", def: "Логическая изоляция данных разных клиентов на уровне namespace и RBAC (ролевая модель)." },
    { term: "M-of-N (мультиподпись)", def: "Схема, требующая M подписей из N возможных для совершения транзакции." },
    { term: "RPS (Requests Per Second)", def: "Количество запросов в секунду, выдерживаемое системой." },
    { term: "SLA (Service Level Agreement)", def: "Соглашение об уровне обслуживания, например, доступность 99.95%." },
    { term: "Retention", def: "Срок хранения данных (например, аудиторских журналов – 7 лет)." },
    { term: "Throughput", def: "Пропускная способность системы (событий в секунду)." },
    { term: "Latency p99", def: "99-й перцентиль задержки – значение, ниже которого находятся 99% запросов." },
    { term: "WORM (Write Once Read Many)", def: "Режим хранения, гарантирующий неизменность данных после записи." }
];

// ---------------------------- КОНТЕКСТ ----------------------------
const soiComponents = [
    'Торговый движок (Matching Engine) — высокопроизводительное ядро биржи',
    'Клиентский портал / API Gateway — шлюз для внешних запросов, управление сессиями и API-ключами',
    'Оркестратор Кошельков (Wallet Orchestrator) — управление подписью и отправкой транзакций (Temporal.io)',
    'HSM-Адаптер — слой абстракции для работы с КриптоПро HSM (PKCS#11)',
    'AML/CFT Движок — система правил для мониторинга транзакций и compliance',
    'Система Управления Ключами (KMS) — жизненный цикл ключей (генерация, ротация, отзыв)',
    'Аудиторское Хранилище — неизменяемый журнал всех критических событий (WORM, retention 7 лет, throughput 10 000 событий/сек)',
    'Административная консоль (Admin Back Office) — управление лимитами, пользователями, системами'
];

const externalSystems = [
    'HSM Cluster (КриптоПро on-premise, HA, 3 узла)',
    'Блокчейн-ноды (BTC/ETH/TRON) – собственные географически распределённые ноды',
    'SIEM (MaxPatrol) – централизованный сбор событий',
    'Внешние сервисы KYC (Sumsub) – верификация клиентов',
    'Платежные шлюзы (фиат: Сбербанк, Т-Банк)'
];

const integrationJustification = [
    { system: 'HSM Cluster (КриптоПро)', justification: 'Требование 115-ФЗ и ГОСТ Р 34.10-2021. Аппаратная защита ключей, сертифицирована ФСБ. Развёртывание: on-premise кластер из 3 узлов, синхронная репликация, p99 latency <500 мс, throughput 1000 подписей/сек.' },
    { system: 'Блокчейн-ноды (BTC/ETH/TRON)', justification: 'Взаимодействие с публичными сетями. Использование собственных нод (географически распределённых) для снижения задержек и повышения надёжности. Scope ограничен тремя блокчейнами с возможностью добавления по критериям: активность сообщества, объём транзакций, поддержка в HSM.' },
    { system: 'SIEM (MaxPatrol)', justification: 'Требование ЦБ РФ к мониторингу инцидентов ИБ. Централизованный сбор и корреляция событий безопасности.' },
    { system: 'Внешние сервисы KYC (Sumsub)', justification: 'Требование 115-ФЗ для идентификации клиентов. Снижение рисков AML.' },
    { system: 'Платежные шлюзы (Фиат)', justification: 'Фиатные депозиты/выплаты в рублях для российских клиентов. Интеграция с банками-эквайерами.' }
];

const assumptions = [
    'Все внешние интеграции доступны по SLA ≥99.9%',
    'HSM кластер развёрнут в геораспределённом ЦОД (on-premise) с синхронной репликацией',
    'Блокчейн-ноды синхронизированы и имеют запас по диску (NVMe, ≥2 ТБ)',
    'Каналы связи с платёжными шлюзами защищены TLS 1.3 и VPN',
    'Все сотрудники с доступом к админке проходят двухфакторную аутентификацию',
    'Резервное копирование БД каждые 6 часов (RPO <6 часов)',
    'Все административные действия требуют dual control',
    'Целевая нагрузка: 50 000 concurrent users, 10 000 RPS, latency p99 <200 мс для API',
    'Аудиторское хранилище имеет throughput не менее 10 000 событий/сек и retention 7 лет'
];

const externalEntities = [
    { entity: 'Трейдер (розничный)', input: 'Торговые ордера, заявки на вывод, API-ключи, 2FA', output: 'Исполнение ордеров, статус вывода, балансы, история' },
    { entity: 'Маркет-мейкер', input: 'Высокочастотные ордера', output: 'Рыночные данные, лимиты, алерты' },
    { entity: 'Корпоративный клиент', input: 'Корпоративные выводы, запросы на мультиподпись', output: 'Выписки, статусы одобрения' },
    { entity: 'Compliance-офицер', input: 'Установка лимитов, заморозка счетов, AML-правила', output: 'Алерты по подозрительным транзакциям, отчёты по 115-ФЗ' },
    { entity: 'Казначей (Treasury)', input: 'Пополнение hot wallet, инициация cold storage вывода', output: 'Статусы резервов, транзакции на подпись' },
    { entity: 'SecOps / ИБ-аналитик', input: 'Ротация мастер-ключей, emergency revoke', output: 'Алерты безопасности, журнал инцидентов, статусы HSM' },
    { entity: 'Администратор платформы', input: 'Управление конфигурацией, мониторинг', output: 'Метрики, логи, алерты' },
    { entity: 'HSM Cluster (КриптоПро)', input: 'Криптографические операции', output: 'Подпись транзакции, генерация ключей' },
    { entity: 'Блокчейн-ноды', input: 'Подтверждения транзакций, балансы', output: 'Подписанные транзакции, broadcast' }
];

// ---------------------------- СТЕЙКХОЛДЕРЫ И МАТРИЦА ОТВЕТСТВЕННОСТИ ----------------------------
const stakeholders = [
    { name: 'Трейдер (розничный)', role: 'Конечный пользователь', interests: 'Быстрое исполнение ордеров, безопасность средств', requirements: 'Скорость вывода ≤30 мин' },
    { name: 'Маркет-мейкер', role: 'Профессиональный трейдер', interests: 'Низкая задержка, высокие лимиты API', requirements: 'Rate limit 1000+ RPS, SLA 99.99%' },
    { name: 'Корпоративный клиент', role: 'Юридическое лицо', interests: 'Мультиподпись, интеграция с казначейством', requirements: 'Self-service ротация API-ключей через UI' },
    { name: 'Compliance-офицер', role: 'Сотрудник комплаенс', interests: 'AML/CFT инструменты, блокировка счетов', requirements: 'Freeze в real-time (<5 сек), черные списки' },
    { name: 'Казначей (Treasury)', role: 'Финансовый сотрудник', interests: 'Управление кошельками, M-of-N политика', requirements: 'Автоматическая sweep-функция, M=2 из N=3' },
    { name: 'SecOps / ИБ', role: 'Специалист по безопасности', interests: 'Мониторинг инцидентов, управление ключами HSM', requirements: 'Все ключи в HSM, revoke SLA <60 сек' },
    { name: 'Аудитор / Регулятор', role: 'Внешний контролирующий орган', interests: 'Неизменяемый журнал, соответствие 115-ФЗ', requirements: 'WORM-хранилище, retention 7 лет, отчёт за 1 час' },
    { name: 'Администратор платформы', role: 'SRE / Platform Engineer', interests: 'Наблюдаемость, автомасштабирование', requirements: 'HA архитектура, RTO <15 мин, RPO <1 мин' },
    { name: 'Бизнес-владелец', role: 'CEO / Product Owner', interests: 'Рентабельность, удержание клиентов', requirements: 'Доступность 99.95%, MTTR <30 мин' },
    { name: 'Разработчик (Dev)', role: 'Инженер', interests: 'Понятные API, CI/CD, документация', requirements: 'Swagger/OpenAPI, тестовые сети' }
];

const responsibilityMatrix = [
    { area: 'Инфраструктурная платформа (K8s, сети, HSM, хранилища)', platformEng: '✅ владелец', devops: 'использование' },
    { area: 'CI/CD пайплайны развертывания приложений', platformEng: 'поддержка инструментов (GitLab CI, ArgoCD)', devops: '✅ владелец (сборка, деплой)' },
    { area: 'Мониторинг и алертинг (Prometheus, Grafana, Loki)', platformEng: 'базовая инфраструктура метрик', devops: '✅ настройка метрик приложений, дашборды' },
    { area: 'Управление секретами и ключами (KMS, HSM)', platformEng: '✅ интеграция с HSM, Vault', devops: 'использование через API' },
    { area: 'Disaster Recovery и резервное копирование', platformEng: '✅ стратегия, автоматизация бекапов платформы', devops: 'реализация бекапов БД и приложений' }
];

// ---------------------------- СЦЕНАРИИ (5) ----------------------------
const scenarios = [
    {
        id: 'S1', name: 'Вывод криптовалюты (основной сценарий)',
        goal: 'Безопасный и предсказуемый вывод средств клиента с балансом между автоматизацией и контролем',
        steps: [ 'Инициирование: Трейдер запрашивает вывод 0.5 BTC', 'Pre-flight: 2FA, AML Check, лимиты', 'Блокировка средств на горячем кошельке', 'Сборка транзакции', 'Согласование: <10k USD авто, ≥10k USD step-up', 'Подпись через HSM', 'Публикация в блокчейн-ноду', 'Финализация по подтверждениям' ],
        exceptions: [ 'Недостаточно средств: 400', 'Адрес в чёрном списке: 422', 'Превышен лимит: 429', 'Неверный формат адреса: 400', '2FA не пройдена: 401' ],
        degradations: [ 'HSM недоступен → pending_hsm, retry 30 сек', 'Блокчейн-нода недоступна → переключение на резервную', 'AML-сервис недоступен → pending_aml_check, ручное рассмотрение' ]
    },
    {
        id: 'S2', name: 'Создание API-ключа для алгоритмической торговли',
        goal: 'Self-service выдача API-ключей с ограниченными правами и обязательной IP-привязкой для withdraw',
        steps: [ '2FA в личном кабинете', 'Выбор scope (trade/withdraw/info) и TTL', 'При scope=withdraw – IP whitelist', 'Валидация KYC', 'Генерация ключа и секрета (показывается один раз)', 'Сохранение хеша в БД', 'Аудит api_key.created' ],
        exceptions: [ 'Scope=withdraw без IP whitelist: 422', 'Дублирование имени: 409', 'Лимит ключей (5): 429', 'KYC не пройден: 403' ],
        degradations: [ 'БД недоступна → 503', 'API Gateway недоступен → ключ создаётся в статусе pending_gateway' ]
    },
    {
        id: 'S3', name: 'Мультиподпись для вывода из холодного хранилища',
        goal: 'Безопасный вывод крупных сумм (>100k USD) из cold storage с кворумом казначеев',
        steps: [ 'Казначей А инициирует вывод', 'Создание multisig-запроса, статус pending_approval', 'Уведомление казначеев Б и В (кворум 2 из 3)', 'Подтверждение в админке (2FA + IP)', 'HSM собирает подписи', 'Транзакция подписывается и отправляется', 'Audit log approvals' ],
        exceptions: [ 'Недостаточно подписей за 24 часа → expired', 'Ошибка подписи в HSM → 400', 'Конфликт UTXO → 409' ],
        degradations: [ 'HSM недоступен → pending_hsm', 'Один из подписантов недоступен → эскалация на резервного' ]
    },
    {
        id: 'S4', name: 'Плановая ротация мастер-ключей HSM',
        goal: 'Смена мастер-ключей без простоя, dual control, полный аудит',
        steps: [ 'SecOps-1 инициирует ротацию', 'SecOps-2 подтверждает (dual control, MFA)', 'HSM генерирует новый мастер-ключ (ГОСТ Р 34.10-2021)', 'Перешифровка активных кошельков', 'Валидация тестовой подписью', 'Архивация старого ключа (retention 5 лет)', 'Audit log key_rotation.completed' ],
        exceptions: [ 'Отказ SecOps-2 → rejected', 'Ошибка перешифрования → откат, инцидент', 'HSM в maintenance → ротация откладывается' ],
        degradations: [ 'Часть кошельков не перешифрована → повтор через 1 час', 'Сбой архивирования → локальное сохранение (защищённо)' ]
    },
    {
        id: 'S5', name: 'Расследование инцидента и формирование compliance-отчёта',
        goal: 'Восстановление цепочки событий по запросу аудитора в течение 1 часа',
        steps: [ 'Аудитор вводит correlation_id или tx_hash', 'Сбор событий из Audit Journal (WORM)', 'Формирование временной шкалы', 'Обогащение из SIEM (IP, user-agent)', 'Экспорт отчёта в PDF/CSV', 'Подписание ЭЦП' ],
        exceptions: [ 'Неполные данные → EvidenceGap', 'Доступ запрещён (нет роли auditor) → 403', 'Запрос за период >1 года → 400' ],
        degradations: [ 'SIEM недоступен → только локальное WORM', 'Часть логов отсутствует → отметка в отчёте' ]
    }
];

// ---------------------------- ТРЕБОВАНИЯ (ИЗМЕРИМЫЕ) ----------------------------
const requirements = [
    // Stakeholder (SR-SH)
    { id: 'SR-SH-1', type: 'SR-SH', description: 'Скорость исполнения вывода для low-risk транзакций', metric: '≤30 минут (p99) для сумм <10k USD' },
    { id: 'SR-SH-2', type: 'SR-SH', description: 'API-ключи с индивидуальными лимитами Rate Limit без повторного KYC', metric: '1000+ RPS на ключ, SLA 99.99%' },
    { id: 'SR-SH-3', type: 'SR-SH', description: 'Приостановка вывода или блокировка счёта в реальном времени', metric: 'Задержка ≤5 секунд (от нажатия до блокировки)' },
    { id: 'SR-SH-4', type: 'SR-SH', description: 'Политика "M of N" для холодного хранилища', metric: 'M=2 из N=3, p99 подписи <1 сек' },
    { id: 'SR-SH-5', type: 'SR-SH', description: 'Все мастер-ключи в сертифицированных ФСБ HSM', metric: 'HSM on-premise кластер, 3 узла, синхронная репликация' },
    { id: 'SR-SH-6', type: 'SR-SH', description: 'Детальный отчёт по транзакции по запросу регулятора', metric: 'WORM-хранилище, retention 7 лет, отчёт за ≤1 час' },
    { id: 'SR-SH-7', type: 'SR-SH', description: 'Отказоустойчивость: отсутствие SPOF', metric: 'RTO <15 мин, RPO <1 мин (синхронная репликация БД)' },
    // System (SR-SYS)
    { id: 'SR-SYS-1', type: 'SR-SYS', description: 'Все взаимодействия с блокчейном и хранение ключей через HSM', metric: 'HSM on-premise, p99 latency <500 мс' },
    { id: 'SR-SYS-2', type: 'SR-SYS', description: 'Ротация мастер-ключей HSM не чаще 1 года, dual control', metric: 'Два сотрудника SecOps, аудит' },
    { id: 'SR-SYS-3', type: 'SR-SYS', description: 'Проверка исходящих адресов по санкционным спискам', metric: 'Задержка AML-проверки <100 мс' },
    { id: 'SR-SYS-4', type: 'SR-SYS', description: 'API-ключи с scopes и обязательной IP-привязкой для withdraw', metric: 'Валидация на API Gateway' },
    { id: 'SR-SYS-5', type: 'SR-SYS', description: 'Логирование всех административных действий в WORM', metric: 'Throughput 10 000 событий/сек, retention 7 лет' },
    { id: 'SR-SYS-6', type: 'SR-SYS', description: 'Время подтверждения вывода через 2FA', metric: 'p99 <30 секунд' },
    { id: 'SR-SYS-7', type: 'SR-SYS', description: 'Batch-транзакции для оптимизации комиссий', metric: 'до 100 outputs на транзакцию' },
    { id: 'SR-SYS-8', type: 'SR-SYS', description: 'Автоматическое повышение risk score при аномалиях', metric: 'False positive <0.5% (NFR-4)' },
    { id: 'SR-SYS-9', type: 'SR-SYS', description: 'Сквозная трассировка через correlation_id', metric: 'Обязательный header' },
    { id: 'SR-SYS-10', type: 'SR-SYS', description: 'Graceful shutdown', metric: 'Таймаут завершения 30 сек' },
    { id: 'SR-SYS-11', type: 'SR-SYS', description: 'Время жизни сессии администратора', metric: '4 часа, затем повторная MFA' },
    { id: 'SR-SYS-12', type: 'SR-SYS', description: 'Резервное копирование БД', metric: 'Каждые 6 часов, автоматическая проверка целостности' },
    // NFR
    { id: 'NFR-1', type: 'NFR', description: 'Доступность торгового API и интерфейса вывода', metric: 'Trade API: 99.99%, Withdraw API: 99.95% в месяц' },
    { id: 'NFR-2', type: 'NFR', description: 'Время подписи транзакции через HSM', metric: 'p99 <500 мс' },
    { id: 'NFR-3', type: 'NFR', description: 'Время отклика на экстренную блокировку (kill-switch)', metric: '≤5 секунд' },
    { id: 'NFR-4', type: 'NFR', description: 'Процент ложных срабатываний AML-движка', metric: '<0.5% от общего числа транзакций' },
    { id: 'NFR-5', type: 'NFR', description: 'Масштабируемость оркестрации кошельков', metric: '1000 исх. транзакций/мин, 50k concurrent users, 10k RPS, p99 latency <200 мс' }
];

// ---------------------------- ACCEPTANCE CRITERIA ----------------------------
const acceptanceCriteria = [
    { req: 'SR-SH-1', criteria: 'При тестировании в testnet 100 заявок на вывод low-risk суммы (<10k USD) 99 из них завершаются за ≤30 минут.' },
    { req: 'SR-SH-2', criteria: 'Нагрузочное тестирование подтверждает 1000 RPS на ключ маркет-мейкера без ошибок rate limiting.' },
    { req: 'SR-SH-5', criteria: 'Инспекция HSM: все приватные ключи генерируются внутри HSM, ни один ключ не покидает HSM в открытом виде.' },
    { req: 'NFR-1', criteria: 'Мониторинг доступности за месяц: Trade API ≥99.99%, Withdraw API ≥99.95% (Uptime).' },
    { req: 'NFR-5', criteria: 'Тест k6: при 50k concurrent users, 10k RPS, p99 latency API <200 мс, error rate <0.1%.' }
];

// ---------------------------- ТРАССИРУЕМОСТЬ (stakeholder → system → NFR) ----------------------------
const requirementTraceability = [
    { stakeholder: 'SR-SH-1', system: ['SR-SYS-6'], nfr: ['NFR-2'] },
    { stakeholder: 'SR-SH-2', system: ['SR-SYS-4'], nfr: ['NFR-1', 'NFR-5'] },
    { stakeholder: 'SR-SH-3', system: ['SR-SYS-3', 'SR-SYS-8'], nfr: ['NFR-3', 'NFR-4'] },
    { stakeholder: 'SR-SH-4', system: ['SR-SYS-7'], nfr: ['NFR-2'] },
    { stakeholder: 'SR-SH-5', system: ['SR-SYS-1', 'SR-SYS-2'], nfr: ['NFR-2'] },
    { stakeholder: 'SR-SH-6', system: ['SR-SYS-5', 'SR-SYS-9'], nfr: [] },
    { stakeholder: 'SR-SH-7', system: ['SR-SYS-10', 'SR-SYS-12'], nfr: ['NFR-1', 'NFR-5'] }
];

// ---------------------------- АРХИТЕКТУРНЫЕ РЕШЕНИЯ (ADR) С АЛЬТЕРНАТИВАМИ ----------------------------
const adrs = [
    {
        title: 'ADR-1: Хранение корневых ключей – HSM (КриптоПро)',
        context: 'Необходимость соответствия 115-ФЗ, ГОСТ Р 34.10-2021, защита от компрометации серверов.',
        decision: 'Все приватные ключи генерируются и хранятся внутри сертифицированного HSM (КриптоПро on-premise кластер из 3 узлов, синхронная репликация). Сервис подписи через PKCS#11.',
        alternatives: 'Альтернатива: программное хранение ключей (Vault) – не соответствует законодательству РФ; Cloud HSM – не сертифицирован ФСБ.',
        tradeoff: 'Усложнение архитектуры и рост бюджета (+40%) против максимальной защищённости и соответствия регуляторам.'
    },
    {
        title: 'ADR-2: Оркестрация вывода – Saga Pattern на Temporal.io',
        context: 'Вывод средств включает множество шагов (блокировка → AML → подпись → отправка → подтверждение), которые могут длиться часы и требовать перезапуска после сбоев.',
        decision: 'Использование распределённого оркестратора саг (Temporal.io) для гарантии консистенции и переживания сбоев.',
        alternatives: 'Альтернативы: Camunda (тяжеловесная, BPMN), ручная реализация saga с Kafka (высокая сложность отладки).',
        tradeoff: 'Сложность отладки распределённых стейт-машин против гарантии финишности для каждой заявки и отсутствия потерянных средств.'
    },
    {
        title: 'ADR-3: Изоляция торгового движка и сервисов кошельков',
        context: 'Торговый движок требует максимальной производительности (low latency), сервис кошельков – максимальной безопасности (HSM).',
        decision: 'Физическое разделение: торговый движок в "сети обработки данных", HSM и оркестратор в "сети активов". Общение через Kafka с шифрованием.',
        alternatives: 'Монолитная архитектура – риск lateral movement при компрометации; синхронные REST вызовы – увеличение latency и связность.',
        tradeoff: 'Увеличение latency на ~50 мс против полной изоляции критичных активов и предотвращения lateral movement.'
    },
    {
        title: 'ADR-4: База данных – PostgreSQL vs MongoDB',
        context: 'Необходимость ACID для финансовых операций (Ledger) и гибкости для метаданных.',
        decision: 'PostgreSQL 15+ для Ledger и Account (ACID, транзакционность). Для аналитики и аудита – отдельная read replica + Elasticsearch.',
        alternatives: 'MongoDB (слабая поддержка ACID, риск консистентности балансов); CockroachDB (избыточна для текущих масштабов).',
        tradeoff: 'Меньшая горизонтальная масштабируемость записи, но гарантия консистентности и соответствие аудиту.'
    },
    {
        title: 'ADR-5: Брокер сообщений – Kafka vs RabbitMQ',
        context: 'Требуется высокая пропускная способность (10k+ событий/сек), replayability и at-least-once доставка для аудита.',
        decision: 'Apache Kafka. Обеспечивает репликацию, долгое хранение событий (retention 7 дней), масштабирование.',
        alternatives: 'RabbitMQ (хуже справляется с replay, меньше пропускная способность); AWS Kinesis (vendor lock-in, не для on-premise).',
        tradeoff: 'Более высокая сложность настройки по сравнению с RabbitMQ, но необходимые возможности для аудита и трассировки.'
    },
    {
        title: 'ADR-6: Оркестрация контейнеров – Kubernetes vs Nomad',
        context: 'Гибридное облако + on-premise ЦОД, потребность в автоматическом масштабировании и изоляции сетей.',
        decision: 'Kubernetes (управляемый Yandex Cloud + self-managed в ЦОД) с политиками сетевой изоляции (Cilium).',
        alternatives: 'Nomad (проще, но меньше экосистема); Docker Swarm (недостаточно возможностей для сложных политик).',
        tradeoff: 'Высокая операционная сложность против экосистемы, стандарта индустрии и гибкости.'
    }
];

// ---------------------------- АРХИТЕКТУРНЫЕ КОМПОНЕНТЫ И ВЗАИМОДЕЙСТВИЯ ----------------------------
const archComponents = [
    'Web UI / Mobile Backend – клиентское взаимодействие, рендеринг интерфейсов',
    'API Gateway (Kong / Traefik) – маршрутизация, rate limiting, JWT/API-ключи, IP whitelist',
    'Matching Engine (Rust/C++) – высокопроизводительный движок ордеров',
    'Account & Ledger Service (Java/Spring) – управление балансами, двойная запись',
    'Orchestrator (Go + Temporal) – управление состоянием заявок на вывод, саги',
    'HSM Adapter (ГОСТ) – прослойка для связи с КриптоПро HSM, PKCS#11',
    'AML Risk Engine (Python/FastAPI) – оценка рисков, скоринг, санкционные списки',
    'KMS (Key Management Service) – управление метаданными ключей, политики ротации',
    'Audit & Forensics – Elasticsearch с WORM-бакетом (retention 7 лет, throughput 10k/сек)'
];

const componentInteractions = [
    { from: 'Web UI', to: 'API Gateway', protocol: 'HTTPS/REST', description: 'Пользовательские запросы' },
    { from: 'API Gateway', to: 'Matching Engine', protocol: 'gRPC', description: 'Торговые ордера' },
    { from: 'API Gateway', to: 'Orchestrator', protocol: 'REST', description: 'Заявки на вывод' },
    { from: 'Orchestrator', to: 'AML Risk Engine', protocol: 'gRPC', description: 'AML-скоринг' },
    { from: 'Orchestrator', to: 'HSM Adapter', protocol: 'gRPC/PKCS#11', description: 'Запрос на подпись' },
    { from: 'HSM Adapter', to: 'HSM Cluster', protocol: 'TCP/TLS', description: 'Криптооперации' },
    { from: 'Orchestrator', to: 'Blockchain Nodes', protocol: 'JSON-RPC', description: 'Broadcast' },
    { from: 'Account & Ledger', to: 'PostgreSQL', protocol: 'SQL', description: 'Балансы (ACID)' },
    { from: 'Все сервисы', to: 'Kafka', protocol: 'TCP', description: 'События аудита' },
    { from: 'Kafka', to: 'Audit & Forensics', protocol: 'TCP', description: 'Запись в WORM' }
];

const techStack = [
    { component: 'Торговый движок', stack: 'Rust / C++ (tokio)', reason: 'Максимальная производительность, p99 <10 мс' },
    { component: 'Оркестратор кошельков', stack: 'Go + Temporal.io', reason: 'Saga-оркестрация, устойчивость к сбоям' },
    { component: 'API Gateway', stack: 'Kong / Traefik', reason: 'Rate limiting, JWT, IP whitelist' },
    { component: 'Account & Ledger', stack: 'Java 17+ / Spring Boot', reason: 'Транзакционность, ACID' },
    { component: 'AML Risk Engine', stack: 'Python / FastAPI', reason: 'ML-экосистема, быстрая разработка' },
    { component: 'HSM Adapter', stack: 'C++ / C#', reason: 'Нативные библиотеки КриптоПро, PKCS#11' },
    { component: 'База данных', stack: 'PostgreSQL 15+', reason: 'ACID, JSONB, CQRS' },
    { component: 'Очереди сообщений', stack: 'Apache Kafka', reason: 'At-least-once, replayability' },
    { component: 'HSM', stack: 'КриптоПро HSM on-premise', reason: 'Сертификация ФСБ, ГОСТ Р 34.10-2021' }
];

// ---------------------------- РИСКИ (5) ----------------------------
const risks = [
    { id: 'R-01', risk: 'Утечка ключей горячего кошелька', probability: 'Низкая', probValue: 1, impact: 'Критическое', impactValue: 3, priority: 3, mitigation: 'HSM, ротация каждые 24 часа, sweep в cold storage', residualRisk: 'Низкий' },
    { id: 'R-02', risk: '51% атака на сеть блокчейна', probability: 'Средняя', probValue: 2, impact: 'Высокое', impactValue: 3, priority: 6, mitigation: 'Увеличенное количество подтверждений (BTC 6+, ETH 30+)', residualRisk: 'Средний' },
    { id: 'R-03', risk: 'Ошибка оркестратора (дублирование отправки)', probability: 'Низкая', probValue: 1, impact: 'Высокое', impactValue: 3, priority: 3, mitigation: 'Идемпотентность, Temporal', residualRisk: 'Низкий' },
    { id: 'R-04', risk: 'Заморозка средств регулятором', probability: 'Средняя', probValue: 2, impact: 'Среднее', impactValue: 2, priority: 4, mitigation: 'Автоматизация отчётности по 115-ФЗ, compliance 24/7', residualRisk: 'Средний' },
    { id: 'R-05', risk: 'Атака на API-ключи трейдера (фишинг)', probability: 'Средняя', probValue: 2, impact: 'Среднее', impactValue: 2, priority: 4, mitigation: 'IP whitelist для withdraw, 2FA, мониторинг аномалий', residualRisk: 'Низкий-Средний' }
];

// ---------------------------- V&V: ТЕСТ-КЕЙСЫ (10) ----------------------------
const testCases = [
    { id: 'TC-WD-001', name: 'Автоматический вывод low-risk суммы', goal: 'Проверка успешного low-risk вывода через HSM', expected: 'completed за 2 минуты, транзакция в блокчейн-эксплорере, audit event withdraw.signed.hsm', method: 'Test', methodDesc: 'Автоматизированный E2E тест в testnet' },
    { id: 'TC-AML-001', name: 'Блокировка вывода по AML (санкционный адрес)', goal: 'Проверка блокировки вывода на адрес из списка OFAC/SDN', expected: 'blocked_aml, алерт в SIEM', method: 'Test', methodDesc: 'Интеграционный тест AML-движка' },
    { id: 'TC-CLD-001', name: 'Мультиподпись для вывода из холодного кошелька', goal: 'Проверка M-of-N мультиподписи', expected: 'Транзакция отправлена только после подтверждения User B, Audit Log с approvals', method: 'Demo', methodDesc: 'Демонстрация казначеям' },
    { id: 'TC-FAIL-001', name: 'Отказ HSM (деградация)', goal: 'Проверка поведения при недоступности HSM', expected: 'pending_hsm, retry, после восстановления – успех', method: 'Test', methodDesc: 'Fault injection' },
    { id: 'TC-API-001', name: 'API-ключ с правами на вывод без IP-привязки', goal: 'Проверка отклонения создания ключа', expected: 'Ошибка 422, ключ не создан', method: 'Test', methodDesc: 'Юнит-тест валидации' },
    { id: 'TC-SEC-001', name: 'Аварийная блокировка (Kill Switch)', goal: 'Проверка экстренной блокировки всех выводов', expected: '503 для withdrawal endpoints, заявки frozen', method: 'Demo', methodDesc: 'Демонстрация для SecOps' },
    { id: 'TC-PERF-001', name: 'Нагрузочное тестирование торгового API', goal: 'Проверка latency под пиковой нагрузкой', expected: 'Latency p99 <10 мс, error rate <0.01%, CPU <70%', method: 'Analysis', methodDesc: 'Нагрузочное тестирование k6, 1000 concurrent users' },
    { id: 'TC-KMS-001', name: 'Ротация мастер-ключа HSM', goal: 'Проверка dual-control ротации', expected: 'Без downtime, audit log с обоими approvals', method: 'Demo + Inspection', methodDesc: 'Демонстрация и проверка логов' },
    { id: 'TC-DR-001', name: 'Восстановление после сбоя БД (RPO/RTO)', goal: 'Проверка аварийного восстановления PostgreSQL', expected: 'RTO <15 минут, RPO <1 минута', method: 'Test', methodDesc: 'DR-упражнение с Patroni' },
    { id: 'TC-HSM-001', name: 'Интеграционное тестирование с КриптоПро HSM', goal: 'Проверка подписи транзакции по ГОСТ', expected: 'Подпись валидна, время <500 мс', method: 'Test + Inspection', methodDesc: 'Интеграционный тест с реальным HSM' }
];

// ---------------------------- МАТРИЦА ВЕРИФИКАЦИИ ----------------------------
const verificationMatrix = [
    { requirement: 'SR-SH-1 (скорость вывода)', method: 'E2E тестирование', artifact: 'TC-WD-001, отчёт о времени выполнения (p99 ≤30 мин)' },
    { requirement: 'SR-SH-2 (RPS и SLA)', method: 'Нагрузочное тестирование', artifact: 'TC-PERF-001, графики latency, error rate' },
    { requirement: 'SR-SH-5 (HSM ключи)', method: 'Инспекция + интеграционный тест', artifact: 'TC-HSM-001, аудит генерации ключей' },
    { requirement: 'NFR-1 (доступность)', method: 'Анализ мониторинга', artifact: 'Отчёт Prometheus за месяц, Uptime ≥99.95%/99.99%' },
    { requirement: 'NFR-5 (масштабируемость)', method: 'Нагрузочное тестирование', artifact: 'Отчёт k6: 50k concurrent, 10k RPS, p99 latency <200 мс' },
    { requirement: 'SR-SYS-5 (аудит WORM)', method: 'Инспекция и тест записи', artifact: 'Проверка retention 7 лет, throughput 10k событий/сек' }
];

// ---------------------------- МАТРИЦА ТРАССИРУЕМОСТИ (требования vs тест-кейсы) ----------------------------
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

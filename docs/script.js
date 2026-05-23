// ============================================
// ПОЛНОСТЬЮ РАБОТАЮЩАЯ ЛОГИКА (С НАВИГАЦИЕЙ)
// ============================================

// Навигация
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    if (!navItems.length) return;
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;
            if (!sectionId) return;
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(sectionId);
            if (targetSection) targetSection.classList.add('active');
        });
    });
}

// Функции рендеринга для каждой секции
function renderContext() {
    const container = document.getElementById('context-content');
    if (!container) return;
    container.innerHTML = `
        <div class="subsection"><h3>1.1 Цель</h3><p>Высоконадёжная (≥99.95%) криптобиржа, соответствующая 115-ФЗ, ГОСТ Р 34.10-2021.</p></div>
        <div class="subsection"><h3>1.2 Среда</h3><ul><li>Гибридное облако + on-premise ЦОД</li><li>Операционный контур: Platform Engineering, DevOps, SecOps, Treasury, Compliance</li></ul></div>
        <div class="subsection"><h3>1.3 Внешние сущности</h3><div class="table-container"><table><thead><tr><th>Сущность</th><th>Вход</th><th>Выход</th></tr></thead><tbody>${externalEntities.map(e => `<tr><td><strong>${e.entity}</strong></td><td>${e.input}</td><td>${e.output}</td></tr>`).join('')}</tbody></table></div></div>
        <div class="subsection"><h3>1.4 Границы SoI</h3><h4>Внутри</h4><ul>${soiComponents.map(c => `<li>${c}</li>`).join('')}</ul><h4>Снаружи</h4><ul>${externalSystems.map(s => `<li>${s}</li>`).join('')}</ul></div>
        <div class="subsection"><h3>1.5 Обоснование интеграций</h3>${integrationJustification.map(j => `<p><strong>${j.system}:</strong> ${j.justification}</p>`).join('')}</div>
        <div class="subsection"><h3>1.6 Допущения</h3><ul>${assumptions.map(a => `<li>${a}</li>`).join('')}</ul></div>
    `;
}

function renderConops() {
    const container = document.getElementById('conops-content');
    if (!container) return;
    container.innerHTML = `
        <h3>Стейкхолдеры</h3><div class="table-container"><table><thead><tr><th>Стейкхолдер</th><th>Роль</th><th>Интересы</th><th>Требования</th></tr></thead><tbody>${stakeholders.map(s => `<tr><td><strong>${s.name}</strong></td><td>${s.role}</td><td>${s.interests}</td><td>${s.requirements}</td></tr>`).join('')}</tbody></table></div>
        <h3>Матрица ответственности (Platform Engineering vs DevOps)</h3><div class="table-container"><table><thead><tr><th>Область</th><th>Platform Engineering</th><th>DevOps</th></tr></thead><tbody>${responsibilityMatrix.map(r => `<tr><td>${r.area}</td><td>${r.platformEng}</td><td>${r.devops}</td></tr>`).join('')}</tbody></table></div>
        <h3>Сценарии (5)</h3>${scenarios.map(s => `<div class="info-card"><h4>${s.id}: ${s.name}</h4><p><strong>Цель:</strong> ${s.goal}</p><p><strong>Шаги:</strong> ${s.steps.join(' → ')}</p><p><strong>Исключения:</strong> ${s.exceptions.join(', ')}</p><p><strong>Деградация:</strong> ${s.degradations.join(', ')}</p></div>`).join('')}
    `;
}

function renderRequirementsPage() {
    const container = document.getElementById('requirements-content');
    if (!container) return;
    const types = { 'SR-SH': 'Stakeholder', 'SR-SYS': 'System', 'NFR': 'NFR' };
    let html = `<div class="filter-bar" id="req-filter-bar-local"></div><div class="table-container"><table><thead><tr><th>ID</th><th>Тип</th><th>Описание</th><th>Метрика</th></tr></thead><tbody id="req-table-body"></tbody></table></div>
                 <h3>Acceptance Criteria</h3><ul>${acceptanceCriteria.map(ac => `<li><strong>${ac.req}:</strong> ${ac.criteria}</li>`).join('')}</ul>
                 <h3>Согласованность</h3><div class="info-card"><ul>${requirementTraceability.map(rt => `<li><strong>${rt.stakeholder}</strong> → ${rt.system.join(', ')} → ${rt.nfr.join(', ') || '—'}</li>`).join('')}</ul></div>`;
    container.innerHTML = html;
    const tbody = document.getElementById('req-table-body');
    const renderTable = (filter) => {
        const filtered = filter === 'all' ? requirements : requirements.filter(r => r.type === filter);
        tbody.innerHTML = filtered.map(r => `<tr><td><strong>${r.id}</strong></td><td><span class="badge badge-${r.type === 'SR-SH' ? 'blue' : (r.type === 'SR-SYS' ? 'green' : 'yellow')}">${types[r.type]}</span></td><td>${r.description}</td><td>${r.metric}</td></tr>`).join('');
    };
    const filterBar = document.getElementById('req-filter-bar-local');
    if (filterBar) {
        ['all','SR-SH','SR-SYS','NFR'].forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn' + (type === 'all' ? ' active' : '');
            btn.textContent = type === 'all' ? 'Все' : types[type];
            btn.onclick = () => {
                document.querySelectorAll('#req-filter-bar-local .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderTable(type);
            };
            filterBar.appendChild(btn);
        });
    }
    renderTable('all');
}

function renderArchitecture() {
    const container = document.getElementById('architecture-content');
    if (!container) return;
    container.innerHTML = `
        <h3>Модель архитектуры (C4 Container)</h3><div class="diagram-container"><div class="mermaid" id="c4-diagram">C4Context
          Person(trader, "Трейдер")
          Person(mm, "Маркет-мейкер")
          System_Boundary(rs, "RocketSpot") {
            Container(web, "Web UI", "React")
            Container(gateway, "API Gateway", "Kong")
            Container(matching, "Matching Engine", "Rust")
            Container(account, "Ledger", "Java")
            Container(orchestrator, "Orchestrator", "Go+Temporal")
            Container(aml, "AML Engine", "Python")
            Container(hsmAdapter, "HSM Adapter", "C++")
            Container(audit, "Audit", "Elasticsearch")
          }
          ContainerDb(pg, "PostgreSQL")
          ContainerDb(kafka, "Kafka")
          System_Ext(hsm, "HSM КриптоПро")
          System_Ext(bc, "Блокчейн-ноды")
          Rel(trader, gateway, "HTTPS")
          Rel(gateway, matching, "gRPC")
          Rel(gateway, orchestrator, "REST")
          Rel(orchestrator, aml, "gRPC")
          Rel(orchestrator, hsmAdapter, "PKCS#11")
          Rel(hsmAdapter, hsm, "TCP/TLS")
          Rel(orchestrator, bc, "JSON-RPC")
          Rel(account, pg, "SQL")
          Rel(orchestrator, kafka, "TCP")
          Rel(kafka, audit, "TCP")
        </div></div>
        <h3>Декомпозиция компонентов</h3><ul>${archComponents.map(c => `<li>${c}</li>`).join('')}</ul>
        <h3>Взаимодействие</h3><div class="table-container"><table><thead><tr><th>От</th><th>К</th><th>Протокол</th><th>Описание</th></tr></thead><tbody>${componentInteractions.map(i => `<tr><td>${i.from}</td><td>${i.to}</td><td><code>${i.protocol}</code></td><td>${i.description}</td></tr>`).join('')}</tbody></table></div>
        <h3>ADR (с альтернативами)</h3>${adrs.map(adr => `<div class="info-card"><h4>${adr.title}</h4><p><strong>Контекст:</strong> ${adr.context}</p><p><strong>Решение:</strong> ${adr.decision}</p><p><strong>Альтернативы:</strong> ${adr.alternatives}</p><p><strong>Trade-off:</strong> ${adr.tradeoff}</p></div>`).join('')}
        <h3>Технологический стек</h3><div class="table-container"><table><thead><tr><th>Компонент</th><th>Стек</th><th>Обоснование</th></tr></thead><tbody>${techStack.map(t => `<tr><td><strong>${t.component}</strong></td><td>${t.stack}</td><td>${t.reason}</td></tr>`).join('')}</tbody></table></div>
    `;
    setTimeout(() => mermaid.contentLoaded(), 100);
}

function renderApi() {
    const container = document.getElementById('api-content');
    if (!container) return;
    container.innerHTML = `
        <h3>POST /api/v2/withdraw</h3><div class="api-block"><pre>{
  "currency": "BTC",
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "amount": "0.5",
  "network": "BTC",
  "twofa_code": "123456"
}</pre><p><strong>Idempotency-Key</strong> обязателен. Retry: экспоненциальная задержка.</p></div>
        <h3>TransactionSignedEvent</h3><div class="api-block"><pre>{
  "event_id": "evt-123",
  "event_type": "transaction.signed.v1",
  "withdrawal_id": "wd-...",
  "tx_hash": "0x...",
  "signature_type": "ГОСТ Р 34.10-2021"
}</pre><p>Idempotency по event_id.</p></div>
    `;
}

function renderRisks() {
    const container = document.getElementById('risks-content');
    if (!container) return;
    container.innerHTML = `<div class="table-container"><table><thead><tr><th>ID</th><th>Риск</th><th>Вероятность</th><th>Влияние</th><th>Приоритет</th><th>Меры</th><th>Остаточный риск</th></tr></thead><tbody>${risks.map(r => `<tr><td><strong>${r.id}</strong></td><td>${r.risk}</td><td><span class="badge badge-${r.probability === 'Низкая' ? 'green' : 'yellow'}">${r.probability}</span></td><td><span class="badge badge-${r.impact === 'Критическое' ? 'red' : 'yellow'}">${r.impact}</span></td><td><span class="badge badge-${r.priority >= 6 ? 'red' : (r.priority >= 4 ? 'yellow' : 'green')}">${r.priority}</span></td><td>${r.mitigation}</td><td>${r.residualRisk}</td></tr>`).join('')}</tbody></table></div>`;
}

function renderVandV() {
    const container = document.getElementById('vandv-content');
    if (!container) return;
    container.innerHTML = `
        <h3>Тест-кейсы (10)</h3>${testCases.map(tc => `<div class="info-card"><h4>${tc.id}: ${tc.name}</h4><p><strong>Цель:</strong> ${tc.goal}</p><p><strong>Ожидаемый результат:</strong> ${tc.expected}</p><p><strong>Метод:</strong> ${tc.method} — ${tc.methodDesc}</p></div>`).join('')}
        <h3>Матрица верификации</h3><div class="table-container"><table><thead><tr><th>Требование</th><th>Метод</th><th>Артефакт</th></tr></thead><tbody>${verificationMatrix.map(v => `<tr><td>${v.requirement}</td><td>${v.method}</td><td>${v.artifact}</td></tr>`).join('')}</tbody></table></div>
        <h3>Матрица трассируемости</h3><div class="table-container"><table><thead><tr><th>Требование</th>${Array(10).fill().map((_,i) => `<th>TC-${(i+1).toString().padStart(2,'0')}</th>`).join('')}</tr></thead><tbody>${traceability.map(t => `<tr><td><strong>${t.req}</strong></td>${Array(10).fill().map((_,i) => `<td class="traceability-check">${t[`tc${(i+1).toString().padStart(2,'0')}`] ? '✓' : ''}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    `;
}

function renderGlossaryPage() {
    const container = document.getElementById('glossary-content');
    if (!container) return;
    container.innerHTML = `<div class="table-container"><table><thead><tr><th>Термин</th><th>Определение</th></tr></thead><tbody>${glossary.map(g => `<tr><td><strong>${g.term}</strong></td><td>${g.def}</td></tr>`).join('')}</tbody></table></div>`;
}

function renderDashboardStats() {
    const statsDiv = document.getElementById('dashboard-stats');
    if (statsDiv) {
        statsDiv.innerHTML = `
            <div class="stat-card"><div class="stat-icon">📋</div><div class="stat-value">5</div><div class="stat-label">Сценариев</div></div>
            <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-value">7</div><div class="stat-label">Stakeholder</div></div>
            <div class="stat-card"><div class="stat-icon">⚙️</div><div class="stat-value">12</div><div class="stat-label">System</div></div>
            <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-value">5</div><div class="stat-label">NFR</div></div>
            <div class="stat-card"><div class="stat-icon">⚠️</div><div class="stat-value">5</div><div class="stat-label">Рисков</div></div>
            <div class="stat-card"><div class="stat-icon">🧪</div><div class="stat-value">10</div><div class="stat-label">Тест-кейсов</div></div>
        `;
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderContext();
    renderConops();
    renderRequirementsPage();
    renderArchitecture();
    renderApi();
    renderRisks();
    renderVandV();
    renderGlossaryPage();
    renderDashboardStats();
    // Перерисовываем Mermaid для архитектурной диаграммы
    if (typeof mermaid !== 'undefined') {
        try { mermaid.contentLoaded(); } catch(e) { console.warn(e); }
    }
    feather.replace();
});

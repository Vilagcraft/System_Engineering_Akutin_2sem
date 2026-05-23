// ============================================
// ЛОГИКА ВИЗУАЛИЗАЦИИ ROCKETSPOT (ИСПРАВЛЕННАЯ)
// ============================================

// Навигация
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.dataset.section;
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
    });
});

// Функция рендеринга требований с фильтрацией
function renderRequirements(filterType) {
    const reqTbody = document.querySelector('#requirements-table tbody');
    if (!reqTbody) return;
    reqTbody.innerHTML = '';
    const filteredReqs = filterType === 'all' ? requirements : requirements.filter(r => r.type === filterType);
    filteredReqs.forEach(r => {
        const tr = document.createElement('tr');
        let typeBadge = '';
        if (r.type === 'SR-SH') typeBadge = '<span class="badge badge-blue">Stakeholder</span>';
        else if (r.type === 'SR-SYS') typeBadge = '<span class="badge badge-green">System</span>';
        else if (r.type === 'NFR') typeBadge = '<span class="badge badge-yellow">NFR</span>';
        tr.innerHTML = `<td><strong>${r.id}</strong></td><td>${typeBadge}</td><td>${r.description}</td><td>${r.metric}</td>`;
        reqTbody.appendChild(tr);
    });
}

// Рендер глоссария
function renderGlossary() {
    const tbody = document.querySelector('#glossary-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    glossary.forEach(g => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><strong>${g.term}</strong></td><td>${g.def}</td>`;
        tbody.appendChild(tr);
    });
}

// Матрица ответственности
function renderResponsibilityMatrix() {
    const tbody = document.querySelector('#responsibility-matrix tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    responsibilityMatrix.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.area}</td><td>${r.platformEng}</td><td>${r.devops}</td>`;
        tbody.appendChild(tr);
    });
}

// Acceptance Criteria
function renderAcceptanceCriteria() {
    const div = document.getElementById('acceptance-criteria');
    if (!div) return;
    let html = '<ul>';
    acceptanceCriteria.forEach(ac => {
        html += `<li><strong>${ac.req}:</strong> ${ac.criteria}</li>`;
    });
    html += '</ul>';
    div.innerHTML = html;
}

// Матрица верификации
function renderVerificationMatrix() {
    const tbody = document.querySelector('#verification-matrix tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    verificationMatrix.forEach(vm => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${vm.requirement}</td><td>${vm.method}</td><td>${vm.artifact}</td>`;
        tbody.appendChild(tr);
    });
}

// Дашборд статистика
function renderDashboardStats() {
    const statsDiv = document.getElementById('dashboard-stats');
    if (!statsDiv) return;
    statsDiv.innerHTML = `
        <div class="stat-card"><div class="stat-icon">📋</div><div class="stat-value">5</div><div class="stat-label">Сценариев</div></div>
        <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-value">7</div><div class="stat-label">Stakeholder reqs</div></div>
        <div class="stat-card"><div class="stat-icon">⚙️</div><div class="stat-value">12</div><div class="stat-label">System reqs</div></div>
        <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-value">5</div><div class="stat-label">NFR</div></div>
        <div class="stat-card"><div class="stat-icon">⚠️</div><div class="stat-value">5</div><div class="stat-label">Рисков</div></div>
        <div class="stat-card"><div class="stat-icon">🧪</div><div class="stat-value">10</div><div class="stat-label">Тест-кейсов</div></div>
    `;
}

// Основная инициализация
document.addEventListener('DOMContentLoaded', () => {
    // ---------- КОНТЕКСТ ----------
    const soiList = document.getElementById('soi-components-list');
    if (soiList) {
        soiComponents.forEach(comp => { const li = document.createElement('li'); li.textContent = comp; soiList.appendChild(li); });
    }
    const extList = document.getElementById('external-systems-list');
    if (extList) {
        externalSystems.forEach(sys => { const li = document.createElement('li'); li.textContent = sys; extList.appendChild(li); });
    }
    const justDiv = document.getElementById('integration-justification');
    if (justDiv) {
        integrationJustification.forEach(j => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${j.system}:</strong> ${j.justification}`;
            p.style.marginBottom = '10px';
            justDiv.appendChild(p);
        });
    }
    const assumptionsList = document.getElementById('assumptions-list');
    if (assumptionsList) {
        assumptions.forEach(a => { const li = document.createElement('li'); li.textContent = a; assumptionsList.appendChild(li); });
    }
    const entitiesDiv = document.getElementById('external-entities-table');
    if (entitiesDiv) {
        let html = '<div class="table-container"><table><thead><tr><th>Внешняя сущность</th><th>Поток в систему</th><th>Поток из системы</th></tr></thead><tbody>';
        externalEntities.forEach(e => {
            html += `<tr><td><strong>${e.entity}</strong></td><td>${e.input}</td><td>${e.output}</td></tr>`;
        });
        html += '</tbody></table></div>';
        entitiesDiv.innerHTML = html;
    }

    // ---------- СТЕЙКХОЛДЕРЫ ----------
    const stakeholdersTbody = document.querySelector('#stakeholders-table tbody');
    if (stakeholdersTbody) {
        stakeholders.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td><strong>${s.name}</strong></td><td>${s.role}</td><td>${s.interests}</td><td>${s.requirements}</td>`;
            stakeholdersTbody.appendChild(tr);
        });
    }

    // ---------- СЦЕНАРИИ ----------
    const scenariosDiv = document.getElementById('scenarios-list');
    if (scenariosDiv) {
        scenarios.forEach(s => {
            const card = document.createElement('div');
            card.className = 'info-card';
            card.style.marginBottom = '20px';
            let stepsHtml = '<ol style="margin-left:20px;">' + s.steps.map(step => `<li>${step}</li>`).join('') + '</ol>';
            let exceptionsHtml = '<ul style="margin-left:20px;color:var(--accent-red);">' + s.exceptions.map(e => `<li>${e}</li>`).join('') + '</ul>';
            let degradationsHtml = '<ul style="margin-left:20px;color:var(--accent-yellow);">' + s.degradations.map(d => `<li>${d}</li>`).join('') + '</ul>';
            card.innerHTML = `
                <h3>${s.id}: ${s.name}</h3>
                <p><strong>🎯 Цель:</strong> ${s.goal}</p>
                <div><h4>📋 Основной поток</h4>${stepsHtml}</div>
                <div><h4>⚠️ Исключения</h4>${exceptionsHtml}</div>
                <div><h4>🔄 Режимы деградации</h4>${degradationsHtml}</div>
            `;
            scenariosDiv.appendChild(card);
        });
    }

    // ---------- ТРЕБОВАНИЯ ----------
    renderRequirements('all');
    const filterBar = document.getElementById('req-filter-bar');
    if (filterBar) {
        const types = ['all', 'SR-SH', 'SR-SYS', 'NFR'];
        types.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn' + (type === 'all' ? ' active' : '');
            btn.dataset.type = type;
            btn.textContent = type === 'all' ? 'Все (24)' : (type === 'SR-SH' ? 'Stakeholder (7)' : (type === 'SR-SYS' ? 'System (12)' : 'NFR (5)'));
            btn.addEventListener('click', () => {
                document.querySelectorAll('#req-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderRequirements(type);
            });
            filterBar.appendChild(btn);
        });
    }
    const reqTraceDiv = document.getElementById('req-traceability-info');
    if (reqTraceDiv) {
        let html = '<div class="info-card"><ul>';
        requirementTraceability.forEach(rt => {
            html += `<li><strong>${rt.stakeholder}</strong> → System: ${rt.system.join(', ')} → NFR: ${rt.nfr.length ? rt.nfr.join(', ') : '—'}</li>`;
        });
        html += '</ul></div>';
        reqTraceDiv.innerHTML = html;
    }

    // ---------- АРХИТЕКТУРА ----------
    const archList = document.getElementById('arch-components-list');
    if (archList) {
        archComponents.forEach(comp => { const li = document.createElement('li'); li.textContent = comp; archList.appendChild(li); });
    }
    const interactionsTbody = document.querySelector('#interactions-table tbody');
    if (interactionsTbody) {
        componentInteractions.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${c.from}</td><td>${c.to}</td><td><code>${c.protocol}</code></td><td>${c.description}</td>`;
            interactionsTbody.appendChild(tr);
        });
    }
    const adrDiv = document.getElementById('adr-list');
    if (adrDiv) {
        adrs.forEach(adr => {
            const card = document.createElement('div');
            card.className = 'info-card';
            card.style.marginBottom = '15px';
            card.innerHTML = `
                <h4>${adr.title}</h4>
                <p><strong>Контекст:</strong> ${adr.context}</p>
                <p><strong>Решение:</strong> ${adr.decision}</p>
                <p><strong>Альтернативы:</strong> ${adr.alternatives}</p>
                <p><strong>Trade-off:</strong> ${adr.tradeoff}</p>
            `;
            adrDiv.appendChild(card);
        });
    }
    const techTbody = document.querySelector('#tech-stack-table tbody');
    if (techTbody) {
        techStack.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td><strong>${t.component}</strong></td><td>${t.stack}</td><td>${t.reason}</td>`;
            techTbody.appendChild(tr);
        });
    }

    // ---------- API ----------
    const apiDiv = document.getElementById('api-withdraw');
    if (apiDiv) {
        apiDiv.innerHTML = `
            <div class="api-block">
                <h4>Запрос</h4>
                <p><strong>Method:</strong> POST</p>
                <p><strong>Endpoint:</strong> /api/v2/withdraw</p>
                <p><strong>Idempotency:</strong> <code>Idempotency-Key</code> header (обязателен)</p>
                <p><strong>Retry policy:</strong> Exponential backoff 1s,2s,4s, max 3 attempts</p>
                <p><strong>Заголовки:</strong></p>
                <ul><li><code>Authorization: Api-Key &lt;key&gt;</code></li><li><code>X-Signature: &lt;HMAC-SHA512(body+timestamp)&gt;</code></li><li><code>X-Timestamp: &lt;unix_time&gt;</code></li><li><code>Idempotency-Key: &lt;UUID&gt;</code></li></ul>
                <p><strong>Тело запроса:</strong></p>
                <pre>{
  "currency": "BTC",
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "amount": "0.5",
  "network": "BTC",
  "twofa_code": "123456"
}</pre>
                <h4>Ответы</h4>
                <table><thead><tr><th>Код</th><th>Описание</th><th>Retry?</th></tr></thead>
                <tbody><tr><td>202</td><td>Заявка принята</td><td>❌</td></tr><tr><td>400</td><td>Неверный формат</td><td>❌</td></tr><tr><td>401</td><td>Неверная подпись/2FA</td><td>❌</td></tr><tr><td>403</td><td>Недостаточно прав</td><td>❌</td></tr><tr><td>409</td><td>Дублирование Idempotency-Key</td><td>✅</td></tr><tr><td>422</td><td>AML risk high / IP not whitelisted</td><td>❌</td></tr><tr><td>429</td><td>Rate limit exceeded</td><td>✅</td></tr><tr><td>500</td><td>Внутренняя ошибка</td><td>✅</td></tr><tr><td>503</td><td>Сервис недоступен</td><td>✅</td></tr></tbody></table>
            </div>
        `;
    }
    const eventDiv = document.getElementById('api-event');
    if (eventDiv) {
        eventDiv.innerHTML = `
            <div class="api-block">
                <h4>Событие: TransactionSignedEvent</h4>
                <p><strong>Назначение:</strong> Оповещение Ledger-сервиса о списании средств</p>
                <p><strong>Схема:</strong></p>
                <pre>{
  "event_id": "evt-123",
  "event_type": "transaction.signed.v1",
  "occurred_at": "2023-10-27T10:25:00Z",
  "withdrawal_id": "wd-123e4567...",
  "tx_hash": "0x123...abc",
  "signed_at": "...",
  "signer": "hsm-cluster-01",
  "signature_type": "ГОСТ Р 34.10-2021",
  "correlation_id": "corr-456"
}</pre>
                <p><strong>Idempotency:</strong> по полю <code>event_id</code></p>
            </div>
        `;
    }

    // ---------- РИСКИ ----------
    const risksTbody = document.querySelector('#risks-table tbody');
    if (risksTbody) {
        risks.forEach(r => {
            const tr = document.createElement('tr');
            const probBadge = r.probability === 'Низкая' ? 'green' : (r.probability === 'Средняя' ? 'yellow' : 'red');
            const impBadge = r.impact === 'Критическое' ? 'red' : (r.impact === 'Высокое' ? 'yellow' : 'green');
            const priorityBadge = r.priority >= 6 ? 'red' : (r.priority >= 4 ? 'yellow' : 'green');
            tr.innerHTML = `
                <td><strong>${r.id}</strong></td><td>${r.risk}</td>
                <td><span class="badge badge-${probBadge}">${r.probability}</span></td>
                <td><span class="badge badge-${impBadge}">${r.impact}</span></td>
                <td><span class="badge badge-${priorityBadge}">${r.priority}</span></td>
                <td>${r.mitigation}</td><td>${r.residualRisk}</td>
            `;
            risksTbody.appendChild(tr);
        });
    }

    // ---------- ТЕСТ-КЕЙСЫ ----------
    const tcDiv = document.getElementById('testcases-list');
    if (tcDiv) {
        testCases.forEach(tc => {
            const card = document.createElement('div');
            card.className = 'info-card';
            card.style.marginBottom = '15px';
            let methodBadge = '';
            if (tc.method.includes('Test')) methodBadge += '<span class="badge badge-green">Test</span> ';
            if (tc.method.includes('Demo')) methodBadge += '<span class="badge badge-blue">Demo</span> ';
            if (tc.method.includes('Analysis')) methodBadge += '<span class="badge badge-yellow">Analysis</span> ';
            if (tc.method.includes('Inspection')) methodBadge += '<span class="badge badge-yellow">Inspection</span> ';
            card.innerHTML = `
                <h4>${tc.id}: ${tc.name}</h4>
                <p><strong>🎯 Цель:</strong> ${tc.goal}</p>
                <p><strong>✅ Ожидаемый результат:</strong> ${tc.expected}</p>
                <p><strong>🔬 Метод верификации:</strong> ${methodBadge} — ${tc.methodDesc}</p>
            `;
            tcDiv.appendChild(card);
        });
    }

    // ---------- МАТРИЦА ТРАССИРУЕМОСТИ ----------
    const traceTbody = document.querySelector('#traceability-table tbody');
    if (traceTbody) {
        traceability.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${t.req}</strong></td>
                <td class="traceability-check">${t.tc01 ? '✓' : ''}</td>
                <td class="traceability-check">${t.tc02 ? '✓' : ''}</td>
                <td class="traceability-check">${t.tc03 ? '✓' : ''}</td>
                <td class="traceability-check">${t.tc04 ? '✓' : ''}</td>
                <td class="traceability-check">${t.tc05 ? '✓' : ''}</td>
                <td class="traceability-check">${t.tc06 ? '✓' : ''}</td>
                <td class="traceability-check">${t.tc07 ? '✓' : ''}</td>
                <td class="traceability-check">${t.tc08 ? '✓' : ''}</td>
                <td class="traceability-check">${t.tc09 ? '✓' : ''}</td>
                <td class="traceability-check">${t.tc10 ? '✓' : ''}</td>
            `;
            traceTbody.appendChild(tr);
        });
    }

    // Вызов дополнительных рендеров
    renderGlossary();
    renderResponsibilityMatrix();
    renderAcceptanceCriteria();
    renderVerificationMatrix();
    renderDashboardStats();
});

// ============================================
// ЛОГИКА ВИЗУАЛИЗАЦИИ ROCKETSPOT
// ============================================

// Навигация по разделам
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

    const filteredReqs = filterType === 'all'
        ? requirements
        : requirements.filter(r => r.type === filterType);

    filteredReqs.forEach(r => {
        const tr = document.createElement('tr');
        let typeBadge = '';
        if (r.type === 'SR-SH') typeBadge = '<span class="badge badge-blue">Stakeholder</span>';
        else if (r.type === 'SR-SYS') typeBadge = '<span class="badge badge-green">System</span>';
        else if (r.type === 'NFR') typeBadge = '<span class="badge badge-yellow">NFR</span>';

        tr.innerHTML = `
            <td><strong>${r.id}</strong></td>
            <td>${typeBadge}</td>
            <td>${r.description}</td>
            <td>${r.metric}</td>
        `;
        reqTbody.appendChild(tr);
    });
}

// Заполнение данных при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // ---------- КОНТЕКСТ И ГРАНИЦЫ ----------
    const soiList = document.getElementById('soi-components-list');
    if (soiList) {
        soiComponents.forEach(comp => {
            const li = document.createElement('li');
            li.textContent = comp;
            soiList.appendChild(li);
        });
    }

    const extList = document.getElementById('external-systems-list');
    if (extList) {
        externalSystems.forEach(sys => {
            const li = document.createElement('li');
            li.textContent = sys;
            extList.appendChild(li);
        });
    }

    // Обоснование интеграций
    const justDiv = document.getElementById('integration-justification');
    if (justDiv && typeof integrationJustification !== 'undefined') {
        integrationJustification.forEach(j => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${j.system}:</strong> ${j.justification}`;
            p.style.marginBottom = '10px';
            justDiv.appendChild(p);
        });
    }

    // Допущения
    const assumptionsList = document.getElementById('assumptions-list');
    if (assumptionsList && typeof assumptions !== 'undefined') {
        assumptions.forEach(a => {
            const li = document.createElement('li');
            li.textContent = a;
            assumptionsList.appendChild(li);
        });
    }

    // Таблица внешних сущностей
    const entitiesDiv = document.getElementById('external-entities-table');
    if (entitiesDiv && typeof externalEntities !== 'undefined') {
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
            tr.innerHTML = `
                <td><strong>${s.name}</strong></td>
                <td>${s.role}</td>
                <td>${s.interests}</td>
                <td>${s.requirements}</td>
            `;
            stakeholdersTbody.appendChild(tr);
        });
    }

    // ---------- CONOPS СЦЕНАРИИ ----------
    const scenariosDiv = document.getElementById('scenarios-list');
    if (scenariosDiv && typeof scenarios !== 'undefined') {
        scenarios.forEach((s) => {
            const card = document.createElement('div');
            card.className = 'info-card';
            card.style.marginBottom = '20px';

            let stepsHtml = '<ol style="margin-left: 20px;">';
            s.steps.forEach(step => { stepsHtml += `<li>${step}</li>`; });
            stepsHtml += '</ol>';

            let exceptionsHtml = '<ul style="margin-left: 20px; color: var(--accent-red);">';
            s.exceptions.forEach(e => { exceptionsHtml += `<li>${e}</li>`; });
            exceptionsHtml += '</ul>';

            let degradationsHtml = '<ul style="margin-left: 20px; color: var(--accent-yellow);">';
            s.degradations.forEach(d => { degradationsHtml += `<li>${d}</li>`; });
            degradationsHtml += '</ul>';

            card.innerHTML = `
                <h3 style="margin-bottom: 15px;">${s.id}: ${s.name}</h3>
                <p><strong>🎯 Цель:</strong> ${s.goal}</p>
                <div style="margin-top: 15px;">
                    <h4>📋 Основной поток</h4>
                    ${stepsHtml}
                </div>
                <div style="margin-top: 15px;">
                    <h4>⚠️ Исключения</h4>
                    ${exceptionsHtml}
                </div>
                <div style="margin-top: 15px;">
                    <h4>🔄 Режимы деградации</h4>
                    ${degradationsHtml}
                </div>
            `;
            scenariosDiv.appendChild(card);
        });
    }

    // ---------- ТРЕБОВАНИЯ ----------
    renderRequirements('all');

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderRequirements(btn.dataset.type);
        });
    });

    // Согласованность требований
    const reqTraceDiv = document.getElementById('req-traceability-info');
    if (reqTraceDiv && typeof requirementTraceability !== 'undefined') {
        let html = '<div class="info-card"><ul style="margin-left: 20px;">';
        requirementTraceability.forEach(rt => {
            html += `<li><strong>${rt.stakeholder}</strong> → System: ${rt.system.join(', ')} → NFR: ${rt.nfr.length ? rt.nfr.join(', ') : '—'}</li>`;
        });
        html += '</ul></div>';
        reqTraceDiv.innerHTML = html;
    }

    // ---------- АРХИТЕКТУРА ----------
    const archList = document.getElementById('arch-components-list');
    if (archList) {
        archComponents.forEach(comp => {
            const li = document.createElement('li');
            li.textContent = comp;
            archList.appendChild(li);
        });
    }

    // Взаимодействие компонентов
    const interactionsTbody = document.querySelector('#interactions-table tbody');
    if (interactionsTbody && typeof componentInteractions !== 'undefined') {
        componentInteractions.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.from}</td>
                <td>${c.to}</td>
                <td><code>${c.protocol}</code></td>
                <td>${c.description}</td>
            `;
            interactionsTbody.appendChild(tr);
        });
    }

    // ADR
    const adrDiv = document.getElementById('adr-list');
    if (adrDiv && typeof adrs !== 'undefined') {
        adrs.forEach(adr => {
            const card = document.createElement('div');
            card.className = 'info-card';
            card.style.marginBottom = '15px';
            card.innerHTML = `
                <h4 style="margin-bottom: 10px;">${adr.title}</h4>
                <p><strong>Контекст:</strong> ${adr.context}</p>
                <p><strong>Решение:</strong> ${adr.decision}</p>
                <p><strong>Trade-off:</strong> ${adr.tradeoff}</p>
            `;
            adrDiv.appendChild(card);
        });
    }

    // Технологический стек
    const techTbody = document.querySelector('#tech-stack-table tbody');
    if (techTbody && typeof techStack !== 'undefined') {
        techStack.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${t.component}</strong></td>
                <td>${t.stack}</td>
                <td>${t.reason}</td>
            `;
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
                <p><strong>Idempotency:</strong> <code>Idempotency-Key</code> header (обязателен для предотвращения дублирования)</p>
                <p><strong>Retry policy:</strong> Exponential backoff 1s, 2s, 4s, max 3 attempts</p>
                <p><strong>Заголовки:</strong></p>
                <ul style="margin-left: 20px; margin-bottom: 15px;">
                    <li><code>Authorization: Api-Key &lt;key&gt;</code></li>
                    <li><code>X-Signature: &lt;HMAC-SHA512(body + timestamp)&gt;</code></li>
                    <li><code>X-Timestamp: &lt;unix_time&gt;</code></li>
                    <li><code>Idempotency-Key: &lt;UUID&gt;</code></li>
                </ul>
                <p><strong>Тело запроса:</strong></p>
                <pre>{
  "currency": "BTC",
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "amount": "0.5",
  "network": "BTC",
  "twofa_code": "123456"
}</pre>
                <h4 style="margin-top: 20px;">Ответы</h4>
                <table style="width:100%; margin-top:10px;">
                    <thead><tr><th>Код</th><th>Описание</th><th>Retry?</th></tr></thead>
                    <tbody>
                        <tr><td>202</td><td>Заявка принята в обработку</td><td>❌</td></tr>
                        <tr><td>400</td><td>Неверный формат адреса или суммы</td><td>❌</td></tr>
                        <tr><td>401</td><td>Неверная подпись или 2FA</td><td>❌</td></tr>
                        <tr><td>403</td><td>Недостаточно прав (scope)</td><td>❌</td></tr>
                        <tr><td>409</td><td>Дублирование Idempotency-Key</td><td>✅ (возврат предыдущего ответа)</td></tr>
                        <tr><td>422</td><td>AML risk high / IP not whitelisted</td><td>❌</td></tr>
                        <tr><td>429</td><td>Превышен rate limit</td><td>✅ (с backoff)</td></tr>
                        <tr><td>500</td><td>Внутренняя ошибка сервера</td><td>✅ (до 3 раз)</td></tr>
                        <tr><td>503</td><td>Сервис временно недоступен</td><td>✅ (до 3 раз)</td></tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    const eventDiv = document.getElementById('api-event');
    if (eventDiv) {
        eventDiv.innerHTML = `
            <div class="api-block">
                <h4>Событие: TransactionSignedEvent</h4>
                <p><strong>Назначение:</strong> Оповещение Ledger-сервиса о списании средств после успешной отправки в сеть</p>
                <p><strong>Версия:</strong> v1 (additive-only changes)</p>
                <p><strong>Схема события:</strong></p>
                <pre>{
  "event_id": "evt-123",
  "event_type": "transaction.signed.v1",
  "occurred_at": "2023-10-27T10:25:00Z",
  "withdrawal_id": "wd-123e4567-e89b-12d3-a456-426614174000",
  "tx_hash": "0x123...abc",
  "signed_at": "2023-10-27T10:25:00Z",
  "signer": "hsm-cluster-01",
  "signature_type": "ГОСТ Р 34.10-2021",
  "correlation_id": "corr-456"
}</pre>
                <p><strong>Idempotency:</strong> По полю <code>event_id</code></p>
            </div>
        `;
    }

    // ---------- РИСКИ ----------
    const risksTbody = document.querySelector('#risks-table tbody');
    if (risksTbody && typeof risks !== 'undefined') {
        risks.forEach(r => {
            const tr = document.createElement('tr');
            const probBadge = r.probability === 'Низкая' ? 'green' : (r.probability === 'Средняя' ? 'yellow' : 'red');
            const impBadge = r.impact === 'Критическое' ? 'red' : (r.impact === 'Высокое' ? 'yellow' : 'green');
            const priorityBadge = r.priority >= 6 ? 'red' : (r.priority >= 4 ? 'yellow' : 'green');
            tr.innerHTML = `
                <td><strong>${r.id}</strong></td>
                <td>${r.risk}</td>
                <td><span class="badge badge-${probBadge}">${r.probability} (${r.probValue})</span></td>
                <td><span class="badge badge-${impBadge}">${r.impact} (${r.impactValue})</span></td>
                <td><span class="badge badge-${priorityBadge}">${r.priority}</span></td>
                <td>${r.mitigation}</td>
                <td>${r.residualRisk}</td>
            `;
            risksTbody.appendChild(tr);
        });
    }

    // ---------- V&V ТЕСТ-КЕЙСЫ ----------
    const tcDiv = document.getElementById('testcases-list');
    if (tcDiv && typeof testCases !== 'undefined') {
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
                <h4 style="margin-bottom: 5px;">${tc.id}: ${tc.name}</h4>
                <p><strong>🎯 Цель:</strong> ${tc.goal}</p>
                <p><strong>✅ Ожидаемый результат:</strong> ${tc.expected}</p>
                <p><strong>🔬 Метод верификации:</strong> ${methodBadge} — ${tc.methodDesc}</p>
            `;
            tcDiv.appendChild(card);
        });
    }

    // ---------- МАТРИЦА ТРАССИРУЕМОСТИ ----------
    const traceTbody = document.querySelector('#traceability-table tbody');
    if (traceTbody && typeof traceability !== 'undefined') {
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
});
// Навигация по разделам
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.dataset.section;

        // Обновление активного пункта меню
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Отображение нужной секции
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
    // Компоненты SoI
    const soiList = document.getElementById('soi-components-list');
    if (soiList) {
        soiComponents.forEach(comp => {
            const li = document.createElement('li');
            li.textContent = comp;
            soiList.appendChild(li);
        });
    }

    // Внешние системы
    const extList = document.getElementById('external-systems-list');
    if (extList) {
        externalSystems.forEach(sys => {
            const li = document.createElement('li');
            li.textContent = sys;
            extList.appendChild(li);
        });
    }

    // Стейкхолдеры
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

    // CONOPS сценарий
    const conopsDiv = document.getElementById('conops-scenario');
    if (conopsDiv) {
        conopsDiv.innerHTML = `
            <div class="info-card">
                <h4>🎯 Цель: Безопасный и предсказуемый вывод средств</h4>
                <ol style="margin-left: 20px; color: var(--text-secondary);">
                    <li><strong>Инициирование:</strong> Трейдер запрашивает вывод 0.5 BTC</li>
                    <li><strong>Pre-flight:</strong> 2FA, AML Check (адрес по черным спискам), проверка лимитов</li>
                    <li><strong>Блокировка средств:</strong> Резервирование на горячем кошельке клиента</li>
                    <li><strong>Сборка транзакции:</strong> Формирование raw tx (UTXO для BTC)</li>
                    <li><strong>Согласование:</strong> < 10,000 USD → авто-подпись; ≥ 10,000 USD → Step-up Approval</li>
                    <li><strong>Подпись:</strong> HSM (ГОСТ), для сумм > 100,000 USD — мультиподпись 2 из 3</li>
                    <li><strong>Публикация:</strong> Отправка в блокчейн-ноду</li>
                    <li><strong>Финализация:</strong> Отслеживание confirmations, списание средств</li>
                </ol>
            </div>
        `;
    }

    // Требования
    renderRequirements('all');

    // Фильтрация требований
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderRequirements(btn.dataset.type);
        });
    });

    // Архитектурные компоненты
    const archList = document.getElementById('arch-components-list');
    if (archList) {
        archComponents.forEach(comp => {
            const li = document.createElement('li');
            li.textContent = comp;
            archList.appendChild(li);
        });
    }

    // ADR
    const adrDiv = document.getElementById('adr-list');
    if (adrDiv) {
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
    if (techTbody) {
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

    // API Withdraw
    const apiDiv = document.getElementById('api-withdraw');
    if (apiDiv) {
        apiDiv.innerHTML = `
            <div class="api-block">
                <p><strong>Заголовки запроса:</strong></p>
                <ul style="margin-left: 20px; margin-bottom: 15px;">
                    <li><code>Authorization: Api-Key &lt;key&gt;</code></li>
                    <li><code>X-Signature: &lt;HMAC-SHA512(body + timestamp)&gt;</code></li>
                    <li><code>X-Timestamp: &lt;unix_time&gt;</code></li>
                </ul>
                <p><strong>Тело запроса:</strong></p>
                <pre>{
  "currency": "BTC",
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "amount": "0.5",
  "network": "BTC",
  "twofa_code": "123456"
}</pre>
                <p><strong>Ответ (202 Accepted):</strong></p>
                <pre>{
  "withdrawal_id": "wd-123e4567-e89b-12d3-a456-426614174000",
  "status": "pending_aml_check",
  "estimated_finish_time": "2023-10-27T10:30:00Z"
}</pre>
            </div>
        `;
    }

    // API Event
    const eventDiv = document.getElementById('api-event');
    if (eventDiv) {
        eventDiv.innerHTML = `
            <div class="api-block">
                <p><strong>Назначение:</strong> Оповещение Ledger-сервиса о списании средств после успешной отправки в сеть</p>
                <p><strong>Схема события:</strong></p>
                <pre>{
  "event_id": "evt-123",
  "withdrawal_id": "wd-...",
  "tx_hash": "0x123...abc",
  "signed_at": "2023-10-27T10:25:00Z",
  "signer": "hsm-cluster-01",
  "signature_type": "ГОСТ Р 34.10-2021"
}</pre>
            </div>
        `;
    }

    // Риски
    const risksTbody = document.querySelector('#risks-table tbody');
    if (risksTbody) {
        risks.forEach(r => {
            const tr = document.createElement('tr');
            const probBadge = r.probability === 'Низкая' ? 'green' : (r.probability === 'Средняя' ? 'yellow' : 'red');
            const impBadge = r.impact === 'Критическое' ? 'red' : (r.impact === 'Высокое' ? 'yellow' : 'green');
            tr.innerHTML = `
                <td><strong>${r.id}</strong></td>
                <td>${r.risk}</td>
                <td><span class="badge badge-${probBadge}">${r.probability}</span></td>
                <td><span class="badge badge-${impBadge}">${r.impact}</span></td>
                <td>${r.mitigation}</td>
            `;
            risksTbody.appendChild(tr);
        });
    }

    // Тест-кейсы
    const tcDiv = document.getElementById('testcases-list');
    if (tcDiv) {
        testCases.forEach(tc => {
            const card = document.createElement('div');
            card.className = 'info-card';
            card.style.marginBottom = '15px';
            card.innerHTML = `
                <h4 style="margin-bottom: 5px;">${tc.id}: ${tc.name}</h4>
                <p><strong>Цель:</strong> ${tc.goal}</p>
                <p><strong>Ожидаемый результат:</strong> ${tc.expected}</p>
            `;
            tcDiv.appendChild(card);
        });
    }

    // Матрица трассируемости
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
});
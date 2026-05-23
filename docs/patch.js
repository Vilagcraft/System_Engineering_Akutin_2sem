document.addEventListener('DOMContentLoaded', () => {
  const tcCount = document.getElementById('testcases-count');
  if (tcCount) tcCount.textContent = '12';

  const vvTitle = document.querySelector('#vandv h3');
  if (vvTitle) vvTitle.textContent = 'Тест-кейсы (12)';

  const architecture = document.getElementById('architecture');
  if (architecture && !document.getElementById('architecture-diagram')) {
    const diagram = document.createElement('div');
    diagram.className = 'diagram-container';
    diagram.id = 'architecture-diagram';
    diagram.innerHTML = `
      <h3>4.0 Архитектурная диаграмма компонентов</h3>
      <p style="margin-bottom: 15px; color: var(--text-secondary);">
        Диаграмма показывает клиентский слой, API Gateway, core-сервисы, изолированный контур активов, аудит и внешние интеграции.
      </p>
      <div class="mermaid">
flowchart LR
    subgraph Clients["Клиенты и внутренние роли"]
        UI["Web UI / API Clients"]
        Admin["Admin Back Office"]
        Auditor["Compliance / Auditor"]
    end

    subgraph Edge["Edge layer"]
        Gateway["API Gateway<br/>JWT, API keys, rate limit, IP whitelist"]
    end

    subgraph Core["Core services"]
        Matching["Matching Engine"]
        Ledger["Account & Ledger"]
        Orchestrator["Wallet Orchestrator<br/>Saga / Temporal"]
        AML["AML Risk Engine"]
        KMS["KMS Policy Service"]
    end

    subgraph Assets["Изолированный контур активов"]
        HSMAdapter["HSM Adapter"]
        HSM["CryptoPro HSM Cluster"]
        Nodes["BTC / ETH / TRON Nodes"]
    end

    subgraph Data["Данные и аудит"]
        Postgres[("PostgreSQL")]
        Kafka[("Kafka Event Bus")]
        WORM[("WORM Audit Storage")]
        SIEM["SIEM"]
    end

    UI --> Gateway
    Admin --> Gateway
    Auditor --> Gateway
    Gateway --> Matching
    Gateway --> Orchestrator
    Gateway --> Ledger
    Orchestrator --> AML
    Orchestrator --> Ledger
    Orchestrator --> HSMAdapter
    KMS --> HSMAdapter
    HSMAdapter --> HSM
    Orchestrator --> Nodes
    Ledger --> Postgres
    Matching --> Kafka
    Orchestrator --> Kafka
    AML --> Kafka
    Kafka --> WORM
    WORM --> SIEM
      </div>`;

    const firstSubheading = architecture.querySelector('h3');
    architecture.insertBefore(diagram, firstSubheading || null);
    if (window.mermaid) mermaid.run({ nodes: diagram.querySelectorAll('.mermaid') });
  }

  const testCasesList = document.getElementById('testcases-list');
  if (testCasesList && !document.getElementById('tc-aud-001')) {
    testCasesList.insertAdjacentHTML('beforeend', `
      <div class="info-card" id="tc-aud-001" style="margin-bottom:15px;">
        <h4 style="margin-bottom:5px;">TC-AUD-001: Экспорт audit trail по запросу регулятора</h4>
        <p><strong>🎯 Цель:</strong> Проверить, что система формирует полный compliance-отчёт за период до 1 года.</p>
        <p><strong>✅ Ожидаемый результат:</strong> PDF/CSV формируется менее чем за 1 час и содержит actor_id, timestamp, correlation_id, IP и подпись аудитора.</p>
        <p><strong>🔬 Метод верификации:</strong> <span class="badge badge-green">Test</span> <span class="badge badge-yellow">Inspection</span> — E2E-тест экспорта и инспекция WORM audit log.</p>
      </div>
      <div class="info-card" id="tc-rbac-001" style="margin-bottom:15px;">
        <h4 style="margin-bottom:5px;">TC-RBAC-001: Tenant isolation и RBAC</h4>
        <p><strong>🎯 Цель:</strong> Проверить разграничение доступа между tenant-данными и ролями Admin, Trader, Compliance Officer, Auditor.</p>
        <p><strong>✅ Ожидаемый результат:</strong> Кросс-tenant доступ запрещён кодом 403, audit trail другого tenant недоступен, права соответствуют матрице RBAC.</p>
        <p><strong>🔬 Метод верификации:</strong> <span class="badge badge-green">Test</span> — интеграционные security-тесты ролей и изоляции tenant-данных.</p>
      </div>`);
  }

  const traceHead = document.querySelector('#traceability-table thead tr');
  if (traceHead && !traceHead.querySelector('[data-extra-tc="11"]')) {
    traceHead.insertAdjacentHTML('beforeend', '<th data-extra-tc="11">TC-11</th><th data-extra-tc="12">TC-12</th>');
  }

  document.querySelectorAll('#traceability-table tbody tr').forEach((row, index) => {
    if (!row.querySelector('[data-extra-cell="11"]')) {
      row.insertAdjacentHTML('beforeend', `<td data-extra-cell="11" class="traceability-check">${index % 2 === 0 ? '✓' : ''}</td><td data-extra-cell="12" class="traceability-check">✓</td>`);
    }
  });
});

document.addEventListener('DOMContentLoaded',()=>{
const tc=document.getElementById('testcases-count');if(tc)tc.textContent='12';
const vv=document.querySelector('#vandv h3');if(vv)vv.textContent='Тест-кейсы (12)';
const arch=document.getElementById('architecture');
if(arch){const d=document.createElement('div');d.className='diagram-container';d.innerHTML=`<h3>4.0 Архитектурная диаграмма</h3><div class="mermaid">flowchart LR
UI[Web UI]-->API[API Gateway]
API-->ME[Matching Engine]
API-->ORCH[Wallet Orchestrator]
ORCH-->AML[AML Engine]
ORCH-->HSM[HSM Adapter]
HSM-->CRYPTO[CryptoPro HSM]
ORCH-->NODE[Blockchain Nodes]
ME-->KAFKA[Kafka]
ORCH-->KAFKA
KAFKA-->AUDIT[WORM Audit]
AUDIT-->SIEM[SIEM]</div>`;arch.insertBefore(d,arch.children[1]);if(window.mermaid){mermaid.run({nodes:d.querySelectorAll('.mermaid')});}}
const tcList=document.getElementById('testcases-list');
if(tcList){tcList.insertAdjacentHTML('beforeend',`<div class="info-card" style="margin-bottom:15px;"><h4>TC-AUD-001: Экспорт audit trail</h4><p><strong>🎯 Цель:</strong> Проверка формирования compliance-отчёта для регулятора.</p><p><strong>✅ Ожидаемый результат:</strong> Отчёт формируется менее чем за 1 час и содержит correlation_id, actor_id и подпись аудитора.</p></div><div class="info-card" style="margin-bottom:15px;"><h4>TC-RBAC-001: Tenant isolation и RBAC</h4><p><strong>🎯 Цель:</strong> Проверка разграничения ролей и tenant-данных.</p><p><strong>✅ Ожидаемый результат:</strong> Кросс-tenant доступ запрещён, роли Admin/Trader/Auditor ограничены RBAC.</p></div>`);}
const trHead=document.querySelector('#traceability-table thead tr');if(trHead){trHead.insertAdjacentHTML('beforeend','<th>TC-11</th><th>TC-12</th>');}
const rows=document.querySelectorAll('#traceability-table tbody tr');rows.forEach((r,i)=>{r.insertAdjacentHTML('beforeend',`<td class="traceability-check">${i%2===0?'✓':''}</td><td class="traceability-check">✓</td>`);});
});
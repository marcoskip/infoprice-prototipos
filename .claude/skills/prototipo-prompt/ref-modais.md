# Modais — Producao vs Prototipo

Mapeamento dos componentes de modal do `app.infoprice.co`.

**Fonte producao:** `src/components/DesignSystemSpecialModal/`, `src/pages/IPA/RevisaoPrecos/Components/ModalsWrapper.tsx`

---

## DesignSystemSpecialModal (compound)

**React:** Modal padrao do Design System com subcomponentes
**Prototipo:** Modal HTML com overlay

### Subcomponentes

| React | Prototipo | Descricao |
|---|---|---|
| `DesignSystemSpecialModal.Root` | `.modal-overlay` + `.modal` | Container + overlay |
| `.Header` | `.modal__header` | Cabecalho com titulo e close |
| `.Icon` | Icone no header | Icone contextual |
| `.Title` | `.modal__title` | Titulo h6 |
| `.Body` | `.modal__body` | Conteudo principal |
| `.Content` | `.modal__content` | Texto do corpo |
| `.Footer` | `.modal__footer` | Botoes de acao |

### HTML no prototipo

```html
<!-- Overlay -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <div class="modal__header">
      <h6 class="modal__title">Titulo do Modal</h6>
      <button class="modal__close">
        <span class="material-icons-outlined">close</span>
      </button>
    </div>
    <div class="modal__body">
      <p class="modal__content">Conteudo do modal.</p>
    </div>
    <div class="modal__footer">
      <button class="modal__btn modal__btn--secondary">Cancelar</button>
      <button class="modal__btn modal__btn--primary">Confirmar</button>
    </div>
  </div>
</div>
```

### CSS sugerido

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--color-white);
  border-radius: 6px;
  box-shadow: 0px 4px 4px rgba(0,0,0,0.12), 0px 0px 10px rgba(0,0,0,0.06);
  min-width: 400px;
  max-width: 600px;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-gray-300);
}

.modal__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-gray-900);
}

.modal__body { padding: 20px; }

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--color-gray-300);
}
```

---

## Modais do Gerenciador de Precos

| Modal React | Funcao | Quando abre |
|---|---|---|
| `PriceCompositionModal` | Mostra composicao da regra de preco | Click no preco sugerido |
| `RuleCompositionModal` | Detalha a logica da regra aplicada | Link na composicao |
| `PriceEventHistoryModal` | Historico de alteracoes de preco | Menu de contexto |
| `DemandForecastModal` | Previsao de demanda detalhada | Click na previsao |
| `ChangePricesModal` | Alteracao em massa de precos | Botao "Alterar preco" (com selecao) |
| `SaveFiltersModal` | Salvar configuracao de filtros | Botao "Filtros salvos" |
| `DeleteFilterModal` | Confirmar exclusao de filtro | Dentro de SaveFilters |
| `ModalOptimizationSummary` | Resumo de otimizacao | Apos otimizacao de precos |
| `RuleCompositionOfferModal` | Regra de oferta | Similar ao RuleComposition |

---

## Boas praticas para modais no prototipo

1. Sempre usar overlay escuro (rgba 0,0,0,0.4)
2. Modal centralizado vertical e horizontalmente
3. Botao de fechar (X) no header
4. ESC fecha o modal
5. Click no overlay fecha o modal
6. Footer com botoes: secundario (esquerda/cancelar) + primario (direita/confirmar)
7. Botao primario em `--color-blue-400` (regra do DS)
8. z-index: 100 (acima de tudo)

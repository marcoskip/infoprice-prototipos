# Fase 3 — Componentes React canonicos do DS

Status: 5 de 5 componentes prioritarios escritos. Build passou.

## O que foi feito

5 arquivos `.react.tsx` foram escritos como **fonte canonica React** dos
componentes complexos com estado. A skill `/handoff` agora aplica
`STRATEGY=lookup` (importa o componente direto) em vez de auto-converter o
HTML toda vez.

| Componente              | Path                                                                         |
| ----------------------- | ---------------------------------------------------------------------------- |
| `modal`                 | `design-system/components/compound/modal/modal.react.tsx`                    |
| `toast`                 | `design-system/components/compound/toast/toast.react.tsx`                    |
| `header-dropdowns`      | `design-system/components/compound/header-dropdowns/header-dropdowns.react.tsx` |
| `select-picker`         | `design-system/components/basic/select-picker/select-picker.react.tsx`       |
| `date-picker`           | `design-system/components/basic/date-picker/date-picker.react.tsx`           |

Todos seguem:
- TypeScript estrito com tipos exportados (props, opcoes, etc.)
- Classes BEM identicas as do DS (consumem `tokens.css` + `styles.css` via `<head>`)
- `clsx` para classNames condicionais
- Hooks no top-level (regras de hooks respeitadas)
- ESC key + click fora fecha (onde aplicavel)
- Body scroll lock onde necessario (modal)
- Sem dependencias externas alem de `react`, `react-dom`, `clsx`

## Decisoes arquiteturais

### Modal

- **createPortal pra `document.body`**: evita conflitos de z-index/overflow com containers ancestrais.
- **Controlado externamente** (`isOpen` + `onClose`): consumer mantem state.
- **Body scroll lock via `document.body.style.overflow`** quando aberto.
- **Tamanhos via prop `size`**: small (400px) / medium (600px, default) / large (800px). Mapeia pra `.modal--small`/`.modal--large` do DS.
- **Footer e title sao opcionais**: header so renderiza se tem title OU se nao escondeu o close button.
- **`disableDismiss` prop** pra modais criticos (ex: confirmacao de pagamento) que nao devem fechar com ESC/backdrop.

### Toast

- **API global tipo react-toastify**: `toast.success({...})` em qualquer lugar, sem precisar passar Context.
- **Store sem React Context**: `Set<listener>` + `useSyncExternalStore` no container. Mais leve que Context, evita re-renders desnecessarios.
- **Container montado 1x na raiz** (`<ToastContainer />`).
- **Auto-dismiss** via `setTimeout`, configuravel por toast (default 5000ms; passar `duration: 0` desabilita).
- **createPortal pra body** — `.toast-container` ja tem `position: fixed; top: 80px; right: 24px; z-index: 9999` no DS.
- **Variante `short`** omite title + close button + action (so body, igual ao showcase).

### Header dropdowns

- **2 componentes separados** (`<ProductDropdown>` + `<UserDropdown>`) + 1 hook (`useHeaderDropdowns`).
- O hook gerencia "**so um aberto por vez**" + closeAll + ESC + click fora.
- Hook expoe `triggerRef` que o consumer attacha no container dos botoes-trigger pra distinguir click no trigger vs click fora.
- `UserDropdown` recebe `groups: UserDropdownGroup[]` — cada grupo vira `.user-dropdown__group` separado por `.dropdown__divider`.
- `ProductDropdown` recebe `products: ProductItem[]` com tag/variant flexiveis.

### SelectPicker

- **Single OU multiple via discriminated union**: `multiple: false` => `value: V | null` + `onChange: (v|null) => void`. `multiple: true` => `value: V[]` + `onChange: (v[]) => void`. TypeScript resolve no compile-time.
- **Generic over `V extends string | number`**: tipa direito `value`/`onChange`.
- **Search opcional** via `searchable` prop. Filtra `searchText ?? label-as-string ?? value-as-string`.
- **Single fecha ao selecionar**, multi mantem aberto pra continuar marcando.
- **Foco automatico no search input ao abrir** (UX importante).

### DatePicker

- **Sem libs externas** — usa Date built-in. Helpers internos (`isSameDay`, `isInRange`, `buildCalendarGrid`).
- **Single OU range** via discriminated union.
- **Grid 6x7 sempre** (42 celulas) — preenche com dias do mes anterior/proximo, marcados `--other-month`.
- **Range UX**:
  - Click 1: define start, end fica null
  - Click 2: define end (ou inverte se anterior ao start)
  - Click 3: novo range
  - Click no mesmo dia limpa
- **Locale via prop**: `monthNames` e `weekdayLabels` configuraveis. Default Portuguese (`Janeiro`...`Dezembro`, `D S T Q Q S S`).
- **`isDisabled(date)` callback** pra regras customizadas (ex: bloquear fins de semana).
- **`minDate` e `maxDate`** pra restringir range globalmente.

## O que NAO foi feito

### Componentes de prioridade Media/Baixa (Fase 3.2)

Continuam usando `STRATEGY=convert` (auto-conversao). Lista que pode ser escrita
em sessoes futuras:

| Prioridade | Componente | Motivo pra ter `.react.tsx` |
|------------|------------|-----------------------------|
| Media      | `sidebar`  | Toggle expand/collapse + ajuste de `left` em outras secoes |
| Media      | `filtro-dropdowns` | 6 padroes diferentes (search, paste-list, select-all, group-collapse, empty, simple-checkbox) |
| Media      | `grid-pagination`  | Nav prev/next/first/last + page state + indicator |
| Baixa      | `filtro-chips`     | Toggle simples — auto-conversao serve bem |
| Baixa      | `composed-buttons` | Toolbar do cabecalho — estado simples |

### Validacao TypeScript completa

Os 5 arquivos foram escritos com cuidado mas **nao foram compilados via `tsc`**.
Pode haver erros de tipo sutis (ex: variancia de generics) que so aparecem no
primeiro consumer. Pra validar:

```bash
# Copiar os 5 arquivos pro test-tela-fornecedores/src/ds/
# Configurar tsconfig.app.json paths
# Rodar:
cd test-tela-fornecedores && npx tsc -b --noEmit
```

### Atualizacao do `dist/`

O `build.js` atual concat so os `.css`. Os `.react.tsx` ficam onde estao
(consumidos diretamente via path no projeto consumidor). Quando a equipe
quiser publicar como pacote npm, ai sim precisaria de um build TypeScript
em `dist/`. Por enquanto, **path-based import** e o caminho mais simples.

## Como o `/handoff` muda daqui pra frente

Antes (Fase 2): para um prototipo HTML usando `<div class="modal-backdrop">`,
o handoff fazia auto-conversao gigante com toda a logica inline.

Agora (Fase 3): o handoff detecta `class="modal-backdrop"`, faz
`Glob design-system/components/*/modal/modal.react.tsx`, encontra,
e gera:

```tsx
import Modal from '../design-system/components/compound/modal/modal.react';

const [confirmOpen, setConfirmOpen] = useState(false);

<Modal
  isOpen={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  title="Confirmar acao"
  footer={<>
    <button className="btn btn--secondary-ghost" onClick={() => setConfirmOpen(false)}>Cancelar</button>
    <button className="btn btn--primary" onClick={confirm}>Confirmar</button>
  </>}
>
  Conteudo aqui...
</Modal>
```

Resultado: codigo mais limpo, comportamento testado, props tipadas.

## Pontos para revisao

- **API dos componentes**: revisar se as props expostas batem com o que voces
  vao usar na producao. Posso ajustar prop names, defaults ou adicionar
  novas variantes.
- **Path de import**: hoje cada projeto consumidor usa path relativo
  (`../design-system/components/...`). Considerar criar tsconfig path alias
  (`@ds/*`) ou empacotar como npm interno futuramente.
- **`react-guide.html`**: o documento atual descrevia padroes gerais
  (clsx, hooks, createPortal). Vale atualiza-lo pra apontar pra esses 5 componentes
  como exemplos canonicos do que a equipe deve escrever quando promover novos
  componentes da Fase 3.2.

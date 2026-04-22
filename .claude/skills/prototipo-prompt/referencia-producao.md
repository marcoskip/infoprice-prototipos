# Referencia de Producao — app.infoprice.co

Mapeamento modular entre os componentes React de producao e a implementacao HTML dos prototipos.
Repositorio: `app.infoprice.co/` (React 18 + TypeScript + RSuite + Redux)

---

## Indice de Referencia

Cada categoria esta documentada em um arquivo separado. Consulte o arquivo relevante conforme o componente que esta implementando:

| Arquivo | Conteudo |
|---|---|
| [ref-tokens.md](ref-tokens.md) | Cores (32 tokens), tipografia (11 classes), layout, sombras, border-radius |
| [ref-botoes.md](ref-botoes.md) | ButtonPrimary (7 skins, 4 sizes), ButtonSecondary, LinkButton, Aplicar Preco split button |
| [ref-filtros.md](ref-filtros.md) | CheckPill, SelectPill, AsyncCheckPill, estados, inventario completo de filtros do Gerenciador |
| [ref-tabela.md](ref-tabela.md) | InfoTable, 15 colunas com larguras, header cells (sort + pref), paginacao, expanded rows |
| [ref-inputs.md](ref-inputs.md) | CurrencyInput, CustomNumberInput, skins (gray/blue/red), interacoes, regra de largura |
| [ref-data-display.md](ref-data-display.md) | BigNumbersBox (7 KPIs), PercentageIndicator, CostIndicator (5 niveis), TableBadge, Chip, Tag |
| [ref-navegacao.md](ref-navegacao.md) | Header (NavBar), Sidebar (5 modulos), Title Bar, Cabecalho, Layout |
| [ref-modais.md](ref-modais.md) | DesignSystemSpecialModal, 9 modais do Gerenciador, boas praticas |
| [ref-gerenciador.md](ref-gerenciador.md) | Hierarquia completa da pagina, quick action filters, estados Redux, sort keys, fluxo de dados |

---

## Como usar

1. Ao implementar um componente, identifique a categoria e leia o arquivo correspondente
2. Para uma visao geral da pagina completa, comece por `ref-gerenciador.md`
3. Para tokens e cores, consulte `ref-tokens.md` antes de qualquer implementacao
4. Para entender como um componente React se traduz em HTML/CSS, consulte o arquivo da categoria

import { useState, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';

// ─── Tipos ──────────────────────────────────────────────────────
type StatusKey = 'ativo' | 'pendente' | 'inativo';

type Fornecedor = {
  empresa: string;
  cnpj: string;
  repNome: string;
  repEmail: string;
  status: StatusKey;
  negociacoes: number;
  ultima: string;
};

type UltimaKey = 'hoje' | '7d' | '30d' | '3m' | 'antigo';

// ─── Mock data (extraido do prototipo — substituir por API real) ────
const FORNECEDORES: Fornecedor[] = [
  { empresa: 'Coca-Cola FEMSA',   cnpj: '16.670.085/0001-55', repNome: 'Ricardo Lima',     repEmail: 'ricardo.lima@cocacola.com.br',    status: 'ativo',    negociacoes: 3, ultima: 'há 2 dias' },
  { empresa: 'Unilever Brasil',   cnpj: '61.068.276/0001-02', repNome: 'Patrícia Moura',   repEmail: 'patricia.moura@unilever.com',     status: 'ativo',    negociacoes: 1, ultima: 'há 5 dias' },
  { empresa: 'Nestlé Brasil',     cnpj: '60.409.075/0001-52', repNome: 'João Fernandes',   repEmail: 'joao.fernandes@nestle.com.br',    status: 'pendente', negociacoes: 0, ultima: 'enviado há 3 dias' },
  { empresa: 'M. Dias Branco',    cnpj: '07.206.816/0001-15', repNome: 'Ana Souza',        repEmail: 'ana.souza@mdiasbranco.com.br',    status: 'ativo',    negociacoes: 2, ultima: 'há 1 semana' },
  { empresa: 'BRF S/A',           cnpj: '01.838.723/0001-27', repNome: '',                 repEmail: '',                                status: 'pendente', negociacoes: 0, ultima: 'enviado hoje' },
  { empresa: 'Pif Paf',           cnpj: '19.791.896/0001-10', repNome: 'Carlos Mendes',    repEmail: 'carlos.mendes@pifpaf.com.br',     status: 'inativo',  negociacoes: 0, ultima: 'há 3 meses' },
  { empresa: 'Ambev',             cnpj: '02.808.708/0001-07', repNome: 'Luísa Reis',       repEmail: 'luisa.reis@ambev.com.br',         status: 'ativo',    negociacoes: 4, ultima: 'há 1 dia' },
  { empresa: 'Seara Alimentos',   cnpj: '02.914.460/0001-50', repNome: 'Bruno Tavares',    repEmail: 'bruno.tavares@seara.com.br',      status: 'ativo',    negociacoes: 2, ultima: 'há 4 dias' },
  { empresa: 'JBS Foods',         cnpj: '02.916.265/0001-60', repNome: 'Camila Rocha',     repEmail: 'camila.rocha@jbs.com.br',         status: 'pendente', negociacoes: 0, ultima: 'enviado há 1 dia' },
  { empresa: 'Perdigão',          cnpj: '16.439.708/0001-30', repNome: 'Eduardo Lima',     repEmail: 'eduardo.lima@perdigao.com.br',    status: 'inativo',  negociacoes: 1, ultima: 'há 2 meses' },
  { empresa: 'Sadia',             cnpj: '20.730.099/0001-94', repNome: 'Marina Pires',     repEmail: 'marina.pires@sadia.com.br',       status: 'ativo',    negociacoes: 5, ultima: 'há 6 horas' },
  { empresa: 'Marilan',           cnpj: '50.726.600/0001-20', repNome: 'Renato Alves',     repEmail: 'renato.alves@marilan.com.br',     status: 'ativo',    negociacoes: 1, ultima: 'há 2 semanas' },
  { empresa: 'Friboi',            cnpj: '02.916.265/0050-31', repNome: 'Tiago Martins',    repEmail: 'tiago.martins@friboi.com.br',     status: 'ativo',    negociacoes: 2, ultima: 'há 3 dias' },
  { empresa: 'Aurora Alimentos',  cnpj: '83.018.945/0001-77', repNome: 'Beatriz Costa',    repEmail: 'beatriz.costa@aurora.com.br',     status: 'pendente', negociacoes: 0, ultima: 'enviado há 2 dias' },
  { empresa: 'Vigor',             cnpj: '13.324.184/0001-97', repNome: 'Felipe Cardoso',   repEmail: 'felipe.cardoso@vigor.com.br',     status: 'ativo',    negociacoes: 3, ultima: 'há 1 dia' },
  { empresa: 'Itambé',            cnpj: '63.453.598/0001-14', repNome: 'Mariana Oliveira', repEmail: 'mariana.oliveira@itambe.com.br',  status: 'inativo', negociacoes: 0, ultima: 'há 5 meses' },
  { empresa: 'Camil Alimentos',   cnpj: '64.904.295/0001-03', repNome: 'Diego Ramos',      repEmail: 'diego.ramos@camil.com.br',        status: 'ativo',    negociacoes: 1, ultima: 'há 1 mês' },
  { empresa: 'Heinz Brasil',      cnpj: '13.575.928/0001-30', repNome: 'Letícia Almeida',  repEmail: 'leticia.almeida@heinz.com.br',    status: 'pendente', negociacoes: 0, ultima: 'enviado há 4 dias' },
  { empresa: 'Tirol Laticínios',  cnpj: '83.026.401/0001-09', repNome: 'Roberta Pinheiro', repEmail: 'roberta.pinheiro@tirol.com.br',   status: 'ativo',    negociacoes: 2, ultima: 'há 6 dias' },
  { empresa: 'Bauducco',          cnpj: '60.394.475/0001-26', repNome: 'Henrique Moraes',  repEmail: 'henrique.moraes@bauducco.com.br', status: 'ativo',    negociacoes: 4, ultima: 'há 2 dias' },
];

const STATUS_BADGE: Record<StatusKey, { cls: string; label: string }> = {
  ativo:    { cls: 'badge--filled badge--green',  label: 'Ativo' },
  pendente: { cls: 'badge--filled badge--orange', label: 'Convite pendente' },
  inativo:  { cls: 'badge--filled badge--gray',   label: 'Inativo' },
};

const STATUS_LABELS: Record<StatusKey, string> = {
  ativo: 'Ativo',
  pendente: 'Convite pendente',
  inativo: 'Inativo',
};

const ULTIMA_LABELS: Record<UltimaKey, string> = {
  hoje: 'Hoje',
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  '3m': 'Últimos 3 meses',
  antigo: 'Mais antigo',
};

const ASSETS_BASE = 'https://infoprice.github.io/produto-ux/DSBridge/assets';

// Heuristica do filtro "Última negociação"
function matchUltima(f: Fornecedor, key: UltimaKey | null): boolean {
  if (!key) return true;
  const u = f.ultima.toLowerCase();
  switch (key) {
    case 'hoje':   return u.includes('hoje') || u.includes('horas');
    case '7d':     return u.includes('horas') || u.includes('hoje') || /há \d+ dia/.test(u) || u.includes('1 semana') || /enviado.*\d+ dia/.test(u);
    case '30d':    return !u.includes('mês') && !u.includes('mes') && !u.includes('meses');
    case '3m':     return !u.includes('5 meses') && !u.includes('6 meses') && !u.includes('7 meses');
    case 'antigo': return u.includes('mês') || u.includes('meses');
  }
}

// ─── Componente ─────────────────────────────────────────────────
export default function TelaFornecedores() {
  // Estado de filtros
  const [statusFilters, setStatusFilters] = useState<Set<StatusKey>>(new Set());
  const [ultima, setUltima] = useState<UltimaKey | null>(null);
  const [search, setSearch] = useState('');

  // Estado de UI
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [chipStatusOpen, setChipStatusOpen] = useState(false);
  const [chipUltimaOpen, setChipUltimaOpen] = useState(false);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [kebabPos, setKebabPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Selecao de linhas
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const checkAllRef = useRef<HTMLInputElement>(null);

  // Lista filtrada (derivada do estado)
  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    return FORNECEDORES.filter(f => {
      if (statusFilters.size > 0 && !statusFilters.has(f.status)) return false;
      if (!matchUltima(f, ultima)) return false;
      if (s && !f.empresa.toLowerCase().includes(s) && !f.cnpj.includes(s)) return false;
      return true;
    });
  }, [statusFilters, ultima, search]);

  const ativos = filtered.filter(f => f.status === 'ativo').length;
  const pendentes = filtered.filter(f => f.status === 'pendente').length;

  // Master checkbox: indeterminate state via ref
  useEffect(() => {
    if (!checkAllRef.current) return;
    const total = filtered.length;
    const checked = selectedRows.size;
    checkAllRef.current.checked = total > 0 && checked === total;
    checkAllRef.current.indeterminate = checked > 0 && checked < total;
  }, [selectedRows, filtered.length]);

  // Reset selecao quando filtro muda
  useEffect(() => { setSelectedRows(new Set()); }, [statusFilters, ultima, search]);

  // Fecha tudo (utility)
  const closeAll = () => {
    setChipStatusOpen(false);
    setChipUltimaOpen(false);
    setKebabOpen(false);
  };

  // Click fora fecha dropdowns
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.filtro-dropdown, .filtro-chip, .grid__pref-dropdown, [data-kebab]')) {
        closeAll();
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Handlers de filtros
  const toggleStatus = (key: StatusKey) => {
    setStatusFilters(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const statusLabel = useMemo(() => {
    if (statusFilters.size === 0) return 'Todos';
    if (statusFilters.size === 1) return STATUS_LABELS[[...statusFilters][0]];
    return `${statusFilters.size} selecionados`;
  }, [statusFilters]);

  // Toggle de selecao de linha
  const toggleRow = (cnpj: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(cnpj)) next.delete(cnpj);
      else next.add(cnpj);
      return next;
    });
  };

  const toggleAllRows = (checked: boolean) => {
    setSelectedRows(checked ? new Set(filtered.map(f => f.cnpj)) : new Set());
  };

  // Kebab: abre proximo ao botao clicado
  const openKebab = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (kebabOpen) {
      closeAll();
      return;
    }
    closeAll();
    const r = e.currentTarget.getBoundingClientRect();
    const dropW = 200;
    setKebabPos({ top: r.bottom + 4, left: Math.max(8, r.right - dropW) });
    setKebabOpen(true);
  };

  const handleKebabAction = (action: string) => {
    // TODO: plugar acoes reais (ver detalhes, editar, etc.)
    console.log('Acao kebab:', action);
    closeAll();
  };

  // Sidebar toggle: ajusta `left` das secoes via inline style
  const sectionLeft = sidebarExpanded ? '220px' : '52px';

  // ─── Render ──────────────────────────────────────────────────
  return (
    <>
      {/* CSS page-specific (foi inline no prototipo HTML; mantido aqui pra paridade visual) */}
      <style>{`
        .filtros   { top: 104px; }
        .cabecalho { top: 238px; }
        .grid      { top: 306px; }

        .sidebar__item--active {
          background: var(--color-blue-light-5);
          color: var(--color-blue-400);
        }
        .sidebar__item--active .sidebar__icon {
          filter: brightness(0) saturate(100%) invert(38%) sepia(91%) saturate(1542%) hue-rotate(195deg) brightness(96%) contrast(91%);
        }

        .filtros .searchbar { width: 320px; }

        .grid__empresa-name {
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          color: var(--color-gray-900);
        }
        .grid__rep-name {
          display: block;
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          color: var(--color-gray-900);
          line-height: var(--line-height-md);
        }
        .grid__rep-email {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-regular);
          color: var(--color-gray-600);
          line-height: var(--line-height-sm);
        }
        .grid__rep-empty {
          color: var(--color-gray-500);
          font-weight: var(--font-weight-regular);
        }
        .grid__neg-count {
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          color: var(--color-gray-900);
        }
        .grid__last-activity {
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-regular);
          color: var(--color-gray-700);
        }

        .cabecalho__export.btn--small .material-icons-outlined { font-size: 16px; }

        .kebab-floating {
          position: fixed;
          min-width: 200px;
        }
        .kebab-floating .grid__pref-dropdown__item {
          cursor: pointer;
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header__left">
          <button className="header__menu-btn" aria-label="Menu de produtos">
            <span className="material-icons-outlined">apps</span>
          </button>
          <div className="header__brand">
            <img className="header__logo" src={`${ASSETS_BASE}/logo-principal.svg`} alt="InfoPrice" />
            <div className="header__divider" aria-hidden="true"></div>
            <span className="header__product-name">IPA | Software de Precificação</span>
          </div>
        </div>
        <div className="header__right">
          <button className="header__help-btn" aria-label="Ajuda">
            <span className="material-icons-outlined">help_outline</span>
          </button>
          <div className="header__user">
            <span className="header__user-name">Olá, Marcus</span>
            <span className="material-icons-outlined">keyboard_arrow_down</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={clsx('sidebar', sidebarExpanded && 'is-expanded')} id="sidebar">
        <div className="sidebar__top">
          <div className="sidebar__item">
            <img src={`${ASSETS_BASE}/gerenciador-symbol.svg`} alt="" className="sidebar__icon" />
            <span className="sidebar__label">Gerenciador</span>
          </div>
          <div className="sidebar__item">
            <img src={`${ASSETS_BASE}/estrategia-symbol.svg`} alt="" className="sidebar__icon" />
            <span className="sidebar__label">Estratégia</span>
          </div>
          <div className="sidebar__item sidebar__item--active">
            <img src={`${ASSETS_BASE}/negociacoes-symbol.svg`} alt="" className="sidebar__icon" />
            <span className="sidebar__label">Negociações Fornecedor</span>
            <span className="material-icons-outlined sidebar__item-chevron">keyboard_arrow_right</span>
          </div>
          <div className="sidebar__item">
            <img src={`${ASSETS_BASE}/extracao-symbol.svg`} alt="" className="sidebar__icon" />
            <span className="sidebar__label">Extração de preços</span>
          </div>
          <div className="sidebar__item">
            <img src={`${ASSETS_BASE}/IA-symbol.svg`} alt="" className="sidebar__icon" />
            <span className="sidebar__label">Precifique com IA</span>
          </div>
        </div>
        <div className="sidebar__bottom">
          <button
            className={clsx('sidebar__seta', sidebarExpanded && 'is-flipped')}
            aria-label={sidebarExpanded ? 'Recolher menu' : 'Expandir menu'}
            onClick={() => setSidebarExpanded(e => !e)}
          >
            <span className="material-icons-outlined">keyboard_arrow_right</span>
          </button>
        </div>
      </aside>

      {/* Title bar */}
      <section className="title-bar" style={{ left: sectionLeft }}>
        <div className="title-bar__left">
          <span className="title-bar__heading">Fornecedores</span>
        </div>
        <div className="title-bar__right">
          <button className="btn btn--small btn--primary">
            <span className="material-icons-outlined">add</span>
            <span>Convidar fornecedor</span>
          </button>
        </div>
      </section>

      {/* Filtros */}
      <section className="filtros" style={{ left: sectionLeft }}>
        <div className="filtros__inner">
          <div className="filtros__box">
            <div className="filtros__left">
              <div className="filtros__row">
                <div className={clsx('searchbar', search !== '' && 'has-value')}>
                  <span className="material-icons-outlined searchbar__icon">search</span>
                  <input
                    type="text"
                    className="searchbar__input"
                    placeholder="Buscar por nome ou CNPJ..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button
                    className="searchbar__clear"
                    aria-label="Limpar"
                    onClick={() => setSearch('')}
                  >
                    <span className="material-icons-outlined">close</span>
                  </button>
                </div>

                {/* Chip Status */}
                <div className="filtro-chip-wrapper">
                  <button
                    className={clsx('filtro-chip', chipStatusOpen && 'is-open')}
                    aria-expanded={chipStatusOpen}
                    onClick={(e) => {
                      e.stopPropagation();
                      const wasOpen = chipStatusOpen;
                      closeAll();
                      if (!wasOpen) setChipStatusOpen(true);
                    }}
                  >
                    <span className="filtro-chip__prefix">Status:</span>
                    <span>{statusLabel}</span>
                    <span className="material-icons-outlined filtro-chip__chevron">keyboard_arrow_down</span>
                  </button>
                  <div className={clsx('filtro-dropdown', chipStatusOpen && 'is-open')}>
                    <div className="filtro-dropdown__list">
                      {(['ativo', 'pendente', 'inativo'] as StatusKey[]).map(key => (
                        <label key={key} className="filtro-dropdown__item">
                          <input
                            type="checkbox"
                            checked={statusFilters.has(key)}
                            onChange={() => toggleStatus(key)}
                          />
                          <span>{STATUS_LABELS[key]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chip Última negociação */}
                <div className="filtro-chip-wrapper">
                  <button
                    className={clsx('filtro-chip', chipUltimaOpen && 'is-open')}
                    aria-expanded={chipUltimaOpen}
                    onClick={(e) => {
                      e.stopPropagation();
                      const wasOpen = chipUltimaOpen;
                      closeAll();
                      if (!wasOpen) setChipUltimaOpen(true);
                    }}
                  >
                    <span>{ultima ? ULTIMA_LABELS[ultima] : 'Última negociação'}</span>
                    <span className="material-icons-outlined filtro-chip__chevron">keyboard_arrow_down</span>
                  </button>
                  <div className={clsx('filtro-dropdown', chipUltimaOpen && 'is-open')}>
                    <div className="filtro-dropdown__list">
                      {(Object.keys(ULTIMA_LABELS) as UltimaKey[]).map(key => (
                        <label key={key} className="filtro-dropdown__item">
                          <input
                            type="radio"
                            name="ultima"
                            checked={ultima === key}
                            onChange={() => setUltima(key)}
                          />
                          <span>{ULTIMA_LABELS[key]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cabecalho */}
      <section className="cabecalho" style={{ left: sectionLeft }}>
        <div className="cabecalho__inner">
          <span className="cabecalho__info">
            <b>{filtered.length}</b> fornecedores · <b>{ativos}</b> ativos · <b>{pendentes}</b> convites pendentes
          </span>
          <div className="cabecalho__buttons">
            <button className="btn btn--small btn--secondary btn--white cabecalho__export">
              <span className="material-icons-outlined">file_download</span>
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="grid" style={{ left: sectionLeft }}>
        <div className="grid__wrapper">
          <table className="grid__table">
            <colgroup>
              <col style={{ width: '40px' }} />
              <col />
              <col style={{ width: '160px' }} />
              <col style={{ width: '240px' }} />
              <col style={{ width: '160px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '160px' }} />
              <col style={{ width: '96px' }} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <input
                    ref={checkAllRef}
                    type="checkbox"
                    className="grid__check"
                    aria-label="Selecionar todos"
                    onChange={(e) => toggleAllRows(e.target.checked)}
                  />
                </th>
                <th><div className="grid__th-content"><span>Empresa</span></div></th>
                <th><div className="grid__th-content"><span>CNPJ</span></div></th>
                <th><div className="grid__th-content"><span>Representante</span></div></th>
                <th><div className="grid__th-content"><span>Status</span></div></th>
                <th><div className="grid__th-content"><span>Negociações</span></div></th>
                <th><div className="grid__th-content"><span>Última ativ.</span></div></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => {
                const badge = STATUS_BADGE[f.status];
                return (
                  <tr key={f.cnpj}>
                    <td>
                      <input
                        type="checkbox"
                        className="grid__check"
                        aria-label={`Selecionar ${f.empresa}`}
                        checked={selectedRows.has(f.cnpj)}
                        onChange={() => toggleRow(f.cnpj)}
                      />
                    </td>
                    <td><span className="grid__empresa-name">{f.empresa}</span></td>
                    <td>{f.cnpj}</td>
                    <td>
                      {f.repNome ? (
                        <>
                          <span className="grid__rep-name">{f.repNome}</span>
                          <span className="grid__rep-email">{f.repEmail}</span>
                        </>
                      ) : (
                        <span className="grid__rep-empty">—</span>
                      )}
                    </td>
                    <td><span className={clsx('badge', badge.cls)}>{badge.label}</span></td>
                    <td><span className="grid__neg-count">{f.negociacoes}</span></td>
                    <td><span className="grid__last-activity">{f.ultima}</span></td>
                    <td>
                      <button
                        className="btn btn--link btn--small"
                        data-kebab
                        onClick={openKebab}
                      >
                        <span>Ações</span>
                        <span className="material-icons-outlined">keyboard_arrow_down</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Paginação */}
          <div className="grid__pagination">
            <div className="grid__pagination-left">
              <span className="grid__pagination-val">{filtered.length}</span>
              <span className="material-icons-outlined">expand_less</span>
              <span className="grid__pagination-label">/ página</span>
              <span className="grid__pagination-sep"></span>
              <span className="grid__pagination-label">total: {filtered.length}</span>
            </div>
            <div className="grid__pagination-right">
              <div className="grid__pagination-nav">
                <span className="material-icons-outlined">first_page</span>
                <span className="material-icons-outlined">chevron_left</span>
              </div>
              <button className="grid__pagination-btn is-active">1</button>
              <div className="grid__pagination-nav">
                <span className="material-icons-outlined">chevron_right</span>
                <span className="material-icons-outlined">last_page</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kebab dropdown — flutuante, posicionado via state */}
      {kebabOpen && (
        <div
          className="grid__pref-dropdown is-open kebab-floating"
          role="menu"
          style={{ top: kebabPos.top, left: kebabPos.left }}
        >
          <div className="grid__pref-dropdown__item" onClick={() => handleKebabAction('ver')}>
            <span className="material-icons-outlined" style={{ fontSize: 16 }}>visibility</span>
            <span>Ver detalhes</span>
          </div>
          <div className="grid__pref-dropdown__item" onClick={() => handleKebabAction('editar')}>
            <span className="material-icons-outlined" style={{ fontSize: 16 }}>edit</span>
            <span>Editar fornecedor</span>
          </div>
          <div className="grid__pref-dropdown__item" onClick={() => handleKebabAction('convidar')}>
            <span className="material-icons-outlined" style={{ fontSize: 16 }}>send</span>
            <span>Nova negociação</span>
          </div>
          <div className="grid__pref-dropdown__item" onClick={() => handleKebabAction('historico')}>
            <span className="material-icons-outlined" style={{ fontSize: 16 }}>history</span>
            <span>Histórico</span>
          </div>
          <div
            className="grid__pref-dropdown__item"
            style={{ color: 'var(--color-red-600)' }}
            onClick={() => handleKebabAction('desativar')}
          >
            <span className="material-icons-outlined" style={{ fontSize: 16 }}>block</span>
            <span>Desativar</span>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Header dropdowns — InfoPrice DS
 *
 * Dois dropdowns canonicos do header IPA:
 * - ProductDropdown: lista de produtos InfoPrice (ISA, IPA, etc.)
 * - UserDropdown: identidade do usuario logado + acoes (Configuracoes, Sair, etc.)
 *
 * Inclui hook `useHeaderDropdowns` que gerencia "so um aberto por vez"
 * + closeAll automatico no click fora.
 *
 * Markup canonico: design-system/components/compound/header-dropdowns/header-dropdowns.html
 *
 * Uso:
 *
 *   const dropdowns = useHeaderDropdowns();
 *
 *   <header className="header">
 *     <button onClick={dropdowns.toggleProduct} aria-expanded={dropdowns.productOpen}>...</button>
 *     <ProductDropdown isOpen={dropdowns.productOpen} products={PRODUCTS} onClose={dropdowns.closeAll} />
 *     <button onClick={dropdowns.toggleUser} aria-expanded={dropdowns.userOpen}>...</button>
 *     <UserDropdown isOpen={dropdowns.userOpen} user={user} onClose={dropdowns.closeAll} groups={USER_GROUPS} />
 *   </header>
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';

// ─── ProductDropdown ─────────────────────────────────────────────

export type ProductTag = 'ipa-active' | 'isa-active' | 'disabled';

export type ProductItem = {
  id: string;
  name: ReactNode;
  tag: string;          // texto da tag, ex: "IPA", "ISA"
  variant: ProductTag;  // estilo da tag
  disabled?: boolean;
  href?: string;        // link opcional
  onClick?: () => void; // ou handler
};

export type ProductDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  title?: ReactNode; // default "Produtos"
  /** className extra opcional */
  className?: string;
};

export function ProductDropdown({
  isOpen,
  onClose,
  products,
  title = 'Produtos',
  className,
}: ProductDropdownProps) {
  if (!isOpen) return null;

  return (
    <div
      className={clsx('dropdown', 'product-dropdown', 'is-open', className)}
      role="menu"
    >
      <div className="product-dropdown__header">
        <span className="product-dropdown__title">{title}</span>
      </div>
      <div className="product-dropdown__list">
        {products.map((p) => {
          const onItemClick = () => {
            if (p.disabled) return;
            p.onClick?.();
            onClose();
          };
          return (
            <div
              key={p.id}
              className={clsx(
                'product-dropdown__item',
                p.disabled && 'product-dropdown__item--disabled'
              )}
              role="menuitem"
              aria-disabled={p.disabled || undefined}
              tabIndex={p.disabled ? -1 : 0}
              onClick={onItemClick}
              onKeyDown={(e) => {
                if (p.disabled) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onItemClick();
                }
              }}
            >
              <span className={clsx('product-tag', `product-tag--${p.variant}`)}>{p.tag}</span>
              <span className="product-dropdown__item-name">{p.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── UserDropdown ────────────────────────────────────────────────

export type UserDropdownItem = {
  id: string;
  label: ReactNode;
  /** Material Icon outlined name; omit em items text-only */
  icon?: string;
  /** Mostra um badge ao lado do label (ex: "Convidar") */
  badge?: ReactNode;
  /** true = sem icone, estilo text-only (Sair, Termos) */
  textOnly?: boolean;
  onClick?: () => void;
};

export type UserDropdownGroup = {
  /** Lista de itens. Cada grupo e separado por <hr class="dropdown__divider"> */
  items: UserDropdownItem[];
};

export type UserDropdownUser = {
  name: ReactNode;
  email: ReactNode;
};

export type UserDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserDropdownUser;
  /** Grupos de itens, separados por divider no DOM */
  groups: UserDropdownGroup[];
  className?: string;
};

export function UserDropdown({
  isOpen,
  onClose,
  user,
  groups,
  className,
}: UserDropdownProps) {
  if (!isOpen) return null;

  return (
    <div
      className={clsx('dropdown', 'user-dropdown', 'is-open', className)}
      role="menu"
    >
      <div className="user-dropdown__identity">
        <span className="user-dropdown__name">{user.name}</span>
        <span className="user-dropdown__email">{user.email}</span>
      </div>
      {groups.map((group, gi) => (
        <UserGroup key={gi} items={group.items} onClose={onClose} />
      ))}
    </div>
  );
}

function UserGroup({
  items,
  onClose,
}: {
  items: UserDropdownItem[];
  onClose: () => void;
}) {
  return (
    <>
      <div className="dropdown__divider" />
      <div className="user-dropdown__group">
        {items.map((item) => {
          const onItemClick = () => {
            item.onClick?.();
            onClose();
          };
          return (
            <div
              key={item.id}
              className={clsx(
                'user-dropdown__item',
                item.textOnly && 'user-dropdown__item--text-only'
              )}
              role="menuitem"
              tabIndex={0}
              onClick={onItemClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onItemClick();
                }
              }}
            >
              {item.icon && (
                <span className="material-icons-outlined">{item.icon}</span>
              )}
              <span className="user-dropdown__item-label">
                {item.label}
                {item.badge && (
                  <> <span className="user-dropdown__badge">{item.badge}</span></>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Hook: gerenciamento de estado dos dropdowns ─────────────────

export type HeaderDropdownsApi = {
  productOpen: boolean;
  userOpen: boolean;
  toggleProduct: () => void;
  toggleUser: () => void;
  closeAll: () => void;
  /** Ref para attachar nos botoes-trigger pra evitar fechar quando clicar neles */
  triggerRef: React.RefObject<HTMLDivElement>;
};

export function useHeaderDropdowns(): HeaderDropdownsApi {
  const [productOpen, setProductOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const closeAll = useCallback(() => {
    setProductOpen(false);
    setUserOpen(false);
  }, []);

  const toggleProduct = useCallback(() => {
    setProductOpen((prev) => {
      const next = !prev;
      if (next) setUserOpen(false); // so um aberto por vez
      return next;
    });
  }, []);

  const toggleUser = useCallback(() => {
    setUserOpen((prev) => {
      const next = !prev;
      if (next) setProductOpen(false);
      return next;
    });
  }, []);

  // ESC fecha
  useEffect(() => {
    if (!productOpen && !userOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [productOpen, userOpen, closeAll]);

  // Click fora fecha
  useEffect(() => {
    if (!productOpen && !userOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      // Nao fecha se clicou em um dropdown ou em um trigger
      if (
        target.closest('.product-dropdown') ||
        target.closest('.user-dropdown') ||
        (triggerRef.current && triggerRef.current.contains(target))
      ) return;
      closeAll();
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [productOpen, userOpen, closeAll]);

  return { productOpen, userOpen, toggleProduct, toggleUser, closeAll, triggerRef };
}

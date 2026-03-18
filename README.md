# infoprice-prototipos

Protótipos Ip.

# Protótipos Funcionais — InfoPrice

Pipeline de geração de protótipos funcionais e compartilháveis a partir do Figma, sem envolver o time de desenvolvimento.

---

## Como funciona

```
Figma (frame pronto)
    ↓  Figma MCP lê o design
Claude Code (gera HTML + CSS com tokens do DS)
    ↓  VSCode
GitHub (commit + push)
    ↓  GitHub Pages publica automaticamente
Link compartilhável → enviado ao solicitante
```

---

## Pré-requisitos

Antes de usar o pipeline pela primeira vez, certifique-se de ter:

- [ ] [Git](https://git-scm.com/download/win) instalado
- [ ] [VSCode](https://code.visualstudio.com/) instalado
- [ ] [Node.js](https://nodejs.org/) instalado
- [ ] Claude Code instalado (`npm install -g @anthropic-ai/claude-code`)
- [ ] Conta Anthropic autenticada (`claude` no terminal)
- [ ] Token de acesso pessoal do Figma gerado (Settings → Security → Personal access tokens)
- [ ] Repositório clonado na máquina local

---

## Setup inicial (apenas uma vez)

### 1. Clone o repositório

```bash
git clone https://github.com/marcoskip/infoprice-prototipos.git
cd infoprice-prototipos
```

### 2. Configure o Figma MCP

Na raiz do projeto, o arquivo `.mcp.json` já está configurado. Substitua o token se necessário:

```json
{
  "mcpServers": {
    "figma-developer-mcp": {
      "command": "npx",
      "args": ["figma-developer-mcp"],
      "env": {
        "FIGMA_API_KEY": "SEU_TOKEN_AQUI"
      }
    }
  }
}
```

### 3. Configure o modelo Opus (recomendado)

```bash
claude config set model claude-opus-4-5
```

---

## Gerando um protótipo (uso diário)

### Passo 1 — Abra o terminal na pasta do projeto

```bash
cd "C:/Users/ADMIN/Desktop/projeto claude"
```

### Passo 2 — Abra o Claude Code

```bash
claude
```

### Passo 3 — Cole o prompt padrão

Substitua `[URL DO FRAME]` pela URL do frame no Figma e `[NOME-DO-ARQUIVO]` pelo nome descritivo do protótipo:

```
Acesse o frame nesta URL do Figma: [URL DO FRAME]

Com base no design, gere um arquivo chamado [NOME-DO-ARQUIVO].html na raiz do projeto.

Instruções:
- Use o template.html e o tokens.css já existentes no projeto como base
- Reproduza o layout do frame com fidelidade ao Design System da Infoprice
- Implemente botões com estados visuais completos: default, hover, active e disabled
- Implemente dropdowns e filtros funcionais e interativos, se houver no design
- Use dados fictícios mas realistas para preencher o conteúdo
- O código deve ser semântico, acessível e responsivo
- Não use bibliotecas externas — apenas HTML, CSS e JavaScript puro
```

### Passo 4 — Revise o arquivo gerado

Abra o arquivo `.html` no VSCode e verifique se o resultado está fiel ao design. Se precisar de ajustes, peça diretamente ao Claude Code ainda na mesma sessão:

```
Ajuste [descreva o que precisa mudar]
```

### Passo 5 — Publique

```bash
git add .
git commit -m "feat: adiciona protótipo [nome da tela]"
git push origin main
```

### Passo 6 — Compartilhe o link

O protótipo estará disponível em:

```
https://marcoskip.github.io/infoprice-prototipos/[NOME-DO-ARQUIVO].html
```

Envie este link ao solicitante para validação.

---

## Comparando versões (diff)

Cada `git push` registra automaticamente o histórico de alterações. Para comparar duas versões de um protótipo:

```bash
git diff HEAD~1 HEAD -- nome-do-arquivo.html
```

Ou acesse diretamente no GitHub em **Commits** e clique em qualquer commit para ver o que mudou.

---

## Estrutura do projeto

```
infoprice-prototipos/
├── tokens.css          → Tokens do Design System (cores, tipografia, sombras)
├── template.html       → Template base para novos protótipos
├── .mcp.json           → Configuração do Figma MCP
├── README.md           → Este documento
└── [prototipos]/       → Arquivos HTML gerados
    ├── preco-oferta.html
    └── ...
```

---

## Escopo de interatividade dos protótipos

Os protótipos gerados por este pipeline têm como objetivo **validação visual e funcional** com o solicitante, não implementação. O escopo padrão inclui:

| Elemento            | Comportamento esperado              |
| ------------------- | ----------------------------------- |
| Botões              | Default, hover, active, disabled    |
| Dropdowns e filtros | Abrir/fechar, selecionar opção      |
| Inputs              | Foco com highlight, edição de texto |
| Tabelas             | Hover nas linhas, checkboxes        |
| Navegação           | Links entre estados/telas           |

Dados dinâmicos, integração com APIs e lógica de negócio **não fazem parte do escopo** — ficam a cargo do time de desenvolvimento na implementação.

---

## Solução de problemas

**O Figma MCP não está conectado**
Verifique se o arquivo `.mcp.json` está na raiz do projeto e se o token do Figma é válido. Tokens expirados precisam ser regenerados em Figma → Settings → Security.

**O Claude Code não reconhece o Figma MCP**
Feche e reabra o Claude Code. O `.mcp.json` é lido apenas na inicialização.

**O protótipo não aparece no GitHub Pages**
Aguarde 2–5 minutos após o `git push`. O GitHub Pages tem um delay de build. Verifique em Settings → Pages se o branch `main` está configurado.

**O design não foi reproduzido fielmente**
Adicione mais detalhes ao prompt descrevendo os elementos específicos que precisam de atenção. Quanto mais contexto, melhor o resultado.

---

## Tokens do Design System

Os tokens estão em `tokens.css` e foram extraídos diretamente do Figma. Sempre que o Design System for atualizado, rode o seguinte prompt no Claude Code para regenerar o arquivo:

```
Acesse o arquivo do Design System no Figma: https://www.figma.com/design/qXRoOz0cCzAX4WgOz7fAmJ/Design-System

Extraia todos os tokens disponíveis — Variables e Styles — e atualize o arquivo
tokens.css na raiz do projeto, mantendo a estrutura e os comentários existentes.
```

---

_Desenvolvido pelo time de UX/UI — InfoPrice · 2026_

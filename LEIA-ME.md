# Site oficial — Black Iron Fitness

Site institucional estático (HTML + CSS + JavaScript puro, sem dependências).
Funciona em qualquer hospedagem: Netlify, Vercel, GitHub Pages ou Cloudflare.

## Como publicar (sem linha de comando)

**Netlify (mais rápido):** entre em app.netlify.com → "Add new site" → "Deploy manually" →
arraste a pasta `black-iron-fitness` inteira para a área indicada. Pronto.

**GitHub Desktop + Vercel:** crie um repositório novo no GitHub Desktop, copie os arquivos
desta pasta para dentro dele, faça o commit e o push. Na Vercel, "Add New Project" →
escolha o repositório → Framework: "Other" → Deploy.

## Informações reais usadas (fonte: Instagram @blackironfitness__)

- Lema: Força | Disciplina | Evolução
- Horário: segunda a sexta 6h às 21h · sábado 9h às 13h
- Endereço: Av. Jorge Dariva, 1342 — Osório/RS
- WhatsApp: (51) 98976-6640
- Planos a partir de R$ 89,90 (informado pelo responsável)

## O que falta confirmar com a academia

Tudo que está com borda tracejada no site é espaço reservado:

| Onde | O que preencher |
|---|---|
| `academia/index.html` | História da academia (quando abriu, quem fundou) |
| `modalidades/index.html` | Outras modalidades além de musculação e cardio (há um modelo comentado no código) |
| `equipe/index.html` | Nome, função, CREF e texto de cada profissional |
| `planos/index.html` | Nome/período do plano de R$ 89,90 e valores dos demais planos |
| `planos/index.html` | Wellhub: confirmar se é parceiro e quais planos aceita |
| `horarios/index.html` | Estacionamento e ponto de referência |
| Domingo | O Instagram não cita domingo; o site mostra "Fechado" |

## Como trocar as fotos

Salve as fotos na pasta `img/` em formato `.webp` (ou `.jpg`) com os nomes que aparecem
nos espaços reservados — por exemplo `img/fachada.webp`, `img/cardio.webp`.
Depois troque o bloco `<span class="ph-media">…</span>` pela tag `<img>` correspondente
(ou peça para o Claude fazer isso).

## Domínio

O endereço `https://www.blackironfitness.com.br` está como provisório em: todas as páginas
(tags canonical/og), `sitemap.xml` e `robots.txt`. Ao definir o domínio real, substitua
esse texto em todos os arquivos.

## Se algo mudar

- **WhatsApp ou horário do selo "Aberto agora":** `js/main.js`, no topo do arquivo.
- **Textos de cada página:** dentro de cada pasta, no arquivo `index.html`.
- **Cores e tipografia:** `css/style.css`, no bloco `:root` no início.

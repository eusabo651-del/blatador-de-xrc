# Blatador de Xrc

Painel escuro para gerar, consultar e favoritar configurações de sensibilidade, com acesso por key e vínculo de dispositivo.

## API de keys

A coleção configurada é:

`https://6ac66d7ebea0e72cf5c906ed.mockapi.io/Xrckeys`

No deploy Vercel, a rota serverless (`api/trpc.ts`) autentica usuários, administra licenças e persiste o histórico diretamente nessa coleção. `server/mockapi.ts` contém as funções compartilhadas de acesso e a verificação da coleção. A coleção estava vazia quando esta adaptação foi preparada; portanto, nenhum acesso de usuário será validado até que keys sejam criadas pelo painel administrativo ou cadastradas na API. O comando local `pnpm dev` usa o router de desenvolvimento baseado no banco SQL do scaffold.

Formato esperado de um registro:

```json
{
  "key": "XRC-weekly-ABC123DEF456",
  "username": "jogador",
  "used": false,
  "device": "",
  "expire": 7,
  "type": "weekly",
  "createdAt": 1790028013,
  "activatedAt": 0,
  "expiresAt": 0,
  "status": "active",
  "history": []
}
```

- `key`: valor digitado no login.
- `used` e `device`: controlam a primeira ativação e o vínculo ao dispositivo.
- `expire`: duração em dias; `type` aceita `daily`, `weekly`, `monthly`, `yearly` ou `perm`.
- Datas são timestamps Unix em segundos. `expiresAt: 0` representa ainda não ativada ou uma licença permanente (`type: "perm"`).
- `status`: `active`, `revoked` ou `blocked`.
- `history`: histórico opcional do gerador.

## Variáveis de ambiente

Configure no host de deploy, fora do repositório público:

- `RBXIS_ADMIN_KEY`: credencial escolhida para o login administrativo. Não a coloque em arquivos versionados, documentação pública ou código do cliente.
- `RBXIS_SESSION_SECRET`: segredo aleatório forte usado para assinar sessões; obrigatório em produção.

Há um `.env.example` apenas com nomes/valores de exemplo. Use um gestor de segredos ou variáveis de ambiente do provedor.

## Escopo

O gerador de sensibilidade, histórico, favoritos e gestão de licenças continuam disponíveis. A aba Auxílio foi refeita como interface de preferências e orientações locais: ela não injeta código, não interage com a memória do jogo e não automatiza mira, recuo ou evasão de proteções.

## Desenvolvimento

```bash
pnpm install
pnpm check
pnpm test
pnpm dev
```

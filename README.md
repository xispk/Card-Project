# Client TODOS

- arrumar error handling dos fetch
- padronizar os botoes /css
- arrumar o problema de fetch do userInfo quando o app esta sendo atualizado fora da home

- refactorar o componente Chat
  - Habilitar abas para multiplas salas
  - Determinar a sala atual
  - Habilitar multiplos grupos de mensagem no mesmo state
  - State deve conter mensagens, sala e infos comuns do chat
  - Cada sala deve ter sua aba individual

- fix problems when reloading the pages, (acredito que a melhor forma de resolver vai ser sempre redirecionar o cliente pra pagina inicial e fazer com que a pagina inicial ative o userInfo)
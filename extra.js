// Explicações complementares (opções sem página na documentação lida) e regras de exibição.
// conf "inferido" = significado deduzido do nome da opção; o site avisa isso ao visitante.
const CV = "Define se a função pode usar os dutos.";
const OV = {
 "sentry.PlacementCooldown":"Tempo de espera entre uma câmera instalada e a próxima.",
 "sentry.DeployedCamerasVisibility":"Define quando as câmeras instaladas ficam visíveis para os outros jogadores. O valor é um modo interno: o número 0 não teve o significado confirmado.",
 "sentry.CamerasVisibleAfter":"Tempo até a câmera instalada ficar visível.",
 "sentry.PortableCamerasMode":"Define como o Sentinela consegue câmeras portáteis (a página do Town of Us: Mira no Among Us Wiki diz que completar todas as tarefas pode liberá-las). O valor é um modo interno: o número 2 não teve o significado confirmado.",
 "sentry.InitialCameras":"Quantas câmeras o Sentinela tem no começo da partida.",
 "sentry.CameraRoundsLast":"Por quantas rodadas as câmeras instaladas continuam funcionando.",
 "sentry.TasksPerCamera":"Quantas tarefas o Sentinela precisa completar para ganhar uma câmera extra.",
 "sentry.MaxCamerasPlaced":"Máximo de câmeras instaladas ao mesmo tempo.",
 "sentry.PortableCamsBattery":"Duração da bateria das câmeras portáteis.",
 "swapper.CanButton":"Define se o Trocador de Votos pode usar o botão de emergência.",
 "grenadier.SabotageFlashing":"Opção ligada a clarões durante sabotagens. O significado exato não foi encontrado na documentação lida.",
 "ambusher.MaxAmbushes":"Número máximo de emboscadas por partida. No arquivo vale 0 (igual ao padrão); é provável que signifique sem limite, mas isso não foi confirmado.",
 "ambusher.AmbushCooldown":"Tempo de espera entre uma emboscada e outra.",
 "ambusher.UpdateInterval":"Intervalo de atualização da emboscada. A unidade e o efeito exato não foram confirmados.",
 "ambusher.ResetAmbush":"Define se a emboscada é reiniciada (por exemplo, a cada rodada). O detalhe exato não foi confirmado.",
 "ambusher.CanVent":CV,
 "puppeteer.ControlUses":"Quantidade de usos do controle. No arquivo vale -1 (o padrão é 3); o significado do -1 não foi confirmado (possivelmente sem limite).",
 "puppeteer.ControlPerKills":"Relaciona o uso do controle ao número de eliminações (valor 2). A regra exata não foi confirmada.",
 "puppeteer.VictimSeesControlDirection":"Modo interno que define se e como a vítima enxerga a direção do controle. O número 3 não teve o significado confirmado.",
 "puppeteer.ControlCooldown":"Tempo de espera para controlar outro jogador novamente.",
 "puppeteer.ControlDuration":"Por quanto tempo o jogador fica sob controle.",
 "puppeteer.CanVent":CV,
 "blackmailer.MaxBlackmails":"Número máximo de chantagens por partida. No arquivo vale 0 (igual ao padrão); é provável que signifique sem limite, mas isso não foi confirmado.",
 "blackmailer.BlackmailCooldown":"Tempo de espera entre uma chantagem e outra.",
 "blackmailer.MaxAliveForVoting":"Número de jogadores vivos ligado à votação (valor 5). A regra exata não foi confirmada.",
 "blackmailer.BlackmailInARow":"Permite chantagear nas rodadas seguidas (pelo nome da opção). Está ativada, e o padrão do arquivo é desativada.",
 "blackmailer.OnlyTargetSeesBlackmail":"Só o jogador chantageado vê o aviso da chantagem (pelo nome da opção). Está ativada, e o padrão do arquivo é desativada.",
 "blackmailer.BlackmailerKill":"Define se o Chantagista pode eliminar jogadores.",
 "hypnotist.HypnotiseCooldown":"Tempo de espera entre uma hipnose e outra.",
 "hypnotist.HypnoKill":"Define se o Hipnotizador pode eliminar jogadores."
};
// Opções que não entram na lista explicada (motivo exibido na página da função)
const NEUTRO = "o preset não habilita nenhuma função Neutra";
const HIDE = {
 "sheriff.ShootNeutralEvil":NEUTRO,"sheriff.ShootNeutralKiller":NEUTRO,"sheriff.ShootNeutralOutlier":NEUTRO,
 "seer.ShowNeutralKillingAsRed":"pertence ao modo Checar; o modo Comparar está ativo","seer.SwapTraitorColors":"pertence ao modo Checar; o modo Comparar está ativo"
};
const PLURAL = {crew:"Tripulantes",imp:"Impostores"};
// Símbolos das funções do jogo base: coloque os arquivos em img/icons/<nome>.png
const OFICIAL_ICON = {scientist:"vitals",engineer:"vent","guardian-angel":"protect",tracker:"track",noisemaker:"alert",detective:"interrogate",shapeshifter:"shift",phantom:"vanish",viper:"viper"};
// Tripulante e Impostor aparecem em uma barra no topo da lista (img/bars/<nome>.png)
const BAR = {
 crewmate:{loc:"img/bars/crewmate.png",rem:"https://static.wikia.nocookie.net/among-us-wiki/images/c/cd/Crewmate_bar.png/revision/latest?cb=20211122213244"},
 impostor:{loc:"img/bars/impostor.png",rem:""}
};
const DRAFT_PT = "Limite usado na distribuição de funções: máximo de funções dessa categoria sorteadas na partida.";

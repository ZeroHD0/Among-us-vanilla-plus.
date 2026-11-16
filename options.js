// Dados extras por função: cor do tema, motivo decorativo, habilidades e OPTIONS (Town of Us: Mira).
// Fonte das OPTIONS: https://au-avengers.github.io/docs.toum.gg/ — opts:null = página ainda não lida (não inventamos valores).
const ICON_REMOTE = "https://au-avengers.github.io/docs.toum.gg/img/Icons/";
const T = "Toggle", S = "Seconds", N = "Count";
const o = (n, pt, d, type, def, range, vals, sec) => ({n, pt, d, type, def, range, vals, sec});
const tog = (n, pt, d, def, sec) => o(n, pt, d, T, def, "True / False", null, sec);

const EXTRA = {
// ===== oficiais (cor da facção, sem OPTIONS do Mira) =====
crewmate:{c:"#4aa3ff",m:"radar"}, scientist:{c:"#1e88e5",m:"radar"}, engineer:{c:"#ef8a2f",m:"plus"},
"guardian-angel":{c:"#f2d94e",m:"hex"}, tracker:{c:"#3fae4a",m:"radar"}, noisemaker:{c:"#9b3be8",m:"plus"},
detective:{c:"#4f8f78",m:"radar"},
impostor:{c:"#e0243c",m:"cross"}, shapeshifter:{c:"#d62b2b",m:"stripe"}, phantom:{c:"#9a7aa0",m:"stripe"}, viper:{c:"#3fbf4a",m:"cross"},

lookout:{c:"#7dcf40",m:"radar",ic:"Lookout",
 abil:["Watch (Vigiar) — escolhe um ou mais jogadores para vigiar. Na próxima reunião você sabe quais funções (ou jogadores) interagiram com cada alvo."],
 opts:[
  o("Watch Cooldown","Recarga de vigiar","Tempo de espera entre uma vigilância e outra. Quanto menor, mais alvos você consegue cobrir na mesma rodada.",S,"20s","1s - 30s"),
  o("Watched Player Feedback Reveals","O que o feedback revela","Define o que o Observador descobre sobre quem interagiu com o alvo vigiado.","String","Players","Players / Roles",[["Players","mostra os jogadores que interagiram com o alvo"],["Roles","mostra as funções que interagiram com o alvo"]]),
  o("Initial Players That Can be Watched","Jogadores vigiáveis (inicial)","Número máximo de jogadores que podem ser vigiados.",N,"5","1 - 15"),
  tog("See Indirect Attacks","Ver ataques indiretos","Define se o Observador fica sabendo de ataques indiretos, como bombas.","False"),
  tog("Lookout Watches Reset After Each Round","Vigilâncias reiniciam a cada rodada","Define se os usos da habilidade são restaurados a cada rodada.","True"),
  tog("┗ Get More Uses From Completing Task","┗ Mais usos ao completar tarefa","Define se completar tarefas dá mais usos da habilidade.","False")]},

seer:{c:"#13b4d1",m:"radar",ic:"Seer",
 abil:["Intuit e Gaze — usadas para comparar os alinhamentos de outros jogadores e saber se são aliados ou inimigos.","Reveal — usada quando a opção de comparar está desligada: revela o alinhamento do alvo."],
 opts:[
  tog("Compare Players Instead of Checking Alignments","Comparar em vez de checar","Define se o Vidente compara dois jogadores (descobrindo se são amigos ou inimigos) ou apenas revela o alinhamento de um jogador.","True","Configurações da função"),
  o("Reveal / Compare Cooldown","Recarga de revelar/comparar","Tempo de espera entre usos da habilidade.",S,"20s","5 - 120s",null,"Configurações da função"),
  o("Max Uses of Reveal / Compare","Usos máximos","Número máximo de vezes que a habilidade pode ser usada.",N,"5","1 - 15 / ∞",null,"Configurações da função"),
  tog("Can Reveal/Compare More Than Once Per Round","Usar mais de uma vez por rodada","Define se o Vidente pode usar a habilidade mais de uma vez na mesma rodada.","False","Configurações da função"),
  tog("┣ Neutral Benigns Shows Friends to All","┣ Neutros Benignos aparecem como amigos","Define se funções Neutras Benignas aparecem como amigáveis na comparação.","False","Comparar alinhamentos"),
  tog("┣ Neutral Evils Shows Friends to All","┣ Neutros Malignos aparecem como amigos","Define se funções Neutras Malignas aparecem como amigáveis.","False","Comparar alinhamentos"),
  tog("┗ Neutral Outliers Shows Friends to All","┗ Neutros Outliers aparecem como amigos","Define se funções Neutras Outliers aparecem como amigáveis.","False","Comparar alinhamentos"),
  tog("Can Only Compare Each Player Once","Comparar cada jogador só uma vez","Define se cada jogador só pode ser comparado uma vez.","False","Comparar alinhamentos"),
  tog("┣ Crewmate Killing Roles are Red","┣ Tripulantes assassinos aparecem em vermelho","Define se o nome de funções Tripulantes Assassinas fica vermelho ao serem reveladas.","False","Checar (Reveal) alinhamentos"),
  tog("┣ Neutral Benign Roles Are Red","┣ Neutros Benignos em vermelho","Define se o nome de Neutros Benignos fica vermelho ao serem revelados.","False","Checar (Reveal) alinhamentos"),
  tog("┣ Neutral Evil Roles Are Red","┣ Neutros Malignos em vermelho","Define se o nome de Neutros Malignos fica vermelho ao serem revelados.","False","Checar (Reveal) alinhamentos"),
  tog("┣ Neutral Killing Roles Are Red","┣ Neutros Assassinos em vermelho","Define se o nome de Neutros Assassinos fica vermelho ao serem revelados.","True","Checar (Reveal) alinhamentos"),
  tog("┣ Neutral Outlier Roles Are Red","┣ Neutros Outliers em vermelho","Define se o nome de Neutros Outliers fica vermelho ao serem revelados.","False","Checar (Reveal) alinhamentos"),
  tog("┗ Traitor Swaps Colors","┗ Traidor troca de cor","Define se o nome do Traidor fica vermelho caso ele seja revelado.","True","Checar (Reveal) alinhamentos")]},

spy:{c:"#77a761",m:"radar",ic:"Spy",
 abil:["Admin — abre a tabela de administração por um tempo total determinado entre usos. O mapa mostra a localização dos jogadores vivos, identificados pelas cores, e atualiza quando alguém muda de área (inclusive por dutos). Fora de locais nomeados e em corredores, ninguém aparece."],
 opts:[
  o("Who Sees Bodies On Admin","Quem vê corpos na administração","Define quem enxerga os corpos na tabela de administração.","String","Nobody","Nobody / Spy / Everyone But Spy / Everyone",[["Nobody","ninguém vê corpos"],["Spy","só o Espião vê"],["Everyone But Spy","todos, menos o Espião"],["Everyone","todos veem"]]),
  o("Allow Portable Admin Table For","Admin portátil para","Define se o Espião (a função e/ou o modificador) tem acesso à administração portátil.","String","Role + Modifier","Role / Modifier / Both / Neither",[["Role","só a função Espião"],["Modifier","só o modificador Espião"],["Both","ambos"],["Neither","nenhum"]]),
  tog("┣ Move With Portable Admin","┣ Mover-se com a admin portátil","Define se é possível andar com a administração portátil aberta.","True"),
  o("┣ Starting Charge","┣ Carga inicial","Quantidade de carga dada logo no início.",S,"20s","0s - 30s"),
  o("┣ Battery Charged Each Round","┣ Carga por rodada","Carga dada após cada reunião.",S,"15s","0s - 30s"),
  o("┣ Battery Charged Per Task","┣ Carga por tarefa","Carga dada ao completar uma tarefa.",S,"10s","0s - 30s"),
  o("┣ Portable Admin Display Cooldown","┣ Recarga do botão da admin portátil","Tempo de espera do botão da administração portátil.",S,"15s","0s - 30s"),
  o("┗ Portable Admin Display Duration","┗ Duração do botão da admin portátil","Duração máxima do botão, desde que haja carga suficiente.",S,"15s","5 - 30s / ∞")]},

sheriff:{c:"#d9a441",m:"cross",ic:"Sheriff",
 abil:["Shoot (Atirar) — atira em um jogador para tentar eliminá-lo. Se o alvo não for Impostor (ou de uma das facções permitidas), o tiro falha (misfire)."],
 opts:[
  o("Kill Cooldown","Recarga do tiro","Tempo de espera entre um tiro e outro.",S,"25s","10s - 60s"),
  tog("Can Self Report","Pode reportar os próprios abates","Define se o Xerife pode reportar jogadores que ele mesmo eliminou.","False"),
  tog("Allow Shooting in First Round","Atirar na primeira rodada","Define se o Xerife pode atirar na rodada um.","False"),
  tog("Can Shot Neutral Benign Roles","Pode acertar Neutros Benignos","Define se o tiro acerta funções Neutras Benignas.","False"),
  tog("Can Shot Neutral Evil Roles","Pode acertar Neutros Malignos","Define se o tiro acerta funções Neutras Malignas.","True"),
  tog("Can Shoot Neutral Killer Roles","Pode acertar Neutros Assassinos","Define se o tiro acerta funções Neutras Assassinas.","True"),
  tog("Can Shoot Neutral Outlier Roles","Pode acertar Neutros Outliers","Define se o tiro acerta funções Neutras Outliers.","True"),
  o("Misfire Kills","Quem morre no tiro errado","Define quem morre quando o Xerife erra o alvo.","String","Sheriff","Sheriff / Target / Sheriff & Target / No One",[["Sheriff","morre o Xerife"],["Target","morre o alvo"],["Sheriff & Target","morrem os dois"],["No One","ninguém morre"]])]},

sentry:{c:"#6d3fd0",m:"radar",ic:"Sentry",abil:["Colocar câmeras — instala câmeras adicionais pelo mapa, que podem ser vistas na Segurança ou por jogadores com câmeras portáteis."],opts:null},

vigilante:{c:"#c53135",m:"cross",ic:"Vigilante",
 abil:["Guess (Adivinhar) — habilidade de reunião: adivinha a função de um jogador. Se acertar, o alvo morre; se errar sem tiros seguros, o Vigilante morre."],
 opts:[
  o("Number of Guesses","Número de palpites","Número máximo de palpites certos que podem ser dados.","Amount","5","1 - 15"),
  tog("Can Guess More Than Once Per Meeting","Mais de um palpite por reunião","Define se o Vigilante pode adivinhar mais de uma vez na mesma reunião.","True"),
  tog("Can Guess Neutral Benign Roles","Pode adivinhar Neutros Benignos","Define se é possível adivinhar funções Neutras Benignas.","True"),
  tog("Can Guess Neutral Evil Roles","Pode adivinhar Neutros Malignos","Define se é possível adivinhar funções Neutras Malignas.","True"),
  tog("Can Guess Neutral Killing Roles","Pode adivinhar Neutros Assassinos","Define se é possível adivinhar funções Neutras Assassinas.","True"),
  tog("Can Guess Neutral Outlier Roles","Pode adivinhar Neutros Outliers","Define se é possível adivinhar funções Neutras Outliers.","True"),
  tog("Can Guess Killer Modifiers","Pode adivinhar modificadores de assassino","Define se é possível adivinhar modificadores de assassinos.","True"),
  tog("Can Guess Alliance Modifiers","Pode adivinhar modificadores de aliança","Define se é possível adivinhar modificadores de aliança.","True"),
  o("Safe Shots Available","Tiros seguros","Quantidade máxima de tiros seguros (palpites errados que não matam o Vigilante).","Amount","3","0 - 3")]},

swapper:{c:"#df7205",m:"hex",ic:"Swapper",abil:["Swap (Trocar) — troca os votos de dois jogadores numa reunião. Os dois escolhidos trocam de posição visualmente ao final da reunião: se o Jogador 1 teve mais votos e foi trocado com o Jogador 2, o Jogador 2 é ejetado."],opts:null},

imitator:{c:"#f19cc9",m:"plus",ic:"Imitator",
 abil:["Imitate (Imitar) — habilidade de reunião: seleciona um jogador morto e, na rodada seguinte, usa a função e as habilidades dele."],
 opts:[
  tog("Imitate Neutral Counterparts","Imitar contrapartes de Neutros","Define se o Imitador também pode imitar Neutros mortos, assumindo uma função de Tripulante com habilidades parecidas.","True"),
  tog("Imitate Impostor Counterparts","Imitar contrapartes de Impostores","Define se o Imitador também pode imitar Impostores mortos, assumindo uma função de Tripulante com habilidades parecidas.","True"),
  tog("Imitate Basic Crewmate","Imitar Tripulante básico","Define se o Imitador pode imitar a função básica de Tripulante.","True"),
  o("Imitator Must Be Guessed As","Como o Imitador deve ser adivinhado","Define como o Imitador pode ser adivinhado por Assassinos.","String","Imitator or Imitated Role","Imitator / Imitated Role / Imitator or Imitated Role",[["Imitator","só como Imitador"],["Imitated Role","só como a função imitada"],["Imitator or Imitated Role","qualquer uma das duas"]])]},

trapper:{c:"#4f7fb5",m:"hex",ic:"Trapper",
 abil:["Trap (Armadilha) — coloca uma armadilha que detecta e guarda as funções de quem ficar dentro do alcance por alguns segundos. A lista chega na reunião seguinte, em ordem aleatória."],
 opts:[
  o("Trap Cooldown","Recarga da armadilha","Tempo de espera para colocar armadilhas.",S,"20s","1s - 30s"),
  o("Min Amount Of Time In Trap To Register","Tempo mínimo na armadilha","Quanto tempo um jogador precisa ficar no alcance para ter a função registrada.",S,"5s","0s - 15s"),
  o("Initial Number Of Traps","Armadilhas iniciais","Número inicial de armadilhas que o Armadilheiro pode colocar.",N,"5","1 - 15"),
  o("Trap Size","Tamanho da armadilha","Alcance das armadilhas.","Multiplier","0.25x","0.05x - 1x"),
  o("Traps Removed After Each Round","Armadilhas removidas a cada rodada","Define se as posições das armadilhas são reiniciadas ao fim de cada reunião (opção ligar/desligar; padrão e faixa não constam no trecho lido da documentação).","Toggle",null,null),
  o("┗ Get More Uses From Completing Tasks","┗ Mais usos ao completar tarefas","Define se o máximo de armadilhas aumenta ao completar tarefas (padrão e faixa não constam no trecho lido).","Toggle",null,null),
  o("Minimum Number Of Roles Required To Trigger Trap","Mínimo de funções para ativar","Número mínimo de funções que precisam passar pela armadilha antes de a informação ser entregue (padrão e faixa não constam no trecho lido).","Count",null,null)]},

escapist:{c:"#c9a66b",m:"stripe",ic:"Escapist",
 abil:["Mark (Marcar) — marca um local no mapa.","Recall (Retornar) — teletransporta você até o local marcado, de qualquer lugar."],
 opts:[
  o("Max Recalls","Retornos máximos","Número máximo de vezes que é possível retornar por partida.","Uses","∞","∞ - 15"),
  o("Recall Cooldown","Recarga do retorno","Tempo de espera para retornar ao local marcado.",S,"25s","10s - 60s"),
  o("Can Vent","Pode usar dutos","Define se o Fugitivo pode usar os dutos.",T,"True","N/A")]},

grenadier:{c:"#8fa0b0",m:"hazard",ic:"Grenadier",
 abil:["Flash (Clarão) — joga uma granada que atinge todos os jogadores no raio, deixando a visão deles totalmente cinza por um tempo determinado. Os nomes dos jogadores cegos ficam pretos para o Granadeiro."],
 opts:[
  o("Max Flashes","Clarões máximos","Número máximo de vezes que é possível usar o clarão por partida.","Uses","∞","∞ - 15"),
  o("Flash Cooldown","Recarga do clarão","Tempo de espera entre clarões.",S,"25s","10s - 60s"),
  o("Flash Duration","Duração do clarão","Por quanto tempo os jogadores atingidos ficam cegos.",S,"10s","10s - 60s"),
  o("Flash Radius","Raio do clarão","Raio em que os jogadores são atingidos.","Multiplier","1x","0.25x - 5x"),
  o("Can Vent","Pode usar dutos","Define se o Granadeiro pode usar os dutos.",T,"True","N/A")]},

ambusher:{c:"#a8323e",m:"cross",ic:"Ambusher",abil:["Persegue um jogador e usa a habilidade quando ele estiver perto de outra pessoa, podendo fazer o alvo atacar quem está próximo enquanto o corpo é transportado até o Emboscador."],opts:null},
puppeteer:{c:"#aab4c8",m:"hex",ic:"Puppeteer",abil:["Controla temporariamente outro jogador e o obriga a realizar uma eliminação. Durante o controle, o Marionetista permanece parado."],opts:null},
blackmailer:{c:"#a63040",m:"stripe",ic:"Blackmailer",abil:["Escolhe um jogador para impedi-lo de falar na reunião seguinte. O afetado recebe um aviso e fica sem o chat de texto durante a reunião."],opts:null},
hypnotist:{c:"#b9c7e6",m:"hazard",ic:"Hypnotist",abil:["Hipnotiza jogadores.","Mass Hysteria — habilidade usada na reunião. Na rodada seguinte, os hipnotizados enxergam alterações visuais que os demais não veem."],opts:null}
};
ROLES.forEach(r => Object.assign(r, EXTRA[r.id] || {}));

// Imagens: char = personagem com transparência (arquivos originais do projeto); intro = arte de apresentação da função.
const INTRO = {lookout:"Lookout.png",seer:"Seer.png",spy:"Spy.png",sheriff:"Sheriff.png",sentry:"Sentry.png",vigilante:"Vigilante.png",swapper:"Swapper.png",imitator:"Imitator.png",trapper:"Trapper.png",
 scientist:"Scientist.jpg",engineer:"Engineer.jpg",tracker:"Tracker.jpg",noisemaker:"Noisemaker.jpg",detective:"Detective.jpg","guardian-angel":"GuardianAngel.jpg",
 shapeshifter:"Shapeshifter.jpg",phantom:"Phantom.jpg",viper:"Viper.jpg",escapist:"Escapits.png",grenadier:"Granadier.png",ambusher:"Ambusher.png",puppeteer:"Puppeter.png",hypnotist:"Hypnotist.png",blackmailer:"Blackmailer.png"};
ROLES.forEach(r => { r.char = r.img ? "img/char/" + r.img : null; r.intro = INTRO[r.id] ? "img/intro/" + INTRO[r.id] : null; });

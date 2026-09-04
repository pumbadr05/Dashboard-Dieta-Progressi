(() => {
  const TARGET = 1450;
  const CYCLE_START = '2026-09-07';
  const TARGET_MACRO = {p:76,c:181,f:47};

  const I=(name,qty,unit,category)=>({name,qty,unit,category});
  const K=(p,c,f)=>Math.round(p*4+c*4+f*9);
  const O=(name,detail,p,c,f,ingredients,source=false)=>({name,detail,p,c,f,kcal:K(p,c,f),ingredients,source});

  const days=[
    {id:'lun',label:'Lunedì'},{id:'mar',label:'Martedì'},{id:'mer',label:'Mercoledì'},
    {id:'gio',label:'Giovedì'},{id:'ven',label:'Venerdì'},{id:'sab',label:'Sabato'},{id:'dom',label:'Domenica'}
  ];
  const dayIndex={lun:0,mar:1,mer:2,gio:3,ven:4,sab:5,dom:6};

  const weekMeta={
    1:{range:'7–13 settembre',theme:'Settimana 1 · matrice La Brocca'},
    2:{range:'14–20 settembre',theme:'Settimana 2 · matrice La Brocca'},
    3:{range:'21–27 settembre',theme:'Settimana 3 · matrice La Brocca'},
    4:{range:'28 settembre–4 ottobre',theme:'Settimana 4 · matrice La Brocca'}
  };

  // Quota pane "nell'arco della giornata" ripresa dal piano originale.
  const bread={
    1:{lun:90,mar:80,mer:110,gio:80,ven:90,sab:30,dom:70},
    2:{lun:100,mar:80,mer:90,gio:80,ven:110,sab:30,dom:70},
    3:{lun:90,mar:80,mer:100,gio:70,ven:100,sab:30,dom:70},
    4:{lun:80,mar:80,mer:90,gio:70,ven:90,sab:30,dom:70}
  };
  const breadMacro=q=>({p:0.085*q,c:0.49*q,f:0.025*q,kcal:K(.085*q,.49*q,.025*q)});

  // Macro orientativi per slot. Le tre alternative dello stesso slot sono volutamente molto vicine.
  const M={
    tea:[7,45,4], latte:[11,43,6], yogurt:[9,44,6],
    fruit:[1,15,0.3], fruit2:[1,17,0.3],
    grain:[18,48,18], grainDairy:[25,48,18], grainMeat:[27,45,17],
    proteinLunch:[35,10,24], salad:[35,15,22], dairySalad:[28,22,21],
    proteinDinner:[38,8,24], eggDinner:[27,10,24], practical:[24,45,18],
    pizza:[19,80,17], free:[0,0,0]
  };
  const macro=(key)=>M[key];

  const B={
    tea:[
      O('Tè + segale + miele + kiwi','Tè verde · pane di segale 60 g · miele 8 g · kiwi 1',...macro('tea'),[I('Pane di segale / lievitazione naturale',60,'g','Cereali e pane'),I('Miele',8,'g','Condimenti'),I('Kiwi',1,'pz','Frutta'),I('Tè verde',1,'pz','Bevande')],true),
      O('Tè + pane a lievitazione naturale + kiwi','Tè verde · pane 60 g · confettura 10 g · kiwi 1',...macro('tea'),[I('Pane a lievitazione naturale',60,'g','Cereali e pane'),I('Confettura',10,'g','Condimenti'),I('Kiwi',1,'pz','Frutta'),I('Tè verde',1,'pz','Bevande')]),
      O('Tè + pane + miele + arancia','Tè verde · pane 60 g · miele 8 g · arancia piccola',...macro('tea'),[I('Pane a lievitazione naturale',60,'g','Cereali e pane'),I('Miele',8,'g','Condimenti'),I('Arancia piccola',1,'pz','Frutta'),I('Tè verde',1,'pz','Bevande')])
    ],
    latte:[
      O('Latte + biscotti ai cereali','Latte scremato SL 250 ml · biscotti ai cereali 30 g · caffè',...macro('latte'),[I('Latte scremato SL',250,'ml','Latticini SL'),I('Biscotti ai cereali',30,'g','Cereali e pane'),I('Caffè',1,'pz','Bevande')],true),
      O('Latte + fiocchi d’avena','Latte scremato SL 250 ml · avena 30 g · caffè',...macro('latte'),[I('Latte scremato SL',250,'ml','Latticini SL'),I('Avena',30,'g','Cereali e pane'),I('Caffè',1,'pz','Bevande')]),
      O('Yogurt SL + muesli','Yogurt alla frutta SL 170 g · muesli 30 g',...macro('latte'),[I('Yogurt alla frutta SL',170,'g','Latticini SL'),I('Muesli',30,'g','Cereali e pane')])
    ],
    yogurt:[
      O('Yogurt + muesli + miele','Yogurt alla frutta SL 125 g · muesli 30 g · miele 8 g',...macro('yogurt'),[I('Yogurt alla frutta SL',125,'g','Latticini SL'),I('Muesli',30,'g','Cereali e pane'),I('Miele',8,'g','Condimenti')],true),
      O('Yogurt + avena + miele','Yogurt alla frutta SL 150 g · avena 25 g · miele 8 g',...macro('yogurt'),[I('Yogurt alla frutta SL',150,'g','Latticini SL'),I('Avena',25,'g','Cereali e pane'),I('Miele',8,'g','Condimenti')]),
      O('Yogurt + muesli + frutti rossi','Yogurt alla frutta SL 125 g · muesli 25 g · frutti rossi 80 g',...macro('yogurt'),[I('Yogurt alla frutta SL',125,'g','Latticini SL'),I('Muesli',25,'g','Cereali e pane'),I('Frutti di bosco',80,'g','Frutta')])
    ]
  };

  const fruitOpts=(a,b,c)=>[
    O(a[0],a[1],...macro('fruit'),a[2],true),
    O(b[0],b[1],...macro('fruit'),b[2]),
    O(c[0],c[1],...macro('fruit'),c[2])
  ];
  const fruit2Opts=(a,b,c)=>[
    O(a[0],a[1],...macro('fruit2'),a[2],true),
    O(b[0],b[1],...macro('fruit2'),b[2]),
    O(c[0],c[1],...macro('fruit2'),c[2])
  ];

  const kiwi=()=>['Kiwi','1 kiwi',[I('Kiwi',1,'pz','Frutta')]];
  const pear=()=>['Pera','1 pera piccola',[I('Pera',1,'pz','Frutta')]];
  const peach=()=>['Pesca','1 pesca',[I('Pesca',1,'pz','Frutta')]];
  const banana=()=>['½ banana','Banana poco matura 70 g',[I('Banana poco matura',70,'g','Frutta')]];
  const orange=()=>['Arancia','1 arancia piccola',[I('Arancia piccola',1,'pz','Frutta')]];
  const berries=()=>['Fragole','Fragole 180–200 g',[I('Fragole',190,'g','Frutta')]];
  const cherries=()=>['Ciliegie','Ciliegie 120 g',[I('Ciliegie',120,'g','Frutta')]];
  const apple=()=>['Mela','1 mela piccola',[I('Mela',1,'pz','Frutta')]];

  const optSet=(macroKey, arr)=>arr.map((x,i)=>O(x.name,x.detail,...macro(macroKey),x.ingredients,i===0));

  const lunch = {
    w1lun: optSet('grain',[
      {name:'Orzo, rucola, pomodoro e parmigiano',detail:'Orzo 80 g · parmigiano 15 g · rucola/pomodoro · fagiolini · EVO 14 g',ingredients:[I('Orzo',80,'g','Cereali e pane'),I('Parmigiano',15,'g','Latticini SL'),I('Rucola',40,'g','Verdura'),I('Pomodori',150,'g','Verdura'),I('Fagiolini',200,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Farro, zucca e parmigiano',detail:'Farro 80 g · parmigiano 15 g · zucca 200 g · rucola · EVO 14 g',ingredients:[I('Farro',80,'g','Cereali e pane'),I('Parmigiano',15,'g','Latticini SL'),I('Zucca',200,'g','Verdura'),I('Rucola',40,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Riso, zucchine e grana',detail:'Riso 75 g · grana 15 g · zucchine 250 g · EVO 14 g',ingredients:[I('Riso',75,'g','Cereali e pane'),I('Grana / parmigiano',15,'g','Latticini SL'),I('Zucchine',250,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]}
    ]),
    w1mar: optSet('grainDairy',[
      {name:'Pasta, funghi e mozzarella light',detail:'Pasta 80 g · mozzarella light SL 140 g · funghi · carote · EVO 10 g',ingredients:[I('Pasta',80,'g','Cereali e pane'),I('Mozzarella light SL',140,'g','Latticini SL'),I('Funghi',100,'g','Verdura'),I('Carote',150,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]},
      {name:'Pasta, zucchine e ricotta SL',detail:'Pasta 80 g · ricotta SL 130 g · zucchine 200 g · EVO 10 g',ingredients:[I('Pasta',80,'g','Cereali e pane'),I('Ricotta SL',130,'g','Latticini SL'),I('Zucchine',200,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]},
      {name:'Riso e mozzarella light',detail:'Riso 75 g · mozzarella light SL 120 g · pomodoro 150 g · carote · EVO 10 g',ingredients:[I('Riso',75,'g','Cereali e pane'),I('Mozzarella light SL',120,'g','Latticini SL'),I('Pomodori',150,'g','Verdura'),I('Carote',150,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]}
    ]),
    w1mer: optSet('grainMeat',[
      {name:'Orzo, melanzane e pollo',detail:'Orzo 90 g · fesa di pollo arrosto 80 g · melanzane/funghi · EVO 16 g',ingredients:[I('Orzo',90,'g','Cereali e pane'),I('Fesa di pollo arrosto',80,'g','Carne, pesce e uova'),I('Melanzane',150,'g','Verdura'),I('Funghi',150,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]},
      {name:'Farro, zucchine e tacchino',detail:'Farro 85 g · tacchino 80 g · zucchine 250 g · EVO 16 g',ingredients:[I('Farro',85,'g','Cereali e pane'),I('Tacchino',80,'g','Carne, pesce e uova'),I('Zucchine',250,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]},
      {name:'Riso, bietole e pollo',detail:'Riso 80 g · pollo 80 g · bietole 250 g · EVO 16 g',ingredients:[I('Riso',80,'g','Cereali e pane'),I('Pollo',80,'g','Carne, pesce e uova'),I('Bietole',250,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]}
    ]),
    w1gio: optSet('proteinLunch',[
      {name:'Petto di pollo e pomodori',detail:'Petto di pollo 150 g · pomodori 200 g · EVO 18 g',ingredients:[I('Petto di pollo',150,'g','Carne, pesce e uova'),I('Pomodori',200,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Tacchino e melanzane',detail:'Tacchino 160 g · melanzane 200 g · EVO 18 g',ingredients:[I('Tacchino',160,'g','Carne, pesce e uova'),I('Melanzane',200,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Vitello e zucchine',detail:'Vitello magro 150 g · zucchine 250 g · EVO 18 g',ingredients:[I('Vitello magro',150,'g','Carne, pesce e uova'),I('Zucchine',250,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]}
    ]),
    w1ven: optSet('grainDairy',[
      {name:'Farro freddo con parmigiano',detail:'Farro 80 g · parmigiano 40 g · pomodori 80 g · peperoni · EVO 12 g',ingredients:[I('Farro',80,'g','Cereali e pane'),I('Parmigiano',40,'g','Latticini SL'),I('Pomodori',80,'g','Verdura'),I('Peperoni',200,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]},
      {name:'Orzo con grana e zucca',detail:'Orzo 80 g · grana 35 g · zucca 200 g · EVO 12 g',ingredients:[I('Orzo',80,'g','Cereali e pane'),I('Grana / parmigiano',35,'g','Latticini SL'),I('Zucca',200,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]},
      {name:'Riso con mozzarella light e peperoni',detail:'Riso 75 g · mozzarella light SL 80 g · peperoni 180 g · EVO 12 g',ingredients:[I('Riso',75,'g','Cereali e pane'),I('Mozzarella light SL',80,'g','Latticini SL'),I('Peperoni',180,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]}
    ]),
    w1sab: optSet('salad',[
      {name:'Insalatona con tonno',detail:'Tonno al naturale 130 g · verdure crude 300 g · EVO 22 g',ingredients:[I('Tonno al naturale',130,'g','Carne, pesce e uova'),I('Verdure da insalata',300,'g','Verdura'),I('Olio EVO',22,'g','Condimenti')]},
      {name:'Insalatona con gamberi',detail:'Gamberi 180 g · verdure crude 250 g · mais 50 g · EVO 18 g',ingredients:[I('Gamberi',180,'g','Carne, pesce e uova'),I('Verdure da insalata',250,'g','Verdura'),I('Mais',50,'g','Cereali e pane'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Insalatona con fiocchi di latte',detail:'Fiocchi di latte SL 180 g · verdure 250 g · mais 50 g · EVO 15 g',ingredients:[I('Fiocchi di latte SL',180,'g','Latticini SL'),I('Verdure da insalata',250,'g','Verdura'),I('Mais',50,'g','Cereali e pane'),I('Olio EVO',15,'g','Condimenti')]}
    ]),

    w2lun: optSet('grain',[
      {name:'Farro, zucchine e parmigiano',detail:'Farro 90 g · parmigiano 15 g · zucchine · spinaci · EVO 12 g',ingredients:[I('Farro',90,'g','Cereali e pane'),I('Parmigiano',15,'g','Latticini SL'),I('Zucchine',180,'g','Verdura'),I('Spinaci',200,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]},
      {name:'Orzo, bieta e parmigiano',detail:'Orzo 85 g · parmigiano 15 g · bieta 250 g · EVO 12 g',ingredients:[I('Orzo',85,'g','Cereali e pane'),I('Parmigiano',15,'g','Latticini SL'),I('Bietole',250,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]},
      {name:'Riso, zucca e grana',detail:'Riso 80 g · grana 15 g · zucca 250 g · EVO 12 g',ingredients:[I('Riso',80,'g','Cereali e pane'),I('Grana / parmigiano',15,'g','Latticini SL'),I('Zucca',250,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]}
    ]),
    w2mar: optSet('grainDairy',[
      {name:'Pasta, pomodoro e formaggio light',detail:'Pasta 80 g · parmigiano 10 g · sottiletta light 40 g · zucchine/pomodoro · EVO 10 g',ingredients:[I('Pasta',80,'g','Cereali e pane'),I('Parmigiano',10,'g','Latticini SL'),I('Sottiletta light SL',40,'g','Latticini SL'),I('Zucchine',130,'g','Verdura'),I('Pomodori',180,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]},
      {name:'Pasta e mozzarella light',detail:'Pasta 80 g · mozzarella light SL 80 g · pomodoro 180 g · EVO 10 g',ingredients:[I('Pasta',80,'g','Cereali e pane'),I('Mozzarella light SL',80,'g','Latticini SL'),I('Pomodori',180,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]},
      {name:'Riso e ricotta SL',detail:'Riso 75 g · ricotta SL 120 g · zucchine 180 g · EVO 10 g',ingredients:[I('Riso',75,'g','Cereali e pane'),I('Ricotta SL',120,'g','Latticini SL'),I('Zucchine',180,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]}
    ]),
    w2mer: optSet('grainMeat',[
      {name:'Orzo, zucchine, parmigiano e crudo',detail:'Orzo 90 g · parmigiano 15 g · prosciutto crudo magro 70 g · insalata · EVO 18 g',ingredients:[I('Orzo',90,'g','Cereali e pane'),I('Parmigiano',15,'g','Latticini SL'),I('Prosciutto crudo magro',70,'g','Carne, pesce e uova'),I('Insalata mista',200,'g','Verdura'),I('Zucchine',120,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Farro con tacchino e zucchine',detail:'Farro 85 g · tacchino 80 g · zucchine 200 g · EVO 18 g',ingredients:[I('Farro',85,'g','Cereali e pane'),I('Tacchino',80,'g','Carne, pesce e uova'),I('Zucchine',200,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Riso con pollo e radicchio',detail:'Riso 80 g · pollo 80 g · radicchio 200 g · EVO 18 g',ingredients:[I('Riso',80,'g','Cereali e pane'),I('Pollo',80,'g','Carne, pesce e uova'),I('Radicchio',200,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]}
    ]),
    w2gio: optSet('proteinLunch',[
      {name:'Maiale magro e melanzane',detail:'Maiale magro 210 g · melanzane 200 g · EVO 10 g',ingredients:[I('Maiale magro',210,'g','Carne, pesce e uova'),I('Melanzane',200,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]},
      {name:'Vitello e peperoni',detail:'Vitello magro 170 g · peperoni 200 g · EVO 14 g',ingredients:[I('Vitello magro',170,'g','Carne, pesce e uova'),I('Peperoni',200,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Pollo e zucca',detail:'Pollo 180 g · zucca 250 g · EVO 14 g',ingredients:[I('Pollo',180,'g','Carne, pesce e uova'),I('Zucca',250,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]}
    ]),
    w2ven: optSet('grain',[
      {name:'Farro, pomodoro, piselli e parmigiano',detail:'Farro 80 g · piselli 30 g · parmigiano 10 g · indivia · EVO 16 g',ingredients:[I('Farro',80,'g','Cereali e pane'),I('Piselli',30,'g','Verdura'),I('Parmigiano',10,'g','Latticini SL'),I('Indivia',100,'g','Verdura'),I('Pomodori',120,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]},
      {name:'Orzo, zucca e parmigiano',detail:'Orzo 80 g · parmigiano 15 g · zucca 220 g · EVO 16 g',ingredients:[I('Orzo',80,'g','Cereali e pane'),I('Parmigiano',15,'g','Latticini SL'),I('Zucca',220,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]},
      {name:'Riso, zucchine e grana',detail:'Riso 75 g · grana 15 g · zucchine 220 g · EVO 16 g',ingredients:[I('Riso',75,'g','Cereali e pane'),I('Grana / parmigiano',15,'g','Latticini SL'),I('Zucchine',220,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]}
    ]),
    w2sab: optSet('salad',[
      {name:'Insalatona con gamberi e mais',detail:'Gamberi 180 g · verdure crude 200 g · mais 100 g · EVO 18 g',ingredients:[I('Gamberi',180,'g','Carne, pesce e uova'),I('Verdure da insalata',200,'g','Verdura'),I('Mais',100,'g','Cereali e pane'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Insalatona con tonno e mais',detail:'Tonno al naturale 130 g · verdure 250 g · mais 80 g · EVO 18 g',ingredients:[I('Tonno al naturale',130,'g','Carne, pesce e uova'),I('Verdure da insalata',250,'g','Verdura'),I('Mais',80,'g','Cereali e pane'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Insalatona con fiocchi e mais',detail:'Fiocchi di latte SL 180 g · verdure 250 g · mais 80 g · EVO 15 g',ingredients:[I('Fiocchi di latte SL',180,'g','Latticini SL'),I('Verdure da insalata',250,'g','Verdura'),I('Mais',80,'g','Cereali e pane'),I('Olio EVO',15,'g','Condimenti')]}
    ]),

    w3lun: optSet('grain',[
      {name:'Orzo in insalata',detail:'Orzo 110 g · verdure crude 160 g · bieta 200 g · EVO 18 g',ingredients:[I('Orzo',110,'g','Cereali e pane'),I('Verdure crude miste',160,'g','Verdura'),I('Bietole',200,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Farro con radicchio e bieta',detail:'Farro 95 g · radicchio 150 g · bieta 200 g · EVO 18 g',ingredients:[I('Farro',95,'g','Cereali e pane'),I('Radicchio',150,'g','Verdura'),I('Bietole',200,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Riso con zucca e spinaci',detail:'Riso 90 g · zucca 180 g · spinaci 180 g · EVO 18 g',ingredients:[I('Riso',90,'g','Cereali e pane'),I('Zucca',180,'g','Verdura'),I('Spinaci',180,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]}
    ]),
    w3mar: optSet('grainDairy',[
      {name:'Pasta con verdure e ricotta',detail:'Pasta 80 g · ricotta SL 180 g · verdure cotte 80 g · fagiolini · EVO 10 g',ingredients:[I('Pasta',80,'g','Cereali e pane'),I('Ricotta SL',180,'g','Latticini SL'),I('Verdure cotte',80,'g','Verdura'),I('Fagiolini',200,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]},
      {name:'Pasta con mozzarella light e zucchine',detail:'Pasta 80 g · mozzarella light SL 110 g · zucchine 200 g · EVO 10 g',ingredients:[I('Pasta',80,'g','Cereali e pane'),I('Mozzarella light SL',110,'g','Latticini SL'),I('Zucchine',200,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]},
      {name:'Riso con fiocchi di latte e verdure',detail:'Riso 75 g · fiocchi di latte SL 150 g · verdure 200 g · EVO 10 g',ingredients:[I('Riso',75,'g','Cereali e pane'),I('Fiocchi di latte SL',150,'g','Latticini SL'),I('Verdure cotte',200,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]}
    ]),
    w3mer: optSet('grainMeat',[
      {name:'Farro con funghi e pollo',detail:'Farro 90 g · fesa di pollo 70 g · funghi 250 g · EVO 18 g',ingredients:[I('Farro',90,'g','Cereali e pane'),I('Fesa di pollo arrosto',70,'g','Carne, pesce e uova'),I('Funghi',250,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Orzo con tacchino e zucca',detail:'Orzo 85 g · tacchino 75 g · zucca 230 g · EVO 18 g',ingredients:[I('Orzo',85,'g','Cereali e pane'),I('Tacchino',75,'g','Carne, pesce e uova'),I('Zucca',230,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Riso con pollo e spinaci',detail:'Riso 80 g · pollo 75 g · spinaci 220 g · EVO 18 g',ingredients:[I('Riso',80,'g','Cereali e pane'),I('Pollo',75,'g','Carne, pesce e uova'),I('Spinaci',220,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]}
    ]),
    w3gio: optSet('proteinLunch',[
      {name:'Coscia di pollo e lattuga',detail:'Coscia di pollo 250 g · lattuga 100 g · EVO 8 g',ingredients:[I('Coscia di pollo',250,'g','Carne, pesce e uova'),I('Lattuga',100,'g','Verdura'),I('Olio EVO',8,'g','Condimenti')]},
      {name:'Pollo e radicchio',detail:'Pollo 180 g · radicchio 200 g · EVO 14 g',ingredients:[I('Pollo',180,'g','Carne, pesce e uova'),I('Radicchio',200,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Tacchino e finocchi',detail:'Tacchino 180 g · finocchi 220 g · EVO 14 g',ingredients:[I('Tacchino',180,'g','Carne, pesce e uova'),I('Finocchi',220,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]}
    ]),
    w3ven: optSet('grain',[
      {name:'Farro con peperoni',detail:'Farro 100 g · peperoni 100 g · carote 150 g · EVO 20 g',ingredients:[I('Farro',100,'g','Cereali e pane'),I('Peperoni',100,'g','Verdura'),I('Carote',150,'g','Verdura'),I('Olio EVO',20,'g','Condimenti')]},
      {name:'Orzo con zucca e carote',detail:'Orzo 90 g · zucca 180 g · carote 120 g · EVO 20 g',ingredients:[I('Orzo',90,'g','Cereali e pane'),I('Zucca',180,'g','Verdura'),I('Carote',120,'g','Verdura'),I('Olio EVO',20,'g','Condimenti')]},
      {name:'Riso con peperoni e radicchio',detail:'Riso 85 g · peperoni 100 g · radicchio 150 g · EVO 20 g',ingredients:[I('Riso',85,'g','Cereali e pane'),I('Peperoni',100,'g','Verdura'),I('Radicchio',150,'g','Verdura'),I('Olio EVO',20,'g','Condimenti')]}
    ]),
    w3sab: optSet('dairySalad',[
      {name:'Pomodoro e mozzarella',detail:'Mozzarella SL 150 g · pomodori 250 g · origano · EVO 8 g',ingredients:[I('Mozzarella SL',150,'g','Latticini SL'),I('Pomodori',250,'g','Verdura'),I('Olio EVO',8,'g','Condimenti')]},
      {name:'Fiocchi di latte e pomodoro',detail:'Fiocchi di latte SL 200 g · pomodori 250 g · EVO 10 g',ingredients:[I('Fiocchi di latte SL',200,'g','Latticini SL'),I('Pomodori',250,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]},
      {name:'Ricotta SL e insalata',detail:'Ricotta SL 160 g · insalata 250 g · EVO 10 g',ingredients:[I('Ricotta SL',160,'g','Latticini SL'),I('Verdure da insalata',250,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]}
    ]),

    w4lun: optSet('grainMeat',[
      {name:'Farro, piselli e gamberi',detail:'Farro 90 g · piselli 40 g · gamberi 40 g · indivia · EVO 18 g',ingredients:[I('Farro',90,'g','Cereali e pane'),I('Piselli',40,'g','Verdura'),I('Gamberi',40,'g','Carne, pesce e uova'),I('Indivia',100,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Orzo, piselli e pollo',detail:'Orzo 85 g · piselli 40 g · pollo 60 g · indivia · EVO 16 g',ingredients:[I('Orzo',85,'g','Cereali e pane'),I('Piselli',40,'g','Verdura'),I('Pollo',60,'g','Carne, pesce e uova'),I('Indivia',100,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]},
      {name:'Riso, gamberi e zucchine',detail:'Riso 80 g · gamberi 70 g · zucchine 200 g · EVO 16 g',ingredients:[I('Riso',80,'g','Cereali e pane'),I('Gamberi',70,'g','Carne, pesce e uova'),I('Zucchine',200,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]}
    ]),
    w4mar: optSet('grainDairy',[
      {name:'Pasta, melanzane e formaggio fresco',detail:'Pasta 80 g · formaggio fresco SL 65 g · melanzane 130 g · fagiolini · EVO 10 g',ingredients:[I('Pasta',80,'g','Cereali e pane'),I('Formaggio fresco SL',65,'g','Latticini SL'),I('Melanzane',130,'g','Verdura'),I('Fagiolini',200,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]},
      {name:'Pasta, zucchine e mozzarella light',detail:'Pasta 80 g · mozzarella light SL 80 g · zucchine 200 g · EVO 10 g',ingredients:[I('Pasta',80,'g','Cereali e pane'),I('Mozzarella light SL',80,'g','Latticini SL'),I('Zucchine',200,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]},
      {name:'Riso, zucca e ricotta SL',detail:'Riso 75 g · ricotta SL 120 g · zucca 200 g · EVO 10 g',ingredients:[I('Riso',75,'g','Cereali e pane'),I('Ricotta SL',120,'g','Latticini SL'),I('Zucca',200,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]}
    ]),
    w4mer: optSet('grainMeat',[
      {name:'Orzo al pomodoro e prosciutto crudo',detail:'Orzo 100 g · prosciutto crudo magro 70 g · indivia · EVO 22 g',ingredients:[I('Orzo',100,'g','Cereali e pane'),I('Prosciutto crudo magro',70,'g','Carne, pesce e uova'),I('Indivia',100,'g','Verdura'),I('Salsa di pomodoro',80,'g','Verdura'),I('Olio EVO',22,'g','Condimenti')]},
      {name:'Farro con tacchino e radicchio',detail:'Farro 90 g · tacchino 80 g · radicchio 180 g · EVO 20 g',ingredients:[I('Farro',90,'g','Cereali e pane'),I('Tacchino',80,'g','Carne, pesce e uova'),I('Radicchio',180,'g','Verdura'),I('Olio EVO',20,'g','Condimenti')]},
      {name:'Riso con pollo e spinaci',detail:'Riso 85 g · pollo 80 g · spinaci 200 g · EVO 20 g',ingredients:[I('Riso',85,'g','Cereali e pane'),I('Pollo',80,'g','Carne, pesce e uova'),I('Spinaci',200,'g','Verdura'),I('Olio EVO',20,'g','Condimenti')]}
    ]),
    w4gio: optSet('proteinLunch',[
      {name:'Vitello magro e pomodori',detail:'Vitello magro 150 g · pomodori 200 g · EVO 16 g',ingredients:[I('Vitello magro',150,'g','Carne, pesce e uova'),I('Pomodori',200,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]},
      {name:'Pollo e zucca',detail:'Pollo 170 g · zucca 220 g · EVO 16 g',ingredients:[I('Pollo',170,'g','Carne, pesce e uova'),I('Zucca',220,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]},
      {name:'Tacchino e melanzane',detail:'Tacchino 170 g · melanzane 200 g · EVO 16 g',ingredients:[I('Tacchino',170,'g','Carne, pesce e uova'),I('Melanzane',200,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]}
    ]),
    w4ven: optSet('grain',[
      {name:'Farro, rucola, pomodoro e parmigiano',detail:'Farro 80 g · parmigiano 15 g · rucola/pomodoro · zucchine · EVO 14 g',ingredients:[I('Farro',80,'g','Cereali e pane'),I('Parmigiano',15,'g','Latticini SL'),I('Rucola',40,'g','Verdura'),I('Pomodori',150,'g','Verdura'),I('Zucchine',250,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Orzo con zucca e parmigiano',detail:'Orzo 80 g · parmigiano 15 g · zucca 220 g · EVO 14 g',ingredients:[I('Orzo',80,'g','Cereali e pane'),I('Parmigiano',15,'g','Latticini SL'),I('Zucca',220,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Riso con radicchio e grana',detail:'Riso 75 g · grana 15 g · radicchio 200 g · EVO 14 g',ingredients:[I('Riso',75,'g','Cereali e pane'),I('Grana / parmigiano',15,'g','Latticini SL'),I('Radicchio',200,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]}
    ]),
    w4sab: optSet('dairySalad',[
      {name:'Fiocchi di formaggio e mais',detail:'Fiocchi di formaggio magro SL 200 g · lattuga 100 g · mais 100 g · EVO 18 g',ingredients:[I('Fiocchi di formaggio magro SL',200,'g','Latticini SL'),I('Lattuga',100,'g','Verdura'),I('Mais',100,'g','Cereali e pane'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Mozzarella light, pomodoro e mais',detail:'Mozzarella light SL 130 g · pomodori 200 g · mais 80 g · EVO 15 g',ingredients:[I('Mozzarella light SL',130,'g','Latticini SL'),I('Pomodori',200,'g','Verdura'),I('Mais',80,'g','Cereali e pane'),I('Olio EVO',15,'g','Condimenti')]},
      {name:'Ricotta SL e insalata',detail:'Ricotta SL 160 g · insalata 250 g · mais 60 g · EVO 15 g',ingredients:[I('Ricotta SL',160,'g','Latticini SL'),I('Verdure da insalata',250,'g','Verdura'),I('Mais',60,'g','Cereali e pane'),I('Olio EVO',15,'g','Condimenti')]}
    ])
  };

  const dinner = {
    w1lun: optSet('proteinDinner',[
      {name:'Maiale magro e peperoni',detail:'Maiale magro 190 g · peperoni 200 g · EVO 12 g',ingredients:[I('Maiale magro',190,'g','Carne, pesce e uova'),I('Peperoni',200,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]},
      {name:'Vitello e melanzane',detail:'Vitello magro 170 g · melanzane 200 g · EVO 14 g',ingredients:[I('Vitello magro',170,'g','Carne, pesce e uova'),I('Melanzane',200,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Pollo e zucca',detail:'Pollo 180 g · zucca 220 g · EVO 14 g',ingredients:[I('Pollo',180,'g','Carne, pesce e uova'),I('Zucca',220,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]}
    ]),
    w1mar: optSet('eggDinner',[
      {name:'Frittata con zucchine',detail:'2 uova · zucchine · melanzane 200 g · EVO 4 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Zucchine',100,'g','Verdura'),I('Melanzane',200,'g','Verdura'),I('Olio EVO',4,'g','Condimenti')]},
      {name:'Frittata con spinaci',detail:'2 uova · spinaci 150 g · zucchine 150 g · EVO 6 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Spinaci',150,'g','Verdura'),I('Zucchine',150,'g','Verdura'),I('Olio EVO',6,'g','Condimenti')]},
      {name:'Uova con bieta e zucca',detail:'2 uova · bietole 150 g · zucca 150 g · EVO 6 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Bietole',150,'g','Verdura'),I('Zucca',150,'g','Verdura'),I('Olio EVO',6,'g','Condimenti')]}
    ]),
    w1mer: optSet('proteinDinner',[
      {name:'Orata e bieta',detail:'Orata 130 g · bieta 200 g · EVO 14 g',ingredients:[I('Orata',130,'g','Carne, pesce e uova'),I('Bietole',200,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Spigola e zucchine',detail:'Spigola 160 g · zucchine 250 g · EVO 14 g',ingredients:[I('Spigola',160,'g','Carne, pesce e uova'),I('Zucchine',250,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Merluzzo e spinaci',detail:'Merluzzo 200 g · spinaci 220 g · EVO 16 g',ingredients:[I('Merluzzo',200,'g','Carne, pesce e uova'),I('Spinaci',220,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]}
    ]),
    w1gio: optSet('practical',[
      {name:'Toast con galbanino e cotto',detail:'Pancarrè 120 g · formaggio 60 g · prosciutto cotto 30 g · funghi',ingredients:[I('Pancarrè',120,'g','Cereali e pane'),I('Formaggio SL',60,'g','Latticini SL'),I('Prosciutto cotto',30,'g','Carne, pesce e uova'),I('Funghi',100,'g','Verdura')]},
      {name:'Piadina con tacchino e formaggio',detail:'Piadina 110 g · tacchino 60 g · formaggio light SL 50 g · zucchine',ingredients:[I('Piadina',110,'g','Cereali e pane'),I('Tacchino',60,'g','Carne, pesce e uova'),I('Formaggio light SL',50,'g','Latticini SL'),I('Zucchine',150,'g','Verdura')]},
      {name:'Frisella con mozzarella e pomodoro',detail:'Frisella 100 g · mozzarella SL 70 g · pomodori 180 g · EVO 6 g',ingredients:[I('Frisella',100,'g','Cereali e pane'),I('Mozzarella SL',70,'g','Latticini SL'),I('Pomodori',180,'g','Verdura'),I('Olio EVO',6,'g','Condimenti')]}
    ]),
    w1ven: optSet('proteinDinner',[
      {name:'Calamari e insalata',detail:'Calamari 240 g · insalata mista 200 g · EVO 12 g',ingredients:[I('Calamari',240,'g','Carne, pesce e uova'),I('Insalata mista',200,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]},
      {name:'Seppie e bietole',detail:'Seppie 220 g · bietole 220 g · EVO 14 g',ingredients:[I('Seppie',220,'g','Carne, pesce e uova'),I('Bietole',220,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Merluzzo e finocchi',detail:'Merluzzo 220 g · finocchi 250 g · EVO 16 g',ingredients:[I('Merluzzo',220,'g','Carne, pesce e uova'),I('Finocchi',250,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]}
    ]),

    w2lun: optSet('proteinDinner',[
      {name:'Hamburger di manzo e cetrioli',detail:'Hamburger di manzo 170 g · cetrioli 150 g · EVO 8 g',ingredients:[I('Hamburger di manzo',170,'g','Carne, pesce e uova'),I('Cetrioli',150,'g','Verdura'),I('Olio EVO',8,'g','Condimenti')]},
      {name:'Manzo magro e radicchio',detail:'Manzo magro 170 g · radicchio 200 g · EVO 12 g',ingredients:[I('Manzo magro',170,'g','Carne, pesce e uova'),I('Radicchio',200,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]},
      {name:'Vitello e finocchi',detail:'Vitello magro 170 g · finocchi 220 g · EVO 12 g',ingredients:[I('Vitello magro',170,'g','Carne, pesce e uova'),I('Finocchi',220,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]}
    ]),
    w2mar: optSet('proteinDinner',[
      {name:'Seppie e fagiolini',detail:'Seppie 210 g · fagiolini 200 g · EVO 12 g',ingredients:[I('Seppie',210,'g','Carne, pesce e uova'),I('Fagiolini',200,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]},
      {name:'Calamari e zucchine',detail:'Calamari 220 g · zucchine 220 g · EVO 14 g',ingredients:[I('Calamari',220,'g','Carne, pesce e uova'),I('Zucchine',220,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Merluzzo e bietole',detail:'Merluzzo 220 g · bietole 220 g · EVO 16 g',ingredients:[I('Merluzzo',220,'g','Carne, pesce e uova'),I('Bietole',220,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]}
    ]),
    w2mer: optSet('eggDinner',[
      {name:'Frittata con asparagi',detail:'2 uova · asparagi 100 g · zucchine 200 g · EVO 8 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Asparagi',100,'g','Verdura'),I('Zucchine',200,'g','Verdura'),I('Olio EVO',8,'g','Condimenti')]},
      {name:'Frittata con spinaci',detail:'2 uova · spinaci 180 g · zucchine 150 g · EVO 8 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Spinaci',180,'g','Verdura'),I('Zucchine',150,'g','Verdura'),I('Olio EVO',8,'g','Condimenti')]},
      {name:'Uova con bieta e zucca',detail:'2 uova · bietole 160 g · zucca 160 g · EVO 8 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Bietole',160,'g','Verdura'),I('Zucca',160,'g','Verdura'),I('Olio EVO',8,'g','Condimenti')]}
    ]),
    w2gio: optSet('practical',[
      {name:'Frisella, mozzarella e pomodoro',detail:'Frisella 100 g · mozzarella SL 50 g · pomodoro · EVO 10 g',ingredients:[I('Frisella',100,'g','Cereali e pane'),I('Mozzarella SL',50,'g','Latticini SL'),I('Pomodori',180,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]},
      {name:'Toast con cotto e formaggio',detail:'Pane toast 100 g · prosciutto cotto 50 g · formaggio light SL 50 g · pomodoro',ingredients:[I('Pane toast',100,'g','Cereali e pane'),I('Prosciutto cotto',50,'g','Carne, pesce e uova'),I('Formaggio light SL',50,'g','Latticini SL'),I('Pomodori',150,'g','Verdura')]},
      {name:'Piadina con tacchino e mozzarella',detail:'Piadina 100 g · tacchino 50 g · mozzarella light SL 50 g · rucola',ingredients:[I('Piadina',100,'g','Cereali e pane'),I('Tacchino',50,'g','Carne, pesce e uova'),I('Mozzarella light SL',50,'g','Latticini SL'),I('Rucola',50,'g','Verdura')]}
    ]),
    w2ven: optSet('proteinDinner',[
      {name:'Merluzzo e lattuga',detail:'Merluzzo/nasello 230 g · lattuga 100 g · EVO 18 g',ingredients:[I('Merluzzo / nasello',230,'g','Carne, pesce e uova'),I('Lattuga',100,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Orata e finocchi',detail:'Orata 190 g · finocchi 220 g · EVO 16 g',ingredients:[I('Orata',190,'g','Carne, pesce e uova'),I('Finocchi',220,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]},
      {name:'Spigola e spinaci',detail:'Spigola 190 g · spinaci 220 g · EVO 16 g',ingredients:[I('Spigola',190,'g','Carne, pesce e uova'),I('Spinaci',220,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]}
    ]),

    w3lun: optSet('proteinDinner',[
      {name:'Manzo magro e melanzane',detail:'Manzo magro 190 g · melanzane 200 g · EVO 12 g',ingredients:[I('Manzo magro',190,'g','Carne, pesce e uova'),I('Melanzane',200,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]},
      {name:'Vitello e peperoni',detail:'Vitello 180 g · peperoni 200 g · EVO 14 g',ingredients:[I('Vitello magro',180,'g','Carne, pesce e uova'),I('Peperoni',200,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Pollo e zucca',detail:'Pollo 180 g · zucca 220 g · EVO 14 g',ingredients:[I('Pollo',180,'g','Carne, pesce e uova'),I('Zucca',220,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]}
    ]),
    w3mar: optSet('eggDinner',[
      {name:'Frittata con spinaci',detail:'2 uova · spinaci · insalata mista 200 g · EVO 4 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Spinaci',120,'g','Verdura'),I('Insalata mista',200,'g','Verdura'),I('Olio EVO',4,'g','Condimenti')]},
      {name:'Frittata con zucchine',detail:'2 uova · zucchine 200 g · radicchio 150 g · EVO 6 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Zucchine',200,'g','Verdura'),I('Radicchio',150,'g','Verdura'),I('Olio EVO',6,'g','Condimenti')]},
      {name:'Uova con bieta e zucca',detail:'2 uova · bietole 160 g · zucca 160 g · EVO 6 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Bietole',160,'g','Verdura'),I('Zucca',160,'g','Verdura'),I('Olio EVO',6,'g','Condimenti')]}
    ]),
    w3mer: optSet('proteinDinner',[
      {name:'Spigola e fagiolini',detail:'Spigola 110 g · fagiolini 200 g · EVO 16 g',ingredients:[I('Spigola',110,'g','Carne, pesce e uova'),I('Fagiolini',200,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]},
      {name:'Orata e zucchine',detail:'Orata 170 g · zucchine 220 g · EVO 14 g',ingredients:[I('Orata',170,'g','Carne, pesce e uova'),I('Zucchine',220,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Merluzzo e spinaci',detail:'Merluzzo 200 g · spinaci 220 g · EVO 16 g',ingredients:[I('Merluzzo',200,'g','Carne, pesce e uova'),I('Spinaci',220,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]}
    ]),
    w3gio: optSet('practical',[
      {name:'Piadina, sottiletta light e verdure',detail:'Piadina 120 g · sottiletta light SL 50 g · verdure cotte 70 g',ingredients:[I('Piadina',120,'g','Cereali e pane'),I('Sottiletta light SL',50,'g','Latticini SL'),I('Verdure cotte',70,'g','Verdura')]},
      {name:'Toast con tacchino e formaggio',detail:'Pane toast 100 g · tacchino 60 g · formaggio light SL 50 g · zucchine',ingredients:[I('Pane toast',100,'g','Cereali e pane'),I('Tacchino',60,'g','Carne, pesce e uova'),I('Formaggio light SL',50,'g','Latticini SL'),I('Zucchine',120,'g','Verdura')]},
      {name:'Frisella con mozzarella light',detail:'Frisella 100 g · mozzarella light SL 60 g · pomodori 180 g · EVO 6 g',ingredients:[I('Frisella',100,'g','Cereali e pane'),I('Mozzarella light SL',60,'g','Latticini SL'),I('Pomodori',180,'g','Verdura'),I('Olio EVO',6,'g','Condimenti')]}
    ]),
    w3ven: optSet('proteinDinner',[
      {name:'Platessa e zucchine',detail:'Platessa 220 g · zucchine 250 g · EVO 16 g',ingredients:[I('Platessa',220,'g','Carne, pesce e uova'),I('Zucchine',250,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]},
      {name:'Merluzzo e finocchi',detail:'Merluzzo 220 g · finocchi 250 g · EVO 16 g',ingredients:[I('Merluzzo',220,'g','Carne, pesce e uova'),I('Finocchi',250,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]},
      {name:'Orata e bieta',detail:'Orata 190 g · bietole 220 g · EVO 14 g',ingredients:[I('Orata',190,'g','Carne, pesce e uova'),I('Bietole',220,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]}
    ]),

    w4lun: optSet('proteinDinner',[
      {name:'Petto di pollo e bieta',detail:'Petto di pollo 160 g · bieta 200 g · EVO 20 g',ingredients:[I('Petto di pollo',160,'g','Carne, pesce e uova'),I('Bietole',200,'g','Verdura'),I('Olio EVO',20,'g','Condimenti')]},
      {name:'Tacchino e spinaci',detail:'Tacchino 170 g · spinaci 220 g · EVO 18 g',ingredients:[I('Tacchino',170,'g','Carne, pesce e uova'),I('Spinaci',220,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Vitello e finocchi',detail:'Vitello 170 g · finocchi 220 g · EVO 18 g',ingredients:[I('Vitello magro',170,'g','Carne, pesce e uova'),I('Finocchi',220,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]}
    ]),
    w4mar: optSet('proteinDinner',[
      {name:'Pesce spada e lattuga',detail:'Pesce spada 170 g · lattuga 100 g · EVO 8 g',ingredients:[I('Pesce spada',170,'g','Carne, pesce e uova'),I('Lattuga',100,'g','Verdura'),I('Olio EVO',8,'g','Condimenti')]},
      {name:'Orata e zucchine',detail:'Orata 190 g · zucchine 220 g · EVO 14 g',ingredients:[I('Orata',190,'g','Carne, pesce e uova'),I('Zucchine',220,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Spigola e radicchio',detail:'Spigola 190 g · radicchio 200 g · EVO 14 g',ingredients:[I('Spigola',190,'g','Carne, pesce e uova'),I('Radicchio',200,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]}
    ]),
    w4mer: optSet('eggDinner',[
      {name:'Uova e piselli',detail:'2 uova · piselli 160 g · EVO 8 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Piselli',160,'g','Verdura'),I('Olio EVO',8,'g','Condimenti')]},
      {name:'Frittata con spinaci',detail:'2 uova · spinaci 180 g · zucca 150 g · EVO 8 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Spinaci',180,'g','Verdura'),I('Zucca',150,'g','Verdura'),I('Olio EVO',8,'g','Condimenti')]},
      {name:'Uova con zucchine e bieta',detail:'2 uova · zucchine 160 g · bietole 160 g · EVO 8 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Zucchine',160,'g','Verdura'),I('Bietole',160,'g','Verdura'),I('Olio EVO',8,'g','Condimenti')]}
    ]),
    w4gio: optSet('practical',[
      {name:'Frisella, tonno e pomodoro',detail:'Frisella 110 g · tonno sott’olio sgocciolato 60 g · pomodoro · EVO 10 g',ingredients:[I('Frisella',110,'g','Cereali e pane'),I('Tonno sott’olio sgocciolato',60,'g','Carne, pesce e uova'),I('Pomodori',180,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]},
      {name:'Toast con tonno e formaggio light',detail:'Pane toast 100 g · tonno al naturale 70 g · formaggio light SL 40 g · pomodoro',ingredients:[I('Pane toast',100,'g','Cereali e pane'),I('Tonno al naturale',70,'g','Carne, pesce e uova'),I('Formaggio light SL',40,'g','Latticini SL'),I('Pomodori',150,'g','Verdura')]},
      {name:'Piadina con tacchino e mozzarella',detail:'Piadina 100 g · tacchino 50 g · mozzarella light SL 50 g · rucola',ingredients:[I('Piadina',100,'g','Cereali e pane'),I('Tacchino',50,'g','Carne, pesce e uova'),I('Mozzarella light SL',50,'g','Latticini SL'),I('Rucola',50,'g','Verdura')]}
    ]),
    w4ven: optSet('proteinDinner',[
      {name:'Polpo e melanzane',detail:'Polpo 300 g · melanzane 200 g · EVO 18 g',ingredients:[I('Polpo',300,'g','Carne, pesce e uova'),I('Melanzane',200,'g','Verdura'),I('Olio EVO',18,'g','Condimenti')]},
      {name:'Calamari e finocchi',detail:'Calamari 240 g · finocchi 220 g · EVO 16 g',ingredients:[I('Calamari',240,'g','Carne, pesce e uova'),I('Finocchi',220,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]},
      {name:'Merluzzo e bieta',detail:'Merluzzo 220 g · bietole 220 g · EVO 16 g',ingredients:[I('Merluzzo',220,'g','Carne, pesce e uova'),I('Bietole',220,'g','Verdura'),I('Olio EVO',16,'g','Condimenti')]}
    ])
  };

  const pizza=O('Pizza Margherita','Pizza Margherita al piatto 210 g',...macro('pizza'),[I('Pizza Margherita',210,'g','Pasti speciali')],true);

  // Colazione e frutta seguono la rotazione originale L/T/Y/T/L/Y.
  const breakfastKey={lun:'tea',mar:'latte',mer:'yogurt',gio:'tea',ven:'latte',sab:'yogurt',dom:'yogurt'};
  const fruitRotation={
    1:{lun:[pear(),cherries(),orange()],mar:[banana(),kiwi(),orange()],mer:[peach(),kiwi(),berries()],gio:[pear(),kiwi(),orange()],ven:[kiwi(),orange(),banana()],sab:[peach(),kiwi(),orange()],dom:[kiwi(),orange(),peach()]},
    2:{lun:[pear(),kiwi(),orange()],mar:[banana(),kiwi(),orange()],mer:[peach(),kiwi(),berries()],gio:[pear(),kiwi(),orange()],ven:[kiwi(),orange(),banana()],sab:[peach(),kiwi(),orange()],dom:[kiwi(),orange(),peach()]},
    3:{lun:[berries(),kiwi(),orange()],mar:[banana(),kiwi(),orange()],mer:[peach(),kiwi(),berries()],gio:[pear(),kiwi(),orange()],ven:[kiwi(),orange(),banana()],sab:[peach(),kiwi(),orange()],dom:[kiwi(),orange(),peach()]},
    4:{lun:[pear(),kiwi(),orange()],mar:[banana(),kiwi(),orange()],mer:[peach(),kiwi(),berries()],gio:[pear(),kiwi(),orange()],ven:[kiwi(),orange(),banana()],sab:[peach(),kiwi(),orange()],dom:[kiwi(),orange(),peach()]}
  };
  const afternoonRotation={
    1:{lun:[berries(),kiwi(),orange()],mar:[apple(),kiwi(),berries()],mer:[peach(),kiwi(),berries()],gio:[cherries(),kiwi(),berries()],ven:[pear(),kiwi(),orange()],sab:[kiwi(),orange(),peach()],dom:[kiwi(),orange(),peach()]},
    2:{lun:[cherries(),kiwi(),berries()],mar:[apple(),kiwi(),berries()],mer:[peach(),kiwi(),berries()],gio:[cherries(),kiwi(),berries()],ven:[pear(),kiwi(),orange()],sab:[kiwi(),orange(),peach()],dom:[kiwi(),orange(),peach()]},
    3:{lun:[pear(),kiwi(),orange()],mar:[apple(),kiwi(),berries()],mer:[peach(),kiwi(),berries()],gio:[cherries(),kiwi(),berries()],ven:[pear(),kiwi(),orange()],sab:[kiwi(),orange(),peach()],dom:[kiwi(),orange(),peach()]},
    4:{lun:[cherries(),kiwi(),berries()],mar:[apple(),kiwi(),berries()],mer:[peach(),kiwi(),berries()],gio:[cherries(),kiwi(),berries()],ven:[pear(),kiwi(),orange()],sab:[kiwi(),orange(),peach()],dom:[kiwi(),orange(),peach()]}
  };

  // Domenica: nell'originale è libera; nell'app manteniamo un solo pasto libero.
  const sundayMain = {
    1:{lunch:optSet('grainMeat',[
      {name:'Riso con pollo e zucchine',detail:'Riso 75 g · pollo 80 g · zucchine 220 g · EVO 14 g',ingredients:[I('Riso',75,'g','Cereali e pane'),I('Pollo',80,'g','Carne, pesce e uova'),I('Zucchine',220,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Farro con tacchino e spinaci',detail:'Farro 75 g · tacchino 80 g · spinaci 220 g · EVO 14 g',ingredients:[I('Farro',75,'g','Cereali e pane'),I('Tacchino',80,'g','Carne, pesce e uova'),I('Spinaci',220,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Orzo con pollo e bieta',detail:'Orzo 75 g · pollo 80 g · bieta 220 g · EVO 14 g',ingredients:[I('Orzo',75,'g','Cereali e pane'),I('Pollo',80,'g','Carne, pesce e uova'),I('Bietole',220,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]}
    ]), dinner:optSet('proteinDinner',[
      {name:'Pesce bianco e verdure',detail:'Pesce bianco 200 g · verdure 250 g · EVO 14 g',ingredients:[I('Pesce bianco',200,'g','Carne, pesce e uova'),I('Verdure stagionali miste',250,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'Tacchino e verdure',detail:'Tacchino 180 g · verdure 250 g · EVO 14 g',ingredients:[I('Tacchino',180,'g','Carne, pesce e uova'),I('Verdure stagionali miste',250,'g','Verdura'),I('Olio EVO',14,'g','Condimenti')]},
      {name:'2 uova e verdure',detail:'2 uova · verdure 250 g · EVO 10 g',ingredients:[I('Uova',2,'pz','Carne, pesce e uova'),I('Verdure stagionali miste',250,'g','Verdura'),I('Olio EVO',10,'g','Condimenti')]}
    ])}
  };
  sundayMain[2]=sundayMain[1]; sundayMain[3]=sundayMain[1]; sundayMain[4]=sundayMain[1];

  const season={
    settembre:['Zucchine','Melanzane','Peperoni','Pomodori','Fagiolini','Bietole','Spinaci','Rucola','Radicchio','Zucca'],
    ottobre:['Finocchi','Zucca','Broccoli','Cavolfiore','Radicchio','Carote','Bietole','Spinaci','Rucola']
  };
  const metricMeta={
    weight:{label:'Peso',unit:'kg'},waist:{label:'Vita',unit:'cm'},abdomen:{label:'Addome',unit:'cm'},
    hips:{label:'Fianchi',unit:'cm'},thigh:{label:'Coscia',unit:'cm'},arm:{label:'Braccio',unit:'cm'},chest:{label:'Torace',unit:'cm'}
  };

  const weekSelect=document.getElementById('weekSelect');
  const daySelect=document.getElementById('daySelect');
  const list=document.getElementById('mealList');
  const weekend=document.getElementById('weekendNotice');
  const progressKey='bodyProgress_v1';
  const purchasedKey=w=>`shoppingPurchased_labrocca1450_w${w}`;
  const freeMealKey='shoppingSundayFree_v1';
  const storeKey=(w,d)=>`pianoLabrocca1450_w${w}_${d}`;

  const currentWeek=()=>Number(weekSelect.value);
  const currentDay=()=>daySelect.value;

  function autoWeekFromToday(){
    const now=new Date(); now.setHours(12,0,0,0);
    const start=new Date(CYCLE_START+'T12:00:00');
    if(now<start) return 1;
    const diffDays=Math.floor((now-start)/(86400000));
    return (Math.floor(diffDays/7)%4)+1;
  }

  function currentCycleNumber(){
    const now=new Date(); now.setHours(12,0,0,0);
    const start=new Date(CYCLE_START+'T12:00:00');
    if(now<start) return 1;
    return Math.floor(Math.floor((now-start)/86400000)/28)+1;
  }

  function keyFor(w,d){return `w${w}${d}`;}

  function mealOptions(w,d,meal){
    if(meal==='breakfast') return B[breakfastKey[d]];
    if(meal==='snack') {
      const f=fruitRotation[w][d]; return fruitOpts(f[0],f[1],f[2]);
    }
    if(meal==='afternoon') {
      const f=afternoonRotation[w][d]; return fruit2Opts(f[0],f[1],f[2]);
    }
    if(d==='sab'&&meal==='dinner') return [pizza];
    if(d==='dom'&&(meal==='lunch'||meal==='dinner')) return sundayMain[w][meal];
    if(meal==='lunch') return lunch[keyFor(w,d)] || sundayMain[w].lunch;
    if(meal==='dinner') return dinner[keyFor(w,d)] || sundayMain[w].dinner;
    return [];
  }

  function getStoredSelections(w,d){
    try{return JSON.parse(localStorage.getItem(storeKey(w,d))||'{}')||{}}catch(e){return {}}
  }
  function getSelections(){
    const out={};
    ['breakfast','snack','lunch','afternoon','dinner'].forEach(id=>{
      if(currentDay()==='sab'&&id==='dinner') return;
      const el=document.querySelector(`input[name="${id}"]:checked`);
      if(el) out[id]=Number(el.value);
    });
    return out;
  }

  function renderScheduleHeader(){
    const w=currentWeek();
    document.getElementById('cycleLabel').textContent=`Settimana ${w} di 4 · ${weekMeta[w].range}`;
    const cycle=currentCycleNumber();
    document.getElementById('cycleNote').textContent=cycle===1
      ? 'Dal 5 ottobre il ciclo riparte automaticamente dalla Settimana 1.'
      : `Ciclo ${cycle}: dopo la Settimana 4 si torna alla 1.`;
    document.getElementById('shoppingWeekLabel').textContent=`settimana ${w}`;
  }

  function renderMeals(){
    const w=currentWeek(),d=currentDay(),sel=getStoredSelections(w,d);
    const slots=[
      ['breakfast','Colazione'],['snack','Metà mattina'],['lunch','Pranzo'],['afternoon','Merenda'],['dinner','Cena']
    ];
    list.innerHTML=slots.map(([id,title])=>{
      const opts=mealOptions(w,d,id);
      if(d==='sab'&&id==='dinner'){
        const o=opts[0];
        return `<article class="meal-card fixed-meal"><div class="meal-title"><h2>${title}</h2><span class="meal-target">fissa</span></div>
          <div class="option-body"><span class="option-letter">🍕</span><span class="option-text"><strong>${o.name}</strong><small>${o.detail}</small><span class="source-badge">Piano originale</span></span>
          <span class="option-macro"><b>${o.kcal} kcal</b>P ${o.p} · C ${o.c} · G ${o.f}</span></div></article>`;
      }
      return `<article class="meal-card" data-meal="${id}">
        <div class="meal-title"><div><h2>${title}</h2><div class="week-theme">${weekMeta[w].theme}</div></div><span class="meal-target">${id==='lunch'||id==='dinner'?'programmazione del giorno':'rotazione prevista'}</span></div>
        <div class="option-list">${opts.map((o,i)=>`<label class="meal-option">
          <input type="radio" name="${id}" value="${i}" ${sel[id]===i?'checked':''} aria-label="${title}: alternativa ${String.fromCharCode(65+i)}">
          <span class="option-body"><span class="option-letter">${String.fromCharCode(65+i)}</span>
          <span class="option-text"><strong>${o.name}</strong><small>${o.detail}</small>${o.source?'<span class="source-badge">Piano originale</span>':''}</span>
          <span class="option-macro"><b>${o.kcal} kcal</b>P ${o.p} · C ${o.c} · G ${o.f}</span></span>
        </label>`).join('')}</div></article>`;
    }).join('');
    list.querySelectorAll('input').forEach(el=>el.addEventListener('change',()=>{autoSave();updateTotals();renderShopping();}));
    updateTotals(); updateWeekend(); renderScheduleHeader();
  }

  function updateWeekend(){
    const d=currentDay();
    if(d==='sab'){
      weekend.hidden=false;
      weekend.innerHTML='🍕 <strong>Sabato:</strong> pizza Margherita 210 g fissa e quota pane ridotta a 30 g, come nel piano originale.';
    }else if(d==='dom'){
      weekend.hidden=false;
      weekend.innerHTML='🍽️ <strong>Domenica:</strong> il piano originale prevedeva la giornata libera. Qui manteniamo la tua modifica: <strong>un solo pasto libero</strong>, scelto nella sezione Spesa.';
    }else weekend.hidden=true;
  }

  function updateTotals(){
    const w=currentWeek(),d=currentDay(),sel=getSelections();
    const bm=breadMacro(bread[w][d]);
    let p=bm.p,c=bm.c,f=bm.f,count=0,required=5;
    ['breakfast','snack','lunch','afternoon','dinner'].forEach(id=>{
      if(d==='sab'&&id==='dinner'){const o=pizza;p+=o.p;c+=o.c;f+=o.f;count++;return;}
      const opts=mealOptions(w,d,id),idx=sel[id];
      if(Number.isInteger(idx)&&opts[idx]){const o=opts[idx];p+=o.p;c+=o.c;f+=o.f;count++;}
    });
    const kcal=K(p,c,f);
    document.getElementById('breadQty').textContent=`${bread[w][d]} g`;
    document.getElementById('kcalTotal').textContent=count?kcal:'—';
    document.getElementById('proteinTotal').textContent=count?(Math.round(p*10)/10).toString().replace('.',','):'—';
    document.getElementById('carbTotal').textContent=count?(Math.round(c*10)/10).toString().replace('.',','):'—';
    document.getElementById('fatTotal').textContent=count?(Math.round(f*10)/10).toString().replace('.',','):'—';

    const ek=p*4+c*4+f*9;
    const cp=ek?Math.round(c*4/ek*100):0,pp=ek?Math.round(p*4/ek*100):0,fp=ek?100-cp-pp:0;
    document.getElementById('carbPct').textContent=count?`${cp}%`:'—';
    document.getElementById('proteinPct').textContent=count?`${pp}%`:'—';
    document.getElementById('fatPct').textContent=count?`${fp}%`:'—';
    const dist=Math.abs(cp-50)+Math.abs(pp-21)+Math.abs(fp-29);
    document.getElementById('ratioStatus').textContent=count===required?(dist<=6?'coerente':'vicino al target'):'parziale';

    const fill=document.getElementById('kcalProgress'),status=document.getElementById('statusText');
    fill.style.width=count?`${Math.min(100,Math.round(kcal/TARGET*100))}%`:'0%';
    if(count<required){status.textContent=`${count}/${required} pasti scelti · pane incluso`;fill.style.background='var(--accent2)';}
    else{
      const dlt=kcal-TARGET;
      status.textContent=Math.abs(dlt)<=70?`Area target (${dlt>=0?'+':''}${dlt} kcal)`:(dlt<0?`${Math.abs(dlt)} kcal sotto target`:`${dlt} kcal sopra target`);
      fill.style.background=Math.abs(dlt)<=70?'var(--green)':Math.abs(dlt)<=110?'var(--amber)':'var(--danger)';
    }
  }

  function autoSave(){localStorage.setItem(storeKey(currentWeek(),currentDay()),JSON.stringify(getSelections()));}
  function save(){autoSave();flash('Scelte salvate');renderShopping();}
  function reset(){localStorage.removeItem(storeKey(currentWeek(),currentDay()));renderMeals();flash('Giorno azzerato');renderShopping();}
  function flash(t){const m=document.getElementById('saveMessage');m.textContent=t;setTimeout(()=>m.textContent='',1600);}
  function renderVeg(month){document.getElementById('vegChips').innerHTML=season[month].map(v=>`<span class="veg-chip">${v}</span>`).join('');}

  function setTab(name){
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
    document.querySelectorAll('.tab-panel').forEach(p=>p.hidden=p.id!==`${name}Panel`);
    if(name==='shopping')renderShopping();
    if(name==='progress')renderProgress();
  }

  // SHOPPING
  function getFreeMeal(){return localStorage.getItem(freeMealKey)==='dinner'?'dinner':'lunch';}
  function getPurchased(w){try{return JSON.parse(localStorage.getItem(purchasedKey(w))||'{}')||{}}catch(e){return {}}}
  function setPurchased(w,v){localStorage.setItem(purchasedKey(w),JSON.stringify(v));}
  function pKey(x){return `${x.category}|${x.name}|${x.unit}`;}
  function fmtQty(q,u){q=Math.round(q*10)/10;if(u==='g'&&q>=1000)return `${(q/1000).toFixed(q%1000===0?0:2).replace('.',',')} kg`;if(u==='ml'&&q>=1000)return `${(q/1000).toFixed(q%1000===0?0:2).replace('.',',')} l`;return `${Number.isInteger(q)?q:q.toFixed(1).replace('.',',')} ${u}`;}

  function aggregateShopping(){
    const w=currentWeek(),free=getFreeMeal(),map=new Map(),missing=[];let selected=0,required=33;
    const add=x=>{const k=pKey(x);if(!map.has(k))map.set(k,{...x,qty:0});map.get(k).qty+=x.qty;};
    days.forEach(day=>{
      add(I('Pane integrale / lievitazione naturale',bread[w][day.id],'g','Cereali e pane'));
      const sel=getStoredSelections(w,day.id);
      ['breakfast','snack','lunch','afternoon','dinner'].forEach(id=>{
        if(day.id==='sab'&&id==='dinner'){pizza.ingredients.forEach(add);return;}
        if(day.id==='dom'&&id===free)return;
        const opts=mealOptions(w,day.id,id),idx=sel[id];
        if(Number.isInteger(idx)&&opts[idx]){opts[idx].ingredients.forEach(add);selected++;}
        else missing.push(`${day.label} · ${id}`);
      });
    });
    return {items:[...map.values()],selected,required,missing};
  }

  function renderShopping(){
    const box=document.getElementById('shoppingList');if(!box)return;
    renderScheduleHeader();
    const w=currentWeek(),data=aggregateShopping(),purchased=getPurchased(w);
    document.getElementById('shoppingCoverage').textContent=`${data.selected}/${data.required}`;
    const inc=document.getElementById('shoppingIncomplete');
    inc.hidden=data.missing.length===0;
    document.getElementById('shoppingIncompleteText').textContent=data.missing.length?`Mancano ${data.missing.length} scelte nella Settimana ${w}. La lista mostra comunque tutto ciò che hai già programmato.`:'';
    const order=['Carne, pesce e uova','Latticini SL','Cereali e pane','Verdura','Frutta','Condimenti','Bevande','Pasti speciali'],groups={};
    data.items.forEach(x=>(groups[x.category]||(groups[x.category]=[])).push(x));
    box.innerHTML=order.filter(c=>groups[c]?.length).map(cat=>`<section class="shopping-category"><div class="shopping-category-head"><h3>${cat}</h3><span>${groups[cat].length} voci</span></div><div class="shopping-items">${
      groups[cat].sort((a,b)=>a.name.localeCompare(b.name,'it')).map((x,i)=>{
        const k=pKey(x),id=`s_${cat.replace(/\W/g,'')}_${i}`,checked=!!purchased[k];
        return `<div class="shopping-item ${checked?'bought':''}"><input type="checkbox" id="${id}" data-key="${encodeURIComponent(k)}" ${checked?'checked':''}><label for="${id}">${x.name}</label><span class="qty">${fmtQty(x.qty,x.unit)}</span></div>`;
      }).join('')
    }</div></section>`).join('');
    box.querySelectorAll('input[type=checkbox]').forEach(el=>el.addEventListener('change',()=>{const p=getPurchased(w),k=decodeURIComponent(el.dataset.key);p[k]=el.checked;setPurchased(w,p);el.closest('.shopping-item').classList.toggle('bought',el.checked);}));
  }

  // PROGRESS
  function getProgress(){try{const v=JSON.parse(localStorage.getItem(progressKey)||'[]');return Array.isArray(v)?v:[]}catch(e){return []}}
  function setProgress(v){localStorage.setItem(progressKey,JSON.stringify(v));}
  function n(v){if(v==='')return null;const x=Number(v);return Number.isFinite(x)&&x>0&&x<1000?Math.round(x*10)/10:null;}
  function todayISO(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function fmtDate(iso){if(!iso)return '—';const [y,m,d]=iso.split('-');return `${d}/${m}/${y}`;}
  function saveMeasurement(e){e.preventDefault();const f=e.currentTarget,r={id:Date.now(),date:f.measureDate.value};Object.keys(metricMeta).forEach(k=>r[k]=n(f.elements[k].value));const s=document.getElementById('measureStatus');if(!r.date){s.textContent='Inserisci la data.';return;}if(!Object.keys(metricMeta).some(k=>r[k]!=null)){s.textContent='Inserisci almeno un valore.';return;}let a=getProgress();const i=a.findIndex(x=>x.date===r.date);if(i>=0){r.id=a[i].id;a[i]=r}else a.push(r);a.sort((x,y)=>x.date.localeCompare(y.date));setProgress(a);s.textContent=i>=0?'Misurazione aggiornata.':'Misurazione salvata.';f.reset();f.measureDate.value=todayISO();renderProgress();}
  function deleteMeasurement(id){setProgress(getProgress().filter(x=>x.id!==id));renderProgress();}
  function delta(a,b,u){if(a==null||b==null)return '—';const d=Math.round((b-a)*10)/10;return `${d>0?'+':''}${d} ${u}`;}
  function renderProgress(){const a=getProgress(),last=a[a.length-1],first=a[0];document.getElementById('latestWeight').textContent=last?.weight!=null?`${last.weight} kg`:'—';document.getElementById('weightDelta').textContent=first&&last?delta(first.weight,last.weight,'kg'):'—';document.getElementById('latestMeasureDate').textContent=last?fmtDate(last.date):'—';document.getElementById('measureCount').textContent=a.length;renderHistory(a);renderChart(a,document.getElementById('metricSelect').value);}
  function renderHistory(a){const tb=document.getElementById('historyBody'),em=document.getElementById('historyEmpty');if(!a.length){tb.innerHTML='';em.hidden=false;return;}em.hidden=true;tb.innerHTML=[...a].reverse().map(x=>`<tr><td>${fmtDate(x.date)}</td><td>${x.weight??'—'}</td><td>${x.waist??'—'}</td><td>${x.abdomen??'—'}</td><td>${x.hips??'—'}</td><td>${x.thigh??'—'}</td><td>${x.arm??'—'}</td><td>${x.chest??'—'}</td><td><button type="button" class="delete-row" data-id="${x.id}">×</button></td></tr>`).join('');tb.querySelectorAll('.delete-row').forEach(b=>b.addEventListener('click',()=>deleteMeasurement(Number(b.dataset.id))));}
  function renderChart(a,m){const svg=document.getElementById('progressChart'),meta=metricMeta[m],pts=a.filter(x=>x[m]!=null).map(x=>({date:x.date,value:x[m]}));document.getElementById('chartCaption').textContent=`Andamento ${meta.label.toLowerCase()} (${meta.unit})`;if(pts.length<2){svg.innerHTML='<text x="50%" y="50%" text-anchor="middle" class="chart-empty">Servono almeno 2 rilevazioni</text>';return;}const W=640,H=230,p={l:52,r:18,t:18,b:36};let lo=Math.min(...pts.map(x=>x.value)),hi=Math.max(...pts.map(x=>x.value));if(lo===hi){lo--;hi++;}const ex=(hi-lo)*.12;lo-=ex;hi+=ex;const X=i=>p.l+i/(pts.length-1)*(W-p.l-p.r),Y=v=>p.t+(hi-v)/(hi-lo)*(H-p.t-p.b);const grid=[0,.25,.5,.75,1].map(t=>{const v=hi-(hi-lo)*t,y=p.t+t*(H-p.t-p.b);return `<line x1="${p.l}" y1="${y}" x2="${W-p.r}" y2="${y}" class="chart-grid"/><text x="${p.l-8}" y="${y+4}" text-anchor="end" class="chart-label">${v.toFixed(1)}</text>`}).join('');const line=pts.map((x,i)=>`${X(i)},${Y(x.value)}`).join(' '),dots=pts.map((x,i)=>`<circle cx="${X(i)}" cy="${Y(x.value)}" r="4.5" class="chart-dot"><title>${fmtDate(x.date)}: ${x.value} ${meta.unit}</title></circle>`).join('');svg.innerHTML=`${grid}<polyline points="${line}" class="chart-line"/>${dots}`;}

  // INIT
  weekSelect.value=String(autoWeekFromToday());
  renderVeg('settembre');
  renderMeals();
  document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
  weekSelect.addEventListener('change',()=>{renderMeals();renderShopping();});
  daySelect.addEventListener('change',renderMeals);
  document.getElementById('saveDay').addEventListener('click',save);
  document.getElementById('resetDay').addEventListener('click',reset);
  document.querySelectorAll('.seg-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.seg-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderVeg(btn.dataset.season);}));
  const fm=document.getElementById('freeMealSelect');fm.value=getFreeMeal();fm.addEventListener('change',()=>{localStorage.setItem(freeMealKey,fm.value);renderShopping();});
  document.getElementById('clearPurchased').addEventListener('click',()=>{localStorage.removeItem(purchasedKey(currentWeek()));renderShopping();});
  const form=document.getElementById('measureForm');form.measureDate.value=todayISO();form.addEventListener('submit',saveMeasurement);
  document.getElementById('metricSelect').addEventListener('change',renderProgress);
  renderProgress();renderShopping();
  if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
(() => {
  const TARGET = 1350;
  const CYCLE_START = '2026-10-12';
  const TARGET_MACRO = {p:100,c:160,f:45};
  const FIBER_TARGET = 30;
  const breadOverridePrefix='breadOverrideDashboard1350_20261012';

  const I=(name,qty,unit,category)=>({name,qty,unit,category});
  const K=(p,c,f)=>Math.round(p*4+c*4+f*9);
  const O=(name,detail,p,c,f,ingredients,source=false)=>({name,detail,p,c,f,kcal:K(p,c,f),ingredients,source});

  const days=[
    {id:'lun',label:'Lunedì'},{id:'mar',label:'Martedì'},{id:'mer',label:'Mercoledì'},
    {id:'gio',label:'Giovedì'},{id:'ven',label:'Venerdì'},{id:'sab',label:'Sabato'},{id:'dom',label:'Domenica'}
  ];
  const dayIndex={lun:0,mar:1,mer:2,gio:3,ven:4,sab:5,dom:6};

  const weekMeta={
    1:{range:'12–18 ottobre',theme:'Programmazione settimanale'},
    2:{range:'19–25 ottobre',theme:'Programmazione settimanale'},
    3:{range:'26 ottobre–1 novembre',theme:'Programmazione settimanale'},
    4:{range:'2–8 novembre',theme:'Programmazione settimanale'}
  };

  const weekDates={
    1:{lun:{n:12,m:'ott'},mar:{n:13,m:'ott'},mer:{n:14,m:'ott'},gio:{n:15,m:'ott'},ven:{n:16,m:'ott'},sab:{n:17,m:'ott'},dom:{n:18,m:'ott'}},
    2:{lun:{n:19,m:'ott'},mar:{n:20,m:'ott'},mer:{n:21,m:'ott'},gio:{n:22,m:'ott'},ven:{n:23,m:'ott'},sab:{n:24,m:'ott'},dom:{n:25,m:'ott'}},
    3:{lun:{n:26,m:'ott'},mar:{n:27,m:'ott'},mer:{n:28,m:'ott'},gio:{n:29,m:'ott'},ven:{n:30,m:'ott'},sab:{n:31,m:'ott'},dom:{n:1,m:'nov'}},
    4:{lun:{n:2,m:'nov'},mar:{n:3,m:'nov'},mer:{n:4,m:'nov'},gio:{n:5,m:'nov'},ven:{n:6,m:'nov'},sab:{n:7,m:'nov'},dom:{n:8,m:'nov'}}
  };

  // Quota pane giornaliera.
  const bread={
    1:{lun:0,mar:40,mer:30,gio:45,ven:25,sab:0,dom:30},
    2:{lun:0,mar:25,mer:45,gio:45,ven:35,sab:0,dom:30},
    3:{lun:0,mar:40,mer:30,gio:45,ven:35,sab:0,dom:30},
    4:{lun:0,mar:25,mer:45,gio:45,ven:35,sab:0,dom:30}
  };
  const breadMacro=q=>({p:0.085*q,c:0.49*q,f:0.025*q,kcal:K(.085*q,.49*q,.025*q)});

  const breadOverrideKey=(w,d)=>`${breadOverridePrefix}_w${w}_${d}`;
  const getBreadQty=(w,d)=>{const raw=localStorage.getItem(breadOverrideKey(w,d));if(raw!==null){const v=Number(raw);if(Number.isFinite(v)&&v>=0)return v;}return bread[w][d];};
  const setBreadQty=(w,d,v)=>{if(v==null||v===''){localStorage.removeItem(breadOverrideKey(w,d));return;}const n=Number(v);if(Number.isFinite(n)&&n>=0)localStorage.setItem(breadOverrideKey(w,d),String(Math.round(n)));};

  const dayFullDate=(w,d)=>{
    const dt=weekDates[w][d], label=days.find(x=>x.id===d)?.label || '';
    const month=dt.m==='ott'?'ottobre':'novembre';
    return `${label.toUpperCase()}, ${dt.n} ${month}`;
  };

  function estimateFiberIngredient(x){
    const name=(x.name||'').toLowerCase(), cat=x.category||'', q=Number(x.qty)||0, unit=x.unit||'g';
    if(cat==='Verdura'){
      return unit==='g' ? q*0.022 : q*2.2;
    }
    if(cat==='Frutta'){
      if(unit==='pz'){
        if(name.includes('pera')) return 4.5*q;
        if(name.includes('mela')) return 3.8*q;
        if(name.includes('kiwi')) return 2.3*q;
        if(name.includes('arancia')) return 2.8*q;
        if(name.includes('pesca')) return 2*q;
        return 2.5*q;
      }
      if(name.includes('fragole') || name.includes('frutti')) return q*0.02;
      if(name.includes('banana')) return q*0.026;
      if(name.includes('cilieg')) return q*0.016;
      return q*0.02;
    }
    if(cat==='Legumi'){
      return unit==='g' ? q*0.07 : q*7;
    }
    if(cat==='Cereali e pane'){
      if(name.includes('avena') || name.includes('muesli')) return q*0.09;
      if(name.includes('pane') || name.includes('segale') || name.includes('frisella') || name.includes('piadina')) return q*0.05;
      if(name.includes('mais')) return q*0.04;
      if(name.includes('pasta')) return q*0.03;
      if(name.includes('orzo') || name.includes('farro')) return q*0.06;
      if(name.includes('riso')) return q*0.015;
      return q*0.035;
    }
    return 0;
  }

  function estimateFiberForSelection(w,d,sel){
    let fiber = estimateFiberIngredient({name:'Pane integrale', qty:getBreadQty(w,d), unit:'g', category:'Cereali e pane'});
    ['breakfast','snack','lunch','afternoon','dinner'].forEach(id=>{
      if(d==='sab'&&id==='dinner'){(pizza.ingredients||[]).forEach(x=>fiber+=estimateFiberIngredient(x)); return;}
      const opts=mealOptions(w,d,id), idx=sel[id];
      if(Number.isInteger(idx) && opts[idx]) (opts[idx].ingredients||[]).forEach(x=>fiber+=estimateFiberIngredient(x));
    });
    return Math.round(fiber*10)/10;
  }

  function toggleMealCard(card){
    card.classList.toggle('open');
    const btn=card.querySelector('.meal-toggle');
    if(btn) btn.setAttribute('aria-expanded', card.classList.contains('open') ? 'true' : 'false');
  }

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

  // Una giornata a settimana ribilanciata per includere una cena completamente vegetale.
  // Target indicativo: ~1450 kcal, ~100-105 g proteine, ~155-160 g carboidrati, ~44-45 g grassi.
  const plantDinnerDay={
    breakfast:[
      O('Yogurt greco SL, avena e kiwi','Yogurt greco 0% SL 200 g · avena 20 g · kiwi 100 g',23,32,3,[I('Yogurt greco 0% SL',200,'g','Latticini SL'),I('Avena',20,'g','Cereali e pane'),I('Kiwi',100,'g','Frutta')],true),
      O('Skyr SL, muesli e frutti rossi','Skyr SL 200 g · muesli 25 g · frutti rossi 100 g',24,31,3,[I('Skyr SL',200,'g','Latticini SL'),I('Muesli',25,'g','Cereali e pane'),I('Frutti di bosco',100,'g','Frutta')]),
      O('Yogurt greco SL, segale e miele','Yogurt greco 0% SL 200 g · pane di segale 30 g · miele 8 g',23,33,2.5,[I('Yogurt greco 0% SL',200,'g','Latticini SL'),I('Pane di segale',30,'g','Cereali e pane'),I('Miele',8,'g','Condimenti')])
    ],
    snack:[
      O('Pera','Pera 100 g',0.5,15,0.2,[I('Pera',100,'g','Frutta')],true),
      O('Kiwi','Kiwi 130 g',1,15,0.5,[I('Kiwi',130,'g','Frutta')]),
      O('Arancia','Arancia 150 g',1,16,0.2,[I('Arancia',150,'g','Frutta')])
    ],
    lunch:[
      O('Pollo, riso e verdure','Petto di pollo 130 g · riso basmati 40 g a crudo · verdure 250 g · EVO 12 g',45,44,18,[I('Petto di pollo',130,'g','Carne, pesce e uova'),I('Riso basmati',40,'g','Cereali e pane'),I('Verdure stagionali miste',250,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')],true),
      O('Tacchino, farro e verdure','Tacchino 140 g · farro 45 g a crudo · verdure 250 g · EVO 12 g',46,43,17,[I('Tacchino',140,'g','Carne, pesce e uova'),I('Farro',45,'g','Cereali e pane'),I('Verdure stagionali miste',250,'g','Verdura'),I('Olio EVO',12,'g','Condimenti')]),
      O('Vitello, orzo e verdure','Vitello magro 140 g · orzo 45 g a crudo · verdure 250 g · EVO 11 g',42,44,17,[I('Vitello magro',140,'g','Carne, pesce e uova'),I('Orzo',45,'g','Cereali e pane'),I('Verdure stagionali miste',250,'g','Verdura'),I('Olio EVO',11,'g','Condimenti')])
    ],
    afternoon:[
      O('Skyr SL','Skyr SL 125 g',14,7,0.3,[I('Skyr SL',125,'g','Latticini SL')],true),
      O('Yogurt greco SL','Yogurt greco 0% SL 150 g',15,7,1,[I('Yogurt greco 0% SL',150,'g','Latticini SL')]),
      O('Fiocchi di latte SL','Fiocchi di latte SL 120 g',15,5,3,[I('Fiocchi di latte SL',120,'g','Latticini SL')])
    ],
    dinner:[
      O('Lenticchie e verdure','Lenticchie cotte e sgocciolate 200 g · verdure 250 g · EVO 11 g',21,52,12,[I('Lenticchie cotte',200,'g','Legumi'),I('Verdure stagionali miste',250,'g','Verdura'),I('Olio EVO',11,'g','Condimenti')],true),
      O('Ceci e verdure','Ceci cotti e sgocciolati 170 g · verdure 250 g · EVO 8 g',19,52,13,[I('Ceci cotti',170,'g','Legumi'),I('Verdure stagionali miste',250,'g','Verdura'),I('Olio EVO',8,'g','Condimenti')]),
      O('Fagioli cannellini e verdure','Fagioli cannellini cotti 220 g · verdure 250 g · EVO 11 g',20,50,12,[I('Fagioli cannellini cotti',220,'g','Legumi'),I('Verdure stagionali miste',250,'g','Verdura'),I('Olio EVO',11,'g','Condimenti')])
    ]
  };

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

  const pizza=O('Pizza Margherita','Pizza Margherita al piatto 200 g',18,76,16,[I('Pizza Margherita',200,'g','Pasti speciali')],true);
  const flexibleMeal1350=O('Pasto flessibile','Budget massimo 420 kcal · scegli liberamente restando entro questo limite',20,45,18,[I('Pasto flessibile',1,'pz','Pasti speciali')],true);

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

  // Domenica: un solo pasto libero.
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
    ottobre:['Finocchi','Zucca','Broccoli','Cavolfiore','Radicchio','Carote','Bietole','Spinaci','Rucola'],
    novembre:['Finocchi','Zucca','Broccoli','Cavolfiore','Cavolo nero','Radicchio','Carote','Bietole','Spinaci']
  };
  const metricMeta={
    weight:{label:'Peso',unit:'kg'},waist:{label:'Vita',unit:'cm'},abdomen:{label:'Addome',unit:'cm'},
    hips:{label:'Fianchi',unit:'cm'},thigh:{label:'Coscia',unit:'cm'},arm:{label:'Braccio',unit:'cm'},chest:{label:'Torace',unit:'cm'}
  };

  const weekSelect=document.getElementById('weekSelect');
  const daySelect=document.getElementById('daySelect');
  const list=document.getElementById('mealList');
  const weekend=document.getElementById('weekendNotice');
  const legacyProgressKey='bodyProgress_v1';
  const activeProfileKey='dashboardActiveProfile_v1';
  const profiles={federica:{name:'Federica'},davide:{name:'Davide'}};
  let activeProfile=localStorage.getItem(activeProfileKey)||'federica';
  if(!profiles[activeProfile]) activeProfile='federica';
  const progressKey=()=>`bodyProgress_v2_${activeProfile}`;
  const purchasedKey=w=>`shoppingPurchased_dashboard1350_20261012_w${w}`;
  const legacyPurchasedKey=w=>`shoppingPurchased_labrocca1450_w${w}`;
  const freeMealKey='shoppingSundayFree_v1';
  const storeKey=(w,d)=>`pianoDashboard1350_20261012_w${w}_${d}`;
  const legacyStoreKey=(w,d)=>`pianoLabrocca1450_w${w}_${d}`;

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
    if(d==='lun' && plantDinnerDay[meal]) return plantDinnerDay[meal];
    if(meal==='breakfast') return B[breakfastKey[d]];
    if(meal==='snack') {
      const f=fruitRotation[w][d]; return fruitOpts(f[0],f[1],f[2]);
    }
    if(meal==='afternoon') {
      const f=afternoonRotation[w][d]; return fruit2Opts(f[0],f[1],f[2]);
    }
    if(d==='sab'&&meal==='dinner') return [pizza];
    if(d==='dom'&&(meal==='lunch'||meal==='dinner')){if(meal===getFreeMeal())return [flexibleMeal1350];return sundayMain[w][meal];}
    if(meal==='lunch') return lunch[keyFor(w,d)] || sundayMain[w].lunch;
    if(meal==='dinner') return dinner[keyFor(w,d)] || sundayMain[w].dinner;
    return [];
  }

  function getStoredSelections(w,d){
    try{
      const current=localStorage.getItem(storeKey(w,d));
      const parsed=JSON.parse(current||'{}')||{};
      return parsed;
    }catch(e){return {}}
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


  const PETAL_COLORS=['#A94A38','#B5533F','#C0624A','#C96F4F','#D17C50','#D88A4F','#DE974E','#E2A24F','#E5AC55','#E8B65C'];
  function renderPetals(kcal,has){
    const svg=document.getElementById('petalGauge');if(!svg)return;
    const filled=has?Math.min(10,Math.round(kcal/TARGET*10)):0;
    let h='';
    for(let i=0;i<10;i++){const on=i<filled;h+=`<path d="M175 90 C165 78 165 52 175 24 C185 52 185 78 175 90Z" transform="rotate(${-81+18*i} 175 142)" fill="${on?PETAL_COLORS[i]:'#F6EBE0'}" stroke="${on?'none':'#E8D2C3'}" stroke-width="1.5"/>`;}
    svg.innerHTML=h;
  }
  function plannedDayKcal(w,d){
    const sel=getStoredSelections(w,d),bm=breadMacro(getBreadQty(w,d));
    let p=bm.p,c=bm.c,f=bm.f;
    ['breakfast','snack','lunch','afternoon','dinner'].forEach(id=>{
      if(d==='sab'&&id==='dinner'){p+=pizza.p;c+=pizza.c;f+=pizza.f;return;}
      const opts=mealOptions(w,d,id),idx=Number.isInteger(sel[id])?sel[id]:0,o=opts[idx]||opts[0];
      if(o){p+=o.p;c+=o.c;f+=o.f;}
    });
    return K(p,c,f);
  }
  function mealDayDate(w,d){
    const dt=new Date(CYCLE_START+'T12:00:00');
    dt.setDate(dt.getDate()+(currentCycleNumber()-1)*28+(w-1)*7+dayIndex[d]);
    return dt;
  }

  function renderCalendar(){
    const w=currentWeek(), d=currentDay();
    const range=document.getElementById('calendarRange');
    const wrap=document.getElementById('calendarDays');
    if(!range||!wrap)return;
    range.textContent=weekMeta[w].range;
    wrap.innerHTML=days.map(day=>{
      const dt=weekDates[w][day.id];
      const pct=Math.min(100,Math.round(plannedDayKcal(w,day.id)/TARGET*100));
      const isToday=mealDayDate(w,day.id).toDateString()===new Date().toDateString();
      return `<button type="button" class="calendar-day ${day.id===d?'active':''} ${isToday?'is-today':''}" data-day="${day.id}" style="--fill:${pct}%" aria-pressed="${day.id===d?'true':'false'}" aria-label="${day.label} ${dt.n} ${dt.m}, circa ${pct}% del tetto">
        <span>${day.label.slice(0,3).toUpperCase()}</span>
        <strong>${dt.n}</strong>
        <small>${dt.m}</small>
      </button>`;
    }).join('');
    wrap.querySelectorAll('.calendar-day').forEach(btn=>btn.addEventListener('click',()=>{
      daySelect.value=btn.dataset.day;
      renderMeals();
      renderShopping();
    }));
  }

  function shiftWeek(delta){
    let w=currentWeek()+delta;
    if(w<1)w=4;
    if(w>4)w=1;
    weekSelect.value=String(w);
    renderMeals();
    renderShopping();
  }

  function renderScheduleHeader(){
    const w=currentWeek();
    document.getElementById('cycleLabel').textContent=`Settimana ${w} di 4 · ${weekMeta[w].range}`;
    const cycle=currentCycleNumber();
    document.getElementById('cycleNote').textContent=cycle===1
      ? 'Dal 9 novembre il ciclo riparte automaticamente dalla Settimana 1.'
      : `Ciclo ${cycle}: dopo la Settimana 4 si torna alla 1.`;
    document.getElementById('shoppingWeekLabel').textContent=`settimana ${w}`;
    renderCalendar();
  }


  function renderMeals(){
    const w=currentWeek(),d=currentDay(),sel=getStoredSelections(w,d);
    const slots=[
      ['breakfast','Colazione','☀️'],
      ['snack','Metà mattina','🍎'],
      ['lunch','Pranzo','🌤️'],
      ['afternoon','Merenda','🍐'],
      ['dinner','Cena','🌙']
    ];
    list.innerHTML=slots.map(([id,title,icon],pos)=>{
      const opts=mealOptions(w,d,id);
      if(d==='sab'&&id==='dinner'){
        const o=opts[0];
        return `<article class="meal-card fixed-meal open" data-meal="${id}">
          <button type="button" class="meal-head meal-toggle" aria-expanded="true">
            <div class="meal-head-main"><span class="meal-icon">${icon}</span><div><span class="meal-name">${title}</span><small>${o.kcal} kcal</small></div></div>
            <span class="meal-caret">⌃</span>
          </button>
          <div class="meal-body"><div class="option-list single-option">
            <label class="meal-option">
              <input type="radio" name="${id}" value="0" checked disabled>
              <span class="option-body fixed">
                <span class="option-letter">🍕</span>
                <span class="option-text"><strong>${o.name}</strong><small>${o.detail}</small><span class="source-badge">Consigliata</span></span>
                <span class="option-macro"><b>${o.kcal} kcal</b></span>
              </span>
            </label>
          </div></div></article>`;
      }
      const open = pos===0 ? ' open' : '';
      const expanded = pos===0 ? 'true' : 'false';
      const chosenIdx = Number.isInteger(sel[id]) ? sel[id] : 0;
      const chosenKcal = opts[chosenIdx]?.kcal || opts[0]?.kcal || '—';
      return `<article class="meal-card${open}" data-meal="${id}">
        <button type="button" class="meal-head meal-toggle" aria-expanded="${expanded}">
          <div class="meal-head-main"><span class="meal-icon">${icon}</span><div><span class="meal-name">${title}</span><small>${chosenKcal} kcal</small></div></div>
          <span class="meal-caret">${pos===0?'⌃':'⌄'}</span>
        </button>
        <div class="meal-body">
          <div class="option-list">${opts.map((o,i)=>`<label class="meal-option">
            <input type="radio" name="${id}" value="${i}" ${sel[id]===i || (!Number.isInteger(sel[id]) && i===0)?'checked':''} aria-label="${title}: alternativa ${String.fromCharCode(65+i)}">
            <span class="option-body">
              <span class="option-top"><span class="option-letter">${String.fromCharCode(65+i)}</span><span class="option-check">${(sel[id]===i || (!Number.isInteger(sel[id]) && i===0))?'✓':'○'}</span></span>
              <span class="option-text"><strong>${o.name}</strong><small>${o.detail}</small>${o.source?'<span class="source-badge">Consigliata</span>':''}</span>
              <span class="option-cal">${o.kcal} kcal</span>
            </span>
          </label>`).join('')}</div>
        </div>
      </article>`;
    }).join('');

    list.querySelectorAll('input').forEach(el=>el.addEventListener('change',()=>{
      autoSave();
      const card=el.closest('.meal-card');
      const headSmall=card?.querySelector('.meal-head small');
      const checked=card?.querySelector('input:checked');
      const opts=mealOptions(w,d,card?.dataset.meal);
      if(headSmall && checked && opts[Number(checked.value)]) headSmall.textContent=`${opts[Number(checked.value)].kcal} kcal`;
      card?.querySelectorAll('.option-check').forEach((n,ix)=>n.textContent=ix===Number(el.value)?'✓':'○');
      updateTotals();
      renderShopping();
    }));
    list.querySelectorAll('.meal-toggle').forEach(btn=>btn.addEventListener('click',()=>{
      const card=btn.closest('.meal-card');
      toggleMealCard(card);
      card.querySelector('.meal-caret').textContent=card.classList.contains('open')?'⌃':'⌄';
    }));
    const toggleDayView=document.getElementById('toggleDayView'); if(toggleDayView) toggleDayView.textContent='Vedi giornata ›';
    updateTotals(); updateWeekend(); renderScheduleHeader(); renderTodayTraining();
  }

  function updateWeekend(){
    const d=currentDay();
    if(d==='lun'){
      weekend.hidden=false;
      weekend.innerHTML='🌱 <strong>Lunedì:</strong> giornata ribilanciata con <strong>cena vegetale a base di legumi</strong>. Non è previsto pane aggiuntivo: i legumi coprono già parte della quota di carboidrati. Il resto della giornata resta più proteico per mantenere il totale entro 1350 kcal.';
    }else if(d==='sab'){
      weekend.hidden=false;
      weekend.innerHTML='🍕 <strong>Sabato:</strong> pizza Margherita 200 g fissa e nessuna quota di pane aggiuntiva, come previsto dalla programmazione.';
    }else if(d==='dom'){
      weekend.hidden=false;
      weekend.innerHTML='🍽️ <strong>Domenica:</strong> è previsto <strong>un pasto flessibile con budget massimo di circa 420 kcal</strong>, scelto nella sezione Spesa.';
    }else weekend.hidden=true;
  }


  function updateTotals(){
    const w=currentWeek(),d=currentDay(),sel=getSelections();
    const breadQty=getBreadQty(w,d);
    const bm=breadMacro(breadQty);
    let p=bm.p,c=bm.c,f=bm.f,count=0,required=5;
    ['breakfast','snack','lunch','afternoon','dinner'].forEach(id=>{
      if(d==='sab'&&id==='dinner'){const o=pizza;p+=o.p;c+=o.c;f+=o.f;count++;return;}
      const opts=mealOptions(w,d,id),idx=sel[id];
      if(Number.isInteger(idx)&&opts[idx]){const o=opts[idx];p+=o.p;c+=o.c;f+=o.f;count++;}
    });
    const kcal=K(p,c,f);
    const fiber=estimateFiberForSelection(w,d,sel);

    document.getElementById('dayTitle').textContent=`OGGI, ${dayFullDate(w,d).split(', ')[1].toUpperCase()}`;
    document.getElementById('breadQty').textContent=`${breadQty} g`;
    document.getElementById('kcalTarget').textContent=TARGET;
    document.getElementById('kcalTotal').textContent=count?kcal:'—';
    document.getElementById('proteinTotal').textContent=count?(Math.round(p*10)/10).toString().replace('.',','):'—';
    document.getElementById('carbTotal').textContent=count?(Math.round(c*10)/10).toString().replace('.',','):'—';
    document.getElementById('fatTotal').textContent=count?(Math.round(f*10)/10).toString().replace('.',','):'—';
    document.getElementById('fiberTotal').textContent=count?fiber.toString().replace('.',','):'—';

    const ek=p*4+c*4+f*9;
    const cp=ek?Math.round(c*4/ek*100):0,pp=ek?Math.round(p*4/ek*100):0,fp=ek?100-cp-pp:0;
    const macroTarget={c:44,p:29,f:27};
    document.getElementById('carbPct').textContent=count?`${cp}%`:'—';
    document.getElementById('proteinPct').textContent=count?`${pp}%`:'—';
    document.getElementById('fatPct').textContent=count?`${fp}%`:'—';
    document.getElementById('carbTargetPct').textContent=`${macroTarget.c}%`;
    document.getElementById('proteinTargetPct').textContent=`${macroTarget.p}%`;
    document.getElementById('fatTargetPct').textContent=`${macroTarget.f}%`;
    const dist=Math.abs(cp-macroTarget.c)+Math.abs(pp-macroTarget.p)+Math.abs(fp-macroTarget.f);
    const ratio = document.getElementById('ratioStatus');
    if(ratio) ratio.textContent=count===required?(dist<=6?'coerente':'vicino al target'):'parziale';

    renderPetals(kcal,count>0);
    [['proteinBar',p/TARGET_MACRO.p],['carbBar',c/TARGET_MACRO.c],['fatBar',f/TARGET_MACRO.f],['fiberBar',fiber/FIBER_TARGET]].forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.style.width=`${count?Math.max(0,Math.min(100,Math.round(v*100))):0}%`;});
    const fill=document.getElementById('kcalProgress'),status=document.getElementById('statusText');
    const pct=count?Math.min(100,Math.round(kcal/TARGET*100)):0;
    fill.style.width=`${pct}%`;
    if(count<required){
      status.textContent=`${pct}% del tuo obiettivo`;
      fill.style.background='linear-gradient(90deg,#e18d72,#f0c39a)';
    }else{
      status.textContent=`${pct}% del tuo obiettivo`;
      fill.style.background='linear-gradient(90deg,#d97d60,#eab28b)';
    }
  }

  function autoSave(){
localStorage.setItem(storeKey(currentWeek(),currentDay()),JSON.stringify(getSelections()));}
  function save(){autoSave();flash('Scelte salvate');renderShopping();}
  function reset(){localStorage.removeItem(storeKey(currentWeek(),currentDay()));renderMeals();flash('Giorno azzerato');renderShopping();}
  function flash(t){const m=document.getElementById('saveMessage');m.textContent=t;setTimeout(()=>m.textContent='',1600);}
  function renderVeg(month){document.getElementById('vegChips').innerHTML=season[month].map(v=>`<span class="veg-chip">${v}</span>`).join('');}

  function setTab(name){
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
    document.querySelectorAll('.tab-panel').forEach(p=>p.hidden=p.id!==`${name}Panel`);
    if(name==='shopping')renderShopping();
    if(name==='progress'){renderProgress();renderPhotos();}
    if(name==='training')renderTraining();
  }

  // SHOPPING
  function getFreeMeal(){return localStorage.getItem(freeMealKey)==='dinner'?'dinner':'lunch';}
  function getPurchased(w){
    try{
      const current=localStorage.getItem(purchasedKey(w));
      const legacy=localStorage.getItem(legacyPurchasedKey(w));
      const parsed=JSON.parse(current||legacy||'{}')||{};
      if(!current&&legacy)localStorage.setItem(purchasedKey(w),JSON.stringify(parsed));
      return parsed;
    }catch(e){return {}}
  }
  function setPurchased(w,v){localStorage.setItem(purchasedKey(w),JSON.stringify(v));}
  function pKey(x){return `${x.category}|${x.name}|${x.unit}`;}
  function fmtQty(q,u){q=Math.round(q*10)/10;if(u==='g'&&q>=1000)return `${(q/1000).toFixed(q%1000===0?0:2).replace('.',',')} kg`;if(u==='ml'&&q>=1000)return `${(q/1000).toFixed(q%1000===0?0:2).replace('.',',')} l`;return `${Number.isInteger(q)?q:q.toFixed(1).replace('.',',')} ${u}`;}

  function aggregateShopping(){
    const w=currentWeek(),free=getFreeMeal(),map=new Map(),missing=[];let selected=0,required=33;
    const add=x=>{const k=pKey(x);if(!map.has(k))map.set(k,{...x,qty:0});map.get(k).qty+=x.qty;};
    days.forEach(day=>{
      add(I('Pane integrale / lievitazione naturale',getBreadQty(w,day.id),'g','Cereali e pane'));
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
    const order=['Carne, pesce e uova','Legumi','Latticini SL','Cereali e pane','Verdura','Frutta','Condimenti','Bevande','Pasti speciali'],groups={};
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
  function migrateLegacyProgress(){
    if(activeProfile!=='federica') return;
    const newKey=progressKey();
    if(localStorage.getItem(newKey)) return;
    const legacy=localStorage.getItem(legacyProgressKey);
    if(legacy) localStorage.setItem(newKey,legacy);
  }
  function getProgress(){
    migrateLegacyProgress();
    try{const v=JSON.parse(localStorage.getItem(progressKey())||'[]');return Array.isArray(v)?v:[]}catch(e){return []}
  }
  function setProgress(v){localStorage.setItem(progressKey(),JSON.stringify(v));}
  function n(v){if(v==='')return null;const x=Number(v);return Number.isFinite(x)&&x>0&&x<1000?Math.round(x*10)/10:null;}
  function todayISO(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function fmtDate(iso){if(!iso)return '—';const [y,m,d]=iso.split('-');return `${d}/${m}/${y}`;}
  function saveMeasurement(e){e.preventDefault();const f=e.currentTarget,r={id:Date.now(),date:f.measureDate.value};Object.keys(metricMeta).forEach(k=>r[k]=n(f.elements[k].value));const s=document.getElementById('measureStatus');if(!r.date){s.textContent='Inserisci la data.';return;}if(!Object.keys(metricMeta).some(k=>r[k]!=null)){s.textContent='Inserisci almeno un valore.';return;}let a=getProgress();const i=a.findIndex(x=>x.date===r.date);if(i>=0){r.id=a[i].id;a[i]=r}else a.push(r);a.sort((x,y)=>x.date.localeCompare(y.date));setProgress(a);s.textContent=i>=0?'Misurazione aggiornata.':'Misurazione salvata.';f.reset();f.measureDate.value=todayISO();renderProgress();}
  function deleteMeasurement(id){setProgress(getProgress().filter(x=>x.id!==id));renderProgress();}
  function delta(a,b,u){if(a==null||b==null)return '—';const d=Math.round((b-a)*10)/10;return `${d>0?'+':''}${d} ${u}`;}
  function renderProfileUI(){
    document.querySelectorAll('.profile-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.profile===activeProfile));
    const name=profiles[activeProfile]?.name||'Federica';
    const title=document.getElementById('progressProfileName');
    if(title) title.textContent=name;
    const hn=document.getElementById('heroName');if(hn)hn.textContent=name;
    const hd=document.getElementById('heroDate');
    if(hd){const t=new Date();hd.textContent=`${['DOMENICA','LUNEDÌ','MARTEDÌ','MERCOLEDÌ','GIOVEDÌ','VENERDÌ','SABATO'][t.getDay()]} ${t.getDate()} ${monthNames[t.getMonth()].toUpperCase()}`;}
  }
  function switchProfile(profile){
    if(!profiles[profile]||profile===activeProfile)return;
    activeProfile=profile;
    localStorage.setItem(activeProfileKey,profile);
    renderProfileUI();
    const form=document.getElementById('measureForm');
    if(form){form.reset();form.measureDate.value=todayISO();}
    const photoDate=document.getElementById('progressPhotoDate');
    if(photoDate) photoDate.value=todayISO();
    const note=document.getElementById('progressPhotoNote');
    if(note) note.value='';
    renderProgress();
    renderPhotos();
    if(typeof renderTraining==='function')renderTraining();
  }
  function renderProgress(){
    renderProfileUI();
    const a=getProgress(),last=a[a.length-1],first=a[0];
    document.getElementById('latestWeight').textContent=last?.weight!=null?`${last.weight} kg`:'—';
    document.getElementById('weightDelta').textContent=first&&last?delta(first.weight,last.weight,'kg'):'—';
    document.getElementById('latestMeasureDate').textContent=last?fmtDate(last.date):'—';
    document.getElementById('measureCount').textContent=a.length;
    renderHistory(a);
    renderChart(a,document.getElementById('metricSelect').value);
  }
  function renderHistory(a){const tb=document.getElementById('historyBody'),em=document.getElementById('historyEmpty');if(!a.length){tb.innerHTML='';em.hidden=false;return;}em.hidden=true;tb.innerHTML=[...a].reverse().map(x=>`<tr><td>${fmtDate(x.date)}</td><td>${x.weight??'—'}</td><td>${x.waist??'—'}</td><td>${x.abdomen??'—'}</td><td>${x.hips??'—'}</td><td>${x.thigh??'—'}</td><td>${x.arm??'—'}</td><td>${x.chest??'—'}</td><td><button type="button" class="delete-row" data-id="${x.id}">×</button></td></tr>`).join('');tb.querySelectorAll('.delete-row').forEach(b=>b.addEventListener('click',()=>deleteMeasurement(Number(b.dataset.id))));}
  function renderChart(a,m){const svg=document.getElementById('progressChart'),meta=metricMeta[m],pts=a.filter(x=>x[m]!=null).map(x=>({date:x.date,value:x[m]}));document.getElementById('chartCaption').textContent=`Andamento ${meta.label.toLowerCase()} (${meta.unit})`;if(pts.length<2){svg.innerHTML='<text x="50%" y="50%" text-anchor="middle" class="chart-empty">Servono almeno 2 rilevazioni</text>';return;}const W=640,H=230,p={l:52,r:18,t:18,b:36};let lo=Math.min(...pts.map(x=>x.value)),hi=Math.max(...pts.map(x=>x.value));if(lo===hi){lo--;hi++;}const ex=(hi-lo)*.12;lo-=ex;hi+=ex;const X=i=>p.l+i/(pts.length-1)*(W-p.l-p.r),Y=v=>p.t+(hi-v)/(hi-lo)*(H-p.t-p.b);const grid=[0,.25,.5,.75,1].map(t=>{const v=hi-(hi-lo)*t,y=p.t+t*(H-p.t-p.b);return `<line x1="${p.l}" y1="${y}" x2="${W-p.r}" y2="${y}" class="chart-grid"/><text x="${p.l-8}" y="${y+4}" text-anchor="end" class="chart-label">${v.toFixed(1)}</text>`}).join('');const line=pts.map((x,i)=>`${X(i)},${Y(x.value)}`).join(' '),dots=pts.map((x,i)=>`<circle cx="${X(i)}" cy="${Y(x.value)}" r="4.5" class="chart-dot"><title>${fmtDate(x.date)}: ${x.value} ${meta.unit}</title></circle>`).join('');svg.innerHTML=`${grid}<polyline points="${line}" class="chart-line"/>${dots}`;}


  // PROGRESS PHOTOS — IndexedDB, separate per profile.
  const PHOTO_DB_NAME='dashboardProgressPhotos_v1';
  const PHOTO_STORE='photos';

  function openPhotoDB(){
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(PHOTO_DB_NAME,1);
      req.onupgradeneeded=()=>{
        const db=req.result;
        if(!db.objectStoreNames.contains(PHOTO_STORE)){
          const store=db.createObjectStore(PHOTO_STORE,{keyPath:'id',autoIncrement:true});
          store.createIndex('profile','profile',{unique:false});
          store.createIndex('date','date',{unique:false});
        }
      };
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
  }

  async function dbAddPhoto(record){
    const db=await openPhotoDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(PHOTO_STORE,'readwrite');
      const req=tx.objectStore(PHOTO_STORE).add(record);
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
      tx.oncomplete=()=>db.close();
    });
  }

  async function dbGetPhotos(profile){
    const db=await openPhotoDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(PHOTO_STORE,'readonly');
      const idx=tx.objectStore(PHOTO_STORE).index('profile');
      const req=idx.getAll(profile);
      req.onsuccess=()=>resolve((req.result||[]).sort((a,b)=>(b.date||'').localeCompare(a.date||'')||b.id-a.id));
      req.onerror=()=>reject(req.error);
      tx.oncomplete=()=>db.close();
    });
  }

  async function dbDeletePhoto(id){
    const db=await openPhotoDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(PHOTO_STORE,'readwrite');
      const req=tx.objectStore(PHOTO_STORE).delete(id);
      req.onsuccess=()=>resolve();
      req.onerror=()=>reject(req.error);
      tx.oncomplete=()=>db.close();
    });
  }

  function compressImage(file,maxSide=1200,quality=.78){
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>{
        const img=new Image();
        img.onload=()=>{
          const ratio=Math.min(1,maxSide/Math.max(img.width,img.height));
          const w=Math.max(1,Math.round(img.width*ratio));
          const h=Math.max(1,Math.round(img.height*ratio));
          const canvas=document.createElement('canvas');
          canvas.width=w;canvas.height=h;
          const ctx=canvas.getContext('2d');
          ctx.drawImage(img,0,0,w,h);
          resolve(canvas.toDataURL('image/jpeg',quality));
        };
        img.onerror=()=>reject(new Error('Immagine non leggibile'));
        img.src=reader.result;
      };
      reader.onerror=()=>reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function handlePhotoUpload(files){
    const list=[...files].filter(f=>f.type.startsWith('image/'));
    if(!list.length)return;
    const status=document.getElementById('photoStatus');
    const date=document.getElementById('progressPhotoDate')?.value||todayISO();
    const note=(document.getElementById('progressPhotoNote')?.value||'').trim();
    status.textContent=list.length===1?'Salvataggio foto…':`Salvataggio di ${list.length} foto…`;
    let saved=0;
    try{
      for(const file of list){
        const dataUrl=await compressImage(file);
        await dbAddPhoto({
          profile:activeProfile,
          date,
          note,
          dataUrl,
          createdAt:Date.now()
        });
        saved++;
      }
      status.textContent=saved===1?'Foto salvata.':`${saved} foto salvate.`;
      document.getElementById('progressPhotoInput').value='';
      await renderPhotos();
      setTimeout(()=>{if(status.textContent.includes('salvat'))status.textContent='';},2200);
    }catch(err){
      status.textContent='Non sono riuscito a salvare la foto. Riprova con un file più leggero.';
    }
  }

  async function renderPhotos(){
    const gallery=document.getElementById('photoGallery');
    const empty=document.getElementById('photoEmpty');
    if(!gallery||!empty)return;
    try{
      const photos=await dbGetPhotos(activeProfile);
      empty.hidden=photos.length>0;
      gallery.innerHTML=photos.map(p=>`
        <article class="progress-photo-card" data-id="${p.id}">
          <button type="button" class="photo-open" data-id="${p.id}" aria-label="Apri foto del ${fmtDate(p.date)}">
            <img src="${p.dataUrl}" alt="Foto progresso ${profiles[activeProfile].name} del ${fmtDate(p.date)}" loading="lazy" />
          </button>
          <div class="photo-card-meta">
            <div><strong>${fmtDate(p.date)}</strong>${p.note?`<small>${escapeHtml(p.note)}</small>`:''}</div>
            <button type="button" class="photo-delete" data-id="${p.id}" aria-label="Elimina foto">×</button>
          </div>
        </article>`).join('');

      gallery.querySelectorAll('.photo-open').forEach(btn=>btn.addEventListener('click',()=>{
        const p=photos.find(x=>x.id===Number(btn.dataset.id));
        if(p)openPhotoLightbox(p);
      }));
      gallery.querySelectorAll('.photo-delete').forEach(btn=>btn.addEventListener('click',async()=>{
        if(!confirm('Eliminare questa foto dai progressi?'))return;
        await dbDeletePhoto(Number(btn.dataset.id));
        renderPhotos();
      }));
    }catch(err){
      gallery.innerHTML='<p class="micro">Archivio foto non disponibile in questa anteprima.</p>';
      empty.hidden=true;
    }
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  function openPhotoLightbox(p){
    const box=document.getElementById('photoLightbox');
    document.getElementById('photoLightboxImage').src=p.dataUrl;
    document.getElementById('photoLightboxDate').textContent=fmtDate(p.date);
    document.getElementById('photoLightboxNote').textContent=p.note||'';
    box.hidden=false;
    document.body.classList.add('lightbox-open');
  }

  function closePhotoLightbox(){
    const box=document.getElementById('photoLightbox');
    box.hidden=true;
    document.getElementById('photoLightboxImage').src='';
    document.body.classList.remove('lightbox-open');
  }


  // ===== ALLENAMENTO — Blocco 2 (19 ottobre – 29 novembre 2026), scheda di Federica =====
  const TRAIN_START='2026-10-19';
  const TRAIN_WEEKS=6;
  const trainDayIds=['lun','mar','mer','gio','ven','sab','dom'];
  const trainDayNames={lun:'Lunedì',mar:'Martedì',mer:'Mercoledì',gio:'Giovedì',ven:'Venerdì',sab:'Sabato',dom:'Domenica'};
  const trainDayLabels={lun:'FB A',mar:'Punch',mer:'Pilates',gio:'Libero',ven:'FB B',sab:'Cardio',dom:'Riposo'};
  const trainKind={lun:'A',mar:'P',ven:'B'};
  const trainOptional={mer:true,sab:true};
  const monthNames=['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  const trainWeekInfo=[
    {focus:'Rientro e tecnica',note:'Esercizi nuovi: parti leggera, RPE 6–7, impara la tecnica.'},
    {focus:'Più ripetizioni',note:'+1 rep per serie o +2,5% di carico.'},
    {focus:'Più carico',note:'Sali di carico solo se le serie restano pulite e riparti dal basso del range.'},
    {focus:'Consolidamento',note:'Top del range con il nuovo carico.'},
    {focus:'Picco',note:'Glutei a RPE 8, quadricipiti a RPE 7, parte alta a RPE 6–7, senza cedimento.'},
    {focus:'Scarico',note:'Meno 1 serie per esercizio, carichi della sett. 3, RPE 6.'}
  ];
  const trainFinisherMin={A:[10,10,10,10,10,5],B:[10,10,15,15,15,10]};
  const TRAIN_WARM='7–8 min cyclette/ellittica RPE 3–4 + mobilità caviglie/anche + 2 serie progressive leggere sul primo esercizio.';
  const X=(name,s,r,rpe,rec,note,late)=>({name,s,r,rpe,rec,note:note||'',late:late||''});
  const WORKOUTS={
    A:{title:'Full Body A',sub:'Glutei, catena posteriore e core; parte alta contenuta',dur:'70–80 min',rpe:'7–8',
      ex:[
        X('Goblet squat a box (o hack squat)',2,'10–12','7','90 s','Carico moderato, discesa lenta; quadricipiti al minimo utile'),
        X('RDL monopodalico con manubrio',3,'8–10/lato','7','90–120 s','Appoggia una mano, schiena neutra','8'),
        X("Abduzioni all'anca al cavo (o alla macchina)",2,'12–15/lato','8','45–60 s','Glutei medi, movimento lento senza slancio'),
        X('Trazioni assistite (o lat machine presa neutra)',3,'8–10','6–7','75–90 s','Se non riesci, lat machine'),
        X('Panca piana manubri, presa neutra',2,'8–10','6–7','60–75 s','In superset con il rematore'),
        X('Rematore a un braccio con manubrio',2,'10/lato','6–7','60–75 s',"Petto fermo, gomito verso l'anca"),
        X('Face pull ai cavi',2,'12–15','6–7','45–60 s','Spalle posteriori e postura; in superset con il Pallof press'),
        X('Pallof press (anti-rotazione)',3,'10/lato','6–7','45–60 s','Bacino fermo, pausa di 2 s con braccia tese'),
        X('Side plank (dalle ginocchia o piena)',2,'20–30 s/lato','6–7','45 s',"Bacino allineato, spalla lontana dall'orecchio")
      ],
      finisher:w=>`${trainFinisherMin.A[w-1]} min cyclette/ellittica a bassa resistenza, RPE 3–4. Leggero: il giorno dopo c'è il Punch.`,
      after:'3–5 min di defaticamento molto facile + stretching dolce 20–30 s (polpacci, femorali, glutei, flessori anca, pettorali/dorsali) + 5–10 min a gambe sollevate. Nessun dolore, niente stretching statico lungo prima dei pesi.'},
    B:{title:'Full Body B',sub:'Glutei, catena posteriore e core; nessun cedimento',dur:'70–80 min',rpe:'7–8',
      ex:[
        X('Hip thrust bilaterale con pausa 1–2 s (monopodalico quando sei pronta)',3,'10–12','7','90–120 s','Carico moderato, bacino neutro in alto','8'),
        X('Affondo indietro con manubri',2,'8–10/lato','7','75–90 s','Tieni un appoggio vicino se serve'),
        X('Kickback glutei al cavo (o alla macchina)',2,'12–15/lato','8','45–60 s','Senza inarcare la zona lombare'),
        X('Distensioni ai cavi in piedi (cable press)',2,'10–12','6–7','60–75 s','In superset con il rematore'),
        X('Rematore T-bar con petto appoggiato (o low row)',2,'8–10','6–7','60–75 s',''),
        X('Reverse hyper su panca (o superman alternato a terra)',2,'10–12','7–8','60–75 s','Pausa 1 s in alto, senza inarcare la zona lombare'),
        X('Arnold press seduta (o landmine press)',2,'8–10','6–7','60–75 s','Carico leggero-moderato'),
        X('Suitcase carry (camminata con un manubrio)',3,'20–25 m/lato','6–7','45–60 s','Busto dritto, non inclinarti'),
        X('Bird dog con pausa di 2 s',2,'8–10/lato','6–7','45 s','')
      ],
      finisher:w=>`${trainFinisherMin.B[w-1]} min a ritmo costante RPE 4–5 su cyclette o ellittica a bassa resistenza, in ambiente fresco. Mai prima dei pesi, niente HIIT.`,
      after:'3–5 min di defaticamento molto facile + stretching dolce 20–30 s + 5–10 min a gambe sollevate.'}
  };
  const trainFreeDays={
    mer:{title:'Pilates (facoltativo)',text:'Solo se hai tempo ed energie: 45–60 min, RPE 3–5. Utile per mobilità e benessere, ma brucia poche calorie e non sostituisce la forza.'},
    gio:{title:'Giorno libero',text:'Se ne hai voglia, 10–15 min di mobilità caviglie/anche o una camminata facile, poi gambe sollevate.'},
    sab:{title:'Cardio (facoltativo)',text:'Nuoto o acquagym, oppure cyclette/ellittica a bassa resistenza, a ritmo costante RPE 4–5, 30–40 min. È la prima cosa da aggiungere se il peso si ferma per 3 settimane. Se lo salti, non si recupera.'},
    dom:{title:'Riposo',text:'Giornata di recupero completo.'}
  };
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const trainKey=()=>`trainingLog_v1_${activeProfile}`;
  function getTrainLog(){try{const v=JSON.parse(localStorage.getItem(trainKey())||'{}');return v&&typeof v==='object'?v:{}}catch(e){return {}}}
  function setTrainLog(v){localStorage.setItem(trainKey(),JSON.stringify(v));}
  function trainEntry(log,w,day){const k=`w${w}_${day}`;if(!log[k])log[k]={done:false,ex:{}};if(!log[k].ex)log[k].ex={};return log[k];}
  function trainDate(w,day){const d=new Date(TRAIN_START+'T12:00:00');d.setDate(d.getDate()+(w-1)*7+trainDayIds.indexOf(day));return d;}
  function trainRange(w){const a=trainDate(w,'lun'),b=trainDate(w,'dom');return a.getMonth()===b.getMonth()?`${a.getDate()}–${b.getDate()} ${monthNames[a.getMonth()]}`:`${a.getDate()} ${monthNames[a.getMonth()]}–${b.getDate()} ${monthNames[b.getMonth()]}`;}
  function trainToday(){const now=new Date();now.setHours(12,0,0,0);const diff=Math.floor((now-new Date(TRAIN_START+'T12:00:00'))/86400000);return {diff,w:Math.min(TRAIN_WEEKS,Math.max(1,Math.floor(diff/7)+1)),day:['dom','lun','mar','mer','gio','ven','sab'][now.getDay()]};}
  const trainNow=trainToday();
  let trainWeek=trainNow.w;
  let trainDay=(trainNow.diff>=0&&trainNow.diff<TRAIN_WEEKS*7)?trainNow.day:'lun';
  const trainRpe=(ex,w)=>w===1?'6–7':(w===6?'6':((ex.late&&w>=3)?ex.late:ex.rpe));
  const trainSets=(ex,w)=>w===6?Math.max(1,ex.s-1):ex.s;
  const trainPrevWeek=w=>w===6?3:w-1;

  function trainStatusNote(){
    if(trainNow.diff<0){const d=trainDate(1,'lun');return `Il blocco parte lunedì ${d.getDate()} ${monthNames[d.getMonth()]}. Nel frattempo, questa settimana tienila leggera.`;}
    if(trainNow.diff>=TRAIN_WEEKS*7)return 'Il Blocco 2 è concluso: rivedi i carichi e riparti da una nuova scheda.';
    return '';
  }

  function renderTrainWeek(log){
    const w=trainWeek;
    const days=trainDayIds.map(id=>{
      const dt=trainDate(w,id),done=!!(log[`w${w}_${id}`]&&log[`w${w}_${id}`].done);
      return `<button type="button" class="calendar-day tr-day ${id===trainDay?'active':''} ${done?'tr-done-day':''}" data-tr-day="${id}" style="--fill:${done?100:0}%" aria-pressed="${id===trainDay?'true':'false'}">
        <span>${id.toUpperCase()}${done?' ✓':''}</span><strong>${dt.getDate()}</strong><small>${trainDayLabels[id]}</small></button>`;
    }).join('');
    const info=trainWeekInfo[w-1],status=trainStatusNote();
    return `<section class="calendar-card tr-week">
      <div class="calendar-head">
        <button type="button" class="calendar-nav" data-tr-nav="-1" aria-label="Settimana precedente">‹</button>
        <div><span class="calendar-eyebrow">SETTIMANA</span><strong>${w} di ${TRAIN_WEEKS} · ${trainRange(w)}</strong></div>
        <button type="button" class="calendar-nav" data-tr-nav="1" aria-label="Settimana successiva">›</button>
      </div>
      <div class="calendar-days">${days}</div>
      <div class="calendar-meta"><strong>${esc(info.focus)}</strong><span>${esc(info.note)}</span></div>
      ${status?`<p class="micro tr-status">${esc(status)}</p>`:''}
    </section>`;
  }

  function trainHead(day,title,sub,optionalDone,entry){
    const dt=trainDate(trainWeek,day);
    const check=(trainKind[day]||optionalDone)?`<label class="tr-done"><input type="checkbox" data-tr-done ${entry.done?'checked':''}><span>${entry.done?'Fatta':'Segna fatta'}</span></label>`:'';
    return `<div class="tr-head"><div><span class="section-mini">${trainDayNames[day].toUpperCase()} ${dt.getDate()} ${monthNames[dt.getMonth()].toUpperCase()}</span><h2>${trainTitleHtml(title)}</h2>${sub?`<p class="micro">${esc(sub)}</p>`:''}</div>${check}</div>`;
  }

  function renderTrainWorkout(log,key){
    const w=trainWeek,day=trainDay,wk=WORKOUTS[key],entry=log[`w${w}_${day}`]||{done:false,ex:{}};
    const prevEntry=log[`w${trainPrevWeek(w)}_${day}`]||{ex:{}};
    const exs=wk.ex.map((ex,i)=>{
      const saved=(entry.ex&&entry.ex[i])||{},prev=(prevEntry.ex&&prevEntry.ex[i]&&prevEntry.ex[i].kg)||'';
      return `<article class="tr-ex ${saved.ok?'ok':''}" data-ex="${i}">
        <div class="tr-ex-top"><span class="tr-num">${i+1}</span><div><strong>${esc(ex.name)}</strong>${ex.note?`<small>${esc(ex.note)}</small>`:''}</div></div>
        <div class="tr-chips"><span>${trainSets(ex,w)} × ${esc(ex.r)}</span><span>RPE ${esc(trainRpe(ex,w))}</span><span>rec. ${esc(ex.rec)}</span></div>
        <div class="tr-log">
          <label class="tr-kg"><span>Carico (kg)</span><input type="text" inputmode="decimal" maxlength="6" data-tr-kg value="${esc(saved.kg||'')}" placeholder="${prev?esc(prev):'—'}"></label>
          <small>${prev?`Sett. ${trainPrevWeek(w)}: ${esc(prev)} kg`:''}</small>
          <label class="tr-ok"><input type="checkbox" data-tr-ok ${saved.ok?'checked':''}><span>Fatto</span></label>
        </div></article>`;
    }).join('');
    return `<section class="tr-card">
      ${trainHead(day,wk.title,`${wk.sub} · ${wk.dur} · RPE ${wk.rpe}`,false,entry)}
      <div class="tr-box"><b>Riscaldamento</b><span>${esc(TRAIN_WARM)}</span></div>
      <div class="tr-ex-list">${exs}</div>
      <div class="tr-box"><b>Finisher</b><span>${esc(wk.finisher(w))}</span></div>
      <div class="tr-box"><b>Dopo i pesi</b><span>${esc(wk.after)}</span></div>
    </section>`;
  }

  function renderTrainPunch(log){
    const w=trainWeek,entry=log[`w${w}_mar`]||{done:false,ex:{}};
    let extra='';
    if(w>=4&&w<6)extra=" I picchi possono essere un po' più lunghi, ma niente HIIT aggiuntivo.";
    if(w===6)extra=' Settimana di scarico: RPE medio 5–6.';
    return `<section class="tr-card">
      ${trainHead('mar','Punch','45–55 min · RPE medio 6–7 con picchi 8',false,entry)}
      <div class="tr-box"><b>Come farlo</b><span>Cardio intenso controllato, niente HIIT aggiuntivo.${esc(extra)}</span></div>
      <div class="tr-box"><b>Basso impatto</b><span>Niente salti, piedi a terra anche nei picchi (chiedi all'istruttore le alternative). Ambiente fresco e, se prescritta, chiedi se indossare la compressione.</span></div>
    </section>`;
  }

  function renderTrainFree(log){
    const w=trainWeek,day=trainDay,f=trainFreeDays[day],entry=log[`w${w}_${day}`]||{done:false,ex:{}};
    return `<section class="tr-card">
      ${trainHead(day,f.title,'',!!trainOptional[day],entry)}
      <div class="tr-box"><b>${trainOptional[day]?'Facoltativo':'Libero'}</b><span>${esc(f.text)}</span></div>
    </section>`;
  }

  const TRAIN_INFO=`
    <details class="tr-info"><summary>Come progredire</summary>
      <p><b>Doppia progressione.</b> Parti dal basso del range di ripetizioni. Quando completi tutte le serie al top con RPE uguale o inferiore a quello indicato, la volta dopo aumenta il carico del 2,5–5% e riparti dal basso.</p>
      <p><b>Niente cedimento.</b> Resta sempre con 1–3 ripetizioni di riserva. Se un carico non sale per una settimana, va bene: stai preservando il muscolo.</p>
      <p><b>Finisher.</b> Sempre dopo i pesi, mai prima. Se sei a corto di tempo o di energie, accorcia il finisher prima di tagliare le serie dei multiarticolari.</p>
    </details>
    <details class="tr-info"><summary>Adattamenti per il lipedema</summary>
      <p>Non sono indicazioni mediche: conferma le scelte con chi ti segue (angiologo, linfologo, fisioterapista), soprattutto per calze o bendaggi.</p>
      <ul>
        <li>Carichi moderati, ripetizioni medio-alte (8–15), RPE 7–8, mai a cedimento.</li>
        <li>Basso impatto: niente salti nel Punch, niente tapis in salita; finisher su cyclette o ellittica a bassa resistenza.</li>
        <li>Evita ambienti caldi, bevi spesso e fai le pause in un posto fresco.</li>
        <li>Dopo la seduta: 5–10 min a gambe sollevate.</li>
        <li>Sabato facoltativo: nuoto o acquagym al posto della cyclette, se ti è comodo.</li>
      </ul>
    </details>
    <details class="tr-info"><summary>Quando ridurre il volume</summary>
      <p>Riduci le serie (o parlane con la nutrizionista/il medico) se per più di una settimana noti: stanchezza persistente, sonno peggiorato, freddo costante, capogiri, ciclo irregolare o assente, gonfiore o dolore alle gambe in aumento nei 2 giorni dopo l'allenamento, calo netto della forza, umore basso o pensiero fisso sul cibo.</p>
      <p>Se un giorno sei molto stanca, tieni la seduta ma riduci di una serie per esercizio.</p>
    </details>`;


  const FAN_SVG='<svg width="58" height="40" viewBox="0 0 58 40" aria-hidden="true"><g fill="#E3AE57">'+[-60,-30,0,30,60].map(r=>`<path d="M29 36 C25 31 25 17 29 3 C33 17 33 31 29 36Z"${r?` transform="rotate(${r} 29 36)"`:''}/>`).join('')+'</g></svg>';
  function trainTitleHtml(t){const w=String(t).split(' ');return w.length===1?`<i>${esc(t)}</i>`:`${esc(w[0])} <i>${esc(w.slice(1).join(' '))}</i>`;}
  function renderTodayTraining(){
    const el=document.getElementById('todayTraining');if(!el)return;
    if(activeProfile!=='federica'){el.hidden=true;return;}
    const dt=mealDayDate(currentWeek(),currentDay());
    const diff=Math.round((dt-new Date(TRAIN_START+'T12:00:00'))/86400000);
    if(diff>=TRAIN_WEEKS*7){el.hidden=true;return;}
    let label,title,sub,w=1,day='lun',done=false;
    if(diff<0){label='ALLENAMENTO';title='Blocco 2 dal 19 ottobre';sub='Tocca per vedere la scheda';}
    else{
      w=Math.floor(diff/7)+1;day=trainDayIds[diff%7];
      const kind=trainKind[day],isToday=dt.toDateString()===new Date().toDateString();
      label=isToday?'ALLENAMENTO DI OGGI':`ALLENAMENTO · ${trainDayNames[day].toUpperCase()}`;
      if(kind==='P'){title='Punch';sub='45–55 min · RPE 6–7';}
      else if(kind){title=WORKOUTS[kind].title;sub=`${WORKOUTS[kind].ex.length} esercizi · ${WORKOUTS[kind].dur}`;}
      else{title=trainFreeDays[day].title;sub=trainOptional[day]?'Facoltativo':'';}
      const e=getTrainLog()[`w${w}_${day}`];done=!!(e&&e.done);
    }
    el.dataset.w=String(w);el.dataset.day=day;
    el.innerHTML=`<span class="today-train-copy"><span class="today-train-label">${label}</span><span class="today-train-title">${trainTitleHtml(title)}</span>${sub||done?`<span class="today-train-sub">${done?'✓ Fatta':esc(sub)}</span>`:''}</span><span class="today-train-fan">${FAN_SVG}</span>`;
    el.hidden=false;
  }
  function updateTrainDot(){
    const dot=document.getElementById('trainDot');if(!dot)return;
    if(activeProfile!=='federica'||trainNow.diff<0||trainNow.diff>=TRAIN_WEEKS*7){dot.hidden=true;return;}
    const day=trainNow.day,e=getTrainLog()[`w${trainNow.w}_${day}`];
    dot.hidden=!(trainKind[day]&&!(e&&e.done));
  }
  (function initTodayTraining(){
    const el=document.getElementById('todayTraining');if(!el)return;
    el.addEventListener('click',()=>{trainWeek=Number(el.dataset.w)||1;trainDay=el.dataset.day||'lun';setTab('training');window.scrollTo({top:0,behavior:'smooth'});});
  })();

  function renderTraining(){
    const body=document.getElementById('trainingBody');
    if(!body)return;
    const nameEl=document.getElementById('trainingProfileName');
    if(nameEl)nameEl.textContent=profiles[activeProfile].name;
    if(activeProfile!=='federica'){
      body.innerHTML='<section class="tr-card"><p class="empty-state">La scheda di allenamento è quella di Federica. Passa al profilo Federica per vederla e segnare le sedute.</p></section>';
      updateTrainDot();renderTodayTraining();
      return;
    }
    const log=getTrainLog(),kind=trainKind[trainDay];
    const detail=kind==='P'?renderTrainPunch(log):(kind?renderTrainWorkout(log,kind):renderTrainFree(log));
    body.innerHTML=renderTrainWeek(log)+detail+TRAIN_INFO;
    updateTrainDot();renderTodayTraining();
  }

  (function initTraining(){
    const body=document.getElementById('trainingBody');
    if(!body)return;
    body.addEventListener('click',e=>{
      const nav=e.target.closest('[data-tr-nav]');
      if(nav){trainWeek=((trainWeek-1+Number(nav.dataset.trNav)+TRAIN_WEEKS)%TRAIN_WEEKS)+1;renderTraining();return;}
      const d=e.target.closest('[data-tr-day]');
      if(d){trainDay=d.dataset.trDay;renderTraining();}
    });
    body.addEventListener('input',e=>{
      const t=e.target;
      if(!t.matches('[data-tr-kg]'))return;
      const card=t.closest('.tr-ex');if(!card)return;
      const log=getTrainLog(),entry=trainEntry(log,trainWeek,trainDay),i=card.dataset.ex;
      if(!entry.ex[i])entry.ex[i]={};
      entry.ex[i].kg=t.value.replace(',','.').trim();
      setTrainLog(log);
    });
    body.addEventListener('change',e=>{
      const t=e.target;
      if(t.matches('[data-tr-done]')){
        const log=getTrainLog(),entry=trainEntry(log,trainWeek,trainDay);
        entry.done=t.checked;setTrainLog(log);renderTraining();
      }else if(t.matches('[data-tr-ok]')){
        const card=t.closest('.tr-ex');if(!card)return;
        const log=getTrainLog(),entry=trainEntry(log,trainWeek,trainDay),i=card.dataset.ex;
        if(!entry.ex[i])entry.ex[i]={};
        entry.ex[i].ok=t.checked;setTrainLog(log);
        card.classList.toggle('ok',t.checked);
      }
    });
  })();

  // INIT
  weekSelect.value=String(autoWeekFromToday());
  renderProfileUI();
  document.querySelectorAll('.profile-btn').forEach(btn=>btn.addEventListener('click',()=>switchProfile(btn.dataset.profile)));
  renderVeg('ottobre');
  renderMeals();
  document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
  weekSelect.addEventListener('change',()=>{renderMeals();renderShopping();});
  document.getElementById('prevWeek').addEventListener('click',()=>shiftWeek(-1));
  document.getElementById('nextWeek').addEventListener('click',()=>shiftWeek(1));
  daySelect.addEventListener('change',()=>{renderMeals();renderShopping();});
  document.getElementById('saveDay').addEventListener('click',save);
  document.getElementById('resetDay').addEventListener('click',reset);
  document.querySelectorAll('.seg-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.seg-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderVeg(btn.dataset.season);}));
  const fm=document.getElementById('freeMealSelect');fm.value=getFreeMeal();fm.addEventListener('change',()=>{localStorage.setItem(freeMealKey,fm.value);renderShopping();});
  document.getElementById('clearPurchased').addEventListener('click',()=>{localStorage.removeItem(purchasedKey(currentWeek()));renderShopping();});
  const form=document.getElementById('measureForm');form.measureDate.value=todayISO();form.addEventListener('submit',saveMeasurement);
  const photoDate=document.getElementById('progressPhotoDate'); if(photoDate) photoDate.value=todayISO();
  const photoInput=document.getElementById('progressPhotoInput'); if(photoInput) photoInput.addEventListener('change',()=>handlePhotoUpload(photoInput.files));
  document.getElementById('photoLightboxClose')?.addEventListener('click',closePhotoLightbox);
  document.getElementById('photoLightbox')?.addEventListener('click',e=>{if(e.target.id==='photoLightbox')closePhotoLightbox();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('photoLightbox')?.hidden)closePhotoLightbox();});
  document.getElementById('metricSelect').addEventListener('change',renderProgress);

  const breadBtn=document.getElementById('breadModifyBtn');
  if(breadBtn) breadBtn.addEventListener('click',()=>{
    const w=currentWeek(),d=currentDay(),base=bread[w][d],current=getBreadQty(w,d);
    const v=prompt(`Pane di oggi in grammi. Premi OK per salvare oppure lascia vuoto per tornare al valore base di ${base} g.`, String(current));
    if(v===null) return;
    if(String(v).trim()===''){ setBreadQty(w,d,''); renderMeals(); renderShopping(); return; }
    const n=Number(String(v).replace(',','.'));
    if(Number.isFinite(n) && n>0){ setBreadQty(w,d,n); renderMeals(); renderShopping(); }
  });

  const detailBtn=document.getElementById('detailBtn');
  if(detailBtn) detailBtn.addEventListener('click',()=>document.getElementById('macroBreakdown')?.scrollIntoView({behavior:'smooth',block:'center'}));

  const toggleDayView=document.getElementById('toggleDayView');
  if(toggleDayView) toggleDayView.addEventListener('click',()=>{
    const cards=[...document.querySelectorAll('#mealList .meal-card')];
    const allOpen=cards.every(c=>c.classList.contains('open'));
    cards.forEach((card,idx)=>{
      if(allOpen && idx>0) card.classList.remove('open');
      else card.classList.add('open');
      const btn=card.querySelector('.meal-toggle');
      if(btn) btn.setAttribute('aria-expanded', card.classList.contains('open') ? 'true':'false');
      const caret=card.querySelector('.meal-caret');
      if(caret) caret.textContent=card.classList.contains('open') ? '⌃' : '⌄';
    });
    toggleDayView.textContent=allOpen?'Vedi giornata ›':'Chiudi giornata ‹';
  });

  renderProgress();renderPhotos();renderShopping();renderTraining();
  if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(reg=>{reg.update().catch(()=>{});}).catch(()=>{});
})();
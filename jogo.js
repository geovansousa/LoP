var dev=false;

//declaracao de variaveis
var tela=0;
var bgInicio, bgCreditos, bgInstruc, bgJogo;
var xBtMenu=208, yBtMenu=178, wBtMenu=182, hBtMenu=35;
var xBtTelaJogo=517, yBtTelaJogo=8, wBtTelaJogo=67, hBtTelaJogo=33;
var mouseX, mouseY;
var focoBt=0;
var protModelo, prot, xProt=308, yProt=200;
var protParado=[], protAndando=[], protParadoInv=[], protAndandoInv=[], protMorto=[], protJump=[], contProt=0, contJump=0, contMorto=0;
var vil, xVil=10, yVil=105;
var escalaVil=0.06, escalaProt=0.09, escalaPlanta=0.15;
var altTerm=1, contadorColisoes=0;

function drawImg(img,x,y,scale){
  let wImg=img.width
  let hImg=img.height
  
  image(img,x,y,wImg*scale,hImg*scale);
}

function preload(){
  bgInicio = loadImage('imagens/telaInicio.png');
  bgCreditos = loadImage('imagens/telaCreditos.png'); 
  bgInstruc = loadImage('imagens/telaInstruc1.png');
  bgInstruc2 = loadImage('imagens/telaInstruc2.png');
  bgJogo = loadImage('imagens/telaJogoClean.png');
  protModelo = loadImage('imagens/prot.png');
  vil = loadImage('imagens/vil.png'); 
  planta = loadImage('imagens/planta.png');
  fim = loadImage('imagens/fimdejogo.png')
  win = loadImage('imagens/vocevenceu.png')
  
  for(i=1;i<=10;i++){
    protParado[i-1] = loadImage('imagens/Idle'+(i-1)+'.png')
    protAndando[i-1] = loadImage('imagens/Run'+(i-1)+'.png')
    protParadoInv[i-1] = loadImage('imagens/InvIdle'+(i-1)+'.png')
    protAndandoInv[i-1] = loadImage('imagens/InvRun'+(i-1)+'.png')
    protMorto[i-1] = loadImage('imagens/Dead__00'+(i-1)+'.png')
    protJump[i-1] = loadImage('imagens/Jump__00'+(i-1)+'.png')
  }
}


function botao(x,y,func,foco,jogo){
  push()
  if(jogo){
    if(mouseX>=x &&
    mouseX<=x+wBtTelaJogo &&
    mouseY>=y &&
    mouseY<=y+hBtTelaJogo){
      fill(0,128,119,100);
      noStroke()
      rect(x, y, wBtTelaJogo, hBtTelaJogo,2);
      if(mouseIsPressed && mouseButton==LEFT){
        func();
      }
     }else{}
  } else{
      if(focoBt == foco){
        fill(0,128,119,100);
        noStroke()
        rect(x, y, wBtMenu, hBtMenu,2);
      }
      if(mouseX>=x &&
        mouseX<=x+wBtMenu &&
        mouseY>=y &&
        mouseY<=y+hBtMenu){
          focoBt=foco;
          if(mouseIsPressed && mouseButton==LEFT){
            func();
          }
         }else{}
  }
  pop()
}

function mostrarMenu(){
  tela=0;
}
function iniciarJogo(){
  tela=3;
}
function mostrarCreditos(){
  tela=2;
}
function mostrarInstruc(){
  tela=1;
}
function mostrarInstruc2(){
  tela=4;
}


function colisao(xR1,yR1,largR1,altR1,xR2,yR2,largR2,altR2){
  regra1 = xR1+largR1 > xR2;
  regra2 = yR1+altR1 > yR2;
  regra3 = yR1<= yR2+altR2;
  regra4 = xR1 <= xR2+largR2;
  
  regraGeral = regra1 && regra2 && regra3 && regra4;
  
  return(regraGeral)
}

//locais onde o vilao pode surgir
var yPossiveis=[1,53,103,153,203,253,303,353];

function posicaoVilao(yVil) {
  xPossiveis=[];
  var j=0;

  if(yVil=1){ // ok
    for(i=150;i<=325;i++){
      xPossiveis[j]=i; 
      j++
    }
    
    for(i=450;i<=475;i++){
      xPossiveis[j]=i;
      j++
    }
  } else if(yVil=53){ //ok
    for(i=300;i<=552;i++){
      xPossiveis[j]=i; 
      j++
    }
  } else if(yVil=103){ //ok
    for(i=1;i<=270;i++){
      xPossiveis[j]=i; 
      j++
    }
    
    for(i=350;i<=370;i++){
      xPossiveis[j]=i;
      j++
    }
  } else if(yVil=153){ //ok
    for(i=250;i<=275;i++){
      xPossiveis[j]=i; 
      j++
    }
    
    for(i=350;i<=375;i++){
      xPossiveis[j]=i;
      j++
    }
  } else if(yVil=203){ // ok
    for(i=50;i<=425;i++){
      xPossiveis[j]=i; 
      j++
    }
    
    for(i=500;i<=570;i++){
      xPossiveis[j]=i;
      j++
    }
  } else if(yVil=253){ //ok
    for(i=300;i<=325;i++){
      xPossiveis[j]=i; 
      j++
    }
    
    for(i=550;i<=575;i++){
      xPossiveis[j]=i;
      j++
    }
  } else if(yVil=303){ //ok
    for(i=50;i<=175;i++){
      xPossiveis[j]=i; 
      j++
    }
    
    for(i=250;i<=575;i++){
      xPossiveis[j]=i;
      j++
    }
  } else if(yVil=353){
    for(i=100;i<=275;i++){
      xPossiveis[j]=i; 
      j++
    }
    
    for(i=500;i<=575;i++){
      xPossiveis[j]=i;
      j++
    }
  }

  xVil=xPossiveis[parseInt(Math.random()*xPossiveis.length)];
}



function setup() {
  createCanvas(600, 400);
}

function draw() {
  
  //menu
  if(tela==0){
    background(bgInicio); 
    
    botao(xBtMenu,yBtMenu,iniciarJogo,1,false);
    botao(xBtMenu,(yBtMenu+hBtMenu+32),mostrarInstruc,2,false);
    botao(xBtMenu,(yBtMenu+hBtMenu+105),mostrarCreditos,3,false);
    
    
    altTerm=1;
    contadorColisoes=0;
  }
  //instrucoes
  if(tela==1){
    background(bgInstruc);
    
    botao(368,341,mostrarInstruc2,1,false);
    
  }
  //creditos
  if(tela==2){
    background(bgCreditos);
    
    botao(368,341,mostrarMenu,1,false)
    
  }
  if(tela==3){
    background(bgJogo);
    botao(xBtTelaJogo,yBtTelaJogo,mostrarMenu,1,true)
    
    //preenchimento da bolinha dos termometros
    push()
      noStroke()
      fill(255,69,0,150)
      ellipse(17,79,16) // temperatura
      rect(13,72,7,altTerm)
      altTerm-=1.5*Math.pow(10,-2)
    
    pop()
    
    push()
      noStroke()
      fill(135,135,135,200)
      ellipse(59,80,16) // CO2
      rect(56,72,7,altTerm)
      altTerm-=1.5*Math.pow(10,-2)
    pop()
    
     
    // personagens
    contProt+=0.25
    if(contProt>=10) {contProt=0}
    
    if(keyIsDown(LEFT_ARROW)){
      xProt-=1.5
      prot = protAndandoInv;
    } else if(keyIsDown(RIGHT_ARROW)){
      xProt+=1.5
      prot = protAndando;
    } else if(keyIsDown(UP_ARROW)){
      yProt-=1.5
      prot = protAndando;
    } else if(keyIsDown(DOWN_ARROW)){
      yProt+=1.5
      prot = protAndando;
    } else {
      prot = protParado;
    } 
    
    drawImg(prot[parseInt(contProt)],xProt,yProt,escalaProt);
    drawImg(vil,xVil,yVil,escalaVil);
    
    // plantas
    
    x=[100,350,400,400,550,200,50,550]; // posicao das isoladas
    y=[1,1,1,130,150,300,353,52]
    
    //count=0;
    //xPlantas=[], yPlantas=[];
    for (i=0;i<8;i++){
      drawImg(planta,x[i],y[i],escalaPlanta);
      /*xPlantas[count]=x[i];
      yPlantas[count]=y[i];*/
    }
    
    for(i=100;i<300;i+=50){
      drawImg(planta,i,52,escalaPlanta);
      /*xPlantas[count]=i;
      yPlantas[count]=52;*/
    }
    for(i=100;i<200;i+=50){
      drawImg(planta,300,i,escalaPlanta);
      /*xPlantas[count]=300;
      yPlantas[count]=i;*/
    }
    for(i=100;i<250;i+=50){
      drawImg(planta,450,i,escalaPlanta);
      /*xPlantas[count]=450;
      yPlantas[count]=i;*/
    }
    for(i=150;i<400;i+=50){
      drawImg(planta,0,i,escalaPlanta);
      /*xPlantas[count]=0;
      yPlantas[count]=i;*/
    }
    for(i=50;i<250;i+=50){
      drawImg(planta,i,153,escalaPlanta);
      /*xPlantas[count]=i;
      yPlantas[count]=153;*/
    }
    for(i=50;i<300;i+=50){
      drawImg(planta,i,253,escalaPlanta);
      /*xPlantas[count]=i;
      yPlantas[count]=253;*/
    }
    for(i=350;i<550;i+=50){
      drawImg(planta,i,250,escalaPlanta);
      /*xPlantas[count]=i;
      yPlantas[count]=250;*/
    }
    for(i=300;i<500;i+=50){
      drawImg(planta,i,350,escalaPlanta);
      /*xPlantas[count]=i;
      yPlantas[count]=350;*/
    }
    
    
    var wProt=protModelo.width*escalaProt, hProt=protModelo.height*escalaProt;
    var wVil=vil.width*escalaVil, hVil=vil.height*escalaVil;
    
    colisaoProtVil = colisao(xProt,yProt,wProt,hProt,xVil,yVil,wVil,hVil)
    
    if(colisaoProtVil){
      posicaoVilao(yVil=yPossiveis[parseInt(Math.random()*8)]) // substituir vilao do local
      
      //altTerm=altTerm+Math.pow(10,-2)//parar contador dos termometros
      contadorColisoes++
      
    }
    
    
  if(contadorColisoes==10){
    background(win);
    
    contJump+=0.25;
    if(contJump>=10) {contJump=0}
    drawImg(protJump[parseInt(contJump)],50,50,0.5)
    
    botao(368,341,mostrarMenu,1,false);
    }
  else if(altTerm<-60){
    background(fim);
    
    contMorto+=0.25;
    if(contMorto>=10) {contMorto=0}
    drawImg(protMorto[parseInt(contMorto)],50,50,0.5)
    
    botao(368,341,mostrarMenu,1,false);
    }
  }
  
  
  
  ///////////////////////////////
  if(dev){
    push()
      textAlign(CENTER)
      noStroke()
      textSize(20)
      fill(0)
      textSize(18);
      text('Coordenadas: X = '+mouseX+'; Y = '+mouseY,300,25);
      text(focoBt,25,25);
      text('Colisões: '+contadorColisoes,450,20)
    pop()
    
    /*push()
      stroke('red')
      fill('#FFFFFF00')
      rect(xProt,yProt,wProt,hProt);
      stroke('blue')
      fill('#FFFFFF00')
      rect(xVil,yVil,wVil,hVil);
    pop()*/
    
  }
  
}


function keyPressed(){
  
  if(tela==0 || tela==1 || tela==2 || tela==4){
    if(keyCode==UP_ARROW) {focoBt--;}
    if(keyCode==DOWN_ARROW) {focoBt++;}
    if(tela==0){
      if(focoBt<1) {focoBt=3;} else if(focoBt>3) {focoBt=1;}
    } else {if(focoBt<1) {focoBt=1;} else if(focoBt>1) {focoBt=1;}}
    
    if(keyCode==ENTER) {
      if(tela==0){
        if(focoBt==1) {iniciarJogo()}
        if(focoBt==2) {mostrarInstruc()}
        if(focoBt==3) {mostrarCreditos()}       
    }
      if(tela==1){
        if(focoBt==1) {mostrarInstruc2()}
      }
      if(tela==4){
        if(focoBt==1) {mostrarMenu()}
      }
      if(tela==2){
        if(focoBt==1) {mostrarMenu()}
      }
  }
    
  }
  
}

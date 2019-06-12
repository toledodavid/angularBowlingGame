import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  lanzamiento1:boolean = true;
  lanzamiento2:boolean = false;
  frames:any = [];
  frame:number = 1;
  sumatoriaPuntos:number = 0;
  contadorChusas:number = 0;
  spare:boolean = false;
  sumaPinosDerribadosPorFrame:number = 0;


  constructor() {

    for(let frame = 0;frame < 10; frame++){
      if(frame+1 != 10){
        this.frames.push({frame: frame+1, tiro1: '', tiro2: '', puntaje: ''});
      }else{
        this.frames.push({frame: frame+1, tiro1: '', tiro2: '', tiro3: '', puntaje: ''});
      }
    }
    
  }

  ngOnInit() {
  }


  primerLanzamiento(){
    // Numero random del 0 al 10
    let pinosDerribadosLanzamiento1 = Math.floor(Math.random() * 11);

    /* Se verifica si en la casilla anterior se hizo un SPARE 
        Si se hizo un SPARE, entonces a sumatoriaPuntos se le suma el valor de los pinos derribados en el primer lanzamiento 
        y se agrega al puntaje del frame anterior */
    if(this.spare){
      this.sumatoriaPuntos += pinosDerribadosLanzamiento1;
      this.frames[this.frame-2].puntaje = this.sumatoriaPuntos;
      this.spare = false;
    }


    // Se verifica si se hizo chusa
    if(pinosDerribadosLanzamiento1 == 10){
      // Si es chusa, se le agrega el caracter X al tiro1 del frame actual y se aumenta el frame para ir al primer lanzamiento del siguiente
      this.contadorChusas++;
      this.frames[this.frame-1].tiro1 = 'X';
      this.frame++;
      if(this.contadorChusas == 3){
        // Hay tres chusas consecutivas, asi que se hace la suma del la sumatoriaPuntos más los 30 puntos y se le agrega al puntaje del primer frame que hizo la chusa consecutiva
        let puntos:number = this.sumatoriaPuntos += this.contadorChusas*10;
        this.frames[this.frame-4].puntaje = puntos;
        this.contadorChusas--;
        puntos = 0;
      }
    }else{
      // Se agrega la cantidad de pinos derribados en el tiro1 del frame actual
      this.frames[this.frame-1].tiro1 = pinosDerribadosLanzamiento1;
      this.sumaPinosDerribadosPorFrame += pinosDerribadosLanzamiento1;

      /* se verifica si en los dos frames anteriores se hizo chusa consecutiva 
        Si es verdad entonces a la sumatoria de puntos se le suman 20 de las dos chusas anteriores más los pinos derribados en el lanzamiento1 del frame actual,
        y la sumatoria se le agrega al primer frame de las dos chusas consecutivas */
      if(this.contadorChusas == 2){
        this.sumatoriaPuntos += (this.contadorChusas*10) + pinosDerribadosLanzamiento1;
        this.frames[this.frame-3].puntaje = this.sumatoriaPuntos;
        this.contadorChusas--;
      }

      this.lanzamiento1 = false;
      this.lanzamiento2 = true;
    }
    
  }

  segundoLanzamiento(){
    // Se realiza una resta del total de pinos menos la cantidad de pinos que se derribaron en el lanzamiento1
    let pinosRestantes:number = 10 - this.sumaPinosDerribadosPorFrame;

    // Se genera un numero random entre 0 y los pinosRestantes
    let pinosDerribadosLanzamiento2:number = Math.floor(Math.random() * pinosRestantes+1);

    // Se le agrega el valor de los pinos derribados en el lanzamiento 2 a la suma de puntos del frame actual
    this.sumaPinosDerribadosPorFrame += pinosDerribadosLanzamiento2;

    // Si el anterior frame fue chusa, entonces se le agrega al puntaje del frame anterior la suma de los dos lanzamientos
    if(this.contadorChusas == 1){
      this.sumatoriaPuntos += (this.contadorChusas*10)+this.sumaPinosDerribadosPorFrame;
      this.frames[this.frame-2].puntaje = this.sumatoriaPuntos;
      this.contadorChusas--;
    }

    this.sumatoriaPuntos += this.sumaPinosDerribadosPorFrame;

    if(this.sumaPinosDerribadosPorFrame == 10){
      // SPARE
      this.spare = true;
      this.frames[this.frame-1].tiro2 = 'spare';
    }else{
      this.frames[this.frame-1].tiro2 = pinosDerribadosLanzamiento2;
      this.frames[this.frame-1].puntaje = this.sumatoriaPuntos;
    }

    this.frame++;
    this.sumaPinosDerribadosPorFrame = 0;

    if(this.frame == 11){
      this.lanzamiento1 = false;
      this.lanzamiento2 = false;
    }else{
      this.lanzamiento1 = true;
      this.lanzamiento2 = false;
    }
  }

}

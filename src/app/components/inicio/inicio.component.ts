import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  /*turnos:any = [];
  turno:number = 0;
  oportunidad1:boolean = true;
  oportunidad2:boolean = false;
  contadorChusas:number = 0;
  totalPinos:number = 10;
  pinosRestantes:number = 0;
  puntosPorTurno:number = 0;*/


  lanzamiento1:boolean = true;
  lanzamiento2:boolean = false;
  casilla:number = 1;
  puntos:number = 0;
  chusa:boolean = false;
  spare:boolean = false;
  casillas:any = [];
  sumaPinosDerribadosPorCasilla:number = 0;

  constructor() { 
    for(let casilla = 0;casilla < 10; casilla++){
      if(casilla+1 != 10){
        this.casillas.push({casilla: casilla+1, tiro1: '', tiro2: '', puntaje: ''});
      }else{
        this.casillas.push({casilla: casilla+1, tiro1: '', tiro2: '', tiro3: '', puntaje: ''});
      }
    }
    console.log(this.casillas);
  }

  ngOnInit() {
  }

  /*jugar(){
    if(this.oportunidad1){
      let pinosDerribados:number = Math.floor(Math.random() * 11);
      console.log("Tiro 1: ", pinosDerribados);

      if(pinosDerribados == 10){
        this.contadorChusas +=pinosDerribados;
        console.log("CHUSA");
      }else{
        this.oportunidad1 = false;
        this.oportunidad2 = true;

        this.pinosRestantes = this.totalPinos - pinosDerribados;
        console.log("Pinos restantes: ", this.pinosRestantes);
        this.puntosPorTurno += pinosDerribados;
      }
    }else{

      let pinosDerribados2:number = Math.floor(Math.random() * this.pinosRestantes+1);
      console.log("tiro 2: ", pinosDerribados2);
      if(pinosDerribados2 + this.pinosRestantes == 10){
        console.log("Spare");
      }else{
        this.oportunidad1 = true;
        this.oportunidad2 = false;
        this.turno++;

        this.puntosPorTurno += pinosDerribados2;
        console.log(`Puntos en turno ${this.turno}: ${this.puntosPorTurno}`);
      }

    }
  }*/

  primerLanzamiento(){
    //Numero entero random del 0 al 10
    let pinosDerribadosLanzamiento1:number = Math.floor(Math.random() * 11);
    
    /* Verificamos si en la casilla anterior se hizo un SPARE 
        Si se hizo un SPARE, entonces a puntos le sumamos el valor de los pinos derribados en el primer lanzamiento 
        y se lo agregamos al puntaje de la casilla anterior */
    if(this.spare){
      this.puntos += pinosDerribadosLanzamiento1;
      this.casillas[this.casilla-2].puntaje = this.puntos;
      this.spare = false;
    }

    if(pinosDerribadosLanzamiento1 == 10){
      // CHUSA
      this.puntos += pinosDerribadosLanzamiento1;

      /* Verificamos si la casilla anterior fue chusa 
          Si fue chusa en la casilla anterior entonces en el puntaje de la casilla anterior le agregamos los 10 de su chusa más los 10 de la chusa de la casilla actual
          y a puntos le sumamos la chusa actual para despues hacer la suma con los puntos de la siguiente casilla */
      if(this.chusa){
        this.casillas[this.casilla-2].puntaje = this.puntos;
        this.puntos += pinosDerribadosLanzamiento1;
      }

      this.chusa = true;
      this.casillas[this.casilla-1].tiro1 = "X";
      this.casilla++;
    }else{
      // Sino fue chusa el primer lanzamiento, entonces almacenamos los pinos derribados del lanzamiento 1
      this.sumaPinosDerribadosPorCasilla = pinosDerribadosLanzamiento1;

      // Activamos la bola 2 y desactivamos la bola 1
      this.lanzamiento1 = false;
      this.lanzamiento2 = true;

      // Guardamos los pinos derribados del lanzamiento 1 en el objeto de la casilla actual
      this.casillas[this.casilla-1].tiro1 = pinosDerribadosLanzamiento1;
    }

    console.log(this.casillas);

  }

  segundoLanzamiento(){
    // Hacemos una resta de los pinos totales menos los pinos que se derribaron en el lanzamiento 1
    let pinosRestantes:number = 10 - this.sumaPinosDerribadosPorCasilla;

    // Generamos un numero random entre 0 y los pinos que NO se derribaron en el lanzamiento 1
    let pinosDerribadosLanzamiento2:number = Math.floor(Math.random() * pinosRestantes+1);

    // Almacenamos la suma de los pinos derribados en los dos lanzamientos
    this.sumaPinosDerribadosPorCasilla += pinosDerribadosLanzamiento2;

    /* Verificamos si en la casilla anterior de hizo una chusa, 
        Si se hizo una chusa en la casilla anterior, entonces a puntos le sumanos el valor de los dos lanzamientos 
        y agregamos el valor de puntos a la clave puntaje del objeto de la casilla anterior */
    if(this.chusa){
      this.puntos += this.sumaPinosDerribadosPorCasilla;
      this.casillas[this.casilla-2].puntaje = this.puntos;
    }

    // A puntos que trae el puntaje de la casilla anterior, le sumamos el valor de los dos lanzamientos
    this.puntos += this.sumaPinosDerribadosPorCasilla;

    /* Verificamos si con el segundo lanzamiento se genera un SPARE, 
        Si se genera un SPARE almacenamos la palabra spare en la clave tiro2 de la casilla actual 
        Y activamos la variable spare que va a ayudar para la suma del lanzamiento 1 de la siguiente casilla */
    if(this.sumaPinosDerribadosPorCasilla == 10){
      // SPARE
      this.casillas[this.casilla-1].tiro2 = "spare";
      this.spare = true;
    }else{
      /* Si no se genera un SPARE, entonces solo se guarda el valor el lanzamiento 2 y el puntaje, 
      el cual contiene la suma de los dos lanzamientos más el puntaje de la casilla anterior */
      this.casillas[this.casilla-1].tiro2 = pinosDerribadosLanzamiento2;
      this.casillas[this.casilla-1].puntaje = this.puntos;
    }

    // Volvemos a inicializar a 0 la variable que nos ayuda a llevar la suma de los pinos derribados en los dos lanzamientos por casilla
    this.sumaPinosDerribadosPorCasilla = 0;

    // Pasamos a la siguiente casilla, activamos la bola 1 y desactivamos la bola 2
    this.casilla++;
    this.chusa = false;
    this.lanzamiento2 = false;
    this.lanzamiento1 = true;


    console.log(this.casillas);
  }

}

import { Cliente, Reserva } from './../../models';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { format, parseISO } from 'date-fns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reserva-confirmada',
  templateUrl: './reserva-confirmada.component.html',
  styleUrls: ['./reserva-confirmada.component.scss'],
})
export class ReservaConfirmadaComponent implements OnInit, OnDestroy {
  diaSubscriber : Subscription;
  totalSubscriber : Subscription;
  private path = 'Reservas/';
  reserva: Reserva[]=[];
  public dia:any
  public fecha:any

  constructor(public menucontroller:MenuController,
              public firestoreService:FirestoreService) { }

  ngOnInit() {
    this.fechaActual();
    this.getCollectionReservaDia();

  }
  ngOnDestroy(){
    if(this.diaSubscriber){
      this.diaSubscriber.unsubscribe();
    }
    if(this.totalSubscriber){
      this.totalSubscriber.unsubscribe();
    }
  }

  openMenu(){
    this.menucontroller.toggle('custom')
  }

  fechaActual(){
    const date: Date = new Date();
    const utcDay = date.toISOString();
    this.dia = format(parseISO(utcDay), 'dd/MM/yyyy');
    console.log( this.dia);
}


getCollectionReservaDia(){
  this.diaSubscriber = this.firestoreService.getCollectionQuery<Reserva>(this.path,'dia','==',this.dia).subscribe( res =>{
    if(res.length){
      this.reserva = res;
      console.log('prueba',this.reserva)
    } 
  })
}
getCollectionReservaTotal(){
  this.totalSubscriber = this.firestoreService.getCollection<Reserva>(this.path).subscribe( res =>{
    if(res.length){
      this.reserva = res;
      console.log('prueba',this.reserva)
    } 
  })
}

changeSegment(evento:any){
  console.log('segment',evento.detail.value);
  const opc = evento.detail.value;
  if (opc === 'diactual'){
    if(this.totalSubscriber){
      this.totalSubscriber.unsubscribe();
    }
    // this.nuevos = false;
    this.getCollectionReservaDia();
    
  }
  if (opc === 'todas'){
    // this.nuevos = true;
     this.getCollectionReservaTotal();
  }
}

}
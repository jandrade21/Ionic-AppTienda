import { Cliente, Peluquero, Reserva } from './../../models';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { format, parseISO } from 'date-fns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reserva-confirmada',
  templateUrl: './reserva-confirmada.component.html',
  styleUrls: ['./reserva-confirmada.component.scss'],
})
export class ReservaConfirmadaComponent implements OnInit, OnDestroy {

  loading: any;
  diaSubscriber : Subscription;
  totalSubscriber : Subscription;
  profesionalSubscriber : Subscription;
  private path = 'Reservas/';
  private path2 = 'Peluqueros/';
  reserva: Reserva[]=[];
  peluquero: Peluquero[]=[]
  public dia:any
  public fecha:any
  profesionales: any[];
  reservas: any[] = []; 
  reservasMostradas: any[] = [];
  capturaDeProfesional: any ;
  

  constructor(public menucontroller:MenuController,
              public firestoreService:FirestoreService,
              private alertController: AlertController,
              public LoandingController: LoadingController,
              public toastController: ToastController,) { }

  ngOnInit() {
    this.getCollectionReservaTotal(this.capturaDeProfesional);
    this.fechaActual();
    this.getCollectionReservaDia(this.capturaDeProfesional);
    this.getCollectionProfesional();

  }
  ngOnDestroy(){
    if(this.diaSubscriber){
      this.diaSubscriber.unsubscribe();
    }
    if(this.totalSubscriber){
      this.totalSubscriber.unsubscribe();
    }
    if(this.profesionalSubscriber){
      this.profesionalSubscriber.unsubscribe();
    }
    this.seleccionarProfesional(this.capturaDeProfesional);
  
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


getCollectionReservaDia(profesionalID: string){
  this.diaSubscriber = this.firestoreService.getCollectionQuery<Reserva>(this.path,'dia','==',this.dia).subscribe( res =>{
    if(res.length){
      this.reserva = res;
      console.log('reserva por dia',this.reserva)
      this.cargarReservasPorProfesional(profesionalID);
    } 
  })
}
getCollectionReservaTotal(profesionalID: string){
  this.totalSubscriber = this.firestoreService.getCollection<Reserva>(this.path).subscribe( res =>{
    if(res.length){
      this.reserva = res;
      this.reservasMostradas = this.reserva.filter(reserva => reserva.idProfesional === profesionalID);
      console.log('reserva total',this.reservasMostradas)
      
    } 
  })
}
getCollectionProfesional(){
  this.profesionalSubscriber = this.firestoreService.getCollection<Peluquero>(this.path2).subscribe( res =>{
    if(res.length){
      this.peluquero = res;
      console.log('peluquero',this.peluquero)
    } 
  })
}

 changeSegment(evento:any){
   console.log('segment',evento.detail.value);
   const opc = evento.detail.value;
   if (opc === 'turnosDia'){

     // this.nuevos = false;
     this.getCollectionReservaDia(this.capturaDeProfesional);
    
   }
   if (opc === 'turnosTotales'){
     // this.nuevos = true;
     this.getCollectionReservaTotal(this.capturaDeProfesional);
   }
  
 }

seleccionarProfesional(profesionalID: string) {
  this.cargarReservasPorProfesional(profesionalID);
  this.capturaDeProfesional = profesionalID;
   console.log('captura',profesionalID)
}

cargarReservasPorProfesional(profesionalID: string) {
  this.reservasMostradas = this.reserva.filter(reserva => reserva.idProfesional === profesionalID && reserva.dia === this.dia);
  console.log('reserva por profesional', this.reservasMostradas);
}

async deleteReserva(reserva:Reserva){
  const alert = await this.alertController.create({
    cssClass: 'normal',
    header: 'advertencia',
    message:'Seguro desea <strong>Cancelar</strong> la reserva!!!',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: (blah) => {
         console.log('Confirm Cancel: blah')
        },
      },
      {
        text: 'Ok',
        role: 'confirm',
        cssClass: 'normal',
        handler: () => {
          console.log('Confirm Okay');
            this.firestoreService.deleteDoc(this.path,reserva.idReserva).then(res=>{
            this.loading.dismiss();
            this.presentToast('eliminado con exito','success','checkmark')
            this.alertController.dismiss();
          }).catch( error =>{
            this.presentToast('no se pudo eliminar','danger','information-circle')
          });
        },
      },
    ],
  });
  await alert.present();
}

async presentLoading(){
this.loading = await this.LoandingController.create({
  cssClass:'normal',
  message:'guardando',
});
await this.loading.present();

}
async presentToast(mensaje:string, color:string, icono:string) {
const toast = await this.toastController.create({
  message: mensaje,
  cssClass:'normal',
  duration: 2000,
  color:color,
  icon: icono,
});
toast.present();
}

}
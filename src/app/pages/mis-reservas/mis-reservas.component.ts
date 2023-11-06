import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Cliente, Reserva } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.scss'],
})
export class MisReservasComponent implements OnInit {

  loading: any;
  admin = false;
  usuario = false;
  uid = '';
  cliente: Cliente = {
    uid: '',
    email: '',
    nombre:'',
    apellido: '',
    password: '',
    celular: '',
    foto: '',
    referencia: '',
    ubicacion: null
  }
  reservasDelCliente: Reserva[] = [];
  reserva: Reserva[]=[];
  private path = 'Reservas/';

  constructor(public menucontroller:MenuController,
              public firestoreService:FirestoreService,
              public firebaseauthService:FirebaseauthService,
              private alertController: AlertController,
              public loadingController: LoadingController,
              public toastController: ToastController,
              private cdr: ChangeDetectorRef) {
              
    this.reservasCliente();
    
    this.firebaseauthService.stateAuth().subscribe(res =>{
      if (res !== null){
        this.uid = res.uid;
        this.getUserInfo(this.uid);
      } else{
       this.initCliente();
      }
   });
   }

  ngOnInit() {
    this.initCliente();
  
    this.getUserInfo;
    
    console.log('datos del cliente',this.uid)
 
  }


  openMenu(){
    this.menucontroller.toggle('custom')
    
  }

  reservasCliente() {
    this.firestoreService.getCollection<Reserva>(this.path).subscribe(
      res => {
        if (res.length) {
          this.reserva = res;
          this.reservasDelCliente = this.reserva.filter(reserva => reserva.idUsuario === this.uid);
     
          console.log('reserva por dia', this.reservasDelCliente);
          console.log('todas las reservas',this.path)
        }
      },
      error => {
        console.error('Error al obtener las reservas del cliente:', error);
      }
    );
  }
  

  initCliente(){
    this.uid = '';
    this.cliente ={
      uid: '',
      email: '',
      nombre:'',
      apellido:'',
      password:'',
      celular: '',
      foto: '',
      referencia: '',
      ubicacion: null
    }
  }
  getUserInfo(uid: string){
    const path ='Clientes';
    this.firestoreService.getDoc<Cliente>(path, uid).subscribe(res =>{
      if(res){
        this.cliente = res;
        console.log('cliente registrado',res)
      }
    });
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
                this.reserva = this.reserva.filter(r => r.idReserva !== reserva.idReserva);
                this.presentToast('eliminado con exito','success','checkmark')
                this.cdr.detectChanges();
              }).catch(error=>{
                console.log(error)
                this.presentToast('no se pudo eliminar','danger','information-circle')
            
              });
          },
        },
      ],
    });
    await alert.present();
}

async presentLoading() {
  this.loading = await this.loadingController.create({
    cssClass: 'normal',
    message: 'Guardando', // Corregido a "Guardando" (con la G mayúscula)
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
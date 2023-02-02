import { Peluquero } from './../../models';
import { FirestoreService } from './../../services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { FirestorageService } from 'src/app/services/firestorage.service';

@Component({
  selector: 'app-peluqueros',
  templateUrl: './peluqueros.component.html',
  styleUrls: ['./peluqueros.component.scss'],
})
export class PeluquerosComponent implements OnInit {
  peluquero: Peluquero[]=[];
  newPelu: Peluquero;
  enableNewPeluquero = false;
  loading: any;
  newImage = '';
  newFile = '';
  private path ='Peluqueros/';

  constructor(public menucontroler:MenuController,
              public firestoreService: FirestoreService,
              public LoandingController: LoadingController,
              public toastController: ToastController,
              private alertController: AlertController,
              public firestorageService:FirestorageService) { }

  ngOnInit() {
    this.getPeluqueros();
  }

  openMenu(){
    this.menucontroler.toggle('custom')
  }
  nuevo(){
    this.enableNewPeluquero=true;
    this.newPelu={
      nombre:'',
      foto:'',
      id:this.firestoreService.getId(),
    };
  }
  async guardarPeluquero(){
    this.presentLoading();
    const path = 'Peluqueros';
    const name = this.newPelu.nombre;
    const res = await this.firestorageService.uploadImage(this.newFile, path, name);
    this.newPelu.foto = res;
    this.firestoreService.createDoc(this.newPelu,this.path,this.newPelu.id).then(res=>{
      this.loading.dismiss();
      this.presentToast('guardado con exito','success','checkmark')
    }).catch(error=>{
      this.presentToast('no se pudo guardar','danger','information-circle')
    });
  }
  getPeluqueros(){
    this.firestoreService.getCollection<Peluquero>(this.path).subscribe(res=>{
      this.peluquero = res;
    });
  }
  async deletePeluquero(peluquero:Peluquero){
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'advertencia',
      message:'Seguro desea <strong>eliminar</strong> este producto!!!',
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
            this.firestoreService.deleteDoc(this.path,peluquero.id).then(res=>{
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
  async newImageUpload(event: any){
    if(event.target.files && event.target.files[0]){
     this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image)=>{
        this.newPelu.foto = image.target.result as string;
     });
      reader.readAsDataURL(event.target.files[0]);
    }
 }
}

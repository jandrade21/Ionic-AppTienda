import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {
 
  productos: Producto[]=[];
 
  newProducto: Producto;
 enableNewProducto = false;

 private path ='Productos/';

 loading: any;

  constructor(public menucontroler:MenuController, public firestoreService:FirestoreService, public LoandingController: LoadingController,
    public toastController: ToastController,private alertController: AlertController) { }

  ngOnInit() {
    this.getProdutos();
  }

  openMenu(){
    this.menucontroler.toggle('custom')
  }
  guardarProducto(){
    this.presentLoading();
    this.firestoreService.createDoc(this.newProducto,this.path,this.newProducto.id).then(res=>{
      this.loading.dismiss();
      this.presentToast('guardado con exito','success','checkmark')
    }).catch(error=>{
      this.presentToast('no se pudo guardar','danger','information-circle')
    });
  }
  getProdutos(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe(res=>{
      this.productos= res;
    });
  }
  async deleteProducto(producto:Producto){
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
              this.firestoreService.deleteDoc(this.path,producto.id).then(res=>{
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
  nuevo(){
    this.enableNewProducto=true;
    this.newProducto={
      nombre:'',
      precioNormal:null,
      precioReducido:null,
      foto:'',
      id:this.firestoreService.getId(),
      fecha: new Date(),
    };
  }

  async presentLoading(){
    this.loading = await this.LoandingController.create({
      cssClass:'normal',
      message:'guardando',
    });
    await this.loading.present();
    // await loading.onDidDismiss();
    // console.log('loading dismissed!');
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

import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { Hora, Reserva, Cliente } from './../../models';
import { Component, OnInit, } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { FirestoreService } from 'src/app/services/firestore.service';
import { format, parseISO } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  
  form : FormGroup;

  @ViewChild(IonModal) modal: IonModal;
 

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
  public botones:any;
  hora:Hora[]=[];
  newHora: Hora;
  public myDate: any;
  public dia:any
  handlerMessage = '';
  roleMessage = '';
  enableToHora = false;
  loading: any;
  uid = '';
  reserva : Reserva[]=[];
  public arrayTurnos=[];
 


  newReserva: Reserva;
  private path ='Reservas/';
  private path2='Horarios/';
  

  constructor(public menucontroller:MenuController,
              private alertController: AlertController,
              public firestoreService: FirestoreService,
              public toastController: ToastController,
              public LoandingController: LoadingController,
              public firebaseauthService:FirebaseauthService,
              private formbuilder: FormBuilder,
              ) {
                this.form=this.formbuilder.group({
                  turno:['',[Validators.required,Validators.maxLength(6)]]
                })
                
                this.firebaseauthService.stateAuth().subscribe(res =>{
                 
                  if (res !== null){
                    this.uid = res.uid;
                    this.getUserInfo(this.uid);
                  } else{
                   this.initCliente();
                  }
               });
               }

  ngOnInit() 
  {
    this.getHorarios();
    this.nuevo();
  }
  get Turno(){
    return this.form.get('turno');
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
  openMenu(){
    this.menucontroller.toggle('custom')
  }
  nuevo(){
    this.newReserva={
      nombre:this.cliente.nombre,
      idUsuario:this.firestoreService.getId(),
      dia:this.dia,
      turno:'',
      telefono:this.cliente.celular,
      mail:this.cliente.email,
      tipo:'',
      
    };
    
    console.log(this.newReserva)
  }

  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0;
  };

  showdate(){
    this.hora=[];
    this.reserva=[];
    this.arrayTurnos=[];
    this.enableToHora = true;
    console.log(this.myDate);
    this.dia = format(parseISO(this.myDate), 'dd/MM/yyyy');
    console.log(this.dia);
    this.getHorarios();
    this.getCollectionReserva();
    
  }
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
 
 

  cancel() {
    this.modal.dismiss(null, 'cancel');

  }

  confirm() {
    this.modal.dismiss(this.guardarReserva(), 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  getHorarios(){
   this.firestoreService.getCollection<Hora>(this.path2).subscribe(res=>{
      this.hora = res;
      console.log(res)
    });
  }
  async guardarReserva(){
    
    this.firestoreService.createDoc(this.newReserva,this.path,this.newReserva.idUsuario).then(res=>{
      this.presentToast('guardado con exito','success','checkmark')
    }).catch(error=>{
      console.log(error)
      this.presentToast('no se pudo guardar','danger','information-circle')
    });
  }
  getUserInfo(uid: string){
    const path ='Clientes';
    this.firestoreService.getDoc<Cliente>(path, uid).subscribe(res =>{
      if(res){
        this.cliente = res;
      }
    });
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

  getCollectionReserva(){
    this.firestoreService.getCollectionQuery<Reserva>(this.path,'dia','==',this.dia).subscribe( res =>{
      if(res.length){
        this.reserva = res;
        console.log('prueba',this.reserva)
      }
      this.turnosDisponibles();
      
    })
}
  turnosDisponibles(){
    this.arrayTurnos=[];
    this.hora.forEach((tur)=>{
      const existeTurno = this.reserva.find((res)=>res.turno === tur.turno);
      const agregarEnArrayTurno = {
        turno:tur.turno,
      };
      if(existeTurno){
        agregarEnArrayTurno.turno = 'No disponible'; 
      }else{
        agregarEnArrayTurno.turno = tur.turno;
      }
      this.arrayTurnos.push(agregarEnArrayTurno);
    });
    console.log('turnos ultimos',this.arrayTurnos)
  }
}








// cambiarColor(){
//  this.botones = document.querySelectorAll(".cell");
// // Definir función y evitar definirla de manera anónima
// const cuandoSeHaceClick = function (evento) {
// 	// Recuerda, this es el elemento
// 	console.log("El texto que tiene es: ", this.innerText);
// 	// Podemos cambiar cualquier cosa, p.ej. el estilo
// 	this.style.background = "red";
//   this.selector=this.innerHTML;
//   console.log(this.selector)
// }
// // botones es un arreglo así que lo recorremos
// this.botones.forEach(boton => {
// 	//Agregar listener
// 	boton.addEventListener("click", cuandoSeHaceClick);
   
// });
//   } 
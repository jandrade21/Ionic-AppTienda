import { Peluquero } from './../../models';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss'],
})
export class ReservaComponent implements OnInit {

  private path = 'Peluqueros/';
  peluquero: Peluquero[]=[];
  public myDate: any;


  constructor(public menucontroller:MenuController,
              public firestoreService:FirestoreService) {
                this.loadPeluqueros();
               }

  ngOnInit() {
  }

  openMenu(){
    this.menucontroller.toggle('custom')
  }


  loadPeluqueros(){
    this.firestoreService.getCollection<Peluquero>(this.path).subscribe(res=>{
      console.log('reserva',res)
      this.peluquero = res;
      
    })
  }
}

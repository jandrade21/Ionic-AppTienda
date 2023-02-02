import { Peluquero } from './../../models';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profesionales',
  templateUrl: './profesionales.component.html',
  styleUrls: ['./profesionales.component.scss'],
})
export class ProfesionalesComponent implements OnInit {

  @Input() peluquero: Peluquero;

  done = [];
  constructor() { }

  ngOnInit() {}

}

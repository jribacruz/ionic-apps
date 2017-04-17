import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private bluetoothSerial: BluetoothSerial) {

  }

  /**
   * Lista os dispositivos bluetooth pareados.
   */
  listDevices() {
    //Verifica se o bluetooth está ativo
    this.bluetoothSerial.isEnabled().then(res => {
      console.log('Bluetooth ativado.');
      // Lista os dispositivos ja pareados.
      this.bluetoothSerial.list().then(devices => {
        console.log(`br.bluetooth: ${JSON.stringify(devices)}`);
      });
    }).catch(res => {
      console.log('Erro ao conectar bluetooth. Ativado ?');
    });
  }

  /**
   * Busca por dispositivos não pareados
   */
  scan() {
    //Verifica se o bluetooth está ativo
    this.bluetoothSerial.isEnabled().then(res => {
      console.log('Bluetooth ativado.');
      // Lista os dispositivos ja pareados.
      this.bluetoothSerial.discoverUnpaired().then(devices => {
        console.log(`br.bluetooth: ${JSON.stringify(devices)}`);
      });
    }).catch(res => {
      console.log('Erro ao conectar bluetooth. Ativado ?');
    });
  }

}

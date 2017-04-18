import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";
import _ from "lodash";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private bluetoothSerial: BluetoothSerial,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {

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
      this.showBluetoothDevices();
    }).catch(res => {
      //console.log('Erro ao conectar bluetooth. Ativado ?');
      let toast = this.toastCtrl.create({
        message: 'Bluetooth não ativado.',
        showCloseButton: true
      });
      toast.present();
    });
  }

  /**
   * Exibe um alert com os dispositivos bluetooth disponíveis.
   */
  private showBluetoothDevices() {
    let loading = this.loadingCtrl.create({
      content: 'Buscando dispositivos...'
    });
    loading.present();
    this.bluetoothSerial.discoverUnpaired().then(devices => {
      loading.dismiss();
      let alertBDevices = this.alertCtrl.create();
      alertBDevices.setTitle('Dispositivos Bluetooth');
      devices.forEach(device => {
        alertBDevices.addInput({
          type: 'radio',
          label: `${device.name} - ${device.address}`,
          value: device.address
        });
        alertBDevices.addButton('Cancelar');
        alertBDevices.present();
      });
    });
  }

}

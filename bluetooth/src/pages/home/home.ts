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
      this.showPairedBluetoothDevices();
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
      this.showUnpairedBluetoothDevices();
    }).catch(res => {
      //console.log('Erro ao conectar bluetooth. Ativado ?');
      let toast = this.toastCtrl.create({
        message: 'Bluetooth não ativado.',
        showCloseButton: true
      });
      toast.present();
    });
  }

  send(value) {
    this.bluetoothSerial.isConnected().then(data => {
      this.bluetoothSerial.write(value);
    }).catch(err => {
      let toast = this.toastCtrl.create({
        message: 'Dispositivo não conectado.',
        showCloseButton: true
      });
      toast.present();
    });
  }

  private showPairedBluetoothDevices() {
    // Lista os dispositivos ja pareados.
    this.bluetoothSerial.list().then(devices => {
      let alertBDevices = this.alertCtrl.create();
      alertBDevices.setTitle('Dispositivos Bluetooth Pareados');
      devices.forEach(device => {
        alertBDevices.addInput({
          type: 'radio',
          label: `${device.name} - ${device.address}`,
          value: device.address
        });
      });
      alertBDevices.addButton('Cancelar');
      alertBDevices.addButton({
        text: 'Conectar',
        handler: (data: string) => {
          this.connectToDevice(data);
        }
      })
      alertBDevices.present();
    });
  }


  private connectToDevice(mac: string) {
    console.log(`[bluetooth] Tetando conexão com MAC: ${mac}`);
    this.bluetoothSerial.connect(mac).subscribe(
      (res) => console.log('Conectado com sucesso.'),
      (err) => console.log(`[bluetooth] Erro ao conetar: ${err}`),
      () => console.log('Conexão completa.') 
    );
  }

  /**
   * Exibe um alert com os dispositivos bluetooth disponíveis.
   */
  private showUnpairedBluetoothDevices() {
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
      });
      alertBDevices.addButton('Cancelar');
      alertBDevices.present();
    });
  }

}

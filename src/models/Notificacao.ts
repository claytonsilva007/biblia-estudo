export class Notificacao{
    
    id: number;
    title: string;
    text: string;
    sound: string;
    trigger: objDataLeitura;
    data: { secret: string };
    icon: string;

    constructor(){
        this.icon = 'assets/icon/drawable-xhdpi-icon.pn';
        this.sound = null;
        this.data = null;
        this.trigger = new objDataLeitura();
    }
}

export class objDataLeitura{
    at: Date;

    constructor(){
        this.at = new Date();
    }
}
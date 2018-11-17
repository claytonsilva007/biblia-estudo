export class Notificacao{
    
    id: number;
    title: string;
    text: string;
    sound: string;
    trigger: objDataLeitura;
    data: { secret: string };
    icon: string;
    smallIcon: string;

    constructor(){
        this.smallIcon = 'res://icon';
        this.icon = 'file://assets/img/icon.png';
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
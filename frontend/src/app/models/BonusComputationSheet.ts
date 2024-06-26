import { Salesman } from './Salesman';

export type Status =
    | 'pending-hr'
    | 'pending-ceo'
    | 'pending-salesman'
    | 'finished';

export type ClientRanking = 1 | 2 | 3 | 4 | 5;

//this added from backend DB-Sheets
export const socialAttributeNames: string[] = [
    'Leadership Competence',
    'Openness to Employee',
    'Social Behavior to Employee',
    'Attitude towards Client',
    'Communication Skills',
    'Integrity to Company',
];
//////////////////////////////////////////

export class BonusComputationSheet {


    salesman: Salesman;
    yearOfEvaluation: number;
    totalBonus: number = 0;
    status: Status;
    socialPerformanceEvaluation: SocialPerformanceEvaluation;
    orderEvaluation: OrderEvaluation;
    comment?: string;
    declined: boolean;

    constructor(
        salesman: Salesman,
        yearOfEvaluation: number,
        totalBonus: number,
        status: Status,
        socialPerformanceEvaluation: SocialPerformanceEvaluation,
        orderEvaluation: OrderEvaluation,
        comment: string
    ) {
        this.salesman = salesman;
        this.yearOfEvaluation = yearOfEvaluation;
        this.totalBonus = totalBonus;
        this.status = status;
        this.socialPerformanceEvaluation = socialPerformanceEvaluation;
        this.orderEvaluation = orderEvaluation;
        this.comment = comment;
        this.declined = false;
    }
}

export class OrderEvaluation {
    orders: Order[];
    bonussum: number = 0;

    constructor(orders: Order[]) {
        this.orders = orders;
        for (const order of orders) {
            this.bonussum = this.bonussum + order.bonus;
        }
    }
}

export class Order {
    productname: string;
    client: string;
    clientRanking: ClientRanking;
    bonus: number;
    itemamount: number;
    comment?: string;
    price: number;

    constructor(
        productname: string,
        client: string,
        clientRanking: ClientRanking,
        bonus: number,
        itemamount: number,
        price: number,
        comment?: string
    ) {
        this.productname = productname;
        this.client = client;
        this.clientRanking = clientRanking;
        this.bonus = bonus;
        this.itemamount = itemamount;
        this.price = price;
        this.comment = comment;
    }
}

export class SocialPerformanceEvaluation {
    socialAttributes: SocialAttribute[];
    bonussum: number = 0;

    constructor(socialAttributes: SocialAttribute[]) {
        this.socialAttributes = socialAttributes;
        for (const socialAttribute of socialAttributes) {
            this.bonussum = this.bonussum + socialAttribute.bonus;
        }
    }
}

export class SocialAttribute {
    comment?: string;
    targetValue: number;
    actualValue: number;
    socialAttributeName: string;
    bonus: number;

    constructor(
        targetValue: number,
        actualValue: number,
        socialAttributeName: string,
        bonus: number,
        comment?: string
    ) {
        this.targetValue = targetValue;
        this.actualValue = actualValue;
        this.socialAttributeName = socialAttributeName;
        this.bonus = bonus;
        this.comment = comment;
    }
}

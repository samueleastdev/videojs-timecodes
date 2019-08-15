export default class Mortgage {
    
    constructor(years, rate) {
        this.years = years;
        this.rate = rate;
    }
    
    update() {
        
        return (this.years * this.rate);

    }

}
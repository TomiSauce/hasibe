class DataView extends View {

    static refresh(storageUsed, storageAvail, percent) {
        $('#data-usage-text').text(this.#toReadable(storageUsed) + ' / ' + this.#toReadable(storageUsed + storageAvail) + '(' + percent.toFixed(2) + '%)');
        $('#data-usage-bar').val((percent < 1) ? 1 : percent);
    }
    
    static #toReadable(bites) {
        let mb = this.#toMeagBites(bites);
        if (mb > 0.1) return mb + ' MB'; 
        let kb = this.#toKiloBites(bites);
        if (kb > 0.1) return kb + ' KB';
        return bites + ' Bites';
    }

    static #toKiloBites(bites) {
        return (bites / 1024).toFixed(2);
    }

    static #toMeagBites(bites) {
        return (bites / 1024 / 1024).toFixed(2);
    }

}
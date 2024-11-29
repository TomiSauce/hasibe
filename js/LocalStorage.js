class LocalStorage {

    insert(tableName, data) {
        try {
            let table = this.#loadTable(tableName);
            data.id = this.#generateNewID(tableName);
            table.push(data);
            this.#saveTable(tableName, table);
            return data.id;
        } catch (e) {
            return false;
        }
    }

    getByID(tableName, id) {
        let table = this.#loadTable(tableName);
        let index = table.findIndex(e => e.id === id);
        return (index > -1) ? table[index] : [];
    }

    getAll(tableName) {
        return this.#loadTable(tableName);
    }

    update(tableName, data) {
        let table = this.#loadTable(tableName);
        let rowIndex = table.findIndex(r => r.id === data.id);
        if (rowIndex < 0) return false;
        for (let key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                table[rowIndex][key] = data[key];
            }
        }
        this.#saveTable(tableName, table);
        return true;
    }

    delete(tableName, id) {
        let table = this.#loadTable(tableName);
        let index = table.findIndex(e => e.id === id);
        if (index < 0) return false;
        table.splice(index, 1);
        this.#saveTable(tableName, table);
        return true;
    }

    count(tableName) {
        return this.#loadTable(tableName).length;
    }

    #generateNewID(tableName) {
        let table = this.#loadTable(tableName + 'IdCounter');
        if (typeof table === 'number') {
            table = parseInt(table) + 1;
        } else {
            table = 0;
        }
        this.#saveTable(tableName + 'IdCounter', table);
        return table;
    }

    #loadTable(tableName) {
        let table = JSON.parse(localStorage.getItem(tableName));
        if (table === null) return [];
        return table;
    }

    #saveTable(tableName, table) {
        localStorage.setItem(tableName, JSON.stringify(table));
    }

    static getStorageUsed(arrayKey = null) {
        var usedSpace = 0;
        if (arrayKey == null) {
            for (let x in localStorage) {
                if (!localStorage.hasOwnProperty(x)) {
                    continue;
                }
                var xLen = ((localStorage[x].length + x.length) * 2);
                usedSpace += xLen;
                // Uncomment to log KB used by key
                // console.log(x + " = " + (xLen / 1024).toFixed(2) + " KB");
            }
        } else {
            usedSpace = ((localStorage[arrayKey].length + arrayKey.length) * 2)
        }
        return usedSpace;
    }

    static getStorageAvailable(forceRecalculation) {
        let availableKey = 'storageAvailable',
            available = localStorage.getItem(availableKey);
        
        if (forceRecalculation || available == null) {
            var dataKey = 'AVAILABLE_DATA',
            limitReached = false,
            data = 'd';
            available = 0;

            do {
                try { 
                    localStorage.setItem(dataKey, data);
                    data = data + data;
                } catch(e) {
                    available = this.getStorageUsed(dataKey);
                    limitReached = true;
                }
            } while (!limitReached);

            localStorage.removeItem(dataKey);
            localStorage.setItem(availableKey, available);
            return available;
        }
        return available;
    }

}
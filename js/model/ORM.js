class ORM {

	#values = {};

	#data = {};

	static #storage;

	constructor(id = null, rows) {
		if (id !== null) id = Number(id);
		this.#values = rows;
		if (id !== null) {
			this.#values['id'] = id;
			rows = ORM.#storage.getByID(this.constructor.getTableName(), id);
		}
		for (let key in rows) {
			if (Object.hasOwnProperty.call(rows, key)) {
				if (key.endsWith('ID')) {
					this.setObjects(key, rows[key]);
				}
				this.set(key, rows[key]);
			}
		}
	}

	setObjects(key, id) {
		if (objRelsORM[key] !== undefined) {
			this.set(key.replace('ID', ''), new objRelsORM[key](id));
		} else {
			console.error('Class for '+key+' in var objRelsORM was not defined. Add a Classto objRelsORM = {'+key+': ClassName}');
		}
	}

	static setStorageAdapter(storageAdapter) {
		ORM.#storage = storageAdapter;
	}

	static getAll() {
		let table = ORM.#storage.getAll(this.getTableName()),
			objArray = [];
		for (let elem of table) {
			objArray.push(new this(elem.id));
		}
		return objArray;
	}

	static count() {
		return ORM.#storage.count(this.getTableName());
	}

	static getTableName() {
		return this.name.toLowerCase() + 's';
	}

	get(key) {
		if (key in this.#values) {
			return this.#values[key];
		} else if (key in this.#data) {
			return this.#data[key];
		} else {
			return undefined;
		}
	}
	
	set(key, value) {
		if (this.#values.hasOwnProperty(key)) {
			this.#values[key] = value;
			if (key.endsWith('ID') && Object.hasOwnProperty.call(this.#values, key)) {
				this.setObjects(key, this.#values[key]);
			}
		} else {
			this.#data[key] = value;
		}
		return this;
	}

	save() {
		if (this.get('id') === undefined) {
			// Insert
			let id = ORM.#storage.insert(this.constructor.getTableName(), this.#values);
			if (id !== false) {
				this.#values['id'] = id;
				return true;
			}
			return false;
		} else {
			// Update
			return ORM.#storage.update(this.constructor.getTableName(), this.#values);
		}
	}

	delete() {
		return ORM.#storage.delete(this.constructor.getTableName(), this.get('id'));
	}

	getStorageUsed() {
		return ORM.#storage.getStorageUsed(this.constructor.getTableName());
	}

	getStorageAvailable() {
		return ORM.#storage.getStorageAvailable(this.constructor.getTableName());
	}

}
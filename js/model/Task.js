class Task extends ORM {

    constructor(id = null, name = null, maxMinutes = null) {
        super(id, {'name': name, 'maxMinutes':maxMinutes});
    }

}

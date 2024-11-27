class DefaultTask extends ORM {
    
    constructor(id = null, taskID) {
        super(id, {'taskID': taskID});
    }

}
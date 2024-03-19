class Log extends ORM {

    constructor(id = null, userID = null, taskID = null, msg = null) {
        super(id, {userID: userID, taskID: taskID, timeCreated: new Date().getTime(), msg:msg});
    }

}

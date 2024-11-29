class UserView extends View {

    static refreshCreateForm(ranks, tasks) {
        $('#inpRank').append(RankView.generateSelectOptions(ranks));
        $('#inpTask').append(TaskView.generateSelectOptions(tasks, DefaultTask.getAll()[0].get('taskID')));
    }

    static getFormInputs() {
        return {
            'rankID': this.getInpValue('inpRank'),
            'lastName': this.getInpValue('inpLastName'),
            'firstName': this.getInpValue('inpFirstName'),
            'driver': this.getInpValue('inpDriver'),
            'taskID': this.getInpValue('inpTask')
        };
    }

    static clearCreateForm() {
        this.setInpValue('inpRank', 0);
        this.setInpValue('inpLastName');
        this.setInpValue('inpFirstName');
        this.setInpValue('inpDriver');
        this.setInpValue('inpTask', 0);
    }

    static renderTable(users, ranks, tasks, flags, logs) {
        if (users.length === 0) return $('#user-list').html('<div id="no-users">Noch keine AdAs</div>');
        $('#user-list').html('');
        for (let user of users) {
            $('#user-list').append(UserView.generateRow(user, ranks, tasks, flags));
            let userID = user.get('id');
            if (user.get('showLogs')) {
                let userLogs = logs.map(e => {if (e.get('userID') == userID) return e}).filter(l => l instanceof Log);
                UserView.showUserLog(userID, userLogs);
            } else {
                UserView.hideUserLog(userID);
            }
        }
    }

    static generateRow(user, ranks, tasks, flags) {
        let uid = user.get('id');
        let timeRemaining = (user.get('timeRemaining') == null || user.get('timeRemaining') < 0) ? '---' : View.getReadableMinSec(user.get('timeRemaining'));
        return  '<div' + (user.get('timeRemaining') < 0 ? ' class="user-list-late-warning"' : '') + '>' +
                    '<select id="inp-update-rank-' + uid +'" onchange="UserController.updateRank(' + "'" + uid + "'"+')">'+
                        RankView.generateSelectOptions(ranks, user.get('rankID')) +
                    '</select>' +
                    '<input type="text" id="inp-update-last-name-' + uid + '" value="' + user.get('lastName') + '" onkeyup="UserController.updateLastName(' + uid + ', event)" title="Enter fürs Speichern">' +
                    '<input type="text" id="inp-update-first-name-' + uid + '" value="' + user.get('firstName') + '" onkeyup="UserController.updateFirstName(' + uid + ', event)" title="Enter fürs Speichern">' +
                    '<input type="text" id="inp-update-driver-' + uid + '" value="' + ((user.get('driver')) ? user.get('driver') : '') + '" onkeyup="UserController.updateDriver(' + uid + ', event)" title="Enter fürs Speichern" placeholder="-">'+
                    '<select id="inp-update-flag-' + uid +'" onchange="UserController.updateFlag(' + "'" + uid + "'"+')">'+
                        FlagView.generateSelectOptions(flags, user.get('flagID')) +
                    '</select>' +
                    '<select id="inp-update-task-' + uid + '" onchange="UserController.updateTask(' + "'" + uid + "'"+')">' +
                        TaskView.generateSelectOptions(tasks, user.get('taskID')) +
                    '</select>' +
                    '<div id="user-timer-' + uid + '">' + timeRemaining + '</div>' +
                    '<div>' +
                        '<div class="btn-simple btn-delete" onclick="UserController.delete(' + uid + ')" title="Löschen"><i class="fa-solid fa-trash-can"></i></div>' +
                        '<div class="btn-simple btn-expand" onclick="UserController.toggleUserLog(' + uid + ')" title="Gefechtsjournal Öffnen"><i id="btn-expand-' + uid + '" class="fa-solid fa-angles-down"></i></div>' +
                    '</div>' +
                '</div>' +
                '<div class="user-details" id="user-details-' + uid + '"></div>';
    }

    static showUserLog(userID, logs) {
        let out = '';
        if (logs.length) {
            for (var log of logs) {
                out +=
                    '<div>' +
                        '<div>' + View.getReadableHourMinDate(log.get('timeCreated')) + '</div>' +
                        '<div>' + log.get('msg') + '</div>' +
                    '</div>';
            }
            out =
                '<div>' +
                    '<div>' +
                        '<div>Zeit</div>' +
                        '<div>Ereignis</div>' +
                    '</div>' +
                '</div>' +
                '<div>' + out + '</div>';
        } else {
            out = '<div id="no-result-log">Noch keine Ereignisse</div>'
        }
        
        $('#btn-expand-' + userID).removeClass('fa-angles-down').addClass('fa-angles-up');
        $('#user-details-' + userID).html(out).show();
    }

    static hideUserLog(userID) {
        $('#btn-expand-' + userID).addClass('fa-angles-down').removeClass('fa-angles-up');
        $('#user-details-' + userID).html('').hide();
    }

}

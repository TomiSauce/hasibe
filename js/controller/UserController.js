class UserController {

	static refreshCreateForm() {
		UserView.refreshCreateForm(Rank.getAll(), Task.getAll());
	}

	static create() {
		let inp = UserView.getFormInputs(),
			rank = new Rank(inp.rankID),
			task = new Task(inp.taskID);
		if (rank.get('id') === undefined) {
			View.error('Kein Rang ausgewählt', 'inpRankMask');
		} else if (!inp.lastName.length) {
			View.error('Kein Nachname angegeben', 'inpLastNameMask');
		} else if (!inp.firstName.length) {
			View.error('Kein Vorname angegeben', 'inpFirstNameMask');
		} else if (task.get('id') === undefined) {
			View.error('Keine Aufgabe ausgewählt', 'inpTaskMask');
		} else {
			let u = new User(
				null,
				parseInt(rank.get('id')),
				inp.lastName,
				inp.firstName,
				inp.driver,
				parseInt(task.get('id')),
				Flag.getAll()[0].get('id') 
			);
			if (u.save() !== false) {
				UserController.setTimeStarted(u);
				View.success('AdA eingetragen');
				UserView.clearCreateForm();
				UserController.refreshTable();
				new Log(null, u.get('id'), u.get('taskID'), 'Benutzer "' + inp.lastName + ', ' + inp.firstName + '" erstellt').save();
			}
		}
	}

	static refreshTable() {
		let param = View.getInpValue('inpSearch').toLowerCase(),
			users = User.getAll();
		
		// Filter users matching search parameters
		let userList = [];
		if (param.length > 0) {
			for (var key in users) {
				if (Object.hasOwnProperty.call(users, key)) {
					var user = users[key],
						driver = user.get('driver') || "",
						rank = user.get('rank').get('abbr'),
						flag = user.get('flag').get('text'),
						task = user.get('task').get('name');
						
					if (user.get('lastName').toLowerCase().includes(param)
						|| user.get('firstName').toLowerCase().includes(param)
						|| driver.toLowerCase().includes(param)
						|| rank.toLowerCase().includes(param)
						|| flag.toLowerCase().includes(param)
						|| task.toLowerCase().includes(param)) {
							userList.push(user);
					}
				}
			}
		} else {
			userList = users;
		}

		// Calculating timer by task time limits
		for (var user of userList) {
			let timeRemaining = this.getTimeLeft(user);
			user.set('timeRemaining', timeRemaining);
			if (timeRemaining < 0) View.warn('AdA "' + user.get('firstName') + ' ' + user.get('lastName') + '" ist zu spät');
		}

		// Sort users
		if (localStorage.getItem('sortBy') !== null) userList = SortController.sortUsers(userList);

		UserView.renderTable(userList, Rank.getAll(), Task.getAll(), Flag.getAll(), Log.getAll());
	}

	static delete(userID) {		
		if (new User(userID).delete()) {
			View.success('AdA gelöscht');
			UserController.refreshTable();
			SearchController.search();
		} else {
			View.error('Unerwarteter Fehler: #90');
		}
	}

	static toggleUserLog(userID) {
		let u = new User(userID);
		u.set('showLogs', !u.get('showLogs')).save();
		this.refreshTable();
	}

	static updateRank(userID) {
		let rankID = parseInt(UserView.getInpValue('inp-update-rank-' + userID));
		let u = new User(parseInt(userID));
		let oldRank = u.get('rank').get('abbr');
		if (u.set('rankID', rankID).save()) {
			let msg = 'Rang geändert von "' + oldRank + '" zu "' + u.get('rank').get('abbr') + '"';
			View.success(msg, 'inp-update-rank-' + userID);
			new Log(null, userID, null, msg).save();
			this.refreshTable();
		} else {
			View.error('Ein unerwarteter Fehler ist aufgetreten #235', 'inp-update-rank-' + userID);
		}
	}

	static updateFirstName(userID, e) {
		if (e.keyCode == 13) {
			let u = new User(parseInt(userID)),
				styleID = 'inp-update-first-name-' + userID,
				newName = UserView.getInpValue(styleID);

			if (u.set('firstName', newName).save()) {
				let msg = 'Vorname zu "' + newName + '" geändert';
				View.success(msg, styleID);
				new Log(null, userID, null, msg).save();
			} else {
				View.error('Ein unerwarteter Fehler ist aufgetreten #135', styleID)
			}
		}
	}

	static updateLastName(userID, e) {
		if (e.keyCode == 13) {
			let u = new User(parseInt(userID)),
			styleID = 'inp-update-last-name-' + userID,
			newName = UserView.getInpValue(styleID);

			if (u.set('lastName', newName).save()) {
				let msg = 'Name zu "' + newName + '" geändert';
				View.success(msg, styleID);
				new Log(null, userID, null, msg).save();
			} else {
				View.error('Ein unerwarteter Fehler ist aufgetreten #1', styleID)
			}
		}
	}

	static updateDriver(userID, e) {
		if (e.keyCode == 13) {
			let u = new User(parseInt(userID)),
			styleID = 'inp-update-driver-' + userID,
			newDriver = UserView.getInpValue(styleID);

			if (u.set('driver', newDriver).save()) {
				let msg = 'Fahrer zu "' + newDriver + '" geändert';
				View.success(msg, styleID);
				new Log(null, userID, null, msg).save();
			} else {
				View.error('Ein unerwarteter Fehler ist aufgetreten #2')
			}
		}
	}

	static updateFlag(userID) {
		let flagID = parseInt(UserView.getInpValue('inp-update-flag-' + userID));
		let u = new User(parseInt(userID));
		let oldFlag = u.get('flag').get('text');
		if (u.set('flagID', flagID).save()) {
			let msg = 'Flag geändert von "' + oldFlag + '" zu "' + u.get('flag').get('text') + '"';
			View.success(msg, 'inp-update-flag-' + userID);
			new Log(null, userID, null, msg).save();
			this.refreshTable();
		} else {
			View.error('Ein unerwarteter Fehler ist aufgetreten #6005', 'inp-update-flag-' + userID);
		}
	}
	
	static updateTask(userID) {
		let taskID = parseInt(UserView.getInpValue('inp-update-task-' + userID)),
			u = new User(parseInt(userID)),
			oldTask = u.get('task').get('name');
		if (u.set('taskID', taskID).save()) {
			this.setTimeStarted(u);
			let msg = 'Auftrag geändert von "' + oldTask + '" zu "' + u.get('task').get('name') + '"';
			View.success(msg, 'inp-update-task-' + userID);
			new Log(null, userID, null, msg).save();
			this.refreshTable();
		} else {
			View.error('Ein unerwarteter Fehler ist aufgetreten #556', 'inp-update-task-' + userID);
		}
	}

	static setTimeStarted(user) {
		user.set('taskStartedAt', (user.get('task').get('maxMinutes') !== null ? new Date().getTime() : null)).save();
	}

	static getTimeLeft(user) {
		if (user.get('task').get('maxMinutes') === null) return null;
		return (user.get('task').get('maxMinutes') * 60 * 1000) - (new Date().getTime() - user.get('taskStartedAt'));
	}

	static sort(e) {
		if (e.target.id == '') return;
		let sortBy = e.target.id.split(/(?=[A-Z])/)[1].toLowerCase();
	}
}

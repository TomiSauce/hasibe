class TaskController {

	static create() {
		let inp = TaskView.getFormInputs();

		if (!inp.name.length) {
			View.error('Kein Aufragsname angegeben', 'inpTaskNameMask');
		} else {
			if (inp.maxMinutes.length === 0 || inp.maxMinutes < 0) inp.maxMinutes = null;
			let t = new Task(
				null,
				inp.name,
				inp.maxMinutes,
			);
			if (t.save() !== false) {
				View.success('Auftrag erstellt');
				TaskView.clearCreateForm();
				UserController.refreshTable();
				DataController.refresh();
			}
		}
	}

	static setDefaultTask() {
		let inp = TaskView.getDefaultTaskInput().taskID || -1;
		
		if (inp < 0) {
			View.error('Wählen Sie einen Auftrag.', 'inpDefaultTaskMask');
		} else {
			let defaultTask = DefaultTask.getAll()[0];
			let oldTask = new Task(defaultTask.get('id'));
			
			defaultTask.set('taskID', inp).save();
			
			new Log(null, null, null, 'Der Standardauftrag wurde von "' + oldTask.get('name') + '" zu "' + new Task(Number(inp)).get('name') + '" geändert.').save();
	
			UserController.refreshCreateForm();
			DataController.refresh();
		}
	}

	static refreshSetDefault() {
		TaskView.refreshSetDefaultForm(Task.getAll(), DefaultTask.getAll()[0]);
	}

}

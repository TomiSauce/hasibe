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
			}
		}
	}

}

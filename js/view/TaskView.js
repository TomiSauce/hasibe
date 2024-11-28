class TaskView extends View {

	static getFormInputs() {
		return {
			'name': this.getInpValue('inpTaskName'),
			'maxMinutes': this.getInpValue('inpMinutes')
		};
	}

	static getDefaultTaskInput() {
		return {
            'taskID': this.getInpValue('inpDefaultTask'),
		}
	}

	static clearCreateForm() {
		this.setInpValue('inpTaskName');
		this.setInpValue('inpMinutes');
	}

	static generateSelectOptions(tasks, selectedID = null) {
		let out = '';
		for (let task of tasks) {
			out += '<option value="' + task.get('id') + '"' + ((task.get('id') == selectedID) ? ' selected ' : '') + '>' + task.get('name') + '</option>';
		}
		return out;
	}

	static refreshSetDefaultForm(tasks, defaultTask) {
		$('#inpDefaultTask').empty();
		$('#inpDefaultTask').append(TaskView.generateSelectOptions(tasks, defaultTask.get('taskID')));
	}

}

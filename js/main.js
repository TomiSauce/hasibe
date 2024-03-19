//
// Initialization
//

const objRelsORM = {
	flagID: Flag,
	logID: Log,
	rankID: Rank,
	taskID: Task,
	userID: User,
}

ORM.setStorageAdapter(new LocalStorage());

// Seed "Database"
if (!Flag.count()) {
	let flagSeeds = [
		'Neutral',
		'👌 Pünklich',
		'⚠️ Unpünktlich',
		'🚩 Ubooter!!'
	];

	for (let key in flagSeeds) {
		if (Object.hasOwnProperty.call(flagSeeds, key)) {
			new Flag(null, flagSeeds[key]).save();
			new Log(null, null, null, 'Flag "' + flagSeeds[key] + '" erstellt').save();
		}
	}
}

if (!Task.count()) {
	let taskSeeds = [
		{name: 'Undefiniert', minutes: null},
		{name: 'HäSiBe', minutes: null},
		{name: 'Rauchen', minutes: 10},
		{name: 'Pause', minutes: 15},
		{name: 'Kas Reinigung', minutes: null},
		{name: 'Wache', minutes: null},
		{name: 'Mat Mag', minutes: null},
		{name: 'Tech Mag', minutes: null},
		{name: 'Mun Mag', minutes: null},
		{name: 'Fassmanschaft', minutes: null},
		{name: 'Kas Reinigung', minutes: null},
		{name: 'Bewerbungsgespräch', minutes: null},
		{name: 'Quali Gespräch', minutes: null},
		{name: 'Krank im Zimmer', minutes: null}
	];
	
	for (let task of taskSeeds) {
		let t = new Task(null, task.name, task.minutes);
		t.save();
		new Log(null, null, t.get('id'), 'Task "' + task.name + '" erstellt').save();
	}
}

if (!Rank.count()) {
	let rankSeeds = [
		'Rekr',
		'Sdt',
		'Gfr',
		'Obgfr',
		'Kpl',
		'Wm',
		'Obwm',
		'Four',
		'Fw',
		'Hptfw',
		'Adj Uof',
		'Stabsadj',
		'Hptadj',
		'Chefadj',
		'Lt',
		'Oblt',
		'Hptm',
		'Maj',
		'Oberstlt',
		'Oberst i Gst',
		'Br',
		'Div',
		'KKdt',
		'General',
		'Ziv'
	];
	
	for (let key in rankSeeds) {
		if (Object.hasOwnProperty.call(rankSeeds, key)) {
			new Rank(null, rankSeeds[key]).save();
			new Log(null, null, null, 'Rang "' + rankSeeds[key] + '" erstellt').save();
		}
	}
}

const config = {
	sound: true,
};


$(document).ready(() => {
	UserController.refreshCreateForm();
	UserController.refreshTable();

	$('#btn-volume-switch').on('click', () => {
		if (config.sound) {
			config.sound = false;
			$('#volume-switch-icon').addClass('fa-volume-xmark').removeClass('fa-volume-high');
		} else {
			config.sound = true;
			$('#volume-switch-icon').removeClass('fa-volume-xmark').addClass('fa-volume-high');
		}
	});

	let sort = JSON.parse(localStorage.getItem('sortBy'));
	if (sort !== null && sort['order'] !== null && sort['key'] !== null) {
		$('#sort' + sort['key'].charAt(0).toUpperCase() + sort['key'].slice(1) + ' > i')
			.removeClass('fa-sort')
			.addClass('fa-arrow-down-' + sort['order']);
	}
	$('#user-list-header').on('click', (e) => {
		let elemID = $(e.target).attr('id');
		if (!elemID) elemID = $(e.target).parent().attr('id');
		if (!$('#' + elemID).parent('#user-list-header').length) return;
		SortController.setSortParam(elemID); 
	});

	$('#btnClearStorage').on('click', () => {
		if (confirm('Sollen wirklich alle daten gelöscht werden. Diese könnne nicht wiederhergestellt werden.')) {
			localStorage.clear();
			$.notify('Alle Daten wurden gelöscht.', 'success');
			setTimeout(location.reload, 2000);
		}
	});

	setInterval(function() {
		if ($('#section-user-list:hover').length == 0) UserController.refreshTable();
		DataController.refresh();
	}, 1000);

	$('#inpImport').on('change', ImportController.parseExcel);
	$('#btnAddUser').on('click', UserController.create);
	$('#btnAddTask').on('click', TaskController.create);
	$('#inpSearch').on('keyup', SearchController.search);

});

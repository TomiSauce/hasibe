class ImportController {

	static parseExcel(event) {
		let file = event.target.files[0];
		try {
			let reader = new FileReader();
			reader.onload = (e) => {
				let data = e.target.result;
				try {
					let workbook = XLSX.read(data, {
						type: 'binary'
					});
					try {
						workbook.SheetNames.forEach(function(sheetName) {
							let users = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]),
								c = 0,
								ranks = Rank.getAll(),
								flagID = Flag.getAll()[0].get('id'),
								taskID = DefaultTask.getAll()[0].get('taskID');
			
							for (let user of users) {
								let u = new User(),
									name = user['Name / Vorname'].split(',');
			
								u.set('firstName', name[1].trim());
								u.set('lastName', name[0].trim());
								u.set('taskID', taskID);
								u.set('flagID', flagID);
									
								for (let rank of ranks) {
									if (rank.get('abbr') == user['Grad Kurzform'].trim()) u.set('rankID', rank.get('id'));
								}
			
								u.save();
								c += 1;
							}
							View.success('"' + c + '" neue AdAs hinzugefüght.');
							UserController.refreshTable();
							DataController.refresh();
						});
					} catch (ex) {
						View.error('Die Datei "' + file.name + '" konnte nicht geladen werden #007');
						console.error(ex);
					}
					
				} catch (ex) {
					View.error('Die Datei "' + file.name + '" konnte nicht geladen werden #EKF');
					console.error(ex);
				}
			};
	
			reader.onerror = function(ex) {
				View.error('Die Datei "' + file.name + '" konnte nicht geladen werden #ELOOPS');
				console.error(ex);
			};
	
			reader.readAsBinaryString(file);
		} catch (e) {
			View.error('Die Datei "' + file.name + '" konnte nicht geladen werden #0600');
			console.error(ex);
		}
	}

}

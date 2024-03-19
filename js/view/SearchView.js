class SearchView {

	static displayResults(users, ranks, tasks, flags) {
		if (users.length < 1) this.hideResults();
		let out = '';
		$('#no-result').remove();
		for (const user of users) {
			out += UserView.generateRow(user, ranks, tasks, flags);
		}
		$('#quicksearch-result').html(out);
	}

	static hideResults() {
		$('#quicksearch-result').html('<div id="no-result">Keine Resultate</div>');
	}

}
